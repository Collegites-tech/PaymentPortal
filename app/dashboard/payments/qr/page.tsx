"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Copy, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QRGenerationPage() {
  const [qrCodes, setQrCodes] = useState([
    {
      id: "QR001",
      name: "Store Counter Payment",
      amount: "$25.00",
      currency: "USD",
      description: "Quick payment for store purchases",
      createdAt: "2024-01-15",
      scans: 45,
      payments: 12,
      status: "active",
    },
    {
      id: "QR002",
      name: "Table Service",
      amount: "Variable",
      currency: "USD",
      description: "Restaurant table payment",
      createdAt: "2024-01-14",
      scans: 23,
      payments: 8,
      status: "active",
    },
  ])

  const [newQRData, setNewQRData] = useState({
    name: "",
    amount: "",
    currency: "USD",
    description: "",
    type: "fixed", // fixed or variable
    redirectUrl: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate QR generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newQR = {
      id: `QR${String(qrCodes.length + 1).padStart(3, "0")}`,
      name: newQRData.name,
      amount: newQRData.type === "fixed" ? `$${Number.parseFloat(newQRData.amount).toFixed(2)}` : "Variable",
      currency: newQRData.currency,
      description: newQRData.description,
      createdAt: new Date().toISOString().split("T")[0],
      scans: 0,
      payments: 0,
      status: "active",
    }

    setQrCodes([newQR, ...qrCodes])
    setNewQRData({
      name: "",
      amount: "",
      currency: "USD",
      description: "",
      type: "fixed",
      redirectUrl: "",
    })

    toast({
      title: "QR Code generated",
      description: "Your QR code has been created successfully.",
    })

    setIsGenerating(false)
  }

  const handleDownloadQR = (qrId: string) => {
    toast({
      title: "QR Code downloaded",
      description: "QR code image has been downloaded.",
    })
  }

  const handleCopyQRLink = (qrId: string) => {
    const link = `https://payflow.com/qr/${qrId}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "QR code link copied to clipboard.",
    })
  }

  const handleDeleteQR = (qrId: string) => {
    setQrCodes(qrCodes.filter((qr) => qr.id !== qrId))
    toast({
      title: "QR Code deleted",
      description: "QR code has been removed.",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600 hover:bg-green-700"
      case "inactive":
        return "bg-gray-600 hover:bg-gray-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">QR Code Generator</h1>
          <p className="text-slate-400 mt-2">Create and manage payment QR codes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* QR Generation Form */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Generate New QR Code
            </CardTitle>
            <p className="text-slate-400 text-sm">Create a new payment QR code</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateQR} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  QR Code Name
                </Label>
                <Input
                  id="name"
                  value={newQRData.name}
                  onChange={(e) => setNewQRData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Store Counter Payment"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Payment Type</Label>
                <Select
                  value={newQRData.type}
                  onValueChange={(value) => setNewQRData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="variable">Variable Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newQRData.type === "fixed" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-200">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newQRData.amount}
                      onChange={(e) => setNewQRData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="25.00"
                      className="bg-slate-800/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-slate-200">
                      Currency
                    </Label>
                    <Select
                      value={newQRData.currency}
                      onValueChange={(value) => setNewQRData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newQRData.description}
                  onChange={(e) => setNewQRData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Payment for services..."
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirectUrl" className="text-slate-200">
                  Success Redirect URL (Optional)
                </Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  value={newQRData.redirectUrl}
                  onChange={(e) => setNewQRData((prev) => ({ ...prev, redirectUrl: e.target.value }))}
                  placeholder="https://yoursite.com/success"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? "Generating QR Code..." : "Generate QR Code"}
                <QrCode className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* QR Preview */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">QR Code Preview</CardTitle>
            <p className="text-slate-400 text-sm">Preview of your generated QR code</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
              <div className="text-slate-900 text-center">
                <QrCode className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">QR Code Preview</p>
                <p className="text-xs">{newQRData.name || "Sample QR Code"}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">{newQRData.name || "QR Code Name"}</p>
              <p className="text-slate-400 text-sm">
                {newQRData.type === "fixed" && newQRData.amount
                  ? `${newQRData.currency} ${newQRData.amount}`
                  : "Variable Amount"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated QR Codes */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Generated QR Codes</CardTitle>
          <p className="text-slate-400 text-sm">Manage your existing QR codes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <QrCode className="h-6 w-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{qr.name}</h3>
                      <p className="text-slate-400 text-sm">{qr.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadgeColor(qr.status)}>{qr.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadQR(qr.id)}
                      className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyQRLink(qr.id)}
                      className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteQR(qr.id)}
                      className="border-slate-700 text-red-400 hover:bg-slate-800 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="text-white font-medium">{qr.amount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Scans</p>
                    <p className="text-white">{qr.scans}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Payments</p>
                    <p className="text-white">{qr.payments}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Created</p>
                    <p className="text-white">{qr.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
