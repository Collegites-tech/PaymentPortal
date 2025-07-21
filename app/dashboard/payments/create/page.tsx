"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, QrCode, Link, CreditCard, DollarSign } from "lucide-react"
import { PaymentService } from "@/services/payment.service"
import { useToast } from "@/hooks/use-toast"

export default function CreatePaymentPage() {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "USD",
    description: "",
    customerEmail: "",
    customerName: "",
    type: "one_time", // one_time, recurring
    redirectUrl: "",
  })
  const [generatedPayment, setGeneratedPayment] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const result = await PaymentService.createPayment(paymentData)
      setGeneratedPayment(result)
      toast({
        title: "Payment created successfully",
        description: "Your payment link and QR code have been generated.",
      })
    } catch (error) {
      toast({
        title: "Payment creation failed",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      })
    }

    setIsGenerating(false)
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Create Payment</h1>
          <p className="text-slate-400 mt-2">Generate payment links, QR codes, and website buttons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Payment Form */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </CardTitle>
            <p className="text-slate-400 text-sm">Configure your payment parameters</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-200">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="100.00"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-200">
                    Currency
                  </Label>
                  <Select
                    value={paymentData.currency}
                    onValueChange={(value) => setPaymentData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={paymentData.description}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Payment for services..."
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-slate-200">
                    Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    value={paymentData.customerName}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Doe"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail" className="text-slate-200">
                    Customer Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={paymentData.customerEmail}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="john@example.com"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirectUrl" className="text-slate-200">
                  Success Redirect URL (Optional)
                </Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  value={paymentData.redirectUrl}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, redirectUrl: e.target.value }))}
                  placeholder="https://yoursite.com/success"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? "Creating Payment..." : "Create Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Payment */}
        {generatedPayment && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Generated Payment</CardTitle>
              <p className="text-slate-400 text-sm">Your payment has been created successfully</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="link" className="space-y-4">
                <TabsList className="bg-slate-800 border-slate-700 w-full">
                  <TabsTrigger value="link" className="data-[state=active]:bg-slate-700 flex-1">
                    <Link className="h-4 w-4 mr-2" />
                    Payment Link
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="data-[state=active]:bg-slate-700 flex-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Payment Link</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={generatedPayment.paymentUrl}
                        readOnly
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                      <Button
                        onClick={() => handleCopy(generatedPayment.paymentUrl, "Payment link")}
                        variant="outline"
                        className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Payment ID:</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {generatedPayment.id}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Amount:</span>
                      <span className="text-white font-medium">
                        {paymentData.currency} {paymentData.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Status:</span>
                      <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="space-y-4">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-slate-900 text-sm">
                        QR Code for
                        <br />
                        {paymentData.currency} {paymentData.amount}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">Scan this QR code to make the payment</p>
                    <Button
                      onClick={() => handleCopy(generatedPayment.paymentUrl, "QR code link")}
                      variant="outline"
                      className="mt-4 border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy QR Link
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
