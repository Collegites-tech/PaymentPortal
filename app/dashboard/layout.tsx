"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PasswordChangeModal } from "@/components/modals/password-change-modal"
import { OptionalPasswordChangeModal } from "@/components/modals/optional-password-change-modal"
import { AuthService } from "@/services/auth.service"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showOptionalPasswordModal, setShowOptionalPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser()

      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)

      // Check if user needs to change password (mandatory for invited users)
      if (currentUser.isInvited && !currentUser.hasChangedPassword) {
        setShowPasswordModal(true)
      }
      // Show optional password change for users who haven't changed their temporary password
      else if (currentUser.isInvited && currentUser.hasChangedPassword === undefined) {
        // Show optional modal after a short delay
        setTimeout(() => {
          setShowOptionalPasswordModal(true)
        }, 2000)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-950 flex w-full">
        <DashboardSidebar user={user} />
        <SidebarInset className="flex-1">
          <DashboardHeader user={user} />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>

      <PasswordChangeModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

      <OptionalPasswordChangeModal
        open={showOptionalPasswordModal}
        onClose={() => setShowOptionalPasswordModal(false)}
      />
    </SidebarProvider>
  )
}
