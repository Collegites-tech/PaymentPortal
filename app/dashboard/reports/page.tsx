"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { ReportsService } from "@/services/reports.service"
import { AuthService } from "@/services/auth.service"
import { Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, ComposedChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [reportsData, setReportsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  useEffect(() => {
    const loadReports = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      const data = await ReportsService.getReportsData(currentUser.role, dateRange, reportType)
      setReportsData(data)
      setIsLoading(false)
    }

    loadReports()
  }, [dateRange, reportType])

  const handleExport = async (format: string) => {
    await ReportsService.exportReport(reportType, dateRange, format)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const metrics = reportsData?.metrics || []
  const chartData = reportsData?.chartData || []
  const topPerformers = reportsData?.topPerformers || []

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-400 mt-2">Comprehensive insights into your payment operations</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric: any, index: number) => (
          <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{metric.title}</CardTitle>
              <div className="p-2 bg-slate-800 rounded-lg">
                <metric.icon className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="flex items-center text-sm">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-400" : "text-red-400"}>{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-slate-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-slate-700">
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-slate-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart */}
            <Card className="xl:col-span-2 bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
                <p className="text-slate-400 text-sm">Daily revenue over the selected period</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                    transactions: {
                      label: "Transactions",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
                        className="text-xs text-slate-400"
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="hsl(var(--chart-1))"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                        className="text-xs text-slate-400"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--chart-2))"
                        tickLine={false}
                        axisLine={false}
                        className="text-xs text-slate-400"
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="transactions"
                        stroke="var(--color-transactions)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Top Performers</CardTitle>
                <p className="text-slate-400 text-sm">Highest revenue generators</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{performer.name}</p>
                          <p className="text-slate-400 text-xs">{performer.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm">{performer.value}</p>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {performer.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Transaction Analytics</CardTitle>
              <p className="text-slate-400 text-sm">Detailed transaction performance metrics</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">2,847</div>
                  <div className="text-slate-400 text-sm">Total Transactions</div>
                  <div className="text-green-400 text-xs mt-1">+12.5% vs last period</div>
                </div>
                <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">98.2%</div>
                  <div className="text-slate-400 text-sm">Success Rate</div>
                  <div className="text-green-400 text-xs mt-1">+0.8% vs last period</div>
                </div>
                <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">$156</div>
                  <div className="text-slate-400 text-sm">Avg. Transaction</div>
                  <div className="text-red-400 text-xs mt-1">-2.1% vs last period</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Customer Insights</CardTitle>
              <p className="text-slate-400 text-sm">Customer behavior and demographics</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Customer Segments</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">New Customers</span>
                      <Badge className="bg-blue-600">342</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Returning Customers</span>
                      <Badge className="bg-green-600">1,205</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">VIP Customers</span>
                      <Badge className="bg-purple-600">89</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Geographic Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">North America</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Europe</span>
                      <span className="text-white">32%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Asia Pacific</span>
                      <span className="text-white">23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Revenue Analysis</CardTitle>
              <p className="text-slate-400 text-sm">Comprehensive revenue breakdown and forecasting</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Revenue by Source</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Direct Payments</span>
                      <span className="text-white font-semibold">$45,231</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Subscription</span>
                      <span className="text-white font-semibold">$23,456</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Marketplace</span>
                      <span className="text-white font-semibold">$12,789</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Monthly Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Current Month</span>
                      <span className="text-white font-semibold">$81,476</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Projected Next</span>
                      <span className="text-green-400 font-semibold">$89,234</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300">Growth Rate</span>
                      <Badge className="bg-green-600">+9.5%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
