"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Animal, Resource, Report } from "@/types/zoo-types"
import { generateMockData } from "@/lib/mock-data"

interface ZooDataContextType {
  animals: Animal[]
  resources: Resource[]
  reports: Report[]
  addAnimal: (animal: Animal) => void
  updateAnimal: (id: string, animal: Partial<Animal>) => void
  deleteAnimal: (id: string) => void
  addResource: (resource: Resource) => void
  updateResource: (id: string, resource: Partial<Resource>) => void
  deleteResource: (id: string) => void
  addReport: (report: Report) => void
  deleteReport: (id: string) => void
  getHealthStatusCounts: () => { healthy: number; concerning: number; critical: number }
  getAnimalPopulationTrend: () => any[]
  getResourceAvailabilityHistory: () => any[]
  getHealthDistribution: () => any[]
  getAnimalsBySpecies: () => any[]
}

const ZooDataContext = createContext<ZooDataContextType | undefined>(undefined)

export function ZooDataProvider({ children }: { children: React.ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Load mock data on mount
  useEffect(() => {
    if (!isDataLoaded) {
      const { animals, resources, reports } = generateMockData()
      setAnimals(animals)
      setResources(resources)
      setReports(reports)
      setIsDataLoaded(true)
    }
  }, [isDataLoaded])

  // In a real app, these functions would interact with a database
  const addAnimal = (animal: Animal) => {
    const newAnimal = {
      ...animal,
      id: animal.id || Math.random().toString(36).substring(2, 9),
      medical_history: animal.medical_history || [],
    }
    setAnimals((prev) => [...prev, newAnimal])
  }

  const updateAnimal = (id: string, animalUpdate: Partial<Animal>) => {
    setAnimals((prev) => prev.map((animal) => (animal.id === id ? { ...animal, ...animalUpdate } : animal)))
  }

  const deleteAnimal = (id: string) => {
    setAnimals((prev) => prev.filter((animal) => animal.id !== id))
  }

  const addResource = (resource: Resource) => {
    const newResource = {
      ...resource,
      id: resource.id || Math.random().toString(36).substring(2, 9),
    }
    setResources((prev) => [...prev, newResource])
  }

  const updateResource = (id: string, resourceUpdate: Partial<Resource>) => {
    setResources((prev) => prev.map((resource) => (resource.id === id ? { ...resource, ...resourceUpdate } : resource)))
  }

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((resource) => resource.id !== id))
  }

  const addReport = (report: Report) => {
    const newReport = {
      ...report,
      id: report.id || Math.random().toString(36).substring(2, 9),
    }
    setReports((prev) => [...prev, newReport])
  }

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id))
  }

  const getHealthStatusCounts = () => {
    return {
      healthy: animals.filter((a) => a.health_status === "Healthy").length,
      concerning: animals.filter((a) => a.health_status === "Concerning").length,
      critical: animals.filter((a) => a.health_status === "Critical").length,
    }
  }

  const getAnimalPopulationTrend = () => {
    // In a real app, this would fetch historical data from a database
    // For demo purposes, we'll generate more detailed mock data
    const today = new Date()
    const months = []

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })

      // Base values with some randomization
      const mammals = 30 + Math.floor(Math.random() * 10) + i
      const birds = 18 + Math.floor(Math.random() * 8) + i
      const reptiles = 12 + Math.floor(Math.random() * 6) + i

      months.push({
        date: monthName,
        mammals,
        birds,
        reptiles,
        total: mammals + birds + reptiles,
      })
    }

    return months
  }

  const getResourceAvailabilityHistory = () => {
    // In a real app, this would fetch historical data from a database
    // For demo purposes, we'll generate more detailed mock data
    const today = new Date()
    const months = []

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })

      // Base values with some randomization and a decreasing trend
      const food = Math.max(50, 85 - i * 5 - Math.floor(Math.random() * 10))
      const medical = Math.max(50, 90 - i * 5 - Math.floor(Math.random() * 10))
      const equipment = Math.max(50, 95 - i * 5 - Math.floor(Math.random() * 10))

      months.push({
        date: monthName,
        food,
        medical,
        equipment,
      })
    }

    return months
  }

  const getHealthDistribution = () => {
    const counts = getHealthStatusCounts()
    return [
      { name: "Healthy", value: counts.healthy },
      { name: "Concerning", value: counts.concerning },
      { name: "Critical", value: counts.critical },
    ]
  }

  const getAnimalsBySpecies = () => {
    // Count animals by species
    const speciesCounts: Record<string, number> = {}

    animals.forEach((animal) => {
      const species = animal.species
      speciesCounts[species] = (speciesCounts[species] || 0) + 1
    })

    // Convert to array format for charts
    return Object.entries(speciesCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  return (
    <ZooDataContext.Provider
      value={{
        animals,
        resources,
        reports,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        addResource,
        updateResource,
        deleteResource,
        addReport,
        deleteReport,
        getHealthStatusCounts,
        getAnimalPopulationTrend,
        getResourceAvailabilityHistory,
        getHealthDistribution,
        getAnimalsBySpecies,
      }}
    >
      {children}
    </ZooDataContext.Provider>
  )
}

export function useZooData() {
  const context = useContext(ZooDataContext)
  if (context === undefined) {
    throw new Error("useZooData must be used within a ZooDataProvider")
  }
  return context
}

