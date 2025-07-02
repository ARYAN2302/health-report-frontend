"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Parameter {
  id: number
  name: string
  value: string
  unit?: string
  reference_range?: string
  status: string
}

export function ReportTable() {
  const [parameters, setParameters] = useState<Parameter[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<string>("")
  const [showInsight, setShowInsight] = useState(false)
  const [loadingInsight, setLoadingInsight] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    // Fetch latest report
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((reports) => {
        if (reports.length === 0) return
        const latest = reports[0]
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${latest.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      })
      .then((res) => (res ? res.json() : null))
      .then((report) => {
        if (report && report.parameters) setParameters(report.parameters)
      })
      .catch(() => setError("Failed to fetch parameters"))
  }, [])
  const filteredParameters = parameters.filter((param) =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const getInsight = async () => {
    setLoadingInsight(true)
    setShowInsight(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parameters)
      })
      const data = await res.json()
      setInsight(data.insight)
    } catch (e) {
      setInsight("Failed to get AI insight.")
    } finally {
      setLoadingInsight(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Results</CardTitle>
        <CardDescription>Health parameters extracted from your latest report</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search parameters..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reference Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParameters.length > 0 ? (
                filteredParameters.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">{param.name}</TableCell>
                    <TableCell>{param.value}</TableCell>
                    <TableCell>{param.unit}</TableCell>
                    <TableCell>{param.reference_range}</TableCell>
                    <TableCell>
                      {param.status === "normal" && <Badge variant="outline">Normal</Badge>}
                      {param.status === "high" && <Badge variant="destructive">High</Badge>}
                      {param.status === "low" && <Badge variant="secondary">Low</Badge>}
                      {param.status === "unknown" && <Badge variant="outline">Unknown</Badge>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No parameters found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={getInsight}
            className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
          >
            Get AI Analysis
          </button>
        </div>
        {showInsight && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-bold mb-2">AI Health Insight</h2>
              {loadingInsight ? <p>Loading...</p> : <p>{insight}</p>}
              <button onClick={() => setShowInsight(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
