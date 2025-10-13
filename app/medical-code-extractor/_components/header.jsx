import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <motion.div
      className="mt-[30px] sm:mt-0 mb-8 flex items-center"
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }}
    >
      {/* <FeatureIcon icon={Stethoscope} size="lg" gradient="blue" className="mr-4" /> */}

      <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-4">
        <FileText className="h-8 w-8 text-white" />
      </div>

      <div>
        <h1 className="text-3xl font-bold heading-font">Medical Code Extractor</h1>
        <p className="text-muted-foreground mt-1">
          Automatically identify and extract medical billing codes (ICD-10, CPT, HCPCS) from your medical documents
          using AI-powered analysis.
        </p>
      </div>
    </motion.div>
  );
};

export default Header;
