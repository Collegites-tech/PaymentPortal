import { DollarSign, CreditCard, Users, TrendingUp, Plus, Link, BarChart3, UserPlus } from "lucide-react"

export class DashboardService {
  static async getDashboardData(userRole: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const baseStats = [
      {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        icon: DollarSign,
      },
      {
        title: "Transactions",
        value: "2,350",
        change: "+180.1% from last month",
        icon: CreditCard,
      },
      {
        title: "Active Customers",
        value: "1,234",
        change: "+19% from last month",
        icon: Users,
      },
      {
        title: "Success Rate",
        value: "98.2%",
        change: "+2.1% from last month",
        icon: TrendingUp,
      },
    ]

    const recentTransactions = [
      {
        id: "TXN001",
        customer: "John Doe",
        amount: "$299.00",
        status: "completed",
        time: "2 minutes ago",
      },
      {
        id: "TXN002",
        customer: "Jane Smith",
        amount: "$149.99",
        status: "pending",
        time: "5 minutes ago",
      },
      {
        id: "TXN003",
        customer: "Bob Johnson",
        amount: "$89.50",
        status: "completed",
        time: "10 minutes ago",
      },
      {
        id: "TXN004",
        customer: "Alice Brown",
        amount: "$199.99",
        status: "failed",
        time: "15 minutes ago",
      },
    ]

    // Role-based quick actions
    const quickActions = this.getQuickActionsForRole(userRole)

    // Filter stats based on role permissions
    const stats = this.filterStatsForRole(baseStats, userRole)

    return {
      stats,
      recentTransactions,
      quickActions,
    }
  }

  private static getQuickActionsForRole(role: string) {
    const allActions = [
      {
        title: "Create New Payment",
        description: "Generate payment links and QR codes",
        icon: Plus,
        href: "/dashboard/payments/create",
        permission: "create_payments",
      },
      {
        title: "Generate Payment Link",
        description: "Quick payment link creation",
        icon: Link,
        href: "/dashboard/payments/links",
        permission: "create_payments",
      },
      {
        title: "View Customers",
        description: "Manage customer profiles",
        icon: Users,
        href: "/dashboard/customers",
        permission: "manage_customers",
      },
      {
        title: "View Reports",
        description: "Analytics and insights",
        icon: BarChart3,
        href: "/dashboard/reports",
        permission: "view_reports",
      },
      {
        title: "Manage Team",
        description: "Invite and manage team members",
        icon: UserPlus,
        href: "/dashboard/team",
        permission: "manage_team",
      },
    ]

    const permissions = this.getRolePermissions(role)

    return allActions.filter((action) => permissions.includes("all") || permissions.includes(action.permission))
  }

  private static filterStatsForRole(stats: any[], role: string) {
    // All roles can see basic stats, but some might be limited
    if (role === "VIEWER") {
      return stats.filter(
        (stat) => stat.title !== "Total Revenue", // Viewers can't see revenue
      )
    }

    return stats
  }

  private static getRolePermissions(role: string): string[] {
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
      MERCHANT: [
        "view_dashboard",
        "create_payments",
        "view_transactions",
        "manage_customers",
        "view_payouts",
        "view_reports",
      ],
      DEVELOPER: ["view_reports", "view_transactions", "create_payments", "manage_customers"],
      SUPPORT: ["view_transactions", "manage_customers"],
    }

    return permissions[role as keyof typeof permissions] || []
  }
}
