"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Settings,
  Plus,
  LinkIcon,
  QrCode,
  Key,
  Webhook,
  ChevronDown,
  UserPlus,
  Shield,
} from "lucide-react"
import { AuthService } from "@/services/auth.service"

interface DashboardSidebarProps {
  user: any
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [paymentOpsOpen, setPaymentOpsOpen] = useState(true)

  const hasPermission = (permission: string) => {
    return AuthService.hasPermission(user?.role, permission)
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      permission: "view_dashboard",
    },
  ]

  const paymentOperations = [
    {
      title: "Create Payment",
      icon: Plus,
      href: "/dashboard/payments/create",
      permission: "create_payments",
    },
    {
      title: "Payment Links",
      icon: LinkIcon,
      href: "/dashboard/payments/links",
      permission: "create_payments",
    },
    {
      title: "QR Codes",
      icon: QrCode,
      href: "/dashboard/payments/qr",
      permission: "create_payments",
    },
    {
      title: "API Keys",
      icon: Key,
      href: "/dashboard/payments/api",
      permission: "api_access",
    },
    {
      title: "Webhooks",
      icon: Webhook,
      href: "/dashboard/payments/webhooks",
      permission: "api_access",
    },
  ]

  const mainMenuItems = [
    {
      title: "Transactions",
      icon: FileText,
      href: "/dashboard/transactions",
      permission: "view_transactions",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/dashboard/customers",
      permission: "manage_customers",
    },
    {
      title: "Payouts",
      icon: DollarSign,
      href: "/dashboard/payouts",
      permission: "view_payouts",
    },
    {
      title: "Disputes",
      icon: AlertTriangle,
      href: "/dashboard/disputes",
      permission: "view_disputes",
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/dashboard/reports",
      permission: "view_reports",
    },
  ]

  const adminMenuItems = [
    {
      title: "Team Management",
      icon: UserPlus,
      href: "/dashboard/team",
      permission: "manage_team",
    },
    {
      title: "Role Management",
      icon: Shield,
      href: "/dashboard/roles",
      permission: "manage_team",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      permission: "manage_settings",
    },
  ]

  return (
    <Sidebar className="group border-r border-slate-800 bg-slate-900" collapsible="offcanvas">
      <SidebarHeader className="p-4 lg:p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-xl font-bold text-white">PayFlow</span>
            <p className="text-xs text-slate-400 truncate">Payment Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 lg:px-4 py-4 lg:py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(hasPermission("create_payments") || hasPermission("api_access")) && (
          <>
            <SidebarSeparator className="my-4 bg-slate-800" />
            <SidebarGroup>
              <Collapsible open={paymentOpsOpen} onOpenChange={setPaymentOpsOpen}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-slate-400 hover:text-white">
                    <span className="font-medium text-sm">Payment Operations</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {paymentOperations.map(
                        (item) =>
                          hasPermission(item.permission) && (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link
                                  href={item.href}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-lg ml-4"
                                >
                                  <item.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ),
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator className="my-4 bg-slate-800" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(
                (item) =>
                  hasPermission(item.permission) && (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(hasPermission("manage_team") || hasPermission("manage_settings")) && (
          <>
            <SidebarSeparator className="my-4 bg-slate-800" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-2 text-slate-400 font-medium text-sm">
                Administration
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map(
                    (item) =>
                      hasPermission(item.permission) && (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={pathname === item.href}>
                            <Link href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                              <span className="font-medium truncate">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ),
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
