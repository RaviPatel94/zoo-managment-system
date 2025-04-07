"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsTable } from "@/components/reports/reports-table"
import { ReportsUpload } from "@/components/reports/reports-upload"
import { Button } from "@/components/ui/button"
import { FileUp, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddReportForm } from "@/components/reports/add-report-form"

export function ReportsManagement() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <div className="flex gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Report</DialogTitle>
                <DialogDescription>Upload a report file to the system.</DialogDescription>
              </DialogHeader>
              <ReportsUpload onSuccess={() => setUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>Create a new report in the system.</DialogDescription>
              </DialogHeader>
              <AddReportForm onSuccess={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="incident">Incident</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ReportsTable />
        </TabsContent>
        <TabsContent value="health">
          <ReportsTable category="Health" />
        </TabsContent>
        <TabsContent value="inventory">
          <ReportsTable category="Inventory" />
        </TabsContent>
        <TabsContent value="financial">
          <ReportsTable category="Financial" />
        </TabsContent>
        <TabsContent value="incident">
          <ReportsTable category="Incident" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

