"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InviteMemberModal } from "@/components/invite-member-modal"
import { UserPlus, Edit, Trash2, Check, X, Shield, Users, Activity } from "lucide-react"

export default function TeamManagementPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const teamMembers = [
    {
      id: 1,
      name: "John Developer",
      email: "john@company.com",
      role: "DEVELOPER",
      status: "Active",
      lastActive: "2 hours ago",
      joined: "2024-01-10",
    },
    {
      id: 2,
      name: "Sarah Support",
      email: "sarah@company.com",
      role: "SUPPORT",
      status: "Pending",
      lastActive: "Never",
      joined: "Pending",
    },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Manage team members and their access permissions</p>
        </div>
        {user?.role === "PARENT_ADMIN" && (
          <Button onClick={() => setShowInviteModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

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

      <InviteMemberModal open={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  )
}
