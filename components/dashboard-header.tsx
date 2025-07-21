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
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("hasChangedPassword")
    router.push("/login")
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "PARENT_ADMIN":
        return "bg-purple-600 hover:bg-purple-700"
      case "SUB_ADMIN":
        return "bg-blue-600 hover:bg-blue-700"
      case "DEVELOPER":
        return "bg-green-600 hover:bg-green-700"
      case "SUPPORT":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "REFUND_MANAGER":
        return "bg-orange-600 hover:bg-orange-700"
      case "VIEWER":
        return "bg-gray-600 hover:bg-gray-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-lg font-semibold text-white">Welcome back, {user?.name || "User"}</h2>
          <Badge className={getRoleBadgeColor(user?.role)}>{user?.role?.replace("_", " ") || "USER"}</Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-slate-200 hover:text-white">
              <Avatar className="h-8 w-8 bg-slate-700">
                <AvatarFallback className="text-white text-sm">
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{user?.name || "User"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
            <DropdownMenuLabel className="text-slate-200">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-red-400 hover:bg-slate-700 hover:text-red-300" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
