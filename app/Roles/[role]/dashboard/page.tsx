"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, UserPlus, TrendingUp, Sparkles, Users, Settings, CreditCard, LifeBuoy, BarChart3, UserCircle, Menu, LogOut, DollarSign, Shield, FileText, Bell, Activity, UserCheck, Wallet, RefreshCw, Eye, Code, HeadphonesIcon, Download, Filter, Calendar, Zap, Key, Webhook, Building, PieChart, AlertTriangle } from "lucide-react"
import { DashboardService } from "@/services/dashboard.service"
import { AuthService } from "@/services/auth.service"
import { useRouter } from "next/navigation"

const getSidebarLinks = (role: string) => {
  switch (role?.toUpperCase()) {
    case "MERCHANT":
      return [
        { name: "Dashboard", href: `/Roles/${role}/dashboard`, icon: BarChart3 },
        { name: "Payment Management", href: `/Roles/${role}/payments`, icon: CreditCard },
        { name: "Staff Management", href: `/Roles/${role}/staff`, icon: Users },
        { name: "Transactions & Reports", href: `/Roles/${role}/transactions`, icon: FileText },
        { name: "Insights & Analytics", href: `/Roles/${role}/analytics`, icon: PieChart },
        { name: "Payouts & Settlements", href: `/Roles/${role}/payouts`, icon: Wallet },
        { name: "Business Settings", href: `/Roles/${role}/settings`, icon: Settings },
        { name: "Support Center", href: `/Roles/${role}/support`, icon: HeadphonesIcon },
        { name: "API & Webhooks", href: `/Roles/${role}/api`, icon: Webhook },
      ]
    case "STAFF":
      return [
        { name: "Daily Tasks", href: `/Roles/${role}/tasks`, icon: Activity },
        { name: "View Transactions", href: `/Roles/${role}/transactions`, icon: Eye },
        { name: "Create Payments", href: `/Roles/${role}/payments/create`, icon: Plus },
        { name: "Customer Support", href: `/Roles/${role}/support`, icon: HeadphonesIcon },
        { name: "Quick Reports", href: `/Roles/${role}/reports`, icon: FileText },
        { name: "Help Center", href: `/Roles/${role}/help`, icon: LifeBuoy },
      ]
    case "DEVELOPER":
      return [
        { name: "API Management", href: `/Roles/${role}/api`, icon: Code },
        { name: "System Monitoring", href: `/Roles/${role}/monitoring`, icon: Activity },
        { name: "Error Tracking", href: `/Roles/${role}/errors`, icon: Shield },
        { name: "Database", href: `/Roles/${role}/database`, icon: Settings },
        { name: "Integration Testing", href: `/Roles/${role}/testing`, icon: FileText },
        { name: "Documentation", href: `/Roles/${role}/docs`, icon: FileText },
      ]
    default:
      return [
        { name: "Dashboard", href: `/Roles/${role}/dashboard`, icon: BarChart3 },
        { name: "Settings", href: `/Roles/${role}/settings`, icon: Settings },
        { name: "Support", href: `/Roles/${role}/support`, icon: HeadphonesIcon },
      ]
  }
}

