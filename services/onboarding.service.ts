export class OnboardingService {
  static async getMerchantOnboardingData(token: string) {
    console.log("🏪 OnboardingService: Getting merchant onboarding data for token:", token)
    await new Promise((resolve) => setTimeout(resolve, 600))

    return {
      token,
      merchantInfo: {
        businessName: "",
        businessType: "",
        industry: "",
        website: "",
        description: "",
      },
      contactInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      },
      businessDetails: {
        taxId: "",
        registrationNumber: "",
        yearEstablished: "",
        employeeCount: "",
      },
      bankingInfo: {
        accountHolderName: "",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
      },
      currentStep: 1,
      totalSteps: 4,
      isComplete: false,
    }
  }

  static async saveMerchantOnboardingStep(token: string, step: number, data: any) {
    console.log(`💾 OnboardingService: Saving merchant onboarding step ${step}`)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would save to a database
    const storageKey = `merchant_onboarding_${token}`
    const existingData = JSON.parse(localStorage.getItem(storageKey) || "{}")

    const updatedData = {
      ...existingData,
      [`step${step}`]: data,
      currentStep: Math.max(existingData.currentStep || 1, step),
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedData))

    return {
      success: true,
      message: `Step ${step} saved successfully`,
      nextStep: step < 4 ? step + 1 : null,
    }
  }

  static async completeMerchantOnboarding(token: string) {
    console.log("✅ OnboardingService: Completing merchant onboarding")
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const storageKey = `merchant_onboarding_${token}`
    const onboardingData = JSON.parse(localStorage.getItem(storageKey) || "{}")

    // Create merchant account
    const merchantAccount = {
      id: `MERCHANT_${Date.now()}`,
      token,
      status: "active",
      onboardingData,
      completedAt: new Date().toISOString(),
      approvalStatus: "approved", // In real app, this might be "pending_review"
    }

    localStorage.setItem(`merchant_account_${token}`, JSON.stringify(merchantAccount))

    return {
      success: true,
      merchantId: merchantAccount.id,
      message: "Merchant onboarding completed successfully",
      redirectUrl: "/dashboard",
    }
  }

  static async getOnboardingProgress(token: string) {
    console.log("📊 OnboardingService: Getting onboarding progress")
    await new Promise((resolve) => setTimeout(resolve, 300))

    const storageKey = `merchant_onboarding_${token}`
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}")

    const steps = [
      { id: 1, title: "Business Information", completed: !!data.step1 },
      { id: 2, title: "Contact Details", completed: !!data.step2 },
      { id: 3, title: "Business Details", completed: !!data.step3 },
      { id: 4, title: "Banking Information", completed: !!data.step4 },
    ]

    const completedSteps = steps.filter((step) => step.completed).length
    const progress = (completedSteps / steps.length) * 100

    return {
      steps,
      currentStep: data.currentStep || 1,
      progress,
      isComplete: completedSteps === steps.length,
    }
  }
}
