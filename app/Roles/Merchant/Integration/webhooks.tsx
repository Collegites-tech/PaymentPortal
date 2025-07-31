"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { merchantService } from "@/services/merchant.service"

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [newUrl, setNewUrl] = useState("")

  useEffect(() => {
    merchantService.getMerchantWebhooks().then(setWebhooks)
  }, [])

  const handleAddWebhook = async () => {
    const updated = await merchantService.addMerchantWebhook(newUrl)
    setWebhooks(updated)
    setNewUrl("")
    toast({ title: "Webhook added." })
  }

  const handleDeleteWebhook = async (id: string) => {
    const updated = await merchantService.deleteMerchantWebhook(id)
    setWebhooks(updated)
    toast({ title: "Webhook removed." })
  }

  return (
    <Card className="bg-slate-900 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Manage Webhooks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://yourdomain.com/webhook" />
          <Button onClick={handleAddWebhook}>Add</Button>
        </div>

        {webhooks.length === 0 ? (
          <p className="text-slate-400">No webhooks configured.</p>
        ) : (
          <ul className="space-y-2">
            {webhooks.map((webhook) => (
              <li key={webhook.id} className="flex justify-between items-center bg-slate-800 px-4 py-2 rounded-md">
                <span className="text-white">{webhook.url}</span>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
