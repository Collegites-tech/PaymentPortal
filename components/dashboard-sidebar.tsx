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
} from "lucide-react"

interface DashboardSidebarProps {
  user: any
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [paymentOpsOpen, setPaymentOpsOpen] = useState(false)

  const hasPermission = (permission: string) => {
    const permissions = {
      PARENT_ADMIN: ["all"],
      SUB_ADMIN: [
        "view_reports",
        "process_refunds",
        "view_transactions",
        "create_payments",
        "manage_customers",
        "view_payouts",
      ],
      REFUND_MANAGER: ["process_refunds", "view_transactions"],
      VIEWER: ["view_reports", "view_transactions"],
      STAFF: ["view_transactions"],
      DEVELOPER: ["view_reports", "view_transactions", "create_payments", "manage_customers"],
      SUPPORT: ["view_transactions", "manage_customers"],
    }

    const userPermissions = permissions[user?.role as keyof typeof permissions] || []
    return userPermissions.includes("all") || userPermissions.includes(permission)
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
      permission: "create_payments",
    },
    {
      title: "Webhooks",
      icon: Webhook,
      href: "/dashboard/payments/webhooks",
      permission: "create_payments",
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
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      permission: "manage_settings",
    },
  ]

  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">PayFlow</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hasPermission("create_payments") && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <Collapsible open={paymentOpsOpen} onOpenChange={setPaymentOpsOpen}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    Payment Operations
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
                                <Link href={item.href}>
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.title}</span>
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

        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(
                (item) =>
                  hasPermission(item.permission) && (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map(
                    (item) =>
                      hasPermission(item.permission) && (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={pathname === item.href}>
                            <Link href={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
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
