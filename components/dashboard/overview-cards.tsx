"use client"

import { useZooData } from "@/context/zoo-data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrintIcon as Paw, Package, Activity, AlertTriangle } from "lucide-react"

export function OverviewCards() {
  const { animals, resources, getHealthStatusCounts } = useZooData()

  const healthCounts = getHealthStatusCounts()

  const cards = [
    {
      title: "Total Animals",
      value: animals.length,
      description: "Animals in the zoo",
      icon: <Paw className="h-5 w-5 text-primary" />,
      change: "+2 this month",
    },
    {
      title: "Resource Status",
      value: `${resources.filter((r) => r.status === "Available").length}/${resources.length}`,
      description: "Available resources",
      icon: <Package className="h-5 w-5 text-indigo-500" />,
      change: "3 low stock items",
    },
    {
      title: "Health Status",
      value: `${healthCounts.healthy}/${animals.length}`,
      description: "Animals in good health",
      icon: <Activity className="h-5 w-5 text-green-500" />,
      change: `${healthCounts.concerning} need attention`,
    },
    {
      title: "Recent Incidents",
      value: "3",
      description: "In the last 7 days",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      change: "Down from 5 last week",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

