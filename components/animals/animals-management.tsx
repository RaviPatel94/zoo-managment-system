"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimalsTable } from "@/components/animals/animals-table"
import { AddAnimalForm } from "@/components/animals/add-animal-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AnimalsManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Animals</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Animal</DialogTitle>
              <DialogDescription>Enter the details of the new animal to add to the zoo.</DialogDescription>
            </DialogHeader>
            <AddAnimalForm onSuccess={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Animals</TabsTrigger>
          <TabsTrigger value="mammals">Mammals</TabsTrigger>
          <TabsTrigger value="birds">Birds</TabsTrigger>
          <TabsTrigger value="reptiles">Reptiles</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AnimalsTable />
        </TabsContent>
        <TabsContent value="mammals">
          <AnimalsTable speciesFilter="mammal" />
        </TabsContent>
        <TabsContent value="birds">
          <AnimalsTable speciesFilter="bird" />
        </TabsContent>
        <TabsContent value="reptiles">
          <AnimalsTable speciesFilter="reptile" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

