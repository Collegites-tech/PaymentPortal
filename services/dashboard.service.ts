import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Activity,
  UserCheck,
  Wallet,
  RefreshCw,
  Eye,
  Code,
  HeadphonesIcon,
  FileText,
  Bell,
  BarChart3
} from "lucide-react"

export class DashboardService {
  static async getStats() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      totalRevenue: 125000,
      totalTransactions: 1250,
      activeUsers: 89,
      pendingPayouts: 15,
      recentTransactions: [
        { id: 1, amount: 250, customer: "John Doe", status: "completed" },
        { id: 2, amount: 150, customer: "Jane Smith", status: "pending" },
        { id: 3, amount: 300, customer: "Bob Johnson", status: "completed" },
      ]
    }
  }

  static async getRoleBasedDashboard(role: string) {
    return fetch("/api/dashboard/role-based", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }).then(res => res.json())
  }

  static async getDashboardData(userRole: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const baseTransactions = [
      { id: "TXN001", customer: "Alice Johnson", amount: "$1,250", status: "completed", time: "2 hours ago" },
      { id: "TXN002", customer: "Bob Smith", amount: "$850", status: "pending", time: "4 hours ago" },
      { id: "TXN003", customer: "Carol Davis", amount: "$2,100", status: "completed", time: "6 hours ago" },
      { id: "TXN004", customer: "David Wilson", amount: "$675", status: "failed", time: "8 hours ago" },
      { id: "TXN005", customer: "Eva Brown", amount: "$1,500", status: "completed", time: "1 day ago" },
    ]

    const roleBasedData: Record<string, any> = {
      PARENT_ADMIN: {
        stats: [
          { title: "Total Revenue", value: "$125,430", icon: DollarSign, change: "+12.5%" },
          { title: "Active Users", value: "1,234", icon: Users, change: "+8.2%" },
          { title: "Transactions", value: "5,678", icon: CreditCard, change: "+15.3%" },
          { title: "System Health", value: "99.9%", icon: TrendingUp, change: "+0.1%" },
        ],
        quickActions: [
          { title: "User Management", description: "Manage system users", icon: Users, href: "/dashboard/users" },
          { title: "System Settings", description: "Configure system", icon: Shield, href: "/dashboard/settings" },
          { title: "Analytics", description: "View detailed reports", icon: BarChart3, href: "/dashboard/analytics" },
          { title: "Security", description: "Security monitoring", icon: Shield, href: "/dashboard/security" },
        ],
      },
      SUB_ADMIN: {
        stats: [
          { title: "Department Users", value: "156", icon: Users, change: "+8%" },
          { title: "Active Roles", value: "12", icon: UserCheck, change: "+2%" },
          { title: "Pending Approvals", value: "7", icon: FileText, change: "+3%" },
          { title: "Support Tickets", value: "23", icon: HeadphonesIcon, change: "-5%" },
        ],
        quickActions: [
          { title: "User Roles", description: "Manage user roles", icon: UserCheck, href: "/dashboard/roles" },
          { title: "Approvals", description: "Review pending items", icon: FileText, href: "/dashboard/approvals" },
          { title: "Reports", description: "Department reports", icon: BarChart3, href: "/dashboard/reports" },
          { title: "Support", description: "Handle tickets", icon: HeadphonesIcon, href: "/dashboard/support" },
        ],
      },
      MERCHANT: {
        stats: [
          { title: "Today's Revenue", value: "$12,450", icon: DollarSign, change: "+15%" },
          { title: "Transactions", value: "234", icon: CreditCard, change: "+8%" },
          { title: "Customers", value: "1,890", icon: Users, change: "+12%" },
          { title: "Pending Payouts", value: "$3,200", icon: Wallet, change: "+5%" },
        ],
        quickActions: [
          { title: "Create Payment", description: "Process new payment", icon: CreditCard, href: "/dashboard/payments/create" },
          { title: "View Transactions", description: "Transaction history", icon: FileText, href: "/dashboard/transactions" },
          { title: "Manage Staff", description: "Staff management", icon: Users, href: "/dashboard/staff" },
          { title: "Analytics", description: "Business insights", icon: BarChart3, href: "/dashboard/analytics" },
        ],
      },
      STAFF: {
        stats: [
          { title: "Tickets Handled", value: "45", icon: HeadphonesIcon, change: "+10%" },
          { title: "Customer Satisfaction", value: "4.8/5", icon: Users, change: "+0.2%" },
          { title: "Tasks Completed", value: "28", icon: Activity, change: "+15%" },
          { title: "Response Time", value: "2.3min", icon: RefreshCw, change: "-8%" },
        ],
        quickActions: [
          { title: "Customer Support", description: "Handle inquiries", icon: HeadphonesIcon, href: "/dashboard/support" },
          { title: "Task List", description: "View assigned tasks", icon: Activity, href: "/dashboard/tasks" },
          { title: "Knowledge Base", description: "Access resources", icon: FileText, href: "/dashboard/kb" },
          { title: "Team Chat", description: "Team communication", icon: Bell, href: "/dashboard/chat" },
        ],
      },
      REFUND_MANAGER: {
        stats: [
          { title: "Pending Refunds", value: "23", icon: RefreshCw, change: "+5%" },
          { title: "Processed Today", value: "67", icon: DollarSign, change: "+12%" },
          { title: "Dispute Cases", value: "8", icon: Shield, change: "-3%" },
          { title: "Fraud Alerts", value: "2", icon: Eye, change: "-1%" },
        ],
        quickActions: [
          { title: "Process Refunds", description: "Handle refund requests", icon: RefreshCw, href: "/dashboard/refunds" },
          { title: "Dispute Management", description: "Manage disputes", icon: Shield, href: "/dashboard/disputes" },
          { title: "Fraud Detection", description: "Monitor suspicious activity", icon: Eye, href: "/dashboard/fraud" },
          { title: "Reports", description: "Refund analytics", icon: BarChart3, href: "/dashboard/reports" },
        ],
      },
      DEVELOPER: {
        stats: [
          { title: "API Calls", value: "12,450", icon: Code, change: "+8%" },
          { title: "Active Integrations", value: "23", icon: Activity, change: "+3%" },
          { title: "Error Rate", value: "0.02%", icon: Eye, change: "-15%" },
          { title: "Response Time", value: "120ms", icon: TrendingUp, change: "+5%" },
        ],
        quickActions: [
          { title: "API Documentation", description: "View API docs", icon: FileText, href: "/dashboard/api-docs" },
          { title: "Integration Tools", description: "Development tools", icon: Code, href: "/dashboard/tools" },
          { title: "Error Logs", description: "Monitor errors", icon: Eye, href: "/dashboard/logs" },
          { title: "Performance", description: "System metrics", icon: BarChart3, href: "/dashboard/performance" },
        ],
      },
      SUPPORT: {
        stats: [
          { title: "Open Tickets", value: "34", icon: HeadphonesIcon, change: "+12%" },
          { title: "Resolved Today", value: "67", icon: UserCheck, change: "+8%" },
          { title: "Avg Response", value: "2.3h", icon: Activity, change: "-15%" },
          { title: "Satisfaction", value: "4.8/5", icon: TrendingUp, change: "+0.2%" },
        ],
        quickActions: [
          { title: "Ticket Queue", description: "Handle support tickets", icon: HeadphonesIcon, href: "/dashboard/tickets" },
          { title: "Knowledge Base", description: "Support resources", icon: FileText, href: "/dashboard/kb" },
          { title: "Customer Chat", description: "Live chat support", icon: Bell, href: "/dashboard/chat" },
          { title: "Reports", description: "Support analytics", icon: BarChart3, href: "/dashboard/support-reports" },
        ],
      },
      VIEWER: {
        stats: [
          { title: "Reports Viewed", value: "45", icon: Eye, change: "+10%" },
          { title: "Data Points", value: "1,234", icon: BarChart3, change: "+5%" },
          { title: "Last Access", value: "2h ago", icon: Activity, change: "0%" },
          { title: "Permissions", value: "Read Only", icon: Shield, change: "0%" },
        ],
        quickActions: [
          { title: "View Reports", description: "Access reports", icon: BarChart3, href: "/dashboard/reports" },
          { title: "Data Export", description: "Export data", icon: FileText, href: "/dashboard/export" },
          { title: "Dashboard", description: "View dashboard", icon: Eye, href: "/dashboard/view" },
          { title: "Help", description: "Get assistance", icon: HeadphonesIcon, href: "/dashboard/help" },
        ],
      },
    }

    return {
      stats: roleBasedData[userRole]?.stats || [],
      recentTransactions: baseTransactions,
      quickActions: roleBasedData[userRole]?.quickActions || [],
    }
  }

  static async requestFeatureEnhancement(userRole: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    console.log(`Feature enhancement requested for role: ${userRole}`)
    return { success: true, message: "Feature request submitted successfully" }
  }
}