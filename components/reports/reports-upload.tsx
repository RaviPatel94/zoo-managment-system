"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useZooData } from "@/context/zoo-data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, X } from "lucide-react"

interface ReportsUploadProps {
  onSuccess?: () => void
}

export function ReportsUpload({ onSuccess }: ReportsUploadProps) {
  const { addReport } = useZooData()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Health")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would upload the file to a server
      // For now, we'll just add a report entry
      addReport({
        id: Math.random().toString(36).substring(2, 9),
        title,
        category,
        date: new Date().toISOString(),
        author: "Current User",
        file_url: file ? URL.createObjectURL(file) : "",
      })

      setTitle("")
      setCategory("Health")
      setFile(null)
      onSuccess?.()
    } catch (error) {
      console.error("Error uploading report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Report Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Inventory">Inventory</SelectItem>
            <SelectItem value="Financial">Financial</SelectItem>
            <SelectItem value="Incident">Incident</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Upload File</Label>
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-between bg-muted p-2 rounded-md">
              <div className="flex items-center">
                <FileUp className="h-4 w-4 mr-2" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemoveFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <FileUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Drag and drop your file here or</p>
                <label htmlFor="file-upload" className="text-primary hover:underline cursor-pointer">
                  browse
                </label>
              </div>
              <Input id="file-upload" ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !file}>
          {isSubmitting ? "Uploading..." : "Upload Report"}
        </Button>
      </div>
    </form>
  )
}

