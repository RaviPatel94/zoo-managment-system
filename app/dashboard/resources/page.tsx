import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResourcesManagement } from "@/components/resources/resources-management"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Resources Management"
        description="Track and manage all resources including food, medical supplies, and equipment."
      />
      <ResourcesManagement />
    </div>
  )
}

