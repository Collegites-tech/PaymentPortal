import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RoleService } from "@/services/role.service"
import { Badge } from "@/components/ui/badge"

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void
  selectedRole?: string
}

export function RoleSelector({ onRoleSelect, selectedRole }: RoleSelectorProps) {
  const [roles, setRoles] = useState<any[]>([])

  useEffect(() => {
    const loadRoles = async () => {
      const availableRoles = await RoleService.getAvailableRoles()
      setRoles(availableRoles)
    }
    loadRoles()
  }, [])

  return (
    <div className="space-y-2">
      <Label className="text-slate-200">Select Role</Label>
      <Select value={selectedRole} onValueChange={onRoleSelect}>
        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
          <SelectValue placeholder="Choose a role..." />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex items-center space-x-2">
                <Badge className={RoleService.getRoleBadgeColor(role.value)}>
                  {role.label}
                </Badge>
                <div className="text-sm text-slate-400">{role.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}