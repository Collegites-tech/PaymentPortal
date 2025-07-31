export class RoleService {
  static async getAllRoles() {
    console.log("🎭 RoleService: Getting all roles")
    await new Promise((resolve) => setTimeout(resolve, 400))

    return [
      {
        id: "parent_admin",
        name: "Parent Admin",
        description: "Full system access and control",
        permissions: ["all"],
        isSystem: true,
        userCount: 1,
      },
      {
        id: "sub_admin",
        name: "Sub Admin",
        description: "Administrative access with some restrictions",
        permissions: [
          "view_dashboard",
          "view_reports",
          "process_refunds",
          "view_transactions",
          "create_payments",
          "manage_customers",
          "view_payouts",
          "view_disputes",
        ],
        isSystem: true,
        userCount: 3,
      },
      {
        id: "merchant",
        name: "Merchant",
        description: "Business owner with payment processing capabilities",
        permissions: [
          "view_dashboard",
          "create_payments",
          "view_transactions",
          "manage_customers",
          "view_payouts",
          "view_reports",
          "manage_staff",
        ],
        isSystem: true,
        userCount: 15,
      },
      {
        id: "staff",
        name: "Staff",
        description: "Basic access for staff members",
        permissions: ["view_dashboard", "view_transactions"],
        isSystem: true,
        userCount: 25,
      },
      {
        id: "developer",
        name: "Developer",
        description: "Technical access for integration",
        permissions: [
          "view_dashboard",
          "view_reports",
          "view_transactions",
          "create_payments",
          "manage_customers",
          "api_access",
        ],
        isSystem: true,
        userCount: 5,
      },
    ]
  }

  static async createRole(roleData: any) {
    console.log("➕ RoleService: Creating new role:", roleData.name)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newRole = {
      id: `custom_${Date.now()}`,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      isSystem: false,
      userCount: 0,
      createdAt: new Date().toISOString(),
    }

    return { success: true, role: newRole }
  }

  static async updateRole(roleId: string, roleData: any) {
    console.log("✏️ RoleService: Updating role:", roleId)
    await new Promise((resolve) => setTimeout(resolve, 600))

    return { success: true, message: "Role updated successfully" }
  }

  static async deleteRole(roleId: string) {
    console.log("🗑️ RoleService: Deleting role:", roleId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, message: "Role deleted successfully" }
  }

  static async getAllPermissions() {
    return [
      { id: "view_dashboard", name: "View Dashboard", category: "General" },
      { id: "view_reports", name: "View Reports", category: "Analytics" },
      { id: "view_transactions", name: "View Transactions", category: "Payments" },
      { id: "create_payments", name: "Create Payments", category: "Payments" },
      { id: "process_refunds", name: "Process Refunds", category: "Payments" },
      { id: "manage_customers", name: "Manage Customers", category: "Customer" },
      { id: "view_payouts", name: "View Payouts", category: "Financial" },
      { id: "view_disputes", name: "View Disputes", category: "Financial" },
      { id: "manage_team", name: "Manage Team", category: "Administration" },
      { id: "manage_roles", name: "Manage Roles", category: "Administration" },
      { id: "api_access", name: "API Access", category: "Technical" },
    ]
  }

  static async getRoleConfig(role: string) {
    const roleConfigs = {
      PARENT_ADMIN: {
        dashboardPath: '/dashboard',
        features: ['all'],
        permissions: ['read', 'write', 'delete', 'admin', 'manage_all']
      },
      SUB_ADMIN: {
        dashboardPath: '/Roles/sub-admin/dashboard',
        features: ['view_reports', 'process_refunds', 'view_transactions', 'create_payments', 'manage_customers', 'view_payouts'],
        permissions: ['read', 'write', 'process_refunds']
      },
      MERCHANT: {
        dashboardPath: '/Roles/merchant/dashboard',
        features: ['view_dashboard', 'create_payments', 'view_transactions', 'manage_customers', 'view_payouts', 'view_reports', 'manage_staff'],
        permissions: ['read', 'write', 'manage_staff']
      },
      REFUND_MANAGER: {
        dashboardPath: '/Roles/refund-manager/dashboard',
        features: ['view_dashboard', 'process_refunds', 'view_transactions'],
        permissions: ['read', 'process_refunds']
      },
      VIEWER: {
        dashboardPath: '/Roles/viewer/dashboard',
        features: ['view_dashboard', 'view_reports', 'view_transactions'],
        permissions: ['read']
      },
      STAFF: {
        dashboardPath: '/Roles/staff/dashboard',
        features: ['view_dashboard', 'view_transactions'],
        permissions: ['read']
      },
      DEVELOPER: {
        dashboardPath: '/Roles/developer/dashboard',
        features: ['view_dashboard', 'view_reports', 'view_transactions', 'create_payments', 'manage_customers', 'api_access'],
        permissions: ['read', 'write', 'api_access']
      },
      SUPPORT: {
        dashboardPath: '/Roles/support/dashboard',
        features: ['view_dashboard', 'view_transactions', 'manage_customers'],
        permissions: ['read', 'support']
      }
    }
    
    return roleConfigs[role as keyof typeof roleConfigs] || null
  }

  static async getAvailableRoles() {
    return [
      { value: 'SUB_ADMIN', label: 'Sub Administrator', description: 'Limited admin access with specific permissions' },
      { value: 'MERCHANT', label: 'Merchant', description: 'Store and payment management with staff control' },
      { value: 'REFUND_MANAGER', label: 'Refund Manager', description: 'Handle refunds and transaction disputes' },
      { value: 'VIEWER', label: 'Viewer', description: 'Read-only access to reports and transactions' },
      { value: 'STAFF', label: 'Staff', description: 'Basic access to view transactions' },
      { value: 'DEVELOPER', label: 'Developer', description: 'API access and development tools' },
      { value: 'SUPPORT', label: 'Support', description: 'Customer support and assistance' }
    ]
  }

  static getRoleBadgeColor(role: string) {
    const colors = {
      PARENT_ADMIN: "bg-purple-600 hover:bg-purple-700",
      SUB_ADMIN: "bg-blue-600 hover:bg-blue-700",
      DEVELOPER: "bg-green-600 hover:bg-green-700",
      SUPPORT: "bg-yellow-600 hover:bg-yellow-700",
      REFUND_MANAGER: "bg-orange-600 hover:bg-orange-700",
      VIEWER: "bg-gray-600 hover:bg-gray-700",
      STAFF: "bg-indigo-600 hover:bg-indigo-700",
      MERCHANT: "bg-emerald-600 hover:bg-emerald-700",
    }
    return colors[role as keyof typeof colors] || "bg-slate-600 hover:bg-slate-700"
  }
}