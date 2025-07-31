"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AuthService } from "@/services/auth.service"

export default function APIKeysPage() {
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApiKey = async () => {
      const key = await AuthService.getMerchantApiKey()
      setApiKey(key)
    }
    fetchApiKey()
  }, [])

  const handleRegenerate = async () => {
    setLoading(true)
    const newKey = await AuthService.regenerateMerchantApiKey()
    setApiKey(newKey)
    setLoading(false)
    toast({ title: "API key regenerated." })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    toast({ title: "API key copied to clipboard." })
  }

  return (
    <Card className="bg-slate-900 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Merchant API Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="text" value={apiKey} readOnly className="text-white" />
        <div className="flex gap-3">
          <Button onClick={handleCopy} variant="outline">Copy</Button>
          <Button onClick={handleRegenerate} disabled={loading}>
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