export default function RoleDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const role = params.role as string

  const getRoleConfig = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return {
          title: "Admin Dashboard",
          description: "Complete system administration and oversight",
          color: "from-red-600 to-red-700",
          icon: Shield,
          features: [
            { name: "User Management", icon: Users, description: "Manage all system users" },
            { name: "System Settings", icon: Settings, description: "Configure system parameters" },
            { name: "Security Monitoring", icon: Shield, description: "Monitor security events" },
            { name: "Reports & Analytics", icon: BarChart3, description: "View comprehensive reports" },
            { name: "Audit Logs", icon: FileText, description: "Review system audit trails" },
            { name: "Notifications", icon: Bell, description: "Manage system notifications" }
          ],
          stats: [
            { title: "Total Users", value: "1,234", icon: Users, change: "+12%" },
            { title: "System Health", value: "99.9%", icon: Activity, change: "+0.1%" },
            { title: "Active Sessions", value: "89", icon: UserCheck, change: "+5%" },
            { title: "Security Alerts", value: "3", icon: Shield, change: "-2%" }
          ]
        }

      case "SUB_ADMIN":
        return {
          title: "Sub Admin Dashboard",
          description: "Departmental administration and user management",
          color: "from-orange-600 to-orange-700",
          icon: UserCheck,
          features: [
            { name: "Department Users", icon: Users, description: "Manage department users" },
            { name: "Role Assignment", icon: UserCheck, description: "Assign and modify roles" },
            { name: "Department Reports", icon: BarChart3, description: "View department analytics" },
            { name: "User Permissions", icon: Shield, description: "Manage user permissions" },
            { name: "Activity Monitoring", icon: Activity, description: "Monitor user activities" },
            { name: "Support Tickets", icon: HeadphonesIcon, description: "Handle support requests" }
          ],
          stats: [
            { title: "Department Users", value: "156", icon: Users, change: "+8%" },
            { title: "Active Roles", value: "12", icon: UserCheck, change: "+2%" },
            { title: "Pending Approvals", value: "7", icon: FileText, change: "+3%" },
            { title: "Support Tickets", value: "23", icon: HeadphonesIcon, change: "-5%" }
          ]
        }

      case "MERCHANT":
        return {
          title: "Merchant Dashboard",
          description: "Business operations and payment management",
          color: "from-emerald-600 to-emerald-700",
          icon: Building,
          features: [
            { name: "Payment Management", icon: CreditCard, description: "Create, track, and refund payments" },
            { name: "Staff Management", icon: Users, description: "Invite and manage staff members" },
            { name: "Transactions & Reports", icon: FileText, description: "Download CSV/PDF reports" },
            { name: "Insights & Analytics", icon: PieChart, description: "Volume, success rate, chargeback ratio" },
            { name: "Payouts & Settlements", icon: Wallet, description: "Request payouts and view history" },
            { name: "Business Settings", icon: Settings, description: "Profile, KYC, settlement account" },
            { name: "Support Center", icon: HeadphonesIcon, description: "Raise tickets to PSP support" },
            { name: "API & Webhooks", icon: Webhook, description: "Manage API keys and integrations" }
          ],
          stats: [
            { title: "Today's Revenue", value: "$12,450", icon: DollarSign, change: "+15%" },
            { title: "Total Transactions", value: "234", icon: CreditCard, change: "+8%" },
            { title: "Active Staff", value: "12", icon: Users, change: "+2%" },
            { title: "Pending Payouts", value: "$3,200", icon: Wallet, change: "+5%" }
          ]
        }

      case "STAFF":
        return {
          title: "Staff Dashboard",
          description: "Daily operations and customer service",
          color: "from-green-600 to-green-700",
          icon: Users,
          features: [
            { name: "Customer Support", icon: HeadphonesIcon, description: "Handle customer inquiries" },
            { name: "Transaction Support", icon: CreditCard, description: "Assist with transactions" },
            { name: "Daily Reports", icon: FileText, description: "Generate daily reports" },
            { name: "Task Management", icon: Activity, description: "Manage assigned tasks" },
            { name: "Knowledge Base", icon: FileText, description: "Access help resources" },
            { name: "Team Communication", icon: Bell, description: "Team messaging" }
          ],
          stats: [
            { title: "Tickets Handled", value: "45", icon: HeadphonesIcon, change: "+10%" },
            { title: "Customer Satisfaction", value: "4.8/5", icon: Users, change: "+0.2%" },
            { title: "Tasks Completed", value: "28", icon: Activity, change: "+15%" },
            { title: "Response Time", value: "2.3min", icon: RefreshCw, change: "-8%" }
          ]
        }

      case "REFUND_MANAGER":
        return {
          title: "Refund Manager Dashboard",
          description: "Refund processing and dispute management",
          color: "from-yellow-600 to-yellow-700",
          icon: RefreshCw,
          features: [
            { name: "Refund Processing", icon: RefreshCw, description: "Process refund requests" },
            { name: "Dispute Management", icon: Shield, description: "Handle payment disputes" },
            { name: "Refund Analytics", icon: BarChart3, description: "Track refund metrics" },
            { name: "Customer Communication", icon: Bell, description: "Communicate with customers" },
            { name: "Fraud Detection", icon: Eye, description: "Monitor suspicious activities" },
            { name: "Compliance Reports", icon: FileText, description: "Generate compliance reports" }
          ],
          stats: [
            { title: "Pending Refunds", value: "23", icon: RefreshCw, change: "+5%" },
            { title: "Processed Today", value: "67", icon: DollarSign, change: "+12%" },
            { title: "Dispute Cases", value: "8", icon: Shield, change: "-3%" },
            { title: "Fraud Alerts", value: "2", icon: Eye, change: "-1%" }
          ]
        }

      case "DEVELOPER":
        return {
          title: "Developer Dashboard",
          description: "API management and technical operations",
          color: "from-purple-600 to-purple-700",
          icon: Code,
          features: [
            { name: "API Management", icon: Code, description: "Manage API endpoints" },
            { name: "System Monitoring", icon: Activity, description: "Monitor system performance" },
            { name: "Error Tracking", icon: Shield, description: "Track and resolve errors" },
            { name: "Database Management", icon: Settings, description: "Manage database operations" },
            { name: "Integration Testing", icon: FileText, description: "Test system integrations" },
            { name: "Documentation", icon: FileText, description: "Access developer documentation" }
          ],
          stats: [
            { title: "API Calls", value: "45.2K", icon: Code, change: "+18%" },
            { title: "System Uptime", value: "99.95%", icon: Activity, change: "+0.05%" },
            { title: "Error Rate", value: "0.02%", icon: Shield, change: "-0.01%" },
            { title: "Response Time", value: "120ms", icon: TrendingUp, change: "-5ms" }
          ]
        }

      default:
        return {
          title: "Default Dashboard",
          description: "General overview",
          color: "from-gray-600 to-gray-700",
          icon: Eye,
          features: [],
          stats: []
        }
    }
  }

  useEffect(() => {
    const loadDashboard = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      const data = await DashboardService.getDashboardData(currentUser.role)
      setDashboardData(data)
      setIsLoading(false)
    }

    loadDashboard()
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileOpen])

  const handleRequestFeature = async () => {
    setRequesting(true)
    await DashboardService.requestFeatureEnhancement(user?.role)
    setRequesting(false)
    alert("Your feature request has been sent to the Super Admin!")
  }

  const handleLogout = async () => {
    await AuthService.logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        {/* Sidebar skeleton */}
        {sidebarOpen && (
          <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
            <div className="h-8 bg-slate-800 rounded mb-6 animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-800 rounded mb-4 animate-pulse"></div>
            ))}
          </div>
        )}
        {/* Main skeleton */}
        <div className="flex-1 p-8">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || []
  const recentTransactions = dashboardData?.recentTransactions || []
  const quickActions = dashboardData?.quickActions || []
  const roleConfig = getRoleConfig(role)
  const sidebarLinks = getSidebarLinks(role)

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col transition-all duration-300">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Features</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400"
              onClick={() => setSidebarOpen(false)}
              aria-label="Hide sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarLinks.map(link => (
                <li key={link.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-200 hover:bg-slate-800"
                    onClick={() => router.push(link.href)}
                  >
                    <link.icon className="h-5 w-5 mr-3 text-slate-400" />
                    {link.name}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400"
                onClick={() => setSidebarOpen(true)}
                aria-label="Show sidebar"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">{roleConfig.title}</h1>
              <p className="text-slate-400 mt-2">
                {roleConfig.description}, <span className="text-white font-medium">{user?.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRequestFeature}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
              disabled={requesting}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {requesting ? "Requesting..." : "Request Feature Enhancement"}
            </Button>
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Profile"
              >
                <UserCircle className="h-8 w-8 text-slate-400" />
                <span className="text-white font-medium">{user?.name}</span>
              </Button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-10">
                  <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-10 w-10 text-slate-400" />
                      <div>
                        <div className="text-white font-semibold">{user?.name}</div>
                        <div className="text-slate-400 text-sm">{user?.email}</div>
                        <div className="text-slate-400 text-xs mt-1">Role: {user?.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start text-red-400 hover:bg-slate-800"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat: any, index: number) => (
              <Card
                key={index}
                className={`bg-gradient-to-br ${roleConfig.color} border-slate-700 hover:border-slate-600 transition-all duration-200`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">{stat.title}</CardTitle>
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <stat.icon className="h-4 w-4 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                    <span className="text-green-400">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Transactions */}
            <Card className="xl:col-span-2 bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Recent Transactions</CardTitle>
                    <p className="text-slate-400 text-sm mt-1">Latest payment activities</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/transactions")}
                    className="text-slate-400 hover:text-white"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{transaction.customer.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{transaction.customer}</p>
                          <p className="text-slate-400 text-sm">
                            {transaction.id} • {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-white font-semibold">{transaction.amount}</span>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            transaction.status === "completed"
                              ? "bg-green-600 hover:bg-green-700"
                              : transaction.status === "pending"
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : ""
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
                <p className="text-slate-400 text-sm">Common tasks and shortcuts</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action: any, index: number) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => router.push(action.href)}
                      className="w-full justify-start h-auto p-4 text-left hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700"
                    >
                      <div className="p-2 bg-slate-800 rounded-lg mr-3 flex-shrink-0">
                        <action.icon className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium">{action.title}</p>
                        <p className="text-slate-400 text-sm truncate">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}