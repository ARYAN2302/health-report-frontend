"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface Report {
  id: number
  filename: string
  upload_time: string
}

export function RecentReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReports(data)
        else setError("Failed to fetch reports")
      })
      .catch((err) => setError("Failed to fetch reports"))
  }, [])
  const recent = Array.isArray(reports) ? reports.slice(0, 2) : [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Your recently uploaded lab reports</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="space-y-4">
          {recent.length === 0 ? (
            <div className="text-sm text-muted-foreground">No reports found.</div>
          ) : (
            recent.map((report) => (
              <div key={report.id} className="flex items-start justify-between space-x-4 rounded-md border p-3">
                <div className="flex items-start space-x-3">
                  <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium leading-none">{report.filename}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(report.upload_time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
