"use client";

// ShowResult.jsx
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const ShowResult = ({
  section,
  apiResponse,
  imagePreview,
  onClose,
  name,
  age,
  gender
}) => {
  // For 'add', use provided name/age/gender, for 'recognize', use apiResponse
  const isRecognize = section === "recognize";
  const data = isRecognize ? apiResponse : { name, age, gender };
  // For preview image: for recognize, use uploaded image; for add, use imagePreview
  const imageUrl = imagePreview;

  return (
    <motion.div
      key="result"
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative bg-white rounded-2xl p-4 shadow flex flex-col items-center"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={imageUrl}
        alt="Preview"
        className="w-40 h-40 object-cover rounded-xl border mb-4"
      />
      <div className="space-y-1 text-center">
        <div className="font-bold text-lg">
          {isRecognize ? (
            data.recognized
              ? `Recognized: ${data.name || data.user_name}`
              : "Face Not Recognized"
          ) : (
            `Face Added: ${data.name}`
          )}
        </div>
        {isRecognize && data.recognized && (
          <>
            <div>Confidence: <b>{data.confidence}%</b></div>
            <div>Name: <b>{data.name || data.user_name}</b></div>
            <div>Age: <b>{data.user_age}</b></div>
            <div>Gender: <b>{data.user_gender}</b></div>
            <div>Face ID: <b>{data.face_id}</b></div>
            <div>User ID: <b>{data.user_id}</b></div>
            <div>Timestamp: <b>{new Date(data.user_timestamp).toLocaleString()}</b></div>
          </>
        )}
        {!isRecognize && (
          <>
            <div>Name: <b>{data.name}</b></div>
            <div>Age: <b>{data.age}</b></div>
            <div>Gender: <b>{data.gender}</b></div>
          </>
        )}
        {isRecognize && !data.recognized && (
          <div className="text-red-500 mt-2">No matching face found.</div>
        )}
      </div>
    </motion.div>
  );
};

export default ShowResult;
