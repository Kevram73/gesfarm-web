"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts"

const data = [
  { name: "Jan", value: 400, revenue: 2400, users: 240 },
  { name: "Fév", value: 300, revenue: 1398, users: 139 },
  { name: "Mar", value: 200, revenue: 9800, users: 980 },
  { name: "Avr", value: 278, revenue: 3908, users: 390 },
  { name: "Mai", value: 189, revenue: 4800, users: 480 },
  { name: "Jun", value: 239, revenue: 3800, users: 380 },
  { name: "Jul", value: 349, revenue: 4300, users: 430 },
]

interface ChartProps {
  title: string
  description?: string
  type?: "area" | "bar" | "line"
  dataKey?: string
  className?: string
}

export function Chart({ 
  title, 
  description, 
  type = "area", 
  dataKey = "value",
  className 
}: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill="hsl(var(--primary))" />
          </BarChart>
        )
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
            />
          </LineChart>
        )
      default:
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.1}
            />
          </AreaChart>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
