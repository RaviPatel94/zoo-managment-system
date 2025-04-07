"use client"

import type React from "react"

import { useState } from "react"
import { useZooData } from "@/context/zoo-data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Report } from "@/types/zoo-types"

interface AddReportFormProps {
  onSuccess?: () => void
}

export function AddReportForm({ onSuccess }: AddReportFormProps) {
  const { addReport } = useZooData()
  const [formData, setFormData] = useState<Partial<Report>>({
    title: "",
    category: "Health",
    date: new Date().toISOString().split("T")[0],
    author: "Current User",
  })
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would generate a PDF or other report format
      addReport({
        ...formData,
        id: Math.random().toString(36).substring(2, 9),
        content,
      } as Report)

      setFormData({
        title: "",
        category: "Health",
        date: new Date().toISOString().split("T")[0],
        author: "Current User",
      })
      setContent("")
      onSuccess?.()
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Report Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
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
          <Label htmlFor="date">Report Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Report Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Enter the report content here..."
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </form>
  )
}

