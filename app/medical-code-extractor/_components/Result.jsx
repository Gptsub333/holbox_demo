import React from 'react';
import { motion } from 'framer-motion';

const Result = ({ extractionResult }) => {
  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Document Analysis</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{extractionResult}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
