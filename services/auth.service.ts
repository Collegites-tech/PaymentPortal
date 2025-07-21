export class AuthService {
  private static readonly SUPER_ADMIN_EMAIL = "admin@payflow.com"
  private static readonly SUPER_ADMIN_PASSWORD = "SuperAdmin123!"

  static async login(email: string, password: string) {
    console.log("🔐 AuthService: Login attempt")
    console.log(`   User ID/Email: ${email}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check super admin credentials
    if (email === this.SUPER_ADMIN_EMAIL && password === this.SUPER_ADMIN_PASSWORD) {
      const user = {
        id: "super_admin_001",
        name: "Super Admin",
        email: email,
        role: "PARENT_ADMIN",
        permissions: this.getRolePermissions("PARENT_ADMIN"),
        isInvited: false,
        hasChangedPassword: true,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("authToken", "super_admin_token_123")

      return { success: true, user, message: "Login successful" }
    }

    // Check invited users
    const invitedUsers = this.getInvitedUsers()
    const invitedUser = invitedUsers.find((u: any) => u.email === email && u.tempPassword === password)

    if (invitedUser) {
      const user = {
        ...invitedUser,
        permissions: this.getRolePermissions(invitedUser.role),
      }

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("authToken", `token_${user.id}`)

      return { success: true, user, message: "Login successful" }
    }

    return { success: false, message: "Invalid credentials" }
  }

  static async getCurrentUser() {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("authToken")

    if (!userData || !token) return null

    try {
      const user = JSON.parse(userData)
      return {
        ...user,
        permissions: this.getRolePermissions(user.role),
      }
    } catch {
      return null
    }
  }

  static async logout() {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    localStorage.removeItem("hasChangedPassword")
  }

  static markPasswordChanged() {
    localStorage.setItem("hasChangedPassword", "true")
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      user.hasChangedPassword = true
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  static getRolePermissions(role: string): string[] {
    const permissions = {
      PARENT_ADMIN: ["all", "api_access"],
      SUB_ADMIN: [
        "view_dashboard",
        "view_reports",
        "process_refunds",
        "view_transactions",
        "create_payments",
        "manage_customers",
        "view_payouts",
        "view_disputes",
      ],
      MERCHANT: [
        "view_dashboard",
        "create_payments",
        "view_transactions",
        "manage_customers",
        "view_payouts",
        "view_reports",
      ],
      REFUND_MANAGER: ["view_dashboard", "process_refunds", "view_transactions"],
      VIEWER: ["view_dashboard", "view_reports", "view_transactions"],
      STAFF: ["view_dashboard", "view_transactions"],
      DEVELOPER: [
        "view_dashboard",
        "view_reports",
        "view_transactions",
        "create_payments",
        "manage_customers",
        "api_access",
      ],
      SUPPORT: ["view_dashboard", "view_transactions", "manage_customers"],
    }

    return permissions[role as keyof typeof permissions] || ["view_dashboard"]
  }

  static hasPermission(userRole: string, permission: string): boolean {
    const permissions = this.getRolePermissions(userRole)
    return permissions.includes("all") || permissions.includes(permission)
  }

  private static getInvitedUsers() {
    const invitedUsers = localStorage.getItem("invitedUsers")
    return invitedUsers ? JSON.parse(invitedUsers) : []
  }

  static async generateInviteCredentials(email: string, role: string) {
    const uniqueId = `USR${Date.now()}`
    const tempPassword = Math.random().toString(36).slice(-12) + "A1!"

    const invitedUser = {
      id: uniqueId,
      email,
      role,
      tempPassword,
      isInvited: true,
      hasChangedPassword: false,
      invitedAt: new Date().toISOString(),
      status: "pending",
    }

    // Store invited user
    const existingUsers = this.getInvitedUsers()
    existingUsers.push(invitedUser)
    localStorage.setItem("invitedUsers", JSON.stringify(existingUsers))

    return { uniqueId, tempPassword }
  }
}
