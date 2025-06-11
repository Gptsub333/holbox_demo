import { useEffect, useState } from "react";

export default function AudioVisualization({
  canvasRef,
  isActive,
  color = "teal",
}) {
  const [audioData, setAudioData] = useState(Array(200).fill(0));

  useEffect(() => {
    if (!isActive) {
      setAudioData(Array(200).fill(0));
      return;
    }

    // Simulate audio data update
    const interval = setInterval(() => {
      setAudioData((prev) =>
        prev.map(() => Math.random() * 2 - 1)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  const smoothData = (data, smoothingFactor = 0.8) => {
    return data.reduce((smoothedData, current, index) => {
      if (index === 0) {
        smoothedData.push(current);
      } else {
        smoothedData.push(
          smoothedData[index - 1] * smoothingFactor +
            current * (1 - smoothingFactor)
        );
      }
      return smoothedData;
    }, []);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Ensure canvas is pixel-perfect for high-DPI screens
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any prior scaling
    ctx.scale(dpr, dpr);

    // Use displayed size for all drawing!
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Prepare data
    const smoothedAudioData = smoothData(audioData);
    const centerY = height / 2;
    const step = smoothedAudioData.length / width; // allow float for more accurate mapping

    // Colors
    const colors = {
      teal: ["#0d9488", "#14b8a6", "#2dd4bf"],
      red: ["#dc2626", "#ef4444", "#f87171"],
      blue: ["#2563eb", "#3b82f6", "#60a5fa"],
    };
    const barColor = colors[color] || colors.teal;
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, barColor[0]);
    gradient.addColorStop(0.5, barColor[1]);
    gradient.addColorStop(1, barColor[2]);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;

    // Precompute all y-values for each pixel column (use width + 1 for full right edge coverage)
    const yValues = [];
    const AMPLITUDE = 1.8; 
    for (let i = 0; i <= width; i++) {
      const dataIndex = Math.floor(i * step);
      yValues[i] = centerY + (smoothedAudioData[dataIndex] ?? 0) * centerY  * AMPLITUDE;
    }

    // Optional: Fill under wave
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    for (let i = 0; i <= width; i++) {
      ctx.lineTo(i, yValues[i]);
    }
    ctx.lineTo(width, centerY);
    ctx.closePath();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw the wave line itself, always including the rightmost edge
    ctx.beginPath();
    ctx.moveTo(0, yValues[0]);
    for (let i = 1; i <= width; i++) {
      ctx.lineTo(i, yValues[i]);
    }
    ctx.stroke();
  }, [audioData, color, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-20 rounded-lg"
      style={{ background: "transparent" }}
    />
  );
}
