"use client"

import { useZooData } from "@/context/zoo-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"

export function ResourcesInventory() {
  const { resources } = useZooData()

  // Group resources by category
  const categories = ["Food", "Medical", "Equipment"]
  const resourcesByCategory = categories.map((category) => {
    const categoryResources = resources.filter((r) => r.category === category)
    const lowStockCount = categoryResources.filter((r) => r.status === "Low Stock").length
    const outOfStockCount = categoryResources.filter((r) => r.status === "Out of Stock").length

    return {
      name: category,
      total: categoryResources.length,
      available: categoryResources.filter((r) => r.status === "Available").length,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      resources: categoryResources,
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {resourcesByCategory.map((category, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>
                {category.available} of {category.total} items available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(category.available / category.total) * 100} className="h-2 mb-2" />
              <div className="flex gap-2 mt-4">
                {category.lowStock > 0 && (
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {category.lowStock} Low Stock
                  </Badge>
                )}
                {category.outOfStock > 0 && (
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {category.outOfStock} Out of Stock
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Low Stock Items</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources
            .filter((r) => r.status === "Low Stock")
            .map((resource, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{resource.name}</CardTitle>
                    <Badge className="bg-amber-500">Low Stock</Badge>
                  </div>
                  <CardDescription>{resource.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {resource.quantity} {resource.unit} remaining
                      </span>
                    </div>
                    <Badge variant="outline">Reorder</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

