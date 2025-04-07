"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourcesTable } from "@/components/resources/resources-table"
import { ResourcesInventory } from "@/components/resources/resources-inventory"
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
import { AddResourceForm } from "@/components/resources/add-resource-form"

export function ResourcesManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>Enter the details of the new resource to add to inventory.</DialogDescription>
            </DialogHeader>
            <AddResourceForm onSuccess={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <ResourcesInventory />
        </TabsContent>
        <TabsContent value="all">
          <ResourcesTable />
        </TabsContent>
        <TabsContent value="food">
          <ResourcesTable category="Food" />
        </TabsContent>
        <TabsContent value="medical">
          <ResourcesTable category="Medical" />
        </TabsContent>
        <TabsContent value="equipment">
          <ResourcesTable category="Equipment" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

