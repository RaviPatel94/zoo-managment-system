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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MoreHorizontal, Search } from "lucide-react"
import { AnimalDetailsDialog } from "@/components/animals/animal-details-dialog"
import { EditAnimalForm } from "@/components/animals/edit-animal-form"
import type { Animal } from "@/types/zoo-types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

interface AnimalsTableProps {
  speciesFilter?: string
}

export function AnimalsTable({ speciesFilter }: AnimalsTableProps) {
  const { animals, deleteAnimal } = useZooData()
  const [searchTerm, setSearchTerm] = useState("")
  const [healthFilter, setHealthFilter] = useState("all")
  const [sortBy, setSortBy] = useState<keyof Animal>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [deletingAnimal, setDeletingAnimal] = useState<Animal | null>(null)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Filter animals based on search term, health filter, and species filter
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.species.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesHealth = healthFilter === "all" || animal.health_status.toLowerCase() === healthFilter.toLowerCase()

    const matchesSpecies = !speciesFilter || animal.species.toLowerCase().includes(speciesFilter.toLowerCase())

    return matchesSearch && matchesHealth && matchesSpecies
  })

  // Sort animals
  const sortedAnimals = [...filteredAnimals].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  // Paginate animals
  const paginatedAnimals = sortedAnimals.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const totalPages = Math.ceil(filteredAnimals.length / rowsPerPage)

  const handleSort = (column: keyof Animal) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleDeleteAnimal = () => {
    if (deletingAnimal) {
      deleteAnimal(deletingAnimal.id)
      setDeletingAnimal(null)
    }
  }

  const getHealthStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "concerning":
        return <Badge className="bg-amber-500">Concerning</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search animals..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Health Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="concerning">Concerning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number.parseInt(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAnimals.length === 0 && (
        <div className="flex items-center p-4 mb-4 text-amber-800 border border-amber-300 rounded-lg bg-amber-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>No animals found matching the current filters.</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("species")}>
                Species {sortBy === "species" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("age")}>
                Age {sortBy === "age" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("health_status")}>
                Health Status {sortBy === "health_status" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("location")}>
                Location {sortBy === "location" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnimals.length > 0 ? (
              paginatedAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.age} years</TableCell>
                  <TableCell>{getHealthStatusBadge(animal.health_status)}</TableCell>
                  <TableCell>{animal.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedAnimal(animal)}>View details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingAnimal(animal)}>Edit animal</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeletingAnimal(animal)}>
                          Delete animal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No animals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {selectedAnimal && (
        <AnimalDetailsDialog
          animal={selectedAnimal}
          open={!!selectedAnimal}
          onOpenChange={() => setSelectedAnimal(null)}
        />
      )}

      {editingAnimal && (
        <Dialog open={!!editingAnimal} onOpenChange={(open) => !open && setEditingAnimal(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Animal</DialogTitle>
              <DialogDescription>Update the details for {editingAnimal.name}.</DialogDescription>
            </DialogHeader>
            <EditAnimalForm animal={editingAnimal} onSuccess={() => setEditingAnimal(null)} />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deletingAnimal} onOpenChange={(open) => !open && setDeletingAnimal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {deletingAnimal?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnimal} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

