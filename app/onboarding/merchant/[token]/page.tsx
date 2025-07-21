"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, Building, CreditCard, FileText, ArrowRight } from "lucide-react"
import { OnboardingService } from "@/services/onboarding.service"
import { useToast } from "@/hooks/use-toast"

export default function MerchantOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Business Details
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessCountry: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    description: "",

    // Bank Settlement Details
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    swiftCode: "",

    // Tax Information
    taxId: "",
    taxIdType: "",
    vatNumber: "",
    taxAddress: "",
    taxCity: "",
    taxState: "",
    taxZip: "",
    taxCountry: "",
  })

  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const steps = [
    { id: 0, title: "Personal Details", icon: User, description: "Basic personal information" },
    { id: 1, title: "Business Information", icon: Building, description: "Business details and registration" },
    { id: 2, title: "Bank Settlement", icon: CreditCard, description: "Banking and settlement details" },
    { id: 3, title: "Tax Information", icon: FileText, description: "Tax identification and compliance" },
  ]

  useEffect(() => {
    const loadInviteData = async () => {
      try {
        const data = await OnboardingService.getInviteData(params.token as string)
        setInviteData(data)
        setFormData((prev) => ({
          ...prev,
          email: data.email,
        }))
      } catch (error) {
        toast({
          title: "Invalid invitation",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }

    loadInviteData()
  }, [params.token, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.phone && formData.address
      case 1:
        return formData.businessName && formData.businessType && formData.businessAddress
      case 2:
        return formData.bankName && formData.accountHolderName && formData.accountNumber && formData.routingNumber
      case 3:
        return formData.taxId && formData.taxIdType
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    } else {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await OnboardingService.completeMerchantOnboarding(params.token as string, formData)

      toast({
        title: "Onboarding completed!",
        description: "Your merchant account has been set up successfully.",
      })

      // Redirect to merchant dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Onboarding failed",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white">Loading invitation...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to PayFlow</h1>
          <p className="text-slate-400">Complete your merchant onboarding to get started</p>
          <Badge className="mt-2 bg-blue-600">{inviteData.role}</Badge>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
            {" "}
            {/* Added padding for smaller screens */}
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 justify-center sm:justify-start">
                {" "}
                {/* Centered on small, left on larger */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    /* Adjusted size */
                    index <= currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 lg:w-24 h-1 mx-1 sm:mx-2 ${
                      /* Adjusted width */
                      index < currentStep ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">{steps[currentStep].title}</h2>
            <p className="text-slate-400 text-sm">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6 lg:p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {" "}
                  {/* Adjusted gap */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-slate-800/30 border-slate-700 text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-slate-200">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-slate-200">
                      Country
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-200">
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {" "}
                  {/* Adjusted gap */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-200">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-200">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-slate-200">
                      ZIP/Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {" "}
                  {/* Adjusted gap */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-slate-200">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-slate-200">
                      Business Type *
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => handleInputChange("businessType", value)}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone" className="text-slate-200">
                      Business Phone
                    </Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail" className="text-slate-200">
                      Business Email
                    </Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="website" className="text-slate-200">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://www.example.com"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="text-slate-200">
                    Business Address *
                  </Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200">
                    Business Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your business and what you sell..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {" "}
                  {/* Adjusted gap */}
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-slate-200">
                      Bank Name *
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName" className="text-slate-200">
                      Account Holder Name *
                    </Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-slate-200">
                      Account Number *
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber" className="text-slate-200">
                      Routing Number *
                    </Label>
                    <Input
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType" className="text-slate-200">
                      Account Type
                    </Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => handleInputChange("accountType", value)}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode" className="text-slate-200">
                      SWIFT Code (International)
                    </Label>
                    <Input
                      id="swiftCode"
                      value={formData.swiftCode}
                      onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    <strong>Security Notice:</strong> Your banking information is encrypted and securely stored. This
                    information is required for payment settlements and will only be used for legitimate business
                    purposes.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {" "}
                  {/* Adjusted gap */}
                  <div className="space-y-2">
                    <Label htmlFor="taxIdType" className="text-slate-200">
                      Tax ID Type *
                    </Label>
                    <Select value={formData.taxIdType} onValueChange={(value) => handleInputChange("taxIdType", value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Select tax ID type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="ssn">Social Security Number (SSN)</SelectItem>
                        <SelectItem value="ein">Employer Identification Number (EIN)</SelectItem>
                        <SelectItem value="itin">Individual Taxpayer Identification Number (ITIN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId" className="text-slate-200">
                      Tax ID Number *
                    </Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber" className="text-slate-200">
                      VAT Number (if applicable)
                    </Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxCountry" className="text-slate-200">
                      Tax Country
                    </Label>
                    <Select
                      value={formData.taxCountry}
                      onValueChange={(value) => handleInputChange("taxCountry", value)}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxAddress" className="text-slate-200">
                    Tax Address
                  </Label>
                  <Textarea
                    id="taxAddress"
                    value={formData.taxAddress}
                    onChange={(e) => handleInputChange("taxAddress", e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    rows={3}
                  />
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    <strong>Tax Compliance:</strong> This information is required for tax reporting and compliance
                    purposes. All data is handled in accordance with applicable tax regulations and privacy laws.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
              >
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isLoading ? "Completing..." : "Complete Onboarding"}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
