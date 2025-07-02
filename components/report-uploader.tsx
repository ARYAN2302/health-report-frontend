"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReportUploader() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf" || file.type.startsWith("image/"),
      )
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf" || file.type.startsWith("image/"),
      )
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0 || !token) return
    setIsUploading(true)
    setError(null)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload_report`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.detail || "Upload failed")
        }
      }
      setFiles([])
      alert("Upload and extraction successful!")
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
      alert("Upload failed: " + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Lab Reports</CardTitle>
        <CardDescription>Drag and drop or click to upload PDF or image files</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            isUploading && "pointer-events-none opacity-60",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragging ? "Drop files here" : "Drag files here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">Supports PDF and image files</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="text-sm font-medium">Selected Files</div>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload and Process"
              )}
            </Button>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </CardContent>
    </Card>
  )
}
