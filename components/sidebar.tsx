"use client"

import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  CreditCard,
  BarChart3,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "New Application",
    url: "/scoring",
    icon: CreditCard,
  },
  {
    title: "Borrowers",
    url: "/borrowers",
    icon: Users,
  },
  {
    title: "AI Insights",
    url: "/insights",
    icon: BarChart3,
  },
  {
    title: "Field Agent",
    url: "/field-agent",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="p-[9.5px]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">AI-MitraScore</span>
              <span className="text-xs text-muted-foreground">Credit Assessment</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-accent" : ""}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel>Amara AI Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Borrowers</span>
                <span className="text-sm font-semibold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">AI Processed</span>
                <span className="text-sm font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Avg AI Score</span>
                <span className="text-sm font-semibold">624</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Status</span>
            <span className="text-green-600 text-xs font-medium">Online</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto bg-muted/10">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}