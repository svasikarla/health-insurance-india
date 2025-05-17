"use client"

import React, { useState } from "react"
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
  height?: number
}

// Enhanced color palette with better contrast and harmony
const PARAM_COLORS = {
  "Claim Settlement": "hsl(var(--chart-1))", // Using CSS variables for theme support
  "Network Hospitals": "hsl(var(--chart-2))",
  "Co-payment": "hsl(var(--chart-3))",
  "Pre-Hospitalization": "hsl(var(--chart-4))",
  "Post-Hospitalization": "hsl(var(--chart-5))",
  "Affordability": "hsl(var(--primary))",
  "default": "hsl(var(--muted-foreground))"
}

// Define a unified color for the main radar area
const MAIN_COLOR = "hsl(var(--primary))"
const GRID_COLOR = "hsl(var(--border))"
const AXIS_TEXT_COLOR = "hsl(var(--muted-foreground))"

export function InsuranceRadarChart({ data, title, height = 250 }: InsuranceRadarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="radar-chart-container">
      {title && <h4 className="text-sm font-medium mb-2 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="70%"
          data={data}
          margin={{ top: 10, right: 30, bottom: 30, left: 30 }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Enhanced grid with subtle animation */}
          <PolarGrid 
            stroke={GRID_COLOR} 
            strokeDasharray="3 3" 
            strokeOpacity={0.7}
            className="radar-grid"
          />

          {/* Improved axis styling with better readability */}
          <PolarAngleAxis
            dataKey="name"
            tick={{
              fill: AXIS_TEXT_COLOR,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
            tickLine={false}
            stroke={GRID_COLOR}
            strokeOpacity={0.5}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
            stroke={GRID_COLOR}
          />

          {/* Enhanced radar area with animations and better styling */}
          <Radar
            name="Overall Performance"
            dataKey="value"
            stroke={MAIN_COLOR}
            fill={MAIN_COLOR}
            fillOpacity={0.6}
            strokeWidth={2}
            className="radar-area"
            onMouseEnter={handleMouseEnter}
            dot={(props) => {
              const { cx, cy, index, payload } = props;
              const isActive = activeIndex === index;
              const color = PARAM_COLORS[payload.name] || PARAM_COLORS.default;
              
              return (
                <circle
                  key={`dot-${payload.name}`} // Add a unique key prop
                  cx={cx}
                  cy={cy}
                  r={isActive ? 6 : 4}
                  fill={color}
                  stroke="white"
                  strokeWidth={2}
                  className="radar-dot"
                  style={{
                    transition: "r 0.2s ease-in-out",
                    filter: isActive ? "drop-shadow(0 0 2px rgba(0,0,0,0.3))" : "none"
                  }}
                />
              );
            }}
            activeDot={{
              stroke: "#fff",
              strokeWidth: 2,
              fill: (entry) => PARAM_COLORS[entry.name] || PARAM_COLORS.default,
              r: 7,
              className: "radar-active-dot"
            }}
          />

          {/* Enhanced tooltip with better styling */}
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid hsl(var(--border))",
              padding: "10px 14px"
            }}
            itemStyle={{
              fontSize: "13px",
              color: "hsl(var(--foreground))"
            }}
            labelStyle={{
              fontWeight: "bold",
              marginBottom: "6px",
              fontSize: "14px",
              color: "hsl(var(--foreground))"
            }}
            wrapperStyle={{
              transition: "opacity 0.2s ease-in-out",
              zIndex: 10
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Improved legend with better spacing, styling and hover effects */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 px-2">
        {data.map((param, idx) => (
          <div 
            key={param.name} 
            className="flex items-center text-xs bg-muted/50 px-2.5 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
            onMouseEnter={() => handleMouseEnter(null, idx)}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor: activeIndex === idx ? `color-mix(in srgb, ${PARAM_COLORS[param.name] || PARAM_COLORS.default} 15%, hsl(var(--background)))` : "",
              transition: "background-color 0.2s ease-in-out"
            }}
          >
            <span
              className="inline-block w-3 h-3 mr-1.5 rounded-full"
              style={{ 
                backgroundColor: PARAM_COLORS[param.name] || PARAM_COLORS.default,
                boxShadow: activeIndex === idx ? "0 0 0 2px rgba(255,255,255,0.8)" : "none",
                transition: "box-shadow 0.2s ease-in-out"
              }}
            />
            <span className="font-medium text-foreground">
              {param.name}: <span className="text-primary font-semibold">{param.value}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        .radar-area {
          transition: fill-opacity 0.3s ease-in-out;
        }
        
        .radar-area:hover {
          fill-opacity: 0.7;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .radar-active-dot {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
