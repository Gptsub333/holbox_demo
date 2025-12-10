// TranscriptDisplay.jsx
import React, { useState } from 'react';
import { 
  Wand2, FileText, ClipboardCheck, ChevronDown, GitCompare, 
  Eye, EyeOff, RotateCcw, Trash2, History, Layers , Stethoscope, Loader2
} from 'lucide-react';

const TranscriptDisplay = ({ 
  activeAudio, 
  transcript, 
  isTranscribing, 
  transcribeProgress,
  formattedTranscript,
  hasTranscriptionData,
  handleTranscribe,
  handleRefine,
  handleChatClick,
  handleUploadClick,
  handleCancel,
  isLoadingSample,
  // New props for transcript management
  isRefining,
  showOriginal,
  hasRefinedTranscript,
  toggleTranscriptView,
  revertToOriginal,
  useRefined,
  clearRefinement,
  refinementHistory
}) => {
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('SOAP');
  const [showHistory, setShowHistory] = useState(false);

  const formatOptions = [
    { value: 'SOAP', label: 'SOAP Format', icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { value: 'Clinical', label: 'Clinical Note', icon: ClipboardCheck, color: 'bg-purple-100 text-purple-600' },
    { value: 'Structured', label: 'Structured', icon: Wand2, color: 'bg-green-100 text-green-600' },
  ];

  const handleRefineClick = async () => {
    setShowFormatOptions(false);
    await handleRefine(selectedFormat);
  };

  if (!activeAudio) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-blue-500" />
          </div>
          <p className="text-base text-gray-500 mb-2">Select an audio file to begin</p>
          <p className="text-sm text-gray-400 text-center">
            Choose a sample audio or upload your own to start transcription
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audio Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{activeAudio.title}</h3>
            <p className="text-sm text-gray-500">Duration: {activeAudio.duration}</p>
          </div>
          <div className="flex items-center space-x-2">
            {activeAudio.isUploaded && (
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Uploaded
              </span>
            )}
            {hasRefinedTranscript && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${
                showOriginal 
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {showOriginal ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Original
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3 mr-1" />
                    Refined
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Transcript View Toggle */}
        {hasRefinedTranscript && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleTranscriptView}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    {showOriginal ? 'View Refined' : 'View Original'}
                  </button>
                  {!showOriginal && (
                    <button
                      onClick={revertToOriginal}
                      className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Revert to Original
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {refinementHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900"
                  >
                    <History className="h-4 w-4 mr-1" />
                    History ({refinementHistory.length})
                  </button>
                )}
                <button
                  onClick={clearRefinement}
                  className="flex items-center px-3 py-1.5 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </button>
              </div>
            </div>
            
            {/* Refinement History */}
            {showHistory && refinementHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Refinement History</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {refinementHistory.map((item, index) => (
                    <div key={item.id} className="text-xs p-2 bg-white rounded border">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Refinement #{index + 1}</span>
                        <span className="text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-gray-600">
                        Format: <span className="font-medium">{item.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Transcribe Button */}
          <button
            onClick={handleTranscribe}
            disabled={isTranscribing}
            className={`px-4 py-2 rounded-lg font-medium ${
              isTranscribing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isTranscribing ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Transcribing... {transcribeProgress}%
              </span>
            ) : (
              'Transcribe Audio'
            )}
          </button>
          
          {isTranscribing && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200"
            >
              Cancel
            </button>
          )}

          {/* Refine Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFormatOptions(!showFormatOptions)}
              disabled={!transcript || isRefining}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                !transcript || isRefining
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isRefining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Refining...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Refine Transcript
                  <ChevronDown className="h-4 w-4 ml-2" />
                </>
              )}
            </button>

            {/* Format Options Dropdown */}
            {showFormatOptions && transcript && !isRefining && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Choose Format:</p>
                  <p className="text-xs text-gray-500 mt-1">Select how to refine the transcript</p>
                </div>
                <div className="p-2 space-y-1">
                  {formatOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedFormat(option.value);
                          handleRefineClick();
                        }}
                        className={`w-full flex items-center p-3 rounded hover:bg-gray-50 ${
                          selectedFormat === option.value ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${option.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-500">Refine in {option.value} format</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Ask Questions Button */}
          <button
            onClick={handleChatClick}
            disabled={!hasTranscriptionData}
            className={`px-4 py-2 rounded-lg font-medium ${
              hasTranscriptionData
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Ask Questions
          </button>
        </div>

        {/* Progress Bar */}
        {isTranscribing && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Transcription Progress</span>
              <span>{transcribeProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${transcribeProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {hasTranscriptionData && formattedTranscript ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold">Medical Transcript</h3>
              {hasRefinedTranscript && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  showOriginal 
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {showOriginal ? 'Original' : 'Refined'}
                </span>
              )}
            </div>
         
          </div>
          
          <div className="space-y-6">
            {Object.entries(formattedTranscript).map(([key, section]) => {
              if (!section || !section.content || section.content === 'No information provided') {
                return null;
              }
              
              return (
                <div key={key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-6 bg-blue-500 rounded mr-3"></div>
                    {section.title}
                  </h4>
                  <div className="pl-5">
                    {section.content.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      
                      // Check if line starts with a bullet
                      if (trimmedLine.startsWith('-')) {
                        return (
                          <div key={index} className="flex mb-2 last:mb-0">
                            <span className="text-gray-500 mr-2">•</span>
                            <p className="text-gray-700 flex-1">{trimmedLine.substring(1).trim()}</p>
                          </div>
                        );
                      }
                      // Check if line is a sub-bullet
                      if (trimmedLine.startsWith('- -')) {
                        return (
                          <div key={index} className="flex mb-2 last:mb-0 ml-4">
                            <span className="text-gray-400 mr-2">-</span>
                            <p className="text-gray-600 flex-1">{trimmedLine.substring(2).trim()}</p>
                          </div>
                        );
                      }
                      // Regular paragraph
                      return (
                        <p key={index} className="text-gray-700 mb-2 last:mb-0">
                          {trimmedLine}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : transcript ? (
        // Show raw transcript if not parsed
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Transcript</h3>
            {hasRefinedTranscript && (
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                showOriginal 
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {showOriginal ? 'Original' : 'Refined'}
              </span>
            )}
          </div>
          <div className="whitespace-pre-line text-gray-700 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            {transcript}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TranscriptDisplay;