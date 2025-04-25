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
}

export function InsuranceRadarChart({ data, title = "Policy Parameters" }: InsuranceRadarChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Policy Score"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Score"]}
                contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 