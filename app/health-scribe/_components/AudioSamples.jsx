import React from "react";
import { FileAudio, Play, Pause } from "lucide-react";

export default function AudioSamples({ sampleAudios, playingAudioId, togglePlay, audioProgress, selectAudio }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold heading-font">Sample Recordings</h2>
      <div className="space-y-4">
        {sampleAudios.map((audio) => {
          const isPlaying = playingAudioId === audio.id;
          const progress = audioProgress[audio.id] || 0;
          const durationSeconds = audio.duration
            ? audio.duration.split(":").reduce((acc, time) => acc * 60 + +time, 0)
            : 0;
          const progressPercent = durationSeconds ? (progress / durationSeconds) * 100 : 0;

          return (
            <div
              key={audio.id}
              className={`rounded-lg p-4 transition-all duration-200 ${
                isPlaying ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50 border border-gray-100 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Select audio on left side only */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => selectAudio(audio)}>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FileAudio className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{audio.title}</h3>
                    <p className="text-xs text-muted-foreground">{audio.duration}</p>
                  </div>
                </div>

                {/* Play/pause button with rounded border */}
                <button
                  onClick={() => togglePlay(audio)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-8 h-8 rounded-full border border-blue-600 flex items-center justify-center hover:bg-blue-100"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Play className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              </div>

              {/* Show progress bar only if playing */}
              {isPlaying && (
                <div className="mt-3 h-2 w-full bg-gray-300 rounded">
                  <div className="h-2 bg-blue-600 rounded" style={{ width: `${progressPercent}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
