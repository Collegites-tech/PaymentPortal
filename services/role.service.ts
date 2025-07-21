export class RoleService {
  static async getAllRoles() {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const systemRoles = [
      {
        id: "parent_admin",
        name: "Parent Admin",
        description: "Full system access with all permissions",
        isCustom: false,
        isActive: true,
        permissions: ["all"],
        userCount: 1,
      },
      {
        id: "sub_admin",
        name: "Sub Admin",
        description: "Administrative access with limited permissions",
        isCustom: false,
        isActive: true,
        permissions: ["view_reports", "manage_customers", "create_payments"],
        userCount: 3,
      },
      {
        id: "merchant",
        name: "Merchant",
        description: "Standard merchant account with payment processing",
        isCustom: false,
        isActive: true,
        permissions: ["create_payments", "view_transactions", "manage_customers", "view_payouts", "view_reports"],
        userCount: 15,
      },
    ]

    const customRoles = this.getStoredCustomRoles()
    return [...systemRoles, ...customRoles]
  }

  static async getAllPermissions() {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [
      {
        id: "view_dashboard",
        name: "View Dashboard",
        description: "Access to main dashboard and overview",
        category: "General",
        isCore: true,
        roleCount: 8,
      },
      {
        id: "create_payments",
        name: "Create Payments",
        description: "Create payment links, QR codes, and process payments",
        category: "Payments",
        isCore: true,
        roleCount: 5,
      },
      {
        id: "view_transactions",
        name: "View Transactions",
        description: "View transaction history and details",
        category: "Transactions",
        isCore: true,
        roleCount: 7,
      },
      {
        id: "manage_customers",
        name: "Manage Customers",
        description: "Create, edit, and manage customer profiles",
        category: "Customers",
        isCore: true,
        roleCount: 4,
      },
      {
        id: "view_reports",
        name: "View Reports",
        description: "Access to analytics and reporting features",
        category: "Reports",
        isCore: true,
        roleCount: 6,
      },
      {
        id: "manage_team",
        name: "Manage Team",
        description: "Invite and manage team members",
        category: "Administration",
        isCore: false,
        roleCount: 2,
      },
      {
        id: "manage_settings",
        name: "Manage Settings",
        description: "Configure system and account settings",
        category: "Administration",
        isCore: false,
        roleCount: 2,
      },
      {
        id: "process_refunds",
        name: "Process Refunds",
        description: "Process refunds and handle disputes",
        category: "Payments",
        isCore: false,
        roleCount: 3,
      },
      {
        id: "api_access",
        name: "API Access",
        description: "Access to API keys and webhook management",
        category: "Technical",
        isCore: false,
        roleCount: 2,
      },
      {
        id: "view_payouts",
        name: "View Payouts",
        description: "View payout history and settlement details",
        category: "Finance",
        isCore: false,
        roleCount: 4,
      },
    ]
  }

  static async createRole(roleData: any) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRole = {
      id: `custom_${Date.now()}`,
      ...roleData,
      isActive: true,
      userCount: 0,
      createdAt: new Date().toISOString(),
    }

    const customRoles = this.getStoredCustomRoles()
    customRoles.push(newRole)
    localStorage.setItem("customRoles", JSON.stringify(customRoles))

    return newRole
  }

  static async updateRole(roleId: string, updates: any) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const customRoles = this.getStoredCustomRoles()
    const roleIndex = customRoles.findIndex((role) => role.id === roleId)

    if (roleIndex !== -1) {
      customRoles[roleIndex] = { ...customRoles[roleIndex], ...updates }
      localStorage.setItem("customRoles", JSON.stringify(customRoles))
      return customRoles[roleIndex]
    }

    throw new Error("Role not found")
  }

  static async deleteRole(roleId: string) {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const customRoles = this.getStoredCustomRoles()
    const filteredRoles = customRoles.filter((role) => role.id !== roleId)
    localStorage.setItem("customRoles", JSON.stringify(filteredRoles))

    return { success: true }
  }

  private static getStoredCustomRoles() {
    const stored = localStorage.getItem("customRoles")
    return stored ? JSON.parse(stored) : []
  }
}
