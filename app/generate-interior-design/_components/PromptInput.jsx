import React from "react";

import { Loader2, Wand2 } from "lucide-react";

const PromptInput = ({
  prompt,
  setPrompt,
  handlePromptSelect,
  handleEdit,
  isProcessing,
  selectedImage,
  error,
  filteredSuggestions,
  showSuggestions,
  setShowSuggestions,
  setFilteredSuggestions,
  filterSuggestions,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Instructions</h2>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => {
            const newValue = e.target.value;
            setPrompt(newValue);
            filterSuggestions(newValue);
            if (newValue.trim() && !showSuggestions) {
              setShowSuggestions(true);
            }
          }}
          onFocus={() => {
            setShowSuggestions(true);
            filterSuggestions(prompt);
          }}
          placeholder="Describe how you want to edit the image... (e.g., 'Add a sunset background', 'Remove the person in red shirt', 'Change hair color to blonde')"
          className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-sm text-gray-800 placeholder:text-gray-400"
          maxLength={500}
        />

        {showSuggestions && Object.keys(filteredSuggestions).length > 0 && (
          <div className="absolute mt-[30px] top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {Object.entries(filteredSuggestions).map(
              ([category, suggestions]) => (
                <div
                  key={category}
                  className="p-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    {category}
                  </div>
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePromptSelect(suggestion)}
                      className="text-sm text-gray-700 hover:text-purple-600 cursor-pointer py-1 hover:bg-purple-50 px-2 rounded"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between items-center ">
        <div className="text-xs text-gray-500">
          {prompt.length} / 500 characters
        </div>
        <button
          onClick={() => {
            if (
              showSuggestions &&
              Object.keys(filteredSuggestions).length > 0
            ) {
              setShowSuggestions(false);
              setFilteredSuggestions({});
            } else {
              setShowSuggestions(true);
              filterSuggestions(prompt);
            }
          }}
          className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded hover:bg-purple-50 transition-colors bg-white"
        >
          {showSuggestions && Object.keys(filteredSuggestions).length > 0
            ? "Hide suggestions"
            : "Show suggestions"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleEdit}
          disabled={!selectedImage || !prompt.trim() || isProcessing}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Edit Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
