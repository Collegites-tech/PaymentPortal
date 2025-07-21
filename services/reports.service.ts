import { DollarSign, CreditCard, Users, TrendingUp } from "lucide-react"

export class ReportsService {
  static async getReportsData(userRole: string, dateRange: string, reportType: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const baseMetrics = [
      {
        title: "Total Revenue",
        value: "$125,430.89",
        change: "+12.5% vs last period",
        trend: "up",
        icon: DollarSign,
      },
      {
        title: "Transactions",
        value: "3,247",
        change: "+8.2% vs last period",
        trend: "up",
        icon: CreditCard,
      },
      {
        title: "Active Customers",
        value: "1,856",
        change: "+15.3% vs last period",
        trend: "up",
        icon: Users,
      },
      {
        title: "Conversion Rate",
        value: "94.8%",
        change: "+2.1% vs last period",
        trend: "up",
        icon: TrendingUp,
      },
    ]

    const topPerformers = [
      { name: "Premium Subscription", type: "Product", value: "$45,230", growth: "+18%" },
      { name: "John Smith", type: "Customer", value: "$12,450", growth: "+25%" },
      { name: "E-commerce Store", type: "Channel", value: "$38,920", growth: "+12%" },
      { name: "Mobile App", type: "Platform", value: "$28,340", growth: "+8%" },
    ]

    // Filter metrics based on user role
    const metrics = this.filterMetricsForRole(baseMetrics, userRole)

    return {
      metrics,
      chartData: this.generateChartData(dateRange),
      topPerformers,
    }
  }

  static async exportReport(reportType: string, dateRange: string, format: string) {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, this would generate and download the report
    console.log(`Exporting ${reportType} report for ${dateRange} in ${format} format`)

    return {
      success: true,
      downloadUrl: `/reports/export/${reportType}_${dateRange}.${format}`,
    }
  }

  private static filterMetricsForRole(metrics: any[], role: string) {
    if (role === "VIEWER") {
      return metrics.filter((metric) => metric.title !== "Total Revenue")
    }
    return metrics
  }

  private static generateChartData(dateRange: string) {
    // Generate sample chart data based on date range
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365
    const data = []

    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 5000) + 1000,
        transactions: Math.floor(Math.random() * 100) + 20,
      })
    }

    return data
  }
}
