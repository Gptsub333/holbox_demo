import React from 'react';
import { Loader2 } from 'lucide-react';

const Processing = ({transcribeProgress}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-base text-gray-500 mb-2">Analyzing medical document...</p>
        <p className="text-sm text-gray-400">This may take 30-60 seconds</p>

        <div className="w-full max-w-xs mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${transcribeProgress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processing;
