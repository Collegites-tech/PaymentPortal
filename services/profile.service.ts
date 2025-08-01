updated-code
export class ProfileService {
  static async getUserProfile(userId: string) {
    console.log("👤 ProfileService: Getting user profile for:", userId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    return {
      id: user.id,
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ")[1] || "",
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      department: user.department || "",
      joinDate: user.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      hasChangedPassword: user.hasChangedPassword || false,
    }
  }

  static async updateProfile(userId: string, profileData: any) {
    console.log("✏️ ProfileService: Updating profile for:", userId)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const updatedUser = {
      ...user,
      name: `${profileData.firstName} ${profileData.lastName}`,
      phone: profileData.phone,
      department: profileData.department,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))

    return { success: true, message: "Profile updated successfully" }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    console.log("🔐 ProfileService: Changing password for:", userId)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd verify the current password
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    user.hasChangedPassword = true
    user.passwordChangedAt = new Date().toISOString()

    localStorage.setItem("user", JSON.stringify(user))

    return { success: true, message: "Password changed successfully" }
  }

  static async getAdminDetails(userId: string) {
    console.log("👑 ProfileService: Getting admin details for:", userId)
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      invitedBy: "Super Admin",
      invitedAt: "2024-01-15T10:30:00Z",
      permissions: ["view_dashboard", "create_payments", "view_transactions"],
      accountManager: "admin@payflow.com",
      companyName: "PayFlow Inc.",
      accountType: "Payment Service Provider",
    }
  }

  static async getMerchantStaff(merchantId: string) {
    console.log("👥 ProfileService: Getting merchant staff for:", merchantId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "STAFF001",
        name: "John Staff",
        email: "john.staff@merchant.com",
        role: "MERCHANT_STAFF",
        status: "active",
        invitedAt: "2024-01-10T09:00:00Z",
      },
      {
        id: "STAFF002",
        name: "Jane Viewer",
        email: "jane.viewer@merchant.com",
        role: "MERCHANT_VIEWER",
        status: "pending",
        invitedAt: "2024-01-12T14:30:00Z",
      },
    ]
  }

  static async inviteMerchantStaff(merchantId: string, email: string, role: string) {
    console.log("✉️ ProfileService: Inviting merchant staff:", email, "as", role)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const inviteToken = `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      success: true,
      inviteToken,
      inviteUrl: `${window.location.origin}/invite/${inviteToken}`,
      message: "Staff member invited successfully",
    }
  }

  static async inviteUser(email: string, role: string) {
    console.log("Inviting user:", email, "as", role);
    const inviteToken = `role_${role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      inviteToken,
      inviteUrl: `${window.location.origin}/invite/${inviteToken}`,
      message: "User invited successfully",
    };
  }
}
