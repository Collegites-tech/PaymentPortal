"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, UserPlus, TrendingUp } from "lucide-react"
import { DashboardService } from "@/services/dashboard.service"
import { AuthService } from "@/services/auth.service"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || []
  const recentTransactions = dashboardData?.recentTransactions || []
  const quickActions = dashboardData?.quickActions || []

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Welcome back, <span className="text-white font-medium">{user?.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {user?.permissions?.includes("create_payments") && (
            <Button
              onClick={() => router.push("/dashboard/payments/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Payment
            </Button>
          )}
          {user?.role === "PARENT_ADMIN" && (
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/team")}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat: any, index: number) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200"
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
    </div>
  )
}
