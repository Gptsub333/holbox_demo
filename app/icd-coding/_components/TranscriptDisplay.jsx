"use client";
import React from "react";
import { MessageSquare, FileText, Loader2, Clock, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function TranscriptDisplay({
  activeDocument,
  transcript,
  formattedTranscript,
  isTranscribing,
  transcribeProgress,
  handleChatClick,
  handleTranscribe,
  handleUploadClick,
  handleCancel,
}) {
  return (
    <div>
      {activeDocument ? (
        <div className="rounded-xl border bg-white p-8 shadow-md mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold heading-font">Transcript</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeDocument.title} • {activeDocument.duration}
              </p>
            </div>

            {/* Top Right Button */}
            {transcript ? (
              <button
                onClick={handleChatClick}
                className="text-sm flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Ask Questions
              </button>
            ) : (
              <button
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className={`text-sm flex items-center ${
                  isTranscribing
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800 transition-colors"
                }`}
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-1" />
                    Transcribe Document
                  </>
                )}
              </button>
            )}
          </div>

          {/* Transcript Body */}
          {isTranscribing ? (
            <>
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
                <p className="text-sm font-medium mb-2">
                  Transcribing document...
                </p>
                <div className="w-full max-w-md bg-gray-200 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${transcribeProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {transcribeProgress}% complete
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="w-full rounded-lg px-4 py-3 text-white font-medium bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : transcript ? (
            <>
              <div className="bg-gray-50 rounded-lg p-6 max-h-[400px] overflow-y-auto mb-4">
                {/* Dynamically render sections */}
                {formattedTranscript?.chiefComplaint && (
                  <TranscriptSection
                    title={formattedTranscript.chiefComplaint.title}
                    content={formattedTranscript.chiefComplaint.content[1]}
                  />
                )}
                {formattedTranscript?.historyOfPresentIllness && (
                  <TranscriptSection
                    title={formattedTranscript.historyOfPresentIllness.title}
                    content={formattedTranscript.historyOfPresentIllness.content[1]}
                  />
                )}
                {formattedTranscript?.reviewOfSystems && (
                  <TranscriptSection
                    title={formattedTranscript.reviewOfSystems.title}
                    content={formattedTranscript.reviewOfSystems.content[1]}
                  />
                )}
                {formattedTranscript?.pastMedicalHistory && (
                  <TranscriptSection
                    title={formattedTranscript.pastMedicalHistory.title}
                    content={formattedTranscript.pastMedicalHistory.content[1]}
                  />
                )}
              </div>

              {/* Bottom Ask Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleChatClick}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask Questions About This Transcript
                </button>
              </div>
            </>
          ) : (
            <NoTranscriptMessage handleTranscribe={handleTranscribe} />
          )}
        </div>
      ) : (
        <NoDocumentSelected handleUploadClick={handleUploadClick} />
      )}
    </div>
  );
}

/* Section Component */
function TranscriptSection({ title, content }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="transcript-section mb-4">
      <h3 className="font-bold">{title}</h3>
      <div className="pl-5">
        {lines.map((line, index) => (
          <div key={index}>
            {line.startsWith("-") ? (
              <ul>
                <li className="text-base para-font leading-relaxed">
                  {line.slice(1).trim()}
                </li>
              </ul>
            ) : (
              <p className="text-base para-font leading-relaxed">{line}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* No Transcript Message */
function NoTranscriptMessage({ handleTranscribe }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <FileText className="w-10 h-10 text-blue-500 mb-3 opacity-70" />
      <p className="text-sm font-medium mb-1">No transcript available</p>
      <p className="text-xs text-muted-foreground mb-4">
        Click below to extract a transcript from this document
      </p>
      <button
        onClick={handleTranscribe}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors"
      >
        Extract Transcript
      </button>
    </div>
  );
}

/* No Document Selected */
function NoDocumentSelected({ handleUploadClick }) {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-md flex flex-col items-center justify-center text-center h-80 space-y-6">
      <Clock className="w-12 h-12 text-blue-500 mb-4 opacity-70" />
      <h2 className="text-xl font-semibold heading-font mb-2">
        No Document Selected
      </h2>

      <motion.button
        onClick={handleUploadClick}
        className="flex items-center space-x-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Upload Document"
        style={{ padding: "10px 20px" }}
      >
        <Upload className="w-5 h-5" />
        <span className="text-xs font-medium">Upload Document</span>
      </motion.button>

      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Select a document from the list or upload a new one to view its
        structured transcript.
      </p>
    </div>
  );
}
