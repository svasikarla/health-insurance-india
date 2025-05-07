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

// Define colors for parameter labels
const PARAM_COLORS = {
  "Claim Settlement": "#4f46e5", // Indigo
  "Network Hospitals": "#10b981", // Emerald
  "Co-payment": "#f97316", // Orange
  "Pre-Hospitalization": "#8b5cf6", // Violet
  "Post-Hospitalization": "#ec4899", // Pink
  "Affordability": "#0ea5e9", // Sky
  "default": "#6b7280" // Gray (fallback)
}

export function InsuranceRadarChart({ 
  data, 
  title = "Policy Parameters",
  color = "#4f46e5" 
}: InsuranceRadarChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full"> {/* Increased height to prevent text overlap */}
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="70%" 
              data={data}
              margin={{ top: 5, right: 30, bottom: 25, left: 30 }} /* Increased bottom margin */
            >
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false} 
              />
              {/* Replace single Radar with multiple colored Radars */}
              {data.map((entry, index) => (
                <Radar
                  key={entry.name}
                  name={entry.name}
                  dataKey="value"
                  stroke={PARAM_COLORS[entry.name] || PARAM_COLORS.default}
                  fill={PARAM_COLORS[entry.name] || PARAM_COLORS.default}
                  fillOpacity={0.6}
                  dot
                  activeDot
                  /* Create a custom data array with just this parameter having a value */
                  data={[{
                    name: entry.name,
                    value: entry.value,
                    fullMark: entry.fullMark
                  }]}
                />
              ))}
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #e5e7eb",
                  padding: "8px"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Color-coded parameter legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-6"> {/* Increased top margin */}
          {data.map((param) => (
            <div key={param.name} className="flex items-center text-xs">
              <span 
                className="inline-block w-3 h-3 mr-1 rounded-full"
                style={{ backgroundColor: PARAM_COLORS[param.name] || PARAM_COLORS.default }}
              />
              <span>{param.name}: {param.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}