"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProfileService } from "@/services/profile.service"
import { AuthService } from "@/services/auth.service"

interface PasswordChangeModalProps {
  open: boolean
  onClose: () => void
}

export function PasswordChangeModal({ open, onClose }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const user = await AuthService.getCurrentUser()
      if (user) {
        await ProfileService.changePassword(user.id, currentPassword, newPassword)
        AuthService.markPasswordChanged()

        toast({
          title: "Password updated successfully",
          description: "Your password has been changed.",
        })

        onClose()
      }
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div>
              <DialogTitle className="text-xl font-bold">Change Password (Optional)</DialogTitle>
              <p className="text-slate-400 text-sm">You may skip this step and continue using your current password.</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-slate-200 font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
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
            <Label htmlFor="newPassword" className="text-slate-200 font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
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
            <Label htmlFor="confirmPassword" className="text-slate-200 font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-slate-800/50 border-slate-700 text-white pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={onClose}
            >
              Skip
            </Button>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium py-3"
              disabled={isLoading || newPassword !== confirmPassword || !newPassword || !confirmPassword}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
