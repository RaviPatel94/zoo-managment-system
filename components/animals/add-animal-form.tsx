"use client"

import type React from "react"

import { useState } from "react"
import { useZooData } from "@/context/zoo-data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Animal } from "@/types/zoo-types"

interface AddAnimalFormProps {
  onSuccess?: () => void
}

export function AddAnimalForm({ onSuccess }: AddAnimalFormProps) {
  const { addAnimal } = useZooData()
  const [formData, setFormData] = useState<Partial<Animal>>({
    name: "",
    species: "",
    gender: "Male",
    age: 0,
    health_status: "Healthy",
    location: "Main Exhibit",
    diet_requirements: "",
    arrival_date: new Date().toISOString().split("T")[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number.parseInt(value) || 0 : value,
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
      addAnimal(formData as Animal)
      setFormData({
        name: "",
        species: "",
        gender: "Male",
        age: 0,
        health_status: "Healthy",
        location: "Main Exhibit",
        diet_requirements: "",
        arrival_date: new Date().toISOString().split("T")[0],
      })
      onSuccess?.()
    } catch (error) {
      console.error("Error adding animal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" name="species" value={formData.species} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age (years)</Label>
          <Input id="age" name="age" type="number" min="0" value={formData.age} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="health_status">Health Status</Label>
          <Select value={formData.health_status} onValueChange={(value) => handleSelectChange("health_status", value)}>
            <SelectTrigger id="health_status">
              <SelectValue placeholder="Select health status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Healthy">Healthy</SelectItem>
              <SelectItem value="Concerning">Concerning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrival_date">Arrival Date</Label>
          <Input
            id="arrival_date"
            name="arrival_date"
            type="date"
            value={formData.arrival_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diet_requirements">Diet Requirements</Label>
        <Textarea
          id="diet_requirements"
          name="diet_requirements"
          value={formData.diet_requirements}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Animal"}
        </Button>
      </div>
    </form>
  )
}

