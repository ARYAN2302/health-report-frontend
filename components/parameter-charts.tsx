"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "@/components/ui/chart"

export function ParameterCharts() {
  const [trendData, setTrendData] = useState<any[]>([])
  const [topParams, setTopParams] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((reports) => {
        if (!Array.isArray(reports)) {
          setTrendData([])
          setTopParams([])
          return
        }
        // Count parameter frequency
        const paramCount: Record<string, number> = {}
        reports.forEach((report: any) => {
          report.parameters.forEach((p: any) => {
            paramCount[p.name] = (paramCount[p.name] || 0) + 1
          })
        })
        // Get top 3 parameters
        const sorted = Object.entries(paramCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name)
        setTopParams(sorted)
        // Build trend data
        const data = reports.slice(0, 10).reverse().map((report: any) => {
          const entry: any = { date: new Date(report.upload_time).toLocaleDateString() }
          for (const param of sorted) {
            const found = report.parameters.find((p: any) => p.name === param)
            entry[param] = found ? parseFloat(found.value) : null
          }
          return entry
        })
        setTrendData(data)
      })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Trends</CardTitle>
        <CardDescription>
          Track changes in your most important health parameters over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Parameters</TabsTrigger>
            {topParams.map((p) => (
              <TabsTrigger key={p} value={p}>{p}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {topParams.map((p, i) => (
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={p}
                    stroke={["#8884d8", "#82ca9d", "#ffc658"][i]}
                    name={p}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          {topParams.map((p, i) => (
            <TabsContent key={p} value={p} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={p}
                    stroke={["#8884d8", "#82ca9d", "#ffc658"][i]}
                    name={p}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
