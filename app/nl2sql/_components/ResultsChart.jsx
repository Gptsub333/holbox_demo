"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  // AreaChart, // AreaChart import removed as it's no longer used
  // Area, // Area import removed
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { motion } from "framer-motion"
import { FileQuestion, BarChart3, LineChartIcon, PieChartIcon } from "lucide-react" // AreaChartIcon can be removed if not used elsewhere

// Interface ResultsChartProps removed
// Type annotations for props (chartType, data, xAxisKey, yAxisKey) removed

const CHART_COLORS = {
  Bar: "#2563eb",
  Line: "#16a34a",
  Pie: ["#dc2626", "#f97316", "#facc15", "#4d7c0f", "#0d9488"],
  // Area: "#7c3aed", // Area color removed
}

const ChartIcon = ({ type }) => {
  // Type annotation for type prop removed
  const iconColor = "text-gray-700"
  switch (type) {
    case "Bar":
      return <BarChart3 className={`w-5 h-5 mr-2 ${iconColor}`} />
    case "Line":
      return <LineChartIcon className={`w-5 h-5 mr-2 ${iconColor}`} />
    case "Pie":
      return <PieChartIcon className={`w-5 h-5 mr-2 ${iconColor}`} />
    // case "Area": // Area case removed
    //   return <AreaChartIcon className={`w-5 h-5 mr-2 ${iconColor}`} />
    default:
      return <FileQuestion className={`w-5 h-5 mr-2 ${iconColor}`} />
  }
}

export default function ResultsChart({ chartType, data, xAxisKey, yAxisKey }) {
  if (!data || data.length === 0 || !chartType || !xAxisKey || !yAxisKey) {
    return (
      <motion.div
        className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FileQuestion className="w-12 h-12 mb-3 text-gray-400" />
        No chart data available or configuration missing.
      </motion.div>
    )
  }

  const chartData = data.map((item) => ({
    ...item,
    [yAxisKey]:
      chartType !== "Pie" && typeof item[yAxisKey] === "string"
        ? Number.parseFloat(item[yAxisKey]) || 0
        : item[yAxisKey],
  }))

  const renderChart = () => {
    const commonProps = {
      stroke: "#6b7280",
      fontSize: 12,
      tickFormatter: (value) => (typeof value === "number" ? value.toLocaleString() : value),
    }
    const tooltipProps = {
      contentStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      },
      itemStyle: { color: "#374151" },
      labelStyle: { color: "#4b5563", fontWeight: "500" },
    }
    const legendProps = {
      wrapperStyle: { fontSize: "12px", color: "#4b5563", paddingTop: "10px" },
    }

    switch (chartType) {
      case "Bar":
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey={xAxisKey} {...commonProps} />
            <YAxis {...commonProps} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Bar dataKey={yAxisKey} fill={CHART_COLORS.Bar} name={yAxisKey.replace(/_/g, " ")} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case "Line":
        return (
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey={xAxisKey} {...commonProps} />
            <YAxis {...commonProps} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={CHART_COLORS.Line}
              strokeWidth={2}
              name={yAxisKey.replace(/_/g, " ")}
              activeDot={{ r: 6, strokeWidth: 2, fill: CHART_COLORS.Line }}
              dot={{ r: 4, strokeWidth: 1 }}
            />
          </LineChart>
        )
      case "Pie":
        return (
          <PieChart margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Pie
              data={chartData}
              dataKey={yAxisKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS.Pie[index % CHART_COLORS.Pie.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        )
      case "Area": // Area case removed
        return (
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey={xAxisKey} {...commonProps} />
            <YAxis {...commonProps} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke={CHART_COLORS.Area}
              strokeWidth={2}
              fillOpacity={0.2}
              fill={CHART_COLORS.Area}
              name={yAxisKey.replace(/_/g, " ")}
            />
          </AreaChart>
        )
      default:
        return <p className="text-gray-500">Unsupported chart type: {chartType}</p>
    }
  }

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ChartIcon type={chartType} />
        Chart: {chartType}
      </h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </motion.div>
  )
}
