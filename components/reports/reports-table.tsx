"use client"

import { useState } from "react"
import { useZooData } from "@/context/zoo-data-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, Eye, FileText, MoreHorizontal, Search } from "lucide-react"
import type { Report } from "@/types/zoo-types"
import { ReportViewer } from "@/components/reports/report-viewer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ReportsTableProps {
  category?: string
}

export function ReportsTable({ category }: ReportsTableProps) {
  const { reports, deleteReport } = useZooData()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof Report>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewingReport, setViewingReport] = useState<Report | null>(null)
  const [deletingReport, setDeletingReport] = useState<Report | null>(null)

  // Filter reports based on search term and category
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !category || report.category.toLowerCase() === category.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (column: keyof Report) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleDeleteReport = () => {
    if (deletingReport) {
      deleteReport(deletingReport.id)
      setDeletingReport(null)
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "health":
        return <Badge className="bg-green-500">Health</Badge>
      case "inventory":
        return <Badge className="bg-blue-500">Inventory</Badge>
      case "financial":
        return <Badge className="bg-purple-500">Financial</Badge>
      case "incident":
        return <Badge className="bg-red-500">Incident</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  if (viewingReport) {
    return <ReportViewer report={viewingReport} onBack={() => setViewingReport(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="flex items-center p-4 mb-4 text-amber-800 border border-amber-300 rounded-lg bg-amber-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>No reports found matching the current filters.</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                Category {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("author")}>
                Author {sortBy === "author" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.length > 0 ? (
              sortedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {report.title}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(report.category)}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.author}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="ghost" size="icon" title="View Report" onClick={() => setViewingReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setViewingReport(report)}>View report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Share report</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeletingReport(report)}>
                            Delete report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingReport} onOpenChange={(open) => !open && setDeletingReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the report "{deletingReport?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

