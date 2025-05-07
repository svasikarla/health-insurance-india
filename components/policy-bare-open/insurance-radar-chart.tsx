"use client"

import React from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type InsuranceParameter = {
  name: string
  value: number
  fullMark: number
}

type InsuranceRadarChartProps = {
  data: InsuranceParameter[]
  title?: string
  color?: string
}

// Define a more harmonious color palette
const PARAM_COLORS = {
  "Claim Settlement": "#3b82f6", // Blue
  "Network Hospitals": "#10b981", // Emerald
  "Co-payment": "#f59e0b", // Amber (softer than orange)
  "Pre-Hospitalization": "#8b5cf6", // Violet
  "Post-Hospitalization": "#6366f1", // Indigo
  "Affordability": "#06b6d4", // Cyan
  "default": "#64748b" // Slate (softer gray)
}

// Define a unified color for the main radar area
const MAIN_COLOR = "#3b82f6" // Blue

export function InsuranceRadarChart({
  data,
  title = "Policy Parameters",
  color = "#3b82f6"
}: InsuranceRadarChartProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg font-medium text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full"> {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={data}
              margin={{ top: 10, right: 30, bottom: 30, left: 30 }}
            >
              {/* Softer grid lines */}
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Improved axis styling */}
              <PolarAngleAxis
                dataKey="name"
                tick={{
                  fill: "#475569",
                  fontSize: 12,
                  fontWeight: 500
                }}
                tickLine={false}
              />

              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
                tickCount={5}
              />

              {/* Main unified radar area */}
              <Radar
                name="Overall Performance"
                dataKey="value"
                stroke={MAIN_COLOR}
                fill={MAIN_COLOR}
                fillOpacity={0.5}
                dot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: (entry) => PARAM_COLORS[entry.name] || PARAM_COLORS.default,
                  r: 4
                }}
                activeDot={{
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: (entry) => PARAM_COLORS[entry.name] || PARAM_COLORS.default,
                  r: 6
                }}
              />

              {/* Enhanced tooltip */}
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "none",
                  padding: "10px 14px"
                }}
                itemStyle={{
                  fontSize: "13px",
                  color: "#1e293b"
                }}
                labelStyle={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "14px",
                  color: "#0f172a"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Improved legend with better spacing and styling */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 px-2">
          {data.map((param) => (
            <div key={param.name} className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full shadow-sm">
              <span
                className="inline-block w-3 h-3 mr-1.5 rounded-full"
                style={{ backgroundColor: PARAM_COLORS[param.name] || PARAM_COLORS.default }}
              />
              <span className="font-medium text-gray-700">{param.name}: <span className="text-gray-900">{param.value}%</span></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}