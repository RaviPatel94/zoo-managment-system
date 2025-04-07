"use client"

import { useState, useEffect } from "react"
import { useZooData } from "@/context/zoo-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

export function AnalyticsCharts() {
  const { animals, getAnimalPopulationTrend, getResourceAvailabilityHistory, getHealthDistribution } = useZooData()
  const [isLoading, setIsLoading] = useState(true)
  const [populationData, setPopulationData] = useState<any[]>([])
  const [resourceData, setResourceData] = useState<any[]>([])
  const [healthData, setHealthData] = useState<any[]>([])

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch data from an API
        const popData = getAnimalPopulationTrend()
        const resData = getResourceAvailabilityHistory()
        const healthData = getHealthDistribution()

        setPopulationData(popData)
        setResourceData(resData)
        setHealthData(healthData)
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [getAnimalPopulationTrend, getResourceAvailabilityHistory, getHealthDistribution])

  // Prepare chart data
  const populationChartData = {
    labels: populationData.map((item) => item.date),
    datasets: [
      {
        label: "Mammals",
        data: populationData.map((item) => item.mammals),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Birds",
        data: populationData.map((item) => item.birds),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Reptiles",
        data: populationData.map((item) => item.reptiles),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Total",
        data: populationData.map((item) => item.mammals + item.birds + item.reptiles),
        borderColor: "rgb(75, 85, 99)",
        backgroundColor: "rgba(75, 85, 99, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
      },
    ],
  }

  const resourceChartData = {
    labels: resourceData.map((item) => item.date),
    datasets: [
      {
        label: "Food",
        data: resourceData.map((item) => item.food),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
      {
        label: "Medical",
        data: resourceData.map((item) => item.medical),
        backgroundColor: "rgba(245, 158, 11, 0.7)",
      },
      {
        label: "Equipment",
        data: resourceData.map((item) => item.equipment),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  }

  const healthChartData = {
    labels: healthData.map((item) => item.name),
    datasets: [
      {
        data: healthData.map((item) => item.value),
        backgroundColor: ["rgba(16, 185, 129, 0.7)", "rgba(245, 158, 11, 0.7)", "rgba(239, 68, 68, 0.7)"],
        borderColor: ["rgb(16, 185, 129)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  // Species distribution data
  const speciesData = {
    labels: ["Lions", "Tigers", "Bears", "Elephants", "Giraffes", "Monkeys", "Zebras", "Penguins"],
    datasets: [
      {
        label: "Number of Animals",
        data: [8, 6, 4, 5, 7, 12, 9, 15],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 mb-2" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="animals">Animals</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Animal Population Trends</CardTitle>
              <CardDescription>Total animal count over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Line data={populationChartData} options={chartOptions} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Health Distribution</CardTitle>
              <CardDescription>Current health status of all animals</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Pie data={healthChartData} options={pieChartOptions} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="animals" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Animal Population by Species</CardTitle>
            <CardDescription>Distribution of animals across different species</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Bar data={speciesData} options={chartOptions} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="resources" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resource Availability History</CardTitle>
            <CardDescription>Percentage of resources available over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Bar data={resourceChartData} options={chartOptions} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

