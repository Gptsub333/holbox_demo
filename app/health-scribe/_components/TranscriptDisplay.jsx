import React from "react";
import { MessageSquare, FileAudio, Loader2, Clock } from "lucide-react";

export default function TranscriptDisplay({
  activeAudio,
  transcript,
  formattedTranscript,
  isTranscribing,
  transcribeProgress,
  handleChatClick,
  handleTranscribe,
}) {
  return (
    <div>
      {activeAudio ? (
        <>
          {/* Transcript Section */}
          <div className="rounded-xl border bg-white p-8 shadow-md mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold heading-font">Transcript</h2>
                {activeAudio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeAudio.title} • {activeAudio.duration}
                  </p>
                )}
              </div>

              {/* Top Ask Questions Button */}
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
                      <FileAudio className="w-4 h-4 mr-1" />
                      Transcribe Audio
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Transcription Process or Content */}
            {isTranscribing ? (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
                <p className="text-sm font-medium mb-2">Transcribing audio...</p>
                <div className="w-full max-w-md bg-gray-200 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${transcribeProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{transcribeProgress}% complete</p>
              </div>
            ) : transcript ? (
              <>
                <div className="bg-gray-50 rounded-lg p-6 max-h-[400px] overflow-y-auto mb-4">
                  {/* Render sections dynamically */}
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

                {/* Bottom Ask Questions Button */}
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
        </>
      ) : (
        <NoRecordingSelected />
      )}
    </div>
  );
}

// Sub-component for each transcript section
function TranscriptSection({ title, content }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="transcript-section">
      <h3 className="font-bold">{title}</h3>
      <div className="pl-5">
        {lines.map((line, index) => (
          <div key={index}>
            {line.startsWith("-") ? (
              <ul>
                <li className="text-base para-font leading-relaxed">{line.slice(1).trim()}</li>
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

// Component shown when no transcript is available
function NoTranscriptMessage({ handleTranscribe }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <FileAudio className="w-10 h-10 text-blue-500 mb-3 opacity-70" />
      <p className="text-sm font-medium mb-1">No transcript available</p>
      <p className="text-xs text-muted-foreground mb-4">
        Click the button below to extract a transcript from this recording
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

// Component shown when no recording is selected
function NoRecordingSelected() {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-md flex flex-col items-center justify-center text-center h-80">
      <Clock className="w-12 h-12 text-blue-500 mb-4 opacity-70" />
      <h2 className="text-xl font-semibold heading-font mb-2">No Recording Selected</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Select a recording from the list or upload your own audio file to see the transcript and interact with it.
      </p>
    </div>
  );
}
