"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, CreditCard, TrendingUp, Package, Users, Settings } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { useRouter } from "next/navigation"

export default function MerchantDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlyRevenue: 0,
    activeProducts: 0,
    customers: 0
  })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser || currentUser.role !== 'MERCHANT') {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      // Load merchant-specific stats
    }
    loadData()
  }, [router])

  const merchantFeatures = [
    { title: "Product Management", icon: Package, description: "Manage your products and inventory", href: "/merchant/products" },
    { title: "Payment Processing", icon: CreditCard, description: "Handle payments and transactions", href: "/merchant/payments" },
    { title: "Sales Analytics", icon: TrendingUp, description: "View sales reports and analytics", href: "/merchant/analytics" },
    { title: "Customer Management", icon: Users, description: "Manage customer relationships", href: "/merchant/customers" },
    { title: "Store Settings", icon: Settings, description: "Configure your store settings", href: "/merchant/settings" },
    { title: "Storefront", icon: Store, description: "Manage your online storefront", href: "/merchant/storefront" }
  ]

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Merchant Dashboard</h1>
              <p className="text-slate-400">Welcome back, {user.name}</p>
            </div>
            <Badge className="bg-blue-600 text-white">
              <Store className="h-4 w-4 mr-1" />
              Merchant
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-white">${stats.totalSales.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Products</p>
                  <p className="text-2xl font-bold text-white">{stats.activeProducts}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-white">{stats.customers}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Merchant Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchantFeatures.map((feature, index) => (
            <Card key={index} className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <feature.icon className="h-5 w-5 mr-2 text-blue-500" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
                  onClick={() => router.push(feature.href)}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}