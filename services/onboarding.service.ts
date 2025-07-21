import { AuthService } from "./auth.service"

export class OnboardingService {
  static async getInviteData(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate token validation and data retrieval
    const mockInviteData = {
      token,
      email: "merchant@example.com",
      role: "MERCHANT",
      invitedBy: "Super Admin",
      companyName: "PayFlow Inc.",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isValid: true,
    }

    if (!mockInviteData.isValid) {
      throw new Error("Invalid or expired invitation")
    }

    return mockInviteData
  }

  static async completeMerchantOnboarding(token: string, formData: any) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate unique credentials
    const credentials = await AuthService.generateInviteCredentials(formData.email, "MERCHANT")

    // Create merchant profile
    const merchantProfile = {
      id: credentials.uniqueId,
      ...formData,
      status: "active",
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    }

    // Store merchant profile
    const existingProfiles = this.getStoredMerchantProfiles()
    existingProfiles.push(merchantProfile)
    localStorage.setItem("merchantProfiles", JSON.stringify(existingProfiles))

    // Create user account
    const userData = {
      id: credentials.uniqueId,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: "MERCHANT",
      permissions: AuthService.getRolePermissions("MERCHANT"),
      isInvited: true,
      hasChangedPassword: false,
      tempPassword: credentials.tempPassword,
      merchantProfile: merchantProfile,
      status: "active",
    }

    // Store user data
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("authToken", `token_${userData.id}`)

    return {
      success: true,
      user: userData,
      credentials,
    }
  }

  static async getMerchantProfile(userId: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const profiles = this.getStoredMerchantProfiles()
    return profiles.find((profile) => profile.id === userId)
  }

  private static getStoredMerchantProfiles() {
    const stored = localStorage.getItem("merchantProfiles")
    return stored ? JSON.parse(stored) : []
  }
}
