'use client';
import React from 'react';
import { FileText } from 'lucide-react';

export default function DocumentSamples({
  documents,
  selectDocument,
  activeDocumentId,
  nameDisplay
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold heading-font">
        {nameDisplay}
      </h2>
      <div className="space-y-4">
        {documents.map((doc) => {
          const isActive = activeDocumentId === doc.id;

          return (
            <div
              key={doc.id}
              onClick={() => selectDocument(doc)}
              className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 border border-gray-100 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {doc.duration}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
