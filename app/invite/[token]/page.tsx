"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, CheckCircle, Mail, Phone, User, ArrowRight, LogIn, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MicroservicesService } from "@/services/microservices.service"
import { AuthService } from "@/services/auth.service"

export default function InviteAcceptPage() {
  const [step, setStep] = useState<"details" | "credentials" | "login">("details")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email")
  const [contactValue, setContactValue] = useState("")
  const [generatedCredentials, setGeneratedCredentials] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)

  // Login form states
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("🚀 Starting invite token verification process...")
        const data = await MicroservicesService.verifyInviteToken(params.token as string)
        setInviteData(data)
        console.log("✅ Invite verification completed successfully")
      } catch (error) {
        console.error("❌ Invite verification failed:", error)
        toast({
          title: "Invalid invite link",
          description: "This invite link is invalid or has expired.",
          variant: "destructive",
        })
      }
    }

    verifyToken()
  }, [params.token, toast])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("🚀 STARTING ACCOUNT CREATION PROCESS")
      console.log("=".repeat(60))

      // Step 1: Prepare user data
      const userData = {
        firstName,
        lastName,
        email: inviteData.email,
        role: inviteData.role,
        contactMethod,
        contactValue,
        inviteToken: params.token,
      }

      console.log("📋 User Data Prepared:")
      console.log(userData)

      // Step 2: Generate credentials via microservice
      console.log("\n🔧 STEP 1: Generating credentials...")
      const credentials = await MicroservicesService.generateCredentials(userData)

      // Step 3: Create user account via microservice
      console.log("\n👤 STEP 2: Creating user account...")
      const userAccount = await MicroservicesService.createUserAccount(userData, credentials)

      // Step 4: Send credentials via microservice
      console.log("\n📧 STEP 3: Sending credentials...")
      const notificationResult = await MicroservicesService.sendCredentials(
        contactMethod,
        contactValue,
        credentials,
        userData,
      )

      console.log("\n🎉 ACCOUNT CREATION PROCESS COMPLETED SUCCESSFULLY!")
      console.log("=".repeat(60))

      setGeneratedCredentials(credentials)
      setStep("credentials")

      toast({
        title: "Account created successfully!",
        description: `Your login credentials have been sent to your ${contactMethod}.`,
      })

      // Auto-fill login form with generated credentials for demo purposes
      setLoginId(credentials.uniqueId)
    } catch (error) {
      console.error("❌ ACCOUNT CREATION FAILED:", error)
      toast({
        title: "Account creation failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      console.log("🔐 ATTEMPTING LOGIN")
      console.log(`   User ID: ${loginId}`)
      console.log(`   Password: ${"*".repeat(password.length)}`)

      const result = await AuthService.login(loginId, password)

      if (result.success) {
        console.log("✅ LOGIN SUCCESSFUL")
        console.log(`   User: ${result.user.name}`)
        console.log(`   Role: ${result.user.role}`)

        toast({
          title: "Login successful",
          description: "Welcome to PayFlow!",
        })

        if (result.user.role === "MERCHANT") {
          router.push(`/onboarding/merchant/${params.token}`)
        } else {
          router.push("/dashboard")
        }
      } else {
        console.log("❌ LOGIN FAILED:", result.message)
        toast({
          title: "Login failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error)
      toast({
        title: "Login error",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    }

    setIsLoggingIn(false)
  }

  const handleForgotPassword = () => {
    console.log("🔄 Password reset requested for:", loginId)
    toast({
      title: "Password reset",
      description: "Password reset instructions will be sent to your registered contact method.",
    })
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verifying invite...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        {step === "details" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Join PayFlow</CardTitle>
              <p className="text-slate-400">
                You've been invited to join {inviteData.companyName} as a {inviteData.role}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <strong>Email:</strong> {inviteData.email}
                </p>
                <p className="text-slate-300 text-sm">
                  <strong>Role:</strong> {inviteData.role}
                </p>
                <p className="text-slate-300 text-sm">
                  <strong>Invited by:</strong> {inviteData.invitedBy}
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-200">How would you like to receive your credentials?</Label>
                  <RadioGroup
                    value={contactMethod}
                    onValueChange={(value: "email" | "phone") => setContactMethod(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="text-slate-300 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="text-slate-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-slate-200">
                    {contactMethod === "email" ? "Email Address" : "Phone Number"}
                  </Label>
                  <Input
                    id="contact"
                    type={contactMethod === "email" ? "email" : "tel"}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={contactMethod === "email" ? "john@example.com" : "+1 (555) 123-4567"}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account & Send Credentials
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {step === "credentials" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Credentials Sent!</CardTitle>
              <p className="text-slate-400">Your login credentials have been sent to your {contactMethod}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">
                  <strong>Sent to:</strong> {contactValue}
                </p>
                <p className="text-slate-400 text-xs mb-3">
                  Check your {contactMethod === "email" ? "email inbox" : "text messages"} for your login credentials.
                </p>
                {generatedCredentials && (
                  <div className="mt-3 p-3 bg-slate-700 rounded border-l-4 border-blue-500">
                    <p className="text-xs text-slate-400 mb-1">For demo purposes, your credentials are:</p>
                    <p className="text-sm text-slate-200">
                      <strong>ID:</strong> {generatedCredentials.uniqueId}
                    </p>
                    <p className="text-sm text-slate-200">
                      <strong>Password:</strong> {generatedCredentials.tempPassword}
                    </p>
                  </div>
                )}
              </div>

              <Button onClick={() => setStep("login")} className="w-full bg-green-600 hover:bg-green-700">
                <LogIn className="h-4 w-4 mr-2" />
                Continue to Login
              </Button>
            </CardContent>
          </>
        )}

        {step === "login" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Login to PayFlow</CardTitle>
              <p className="text-slate-400">Enter the credentials sent to your {contactMethod}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginId" className="text-slate-200">
                    User ID
                  </Label>
                  <Input
                    id="loginId"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter your User ID"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-slate-800 border-slate-700 text-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
