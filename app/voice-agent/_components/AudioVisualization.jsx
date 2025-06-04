import { useEffect, useState } from "react";

export default function AudioVisualization({
  canvasRef,
  isActive,
  color = "teal",
}) {
  const [bars, setBars] = useState(Array(20).fill(0));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(20).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    // Draw bars
    const barWidth = width / bars.length;
    const colors = {
      teal: ["#0d9488", "#14b8a6", "#2dd4bf"],
      red: ["#dc2626", "#ef4444", "#f87171"],
      blue: ["#2563eb", "#3b82f6", "#60a5fa"],
    };

    bars.forEach((barHeight, index) => {
      const barColor = colors[color] || colors.teal;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, barColor[0]);
      gradient.addColorStop(0.5, barColor[1]);
      gradient.addColorStop(1, barColor[2]);

      ctx.fillStyle = gradient;

      const x = index * barWidth + barWidth * 0.2;
      const barWidthActual = barWidth * 0.6;
      const y = height - (barHeight / 100) * height * 0.8;
      const barHeightActual = (barHeight / 100) * height * 0.8;

      ctx.fillRect(x, y, barWidthActual, barHeightActual);
    });
  }, [bars, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-20 rounded-lg"
      style={{ background: "transparent" }}
    />
  );
}
