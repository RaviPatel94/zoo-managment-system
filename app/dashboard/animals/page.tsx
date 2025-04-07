import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnimalsManagement } from "@/components/animals/animals-management"

export default function AnimalsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Animals Management"
        description="Manage all animals in your zoo, track their health, and update their information."
      />
      <AnimalsManagement />
    </div>
  )
}

