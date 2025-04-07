"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LayoutDashboard, PawPrintIcon as Paw, Package, FileText, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40 py-4">
        <div className="flex items-center px-4">
          <Paw className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">Zoo Manager</h1>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
              <button onClick={() => router.push("/dashboard")}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/animals")} tooltip="Animals Management">
              <button onClick={() => router.push("/dashboard/animals")}>
                <Paw />
                <span>Animals</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/resources")} tooltip="Resources Management">
              <button onClick={() => router.push("/dashboard/resources")}>
                <Package />
                <span>Resources</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/reports")} tooltip="Reports">
              <button onClick={() => router.push("/dashboard/reports")}>
                <FileText />
                <span>Reports</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{user?.email || "User"}</span>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

