"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User, Settings, LogOut, ChevronDown, Shield } from "lucide-react"
import { AuthService } from "@/services/auth.service"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await AuthService.logout()
    router.push("/auth/login")
  }

  const handleProfileClick = () => {
    router.push("/dashboard/profile")
  }

  const handleSettingsClick = () => {
    router.push("/dashboard/settings")
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
    }
    return colors[role as keyof typeof colors] || "bg-slate-600 hover:bg-slate-700"
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" />
        <div className="hidden md:block">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Welcome back, {user?.name?.split(" ")[0] || "User"}</h2>
              <Badge className={`${getRoleBadgeColor(user?.role)} text-xs`}>
                {user?.role?.replace("_", " ") || "USER"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-3 text-slate-200 hover:text-white hover:bg-slate-800"
            >
              <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <AvatarFallback className="text-white text-sm font-medium">
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-slate-800 border-slate-700">
            <DropdownMenuLabel className="text-slate-200">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
                <Badge className={`${getRoleBadgeColor(user?.role)} text-xs w-fit`}>
                  {user?.role?.replace("_", " ") || "USER"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem onClick={handleProfileClick} className="text-slate-200 hover:bg-slate-700 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {AuthService.hasPermission(user?.role, "manage_settings") && (
              <DropdownMenuItem
                onClick={handleSettingsClick}
                className="text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:bg-slate-700 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
