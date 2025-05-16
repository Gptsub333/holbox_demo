import React from "react";
import { FileAudio } from "lucide-react";

export default function AudioSamples({ sampleAudios, activeAudio, selectAudio }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold heading-font">Sample Recordings</h2>
      <div className="space-y-4">
        {sampleAudios.map((audio) => (
          <div
            key={audio.id}
            className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              activeAudio?.id === audio.id
                ? "bg-blue-50 border-2 border-blue-200"
                : "bg-gray-50 border border-gray-100 hover:bg-blue-50"
            }`}
            onClick={() => selectAudio(audio)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FileAudio className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{audio.title}</h3>
                  <p className="text-xs text-muted-foreground">{audio.duration}</p>
                </div>
              </div>
              {activeAudio?.id === audio.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
