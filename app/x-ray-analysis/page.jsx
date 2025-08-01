"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Stethoscope, ScanSearch } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./_component/resizable"
import { useMediaQuery } from "./hooks/use-media-query"

const xrayImages = [
  {
    id: 1,
    src: "/xray/x3.webp",
    alt: "Sample Chest X-ray 1",
  },
  {
    id: 2,
    src: "/xray/x2.jpg",
    alt: "Sample Chest X-ray 2",
  },
  {
    id: 3,
    src: "/xray/x1.jpg",
    alt: "Sample Chest X-ray 3",
  },
]

const reportDataList = [
  {
    clinicalIndication: "Persistent cough and shortness of breath. Rule out pneumonia or pulmonary pathology.",
    technique: "Standard posteroanterior and lateral views of the chest were obtained. The images are of diagnostic quality.",
    findings: {
      cardiopulmonary: "The cardiac silhouette is normal in size and contour. Pulmonary vasculature is within normal limits. No evidence of acute alveolar infiltrates, consolidation, or pleural effusion. No pneumothorax is identified. Lung fields are clear bilaterally with normal volume. No focal mass or nodular opacity identified.",
      mediastinumAndHila: "Normal mediastinal contour. Hilar structures are unremarkable. Trachea is midline.",
      pleura: "No pleural thickening or calcification. Costophrenic angles are sharp bilaterally.",
      bonesAndSoftTissues: "No rib fractures or lytic/blastic lesions seen. Thoracic spine alignment is maintained. No abnormal soft tissue densities.",
    },
    impression: "Normal chest X-ray. No radiographic evidence of pneumonia, pulmonary mass, effusion, or pneumothorax. Clinical symptoms likely not related to acute intrathoracic pathology; recommend clinical correlation.",
  },
  {
    clinicalIndication: "Fever and chest pain. Evaluate for pneumonia or other acute pathology.",
    technique: "Standard PA and lateral chest X-rays obtained.",
    findings: {
      cardiopulmonary: "The heart is normal in size. Mild prominence of the pulmonary vasculature. Patchy opacity in the right middle lobe suggesting consolidation. No pleural effusion. No pneumothorax.",
      mediastinumAndHila: "Mediastinum is central. Hila are not enlarged.",
      pleura: "No thickening. Costophrenic angles are preserved.",
      bonesAndSoftTissues: "No fractures seen. Bony structures are intact.",
    },
    impression: "Findings are suggestive of right middle lobe pneumonia. No evidence of pneumothorax or pleural effusion.",
  },
  {
    clinicalIndication: "History of trauma. Rule out rib fractures or pneumothorax.",
    technique: "PA and lateral chest X-rays were performed.",
    findings: {
      cardiopulmonary: "Normal cardiac and vascular silhouette. Lungs are expanded with no areas of consolidation. No pneumothorax.",
      mediastinumAndHila: "Mediastinal and hilar contours are normal.",
      pleura: "Pleural spaces are clear. Costophrenic angles are sharp.",
      bonesAndSoftTissues: "Nondisplaced fracture of the left sixth rib is noted. No other fractures. No subcutaneous emphysema.",
    },
    impression: "Nondisplaced fracture of left sixth rib. No pneumothorax or other acute intrathoracic findings.",
  },
]


