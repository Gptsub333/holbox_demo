import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Lightbulb } from "lucide-react";

export default function TranscriptDisplay({ activeDocument, handleUploadClick }) {
  if (!activeDocument) {
    return (
      <Card className="border-dashed border-2 flex items-center justify-center h-80">
        <CardContent className="text-center">
          <FileText className="w-10 h-10 text-blue-500 mx-auto mb-2" />
          <p className="text-gray-500">No document selected.</p>
          <button
            onClick={handleUploadClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Upload Document
          </button>
        </CardContent>
      </Card>
    );
  }

  const transcript = activeDocument.transcript;

  return (
    <div className="space-y-6">
      {/* Document Title */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            {activeDocument.title}
          </h2>
          <p className="text-green-700 mt-2">{transcript.message}</p>
        </CardContent>
      </Card>

      {/* Approval Prediction */}
      {transcript.result && (
        <Card className="border-l-4 border-blue-500 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
              Approval Prediction
            </h3>
            <p>
              Outcome:{" "}
              <b className="text-blue-700">
                {transcript.result.approval_prediction.predicted_outcome}
              </b>
            </p>
            <p>
              Likelihood: {transcript.result.approval_prediction.likelihood} | Confidence:{" "}
              {transcript.result.approval_prediction.confidence_score}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {transcript.result?.risk_factors?.length > 0 && (
        <Card className="border-l-4 border-red-500 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              Risk Factors
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {transcript.result.risk_factors.map((rf, idx) => (
                <li key={idx}>
                  <b>{rf.factor}</b> ({rf.severity}) – {rf.description}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {transcript.result?.recommendations?.length > 0 && (
        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 text-green-600 mr-2" />
              Recommendations
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {transcript.result.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
