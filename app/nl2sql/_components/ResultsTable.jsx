"use client";

import { motion } from "framer-motion";

// Interface ResultsTableProps removed
// Type annotation for data prop removed

// export default function ResultsTable({ data }) {
//   if (!data || data.length === 0) {
//     return (
//       <motion.div className="p-6 text-center text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         No data to display.
//       </motion.div>
//     );
//   }

//   const headers = Object.keys(data[0]);

//   return (
//     <motion.div
//       className="overflow-x-auto h-full"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 min-w-full">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {headers.map((header) => (
//                 <th
//                   key={header}
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                 >
//                   {header.replace(/_/g, " ")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
//                 {headers.map((header) => (
//                   <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     {String(row[header])}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// }

export default function ResultsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        className="p-6 text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No data to display.
      </motion.div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Desktop Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y  divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="block md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
          >
            {headers.map((header, headerIndex) => (
              <div
                key={headerIndex}
                className="flex justify-between items-start py-2 border-b last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-600">
                  {header.replace(/_/g, " ")}
                </div>
                <div className="text-sm text-gray-800 text-right max-w-[60%] break-words">
                  {String(row[header])}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
