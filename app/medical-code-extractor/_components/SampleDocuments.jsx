import React from 'react';
import {
  Heart,
  Bone,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SampleDocuments = ({handleSampleSelect }) => {
  // Sample medical documents
  const sampleDocuments = [
    {
      id: 1,
      title: 'Cardiology Discharge Summary',
      specialty: 'Cardiovascular',
      documentType: 'Inpatient discharge summary',
      complexity: 'High',
      icon: Heart,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      expectedCodes: ['ICD-10 diagnoses', 'Surgical CPT codes', 'Device HCPCS'],
      description:
        'This document provides details of a patient’s hospital stay under cardiology care, including admission diagnosis, treatment given, medications prescribed, test results, lifestyle recommendations, and follow-up instructions after discharge.',
      sampleFile: 'cardiology-report.pdf',
    },
    {
      id: 2,
      title: 'Orthopedic Operative Report',
      specialty: 'Orthopedic Surgery',
      documentType: 'Surgical procedure note',
      complexity: 'Moderate',
      icon: Bone,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      expectedCodes: ['Surgical CPT codes', 'Implant HCPCS', 'Anesthesia codes'],
      description:
        'This report records the surgical procedure performed by an orthopedic surgeon. It includes patient background, diagnosis, type of surgery, anesthesia used, surgical techniques, findings during the operation, implants or devices used, complications (if any), and post-operative care instructions.',
      sampleFile: 'orthopedic-operative.pdf',
    },
    {
      id: 3,
      title: 'Primary Care Office Visit',
      specialty: 'Family Medicine',
      documentType: 'Outpatient visit note',
      complexity: 'Low',
      icon: User,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      expectedCodes: ['E/M codes', 'Preventive CPT', 'Lab orders'],
      description:
        'This record summarizes a routine or follow-up visit to a primary care physician. It typically includes the reason for visit, patient history, physical examination findings, diagnostic tests ordered, assessment of conditions, treatment plan, prescribed medications, and recommendations for future care.',
      sampleFile: 'primary-care-visit.pdf',
    },
  ];

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Try Sample Medical Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleDocuments.map((sample) => {
            const IconComponent = sample.icon;
            return (
              <div
                key={sample.id}
                className={`relative border ${sample.borderColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-60 group ${sample.bgColor} bg-opacity-30`}
                onClick={() => handleSampleSelect(sample)}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${sample.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${sample.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 mb-1">{sample.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{sample.specialty}</div>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(
                        sample.complexity
                      )}`}
                    >
                      {sample.complexity} Complexity
                    </div>
                  </div>
                </div>

                <div className="text-xs text-purple-600 font-medium mt-5">Click to try this sample</div>

                {/* Hover tooltip */}
                <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center p-4">
                  <div className="text-white text-xs font-medium mb-2">Expected Code Types:</div>
                  {sample.expectedCodes.map((code, idx) => (
                    <div key={idx} className="text-white text-xs mb-1">
                      • {code}
                    </div>
                  ))}
                  <div className="text-purple-300 text-xs mt-2">Click to select this document</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SampleDocuments;
