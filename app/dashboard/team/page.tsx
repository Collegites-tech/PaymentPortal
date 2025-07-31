"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Mail, Copy, Trash2, Edit, Shield, Users, Activity, Check, X } from "lucide-react"
import { AuthService } from "@/services/auth.service"

export default function TeamManagementPage() {
  const [user, setUser] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
    role: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      
      // Mock team members data
      const mockTeamMembers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@company.com",
          role: "DEVELOPER",
          status: "Active",
          lastActive: "2 hours ago",
          joined: "Jan 15, 2024",
          inviteLink: `${window.location.origin}/invite/sample123?role=DEVELOPER`
        },
        {
          id: 2,
          name: "Sarah Wilson",
          email: "sarah@company.com",
          role: "SUPPORT",
          status: "Active",
          lastActive: "1 day ago",
          joined: "Jan 10, 2024",
          inviteLink: `${window.location.origin}/invite/sample456?role=SUPPORT`
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike@company.com",
          role: "REFUND_MANAGER",
          status: "Pending",
          lastActive: "Never",
          joined: "Jan 20, 2024",
          inviteLink: `${window.location.origin}/invite/sample789?role=REFUND_MANAGER`
        }
      ]
      
      setTeamMembers(mockTeamMembers)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const availableRoles = [
    { value: 'SUB_ADMIN', label: 'Sub Administrator' },
    { value: 'DEVELOPER', label: 'Developer' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'REFUND_MANAGER', label: 'Refund Manager' },
    { value: 'VIEWER', label: 'Viewer' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'MERCHANT', label: 'Merchant' }
  ]

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteData.name || !inviteData.email || !inviteData.role) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsInviting(true)

    try {
      // Generate invite token
      const inviteToken = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const inviteLink = `${window.location.origin}/invite/${inviteToken}?role=${inviteData.role}`

      // Here you would typically save the invite to your backend
      // For now, we'll simulate it
      const newMember = {
        id: Date.now(),
        ...inviteData,
        status: "Pending",
        lastActive: "Never",
        joined: new Date().toLocaleDateString(),
        inviteLink,
        invitedAt: new Date().toISOString(),
        invitedBy: user.name,
      }

      setTeamMembers([...teamMembers, newMember])
      setInviteData({ name: "", email: "", role: "" })

      // Copy invite link to clipboard
      await navigator.clipboard.writeText(inviteLink)

      toast({
        title: "Invitation sent",
        description: `Invite link copied to clipboard for ${inviteData.email}`,
      })
    } catch (error) {
      toast({
        title: "Invitation failed",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    }

    setIsInviting(false)
  }

  const handleCopyInviteLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast({
        title: "Link copied",
        description: "Invite link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const rolePermissions = [
    {
      permission: "Invite Users",
      parentAdmin: true,
      subAdmin: false,
      refundManager: false,
      viewer: false,
    },
    {
      permission: "Manage Team",
      parentAdmin: true,
      subAdmin: false,
      refundManager: false,
      viewer: false,
    },
    {
      permission: "View Reports",
      parentAdmin: true,
      subAdmin: true,
      refundManager: false,
      viewer: true,
    },
    {
      permission: "Process Refunds",
      parentAdmin: true,
      subAdmin: true,
      refundManager: true,
      viewer: false,
    },
    {
      permission: "Manage Settings",
      parentAdmin: true,
      subAdmin: false,
      refundManager: false,
      viewer: false,
    },
    {
      permission: "View Transactions",
      parentAdmin: true,
      subAdmin: true,
      refundManager: true,
      viewer: true,
    },
    {
      permission: "Create Payments",
      parentAdmin: true,
      subAdmin: true,
      refundManager: false,
      viewer: false,
    },
    {
      permission: "Manage Customers",
      parentAdmin: true,
      subAdmin: true,
      refundManager: false,
      viewer: false,
    },
    {
      permission: "View Payouts",
      parentAdmin: true,
      subAdmin: true,
      refundManager: false,
      viewer: false,
    },
  ]

  const auditLogs = [
    {
      id: 1,
      action: "User Invited",
      user: "Super Admin",
      target: "sarah@company.com",
      timestamp: "2024-01-15 10:30 AM",
      details: "Invited as Support role",
    },
    {
      id: 2,
      action: "Role Updated",
      user: "Super Admin",
      target: "john@company.com",
      timestamp: "2024-01-14 03:45 PM",
      details: "Changed from Staff to Developer",
    },
    {
      id: 3,
      action: "User Removed",
      user: "Super Admin",
      target: "old@company.com",
      timestamp: "2024-01-13 11:20 AM",
      details: "Access revoked",
    },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "DEVELOPER":
        return "bg-blue-600 hover:bg-blue-700"
      case "SUPPORT":
        return "bg-green-600 hover:bg-green-700"
      case "REFUND_MANAGER":
        return "bg-purple-600 hover:bg-purple-700"
      case "VIEWER":
        return "bg-gray-600 hover:bg-gray-700"
      case "SUB_ADMIN":
        return "bg-orange-600 hover:bg-orange-700"
      case "MERCHANT":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "STAFF":
        return "bg-indigo-600 hover:bg-indigo-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 hover:bg-green-700"
      case "Pending":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "Inactive":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
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
          <h1 className="text-4xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-2">Invite and manage team members with role-based access</p>
        </div>
      </div>

      {/* Invite New Member */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Invite Team Member
          </CardTitle>
          <p className="text-slate-400 text-sm">Add new team members with specific roles and permissions</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="role" className="text-slate-200">
                  Role
                </Label>
                <select
                  id="role"
                  value={inviteData.role}
                  onChange={(e) => setInviteData((prev) => ({ ...prev, role: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white w-full px-3 py-2 rounded"
                >
                  <option value="">Select a role</option>
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" disabled={isInviting} className="mt-4">
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="members" className="data-[state=active]:bg-slate-700">
            <Users className="h-4 w-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Role Permissions
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-slate-700">
            <Activity className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Team Members</CardTitle>
              <p className="text-slate-400 text-sm">
                {teamMembers.length} team members • Role-based access control active
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-400 border-b border-slate-800 pb-2">
                  <div>Member</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Last Active</div>
                  <div>Joined</div>
                  <div>Actions</div>
                </div>

                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-6 gap-4 items-center py-3 border-b border-slate-800 last:border-b-0"
                  >
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-slate-400 text-sm">{member.email}</p>
                    </div>
                    <div>
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                    </div>
                    <div>
                      <Badge className={getStatusBadgeColor(member.status)}>{member.status}</Badge>
                    </div>
                    <div className="text-slate-300 text-sm">{member.lastActive}</div>
                    <div className="text-slate-300 text-sm">{member.joined}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800" onClick={() => handleCopyInviteLink(member.inviteLink)}>
                        <Copy className="h-4 w-4 text-blue-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Role Permissions Matrix</CardTitle>
              <p className="text-slate-400 text-sm">Overview of what each role can and cannot do</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-slate-400 border-b border-slate-800 pb-2">
                  <div>Permission</div>
                  <div>Parent Admin</div>
                  <div>Sub Admin</div>
                  <div>Refund Manager</div>
                  <div>Viewer</div>
                </div>

                {rolePermissions.map((perm, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 items-center py-3 border-b border-slate-800 last:border-b-0"
                  >
                    <div className="text-white font-medium">{perm.permission}</div>
                    <div className="flex justify-center">
                      {perm.parentAdmin ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {perm.subAdmin ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {perm.refundManager ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {perm.viewer ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Audit Logs</CardTitle>
              <p className="text-slate-400 text-sm">Track all team management activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-slate-800 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{log.action}</p>
                        <span className="text-slate-400 text-sm">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">
                        <span className="text-blue-400">{log.user}</span> → {log.target}
                      </p>
                      <p className="text-slate-400 text-sm">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <InviteMemberModal open={false} onClose={() => {}} inviterRole={user?.role} /> */}
    </div>
  )
}