"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function UploadArea({ onImageUpload }) {
    const [showFloatingUpload, setShowFloatingUpload] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [stream, setStream] = useState(null)
    const fileInputRef = useRef(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    // Handle file upload from the user's gallery
    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            onImageUpload(file);  // Pass the file to parent
            setShowFloatingUpload(false);
        }
    }

    // Start camera to capture a photo
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment", // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });
            setStream(mediaStream);
            setShowCamera(true);
            setShowFloatingUpload(false);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check permissions or use gallery upload.");
        }
    }

    // Capture the photo from the camera
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

            // Create a Blob from the base64 string and pass it to parent as a file
            const byteCharacters = atob(imageDataUrl.split(',')[1]);
            const byteArray = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

            onImageUpload(file);  // Pass file to parent
            stopCamera();
        }
    }

    // Stop camera stream
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    }

    return (
        <>
            {/* Upload Button */}
            <div className="flex justify-end mb-6">
                <Button
                    onClick={() => setShowFloatingUpload(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                >
                    Upload Food Image
                </Button>
            </div>

            {/* Floating Upload Area */}
            {showFloatingUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="bg-white p-8 rounded-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-slate-900 mb-6">Upload Food Image</h3>

                            <div className="space-y-4">
                                {/* Camera Option */}
                                <Button
                                    onClick={startCamera}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center space-x-2"
                                >
                                    <span className="text-lg">📷</span>
                                    <span>Take Photo</span>
                                </Button>

                                {/* File Upload Option */}
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 py-3 flex items-center justify-center space-x-2"
                                >
                                    <span className="text-lg">📁</span>
                                    <span>Choose from Gallery</span>
                                </Button>

                                {/* Cancel Button */}
                                <Button
                                    onClick={() => setShowFloatingUpload(false)}
                                    variant="ghost"
                                    className="w-full text-slate-600 hover:text-slate-900"
                                >
                                    Cancel
                                </Button>
                            </div>

                            {/* Hidden File Input */}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Camera Stream */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
                        <div className="relative">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto max-h-96 object-cover" />
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                <Button
                                    onClick={capturePhoto}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                                >
                                    📷 Capture
                                </Button>
                                <Button
                                    onClick={stopCamera}
                                    variant="outline"
                                    className="bg-white text-slate-600 hover:bg-slate-50 px-6 py-3 rounded-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
