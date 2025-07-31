"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Shield, Bell, Eye, EyeOff, Building, Users, UserPlus, LinkIcon } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { ProfileService } from "@/services/profile.service"
import { MicroservicesService } from "@/services/microservices.service"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Details
    name: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    address: "",

    // Admin Details
    department: "",
    employeeId: "",
    joiningDate: "",
    reportingManager: "",

    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Staff Management for Merchants
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@merchant.com",
      role: "CASHIER",
      status: "Active",
      inviteLink: "https://payflow.com/invite/abc123",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@merchant.com",
      role: "MANAGER",
      status: "Pending",
      inviteLink: "https://payflow.com/invite/def456",
    },
  ])

  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    role: "CASHIER",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorEnabled: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadProfile = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        location: currentUser.location || "",
        dateOfBirth: currentUser.dateOfBirth || "",
        address: currentUser.address || "",
        department: currentUser.department || "",
        employeeId: currentUser.employeeId || "",
        joiningDate: currentUser.joiningDate || "",
        reportingManager: currentUser.reportingManager || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      const userPreferences = await ProfileService.getPreferences(currentUser.id)
      setPreferences(userPreferences)
      setIsLoading(false)
    }

    loadProfile()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await ProfileService.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        department: formData.department,
        employeeId: formData.employeeId,
        joiningDate: formData.joiningDate,
        reportingManager: formData.reportingManager,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }

    setIsSaving(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await ProfileService.changePassword(user.id, formData.currentPassword, formData.newPassword)

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      })
    }

    setIsSaving(false)
  }

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Generate credentials via microservice
      const credentials = await MicroservicesService.generateCredentials({
        ...newStaffData,
        invitedBy: user.name,
        merchantId: user.id,
      })

      // Generate invite token
      const inviteToken = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const inviteLink = `${window.location.origin}/invite/${inviteToken}`

      // Add to staff list
      const newStaff = {
        id: staffMembers.length + 1,
        ...newStaffData,
        status: "Pending",
        inviteLink,
      }

      setStaffMembers([...staffMembers, newStaff])
      setNewStaffData({ name: "", email: "", role: "CASHIER" })

      toast({
        title: "Staff member invited",
        description: `Invitation sent to ${newStaffData.email}`,
      })
    } catch (error) {
      toast({
        title: "Invitation failed",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    }

    setIsSaving(false)
  }

  const handleCopyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "Invite link copied to clipboard.",
    })
  }

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)

    try {
      await ProfileService.updatePreferences(user.id, newPreferences)
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update preferences.",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      PARENT_ADMIN: "bg-purple-600 hover:bg-purple-700",
      SUB_ADMIN: "bg-blue-600 hover:bg-blue-700",
      DEVELOPER: "bg-green-600 hover:bg-green-700",
      SUPPORT: "bg-yellow-600 hover:bg-yellow-700",
      REFUND_MANAGER: "bg-orange-600 hover:bg-orange-700",
      VIEWER: "bg-gray-600 hover:bg-gray-700",
      STAFF: "bg-indigo-600 hover:bg-indigo-700",
      MERCHANT: "bg-emerald-600 hover:bg-emerald-700",
      CASHIER: "bg-cyan-600 hover:bg-cyan-700",
      MANAGER: "bg-rose-600 hover:bg-rose-700",
    }
    return colors[role as keyof typeof colors] || "bg-slate-600 hover:bg-slate-700"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 bg-gradient-to-r from-blue-600 to-purple-600">
              <AvatarFallback className="text-white text-2xl font-bold">
                {user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-400 mt-1">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge className={getRoleBadgeColor(user?.role)}>{user?.role?.replace("_", " ")}</Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {user?.isInvited ? "Invited User" : "Direct User"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="basic" className="data-[state=active]:bg-slate-700">
            <User className="h-4 w-4 mr-2" />
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-slate-700">
            <Building className="h-4 w-4 mr-2" />
            Admin Details
          </TabsTrigger>
          {user?.role === "MERCHANT" && (
            <TabsTrigger value="staff" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              Staff Management
            </TabsTrigger>
          )}
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-700">
            <Bell className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <p className="text-slate-400 text-sm">Update your personal details and contact information</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      <Mail className="h-4 w-4 inline mr-2" />
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
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-slate-800/50 border-slate-700 text-white"
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-200">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="New York, USA"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-200">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State, ZIP"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Administrative Details</CardTitle>
              <p className="text-slate-400 text-sm">Manage your organizational information</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-slate-200">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                      placeholder="Engineering"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-slate-200">
                      Employee ID
                    </Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="EMP001"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate" className="text-slate-200">
                      Joining Date
                    </Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, joiningDate: e.target.value }))}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportingManager" className="text-slate-200">
                      Reporting Manager
                    </Label>
                    <Input
                      id="reportingManager"
                      value={formData.reportingManager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reportingManager: e.target.value }))}
                      placeholder="John Smith"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "MERCHANT" && (
          <TabsContent value="staff">
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Invite Staff Member</CardTitle>
                  <p className="text-slate-400 text-sm">Add new staff members to your merchant account</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteStaff} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffName" className="text-slate-200">
                          Full Name
                        </Label>
                        <Input
                          id="staffName"
                          value={newStaffData.name}
                          onChange={(e) => setNewStaffData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          className="bg-slate-800/50 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffEmail" className="text-slate-200">
                          Email Address
                        </Label>
                        <Input
                          id="staffEmail"
                          type="email"
                          value={newStaffData.email}
                          onChange={(e) => setNewStaffData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="bg-slate-800/50 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffRole" className="text-slate-200">
                          Role
                        </Label>
                        <Select
                          value={newStaffData.role}
                          onValueChange={(value) => setNewStaffData((prev) => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="CASHIER">Cashier</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {isSaving ? "Sending Invitation..." : "Invite Staff Member"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Staff Members</CardTitle>
                  <p className="text-slate-400 text-sm">Manage your team members and their access</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {staffMembers.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600">
                            <AvatarFallback className="text-white text-sm">
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{staff.name}</p>
                            <p className="text-slate-400 text-sm">{staff.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                          <Badge
                            variant={staff.status === "Active" ? "default" : "secondary"}
                            className={staff.status === "Active" ? "bg-green-600" : "bg-yellow-600"}
                          >
                            {staff.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyInviteLink(staff.inviteLink)}
                            className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="security">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <p className="text-slate-400 text-sm">Manage your password and security preferences</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-slate-200">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        onPaste={(e) => e.preventDefault()}
                        className="bg-slate-800/50 border-slate-700 text-white pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-200">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        onPaste={(e) => e.preventDefault()}
                        className="bg-slate-800/50 border-slate-700 text-white pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      onPaste={(e) => e.preventDefault()}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSaving ? "Changing Password..." : "Change Password"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200 font-medium">Two-Factor Authentication</Label>
                    <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={preferences.twoFactorEnabled}
                    onCheckedChange={(value) => handlePreferenceChange("twoFactorEnabled", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <p className="text-slate-400 text-sm">Choose how you want to receive notifications</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200 font-medium">Email Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("emailNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200 font-medium">SMS Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("smsNotifications", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
