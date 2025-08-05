import React from "react";
import { Banknote } from "lucide-react";

const ResultsModal = ({ showResults, merchants, selectedSample, handleCloseResults }) => {
  if (!showResults) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 transform transition-all duration-300 scale-100 opacity-100"
        style={{
          animation: "pop-in 0.3s ease-in-out",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <Banknote className="h-6 w-6 text-blue-600" />
          <button onClick={handleCloseResults} className="text-red-500">
            Close
          </button>
        </div>
        <h2 className="font-semibold text-gray-700 mb-2">Analysis Complete</h2>
        <p className="text-gray-600 mb-4">
          Here are the merchants and amounts we found in{" "}
          <span className="font-semibold text-blue-700">{selectedSample}</span>.
        </p>
        <div className="overflow-y-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] space-y-2">
          {merchants.map((merchant, index) => (
            <div
              key={index}
              className="flex justify-between p-2 bg-gray-100 rounded-md"
            >
              <span className="font-medium text-gray-800">{merchant.name}</span>
              <span className="font-semibold text-gray-900">
                ${merchant.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
