"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProfileService } from "@/services/profile.service"
import { AuthService } from "@/services/auth.service"

interface OptionalPasswordChangeModalProps {
  open: boolean
  onClose: () => void
}

export function OptionalPasswordChangeModal({ open, onClose }: OptionalPasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: [
        ...(password.length < minLength ? [`At least ${minLength} characters`] : []),
        ...(!hasUpperCase ? ["One uppercase letter"] : []),
        ...(!hasLowerCase ? ["One lowercase letter"] : []),
        ...(!hasNumbers ? ["One number"] : []),
        ...(!hasSpecialChar ? ["One special character"] : []),
      ],
    }
  }

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

    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      toast({
        title: "Weak password",
        description: `Password must include: ${validation.errors.join(", ")}`,
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
          description: "Your password has been changed successfully.",
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

  const handleSkip = () => {
    onClose()
    toast({
      title: "Password change skipped",
      description: "You can change your password later from your profile settings.",
    })
  }

  const passwordValidation = validatePassword(newPassword)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Strengthen Your Security</DialogTitle>
                <p className="text-slate-400 text-sm">Consider changing your temporary password</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm font-medium">Optional Security Enhancement</p>
          <p className="text-blue-300/80 text-xs mt-1">
            You can change your password now or skip and do it later from your profile.
          </p>
        </div>

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
                placeholder="Enter your current password"
                className="bg-slate-800/50 border-slate-700 text-white pr-12"
                required
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
                placeholder="Create a strong password"
                className="bg-slate-800/50 border-slate-700 text-white pr-12"
                required
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
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordValidation.isValid ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className={`text-xs ${passwordValidation.isValid ? "text-green-400" : "text-red-400"}`}>
                    {passwordValidation.isValid ? "Strong password" : "Weak password"}
                  </span>
                </div>
                {!passwordValidation.isValid && (
                  <ul className="text-xs text-slate-400 ml-4 space-y-1">
                    {passwordValidation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
                placeholder="Confirm your new password"
                className="bg-slate-800/50 border-slate-700 text-white pr-12"
                required
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
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium"
              disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
