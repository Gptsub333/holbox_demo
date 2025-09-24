import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

const SAMPLE_DATA = [
  {
    id: 1,
    name: "Classic White Tee",
    model: "/models/model1.png",
    garment: "/garments/whitetshirt.png",
    category: "tshirt",
    description: "Perfect fit casual white t-shirt for everyday wear"
  },
  {
    id: 2,
    name: "Cozy Hoodie",
    model: "/models/model2.png",
    garment: "/garments/hoodie.png",
    category: "hoodie",
    description: "Comfortable pullover hoodie for casual occasions"
  },
  {
    id: 3,
    name: "Denim Jacket",
    model: "/models/model3.png",
    garment: "/garments/denim.png",
    category: "jacket",
    description: "Classic denim jacket for layered street style"
  },
  {
    id: 4,
    name: "Smart Polo",
    model: "/models/model4.png",
    garment: "/garments/poloshirt.png",
    category: "polo",
    description: "Classic collar polo shirt for smart casual look"
  }
];

export default function SampleGallery({ onSampleSelect }) {
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [hoveredSample, setHoveredSample] = useState(null);

  const handleSampleClick = (sample) => {
    // Toggle the selected state of the clicked sample
    if (selectedSamples.some((s) => s.id === sample.id)) {
      setSelectedSamples(selectedSamples.filter((s) => s.id !== sample.id)); // Remove the sample
    } else {
      setSelectedSamples([...selectedSamples, sample]); // Add the sample
    }

    // Optionally, call the onSampleSelect callback with the selected sample
    if (onSampleSelect) {
      onSampleSelect(sample);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sample Gallery</h2>
          <p className="text-sm text-gray-600">Click any sample to try it instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {SAMPLE_DATA.map((sample, index) => (
          <motion.div
            key={sample.id}
            className={`relative cursor-pointer group ${
              selectedSamples.some((s) => s.id === sample.id) 
                ? 'ring-2 ring-purple-500 ring-offset-2' 
                : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleSampleClick(sample)}
            onHoverStart={() => setHoveredSample(sample.id)}
            onHoverEnd={() => setHoveredSample(null)}
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              {/* Sample Preview */}
              <div className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-200 min-h-[120px]">
                <div className="absolute inset-0 flex">
                  {/* Model Image */}
                  <div className="w-1/2 relative overflow-hidden">
                    <img
                      src={sample.model}
                      alt="Model"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Model";
                      }}
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      Model
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-white/50"></div>

                  {/* Garment Image */}
                  <div className="w-1/2 relative overflow-hidden">
                    <img
                      src={sample.garment}
                      alt="Garment"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Garment";
                      }}
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      Garment
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredSample === sample.id ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center text-white">
                    <Play className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs font-medium">Try This Look</p>
                  </div>
                </motion.div>
              </div>

              {/* Sample Info */}
              <div className="p-3 flex-shrink-0">
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {sample.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1 capitalize">{sample.category}</p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {selectedSamples.some((s) => s.id === sample.id) && (
                <motion.div
                  className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <Play className="h-3 w-3" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gallery Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-purple-600">{SAMPLE_DATA.length}</p>
            <p className="text-xs text-gray-600">Samples</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">4</p>
            <p className="text-xs text-gray-600">Categories</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-600">HD</p>
            <p className="text-xs text-gray-600">Quality</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}