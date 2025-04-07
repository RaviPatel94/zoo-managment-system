import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReportsManagement } from "@/components/reports/reports-management"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Reports" description="Generate, view, and manage reports for all zoo operations." />
      <ReportsManagement />
    </div>
  )
}

