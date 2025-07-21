export class ProfileService {
  static async updateProfile(userId: string, profileData: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    return { success: true }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // In a real app, you'd verify the current password
    // For demo purposes, we'll just simulate success

    return { success: true }
  }

  static async getPreferences(userId: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const preferences = localStorage.getItem(`preferences_${userId}`)
    return preferences
      ? JSON.parse(preferences)
      : {
          emailNotifications: true,
          smsNotifications: false,
          twoFactorEnabled: false,
        }
  }

  static async updatePreferences(userId: string, preferences: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences))
    return { success: true }
  }

  static getRoleBadgeColor(role: string) {
    const roleColors: { [key: string]: string } = {
      PARENT_ADMIN: "bg-red-600 hover:bg-red-700",
      SUB_ADMIN: "bg-blue-600 hover:bg-blue-700",
      MERCHANT: "bg-orange-600 hover:bg-orange-700",
      STAFF: "bg-indigo-600 hover:bg-indigo-700",
      VIEWER: "bg-gray-600 hover:bg-gray-700",
    }

    return roleColors[role] || "bg-gray-500 hover:bg-gray-600"
  }
}
