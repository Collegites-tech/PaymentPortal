"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Shield, Users, Settings } from "lucide-react"
import { RoleService } from "@/services/role.service"
import { AuthService } from "@/services/auth.service"
import { useToast } from "@/hooks/use-toast"

export default function RolesPage() {
  const [user, setUser] = useState<any>(null)
  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isCustom: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) return

      setUser(currentUser)
      const [rolesData, permissionsData] = await Promise.all([
        RoleService.getAllRoles(),
        RoleService.getAllPermissions(),
      ])

      setRoles(rolesData)
      setPermissions(permissionsData)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const createdRole = await RoleService.createRole(newRole)
      setRoles((prev) => [...prev, createdRole])
      setShowCreateModal(false)
      setNewRole({ name: "", description: "", permissions: [], isCustom: true })

      toast({
        title: "Role created",
        description: "New role has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (roleId: string, updates: any) => {
    try {
      const updatedRole = await RoleService.updateRole(roleId, updates)
      setRoles((prev) => prev.map((role) => (role.id === roleId ? updatedRole : role)))

      toast({
        title: "Role updated",
        description: "Role has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await RoleService.deleteRole(roleId)
      setRoles((prev) => prev.filter((role) => role.id !== roleId))

      toast({
        title: "Role deleted",
        description: "Role has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const togglePermission = (permission: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const getRoleBadgeColor = (role: any) => {
    if (!role.isCustom) return "bg-purple-600 hover:bg-purple-700"
    return "bg-blue-600 hover:bg-blue-700"
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
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Role Management</h1>
          <p className="text-slate-400 mt-2">Create and manage custom roles with specific permissions</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName" className="text-slate-200">
                    Role Name *
                  </Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Account Manager"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Role Type</Label>
                  <Badge className="bg-blue-600">Custom Role</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-slate-200">
                  Description *
                </Label>
                <Textarea
                  id="roleDescription"
                  value={newRole.description}
                  onChange={(e) => setNewRole((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role and its responsibilities..."
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-slate-200">Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium text-sm">{permission.name}</p>
                        <p className="text-slate-400 text-xs">{permission.description}</p>
                      </div>
                      <Switch
                        checked={newRole.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRole}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="roles" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-slate-700">
            <Settings className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-slate-700">
            <Users className="h-4 w-4 mr-2" />
            Role Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{role.name}</CardTitle>
                      <Badge className={getRoleBadgeColor(role)}>{role.isCustom ? "Custom" : "System"}</Badge>
                    </div>
                    {role.isCustom && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRole(role)}
                          className="h-8 w-8 p-0 hover:bg-slate-800"
                        >
                          <Edit className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRole(role.id)}
                          className="h-8 w-8 p-0 hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Users Assigned</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {role.userCount || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Permissions</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {role.permissions?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Status</span>
                      <Badge className={role.isActive ? "bg-green-600" : "bg-red-600"}>
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Permission Matrix</CardTitle>
              <p className="text-slate-400 text-sm">Overview of all available permissions in the system</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{permission.name}</p>
                      <p className="text-slate-400 text-sm">{permission.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {permission.category}
                        </Badge>
                        <Badge className={permission.isCore ? "bg-purple-600" : "bg-blue-600"}>
                          {permission.isCore ? "Core" : "Extended"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-300 text-sm">Used in {permission.roleCount || 0} roles</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Role Assignments</CardTitle>
              <p className="text-slate-400 text-sm">Manage user role assignments and permissions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Role assignment management</p>
                  <p className="text-slate-500 text-sm">
                    This feature allows you to assign roles to users and manage their permissions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