function RadiologyReport({ data }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Radiology Report</h2>
      <div className="space-y-5 text-sm">
        <div>
          <h3 className="font-semibold text-blue-700 mb-1">Clinical Indication</h3>
          <p className="text-gray-600 leading-relaxed">{data.clinicalIndication}</p>
        </div>
        <div>
          <h3 className="font-semibold text-blue-700 mb-1">Technique</h3>
          <p className="text-gray-600 leading-relaxed">{data.technique}</p>
        </div>
        <div>
          <h3 className="font-semibold text-blue-700 mb-1">Findings</h3>
          <div className="space-y-2 pl-4 border-l-2 border-blue-100">
            <p>
              <strong className="font-bold text-gray-900">Cardiopulmonary:</strong> {data.findings.cardiopulmonary}
            </p>
            <p>
              <strong className="font-bold text-gray-900">Mediastinum and Hila:</strong>{" "}
              {data.findings.mediastinumAndHila}
            </p>
            <p>
              <strong className="font-bold text-gray-900">Pleura:</strong> {data.findings.pleura}
            </p>
            <p>
              <strong className="font-bold text-gray-900">Bones and Soft Tissues:</strong>{" "}
              {data.findings.bonesAndSoftTissues}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-blue-700 mb-1">Impression</h3>
          <p className="text-gray-600 leading-relaxed">{data.impression}</p>
        </div>
      </div>
    </div>
  )
}

const DesktopLayout = ({ xrayImages, selectedImage, handleImageClick, reportData }) => (
  <ResizablePanelGroup direction="horizontal" className="h-screen w-full bg-gray-100 font-sans">
    <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
      <aside className="h-full bg-white flex flex-col p-6">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">X-ray Analysis</h1>
          </div>
          <p className="text-xsm text-gray-500">Select a sample image to view the AI-generated analysis report.</p>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Sample Images</h2>
          {xrayImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image)}
              className={cn(
                "cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out",
                "hover:border-blue-400 hover:shadow-md",
                selectedImage?.id === image.id ? "border-blue-500 shadow-lg" : "border-transparent",
              )}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={200}
                height={200}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      </aside>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={80}>
      <main className="h-full flex-1 p-6 flex flex-col">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {selectedImage ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Analysis for: {selectedImage.alt}</h2>
              </div>
              <div className="flex-1 flex gap-6 p-6 overflow-hidden">
                <div className="w-1/3 flex-shrink-0">
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={selectedImage.src || "/placeholder.svg"}
                      alt={selectedImage.alt}
                      width={400}
                      height={400}
                      className="object-cover w-full h-auto"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto pr-4">
                  <RadiologyReport data={reportData} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ScanSearch className="w-16 h-16 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Select an X-ray</h2>
              <p className="max-w-xs mt-1">Choose a sample from the left panel to display the analysis report here.</p>
            </div>
          )}
        </div>
      </main>
    </ResizablePanel>
  </ResizablePanelGroup>
)

const MobileLayout = ({ xrayImages, selectedImage, handleImageClick, reportData }) => (
  <div className="flex flex-col h-screen bg-gray-100 font-sans p-4">
    <header className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <Stethoscope className="w-8 h-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">X-ray Analysis</h1>
      </div>
      <p className="text-sm text-gray-500">Select a sample image to view the analysis report.</p>
    </header>
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Sample Images</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {xrayImages.map((image) => (
          <div
            key={image.id}
            onClick={() => handleImageClick(image)}
            className={cn(
              "cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out flex-shrink-0 w-32",
              selectedImage?.id === image.id ? "border-blue-500 shadow-lg" : "border-transparent",
            )}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={160}
              height={160}
              className="object-cover w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
    <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
      {selectedImage ? (
        <div className="p-4">
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              width={400}
              height={400}
              className="object-cover w-full h-auto"
            />
          </div>
          <RadiologyReport data={reportData} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
          <ScanSearch className="w-16 h-16 mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold">Select an X-ray</h2>
          <p className="max-w-xs mt-1">Choose a sample from above to display the analysis report here.</p>
        </div>
      )}
    </main>
  </div>
)

export default function ChestXrayAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [hasMounted, setHasMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleImageClick = (image) => {
    setSelectedImage((prevImage) => (prevImage?.id === image.id ? null : image))
  }

  if (!hasMounted) {
    return null // or a loading spinner
  }

  const layoutProps = {
  xrayImages,
  selectedImage,
  handleImageClick,
  reportData: selectedImage ? reportDataList[selectedImage.id - 1] : null, // id is 1-based
}


  return isMobile ? <MobileLayout {...layoutProps} /> : <DesktopLayout {...layoutProps} />
}
