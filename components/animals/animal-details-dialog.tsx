"use client"

import type { Animal } from "@/types/zoo-types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Utensils } from "lucide-react"

interface AnimalDetailsDialogProps {
  animal: Animal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnimalDetailsDialog({ animal, open, onOpenChange }: AnimalDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{animal.name}</DialogTitle>
          <DialogDescription>
            {animal.species} • ID: {animal.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="diet">Diet & Care</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      animal.health_status === "Healthy"
                        ? "bg-green-500"
                        : animal.health_status === "Concerning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {animal.health_status}
                  </Badge>
                  <Badge variant="outline">{animal.gender}</Badge>
                  <Badge variant="outline">{animal.age} years old</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{animal.location}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Arrival Date
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{formatDate(animal.arrival_date)}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                  {animal.image_url ? (
                    <img
                      src={animal.image_url || "/placeholder.svg"}
                      alt={animal.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={`/placeholder.svg?height=192&width=300&text=${animal.species}`}
                      alt={animal.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {animal.description ||
                    `${animal.name} is a ${animal.age}-year-old ${animal.species.toLowerCase()} currently located in ${animal.location}.`}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Recent medical records and health events</CardDescription>
              </CardHeader>
              <CardContent>
                {animal.medical_history && animal.medical_history.length > 0 ? (
                  <div className="space-y-4">
                    {animal.medical_history.map((record, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{record.type}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(record.date)}
                          </div>
                        </div>
                        <p className="text-sm">{record.notes}</p>
                        {record.treatment && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">Treatment: </span>
                            <span className="text-xs">{record.treatment}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medical records available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="h-4 w-4 mr-2" /> Diet Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{animal.diet_requirements}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Feeding Schedule</h4>
                    <ul className="text-sm space-y-1">
                      <li>Morning: 8:00 AM</li>
                      <li>Afternoon: 2:00 PM</li>
                      {animal.species === "Lion" || animal.species === "Tiger" ? <li>Evening: 6:00 PM</li> : null}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Special Instructions</h4>
                    <p className="text-sm text-muted-foreground">
                      {animal.special_care_instructions || "No special instructions."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

