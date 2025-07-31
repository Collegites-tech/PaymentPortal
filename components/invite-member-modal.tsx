"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Copy, X, Mail } from "lucide-react"

interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  inviterRole: string
}

export function InviteMemberModal({
  open,
  onClose,
  inviterRole,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [expiry, setExpiry] = useState("7")
  const [ipLock, setIpLock] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  // Generate invite link dynamically with role
  const handleGenerateInvite = async () => {
    if (!email || !role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const token = Math.random().toString(36).substring(2, 10) // shorter random string
    // ✅ include role dynamically in link
    const generatedLink = `${window.location.origin}/invite/${token}?role=${role.toUpperCase()}`
    setInviteLink(generatedLink)

    toast({
      title: "Invite link generated",
      description: `The invitation link for ${role} has been created successfully.`,
    })

    setIsGenerating(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Link copied",
      description: "Invite link has been copied to clipboard.",
    })
  }

  const handleSendEmail = async () => {
    if (!email || !inviteLink) {
      toast({
        title: "Missing details",
        description: "Please generate an invite link first.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // ✅ send invite with role info
      await fetch("/api/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inviteLink, role }),
      })

      toast({
        title: "Email sent",
        description: `Invitation sent to ${email} for role ${role}`,
      })
    } catch (err) {
      toast({
        title: "Failed to send",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      })
    }

    setIsSending(false)
  }

  const handleClose = () => {
    setEmail("")
    setRole("")
    setExpiry("7")
    setIpLock(false)
    setInviteLink("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Invite Team Member</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-slate-400 text-sm">
            Send an invitation to add a new team member with restricted permissions
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@company.com"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-200">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select role (no invite permissions)" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="SUB_ADMIN">Sub Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="REFUND_MANAGER">Refund Manager</SelectItem>
                <SelectItem value="MERCHANT">Merchant</SelectItem>
                <SelectItem value="DEVELOPER">Developer</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-slate-400 text-xs">Note: Invited users cannot invite other members</p>
          </div>

          {/* Expiry + IP Lock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-slate-200">
                Invite Expiry
              </Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">IP Lock</Label>
              <div className="flex items-center justify-center h-10">
                <Switch checked={ipLock} onCheckedChange={setIpLock} />
              </div>
            </div>
          </div>

          {/* Invite Link + Actions */}
          {inviteLink ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200">Invite Link</Label>
                <div className="flex space-x-2">
                  <Input value={inviteLink} readOnly className="bg-slate-800 border-slate-700 text-white" />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={isSending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSending ? "Sending..." : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite via Email
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? "Generating..." : "Generate Invite Link"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
