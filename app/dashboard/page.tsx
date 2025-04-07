import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { AnimalsTable } from "@/components/animals/animals-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" description="Overview of your zoo's key metrics and recent activities." />
      <OverviewCards />
      <AnalyticsCharts />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Animals Overview</h2>
        <AnimalsTable />
      </div>
    </div>
  )
}

