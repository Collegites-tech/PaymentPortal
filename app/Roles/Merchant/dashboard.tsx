"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, BarChart, CreditCard, Settings, HelpCircle, FileText } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { merchantService } from "@/services/merchant.service"

export default function MerchantDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser || currentUser.role !== "MERCHANT") {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)
      const statsData = await merchantService.getStats()
      const requestData = await merchantService.getRequests()
      setStats(statsData)
      setRequests(requestData)
      setIsLoading(false)
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return <div className="text-white">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Merchant Dashboard</h1>
          <p className="text-slate-400 mt-2">Welcome, <span className="text-white font-semibold">{user?.name}</span></p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => router.push("/merchant/staff/create")}>
            <Users className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
          <Button onClick={() => router.push("/merchant/payments/create")} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-slate-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/invoices")}>
              <FileText className="h-4 w-4 mr-2 text-slate-400" /> View Invoices
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/analytics")}>
              <BarChart className="h-4 w-4 mr-2 text-slate-400" /> View Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/reports")}>
              <CreditCard className="h-4 w-4 mr-2 text-slate-400" /> Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/staff")}>
              <Users className="h-4 w-4 mr-2 text-slate-400" /> Manage Team
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/support")}>
              <HelpCircle className="h-4 w-4 mr-2 text-slate-400" /> Support
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/merchant/settings")}>
              <Settings className="h-4 w-4 mr-2 text-slate-400" /> Settings
            </Button>
          </CardContent>
        </Card>

        {/* Requests from Super Admin */}
        <Card className="bg-slate-900 border border-slate-700 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Requests to Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-slate-400 text-sm">No new requests</p>
            ) : (
              requests.map((req, i) => (
                <div key={i} className="flex justify-between items-center border border-slate-800 rounded-lg p-3">
                  <div className="text-white font-medium">{req.title}</div>
                  <Badge
                    className={
                      req.status === "approved"
                        ? "bg-green-600"
                        : req.status === "pending"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
