"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, Search, Download, Eye, Plus, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState([
    {
      id: "PO001",
      amount: "$2,450.00",
      currency: "USD",
      status: "completed",
      method: "bank_transfer",
      recipient: "John's Electronics Store",
      accountNumber: "****1234",
      scheduledDate: "2024-01-15",
      completedDate: "2024-01-15",
      transactionCount: 45,
      fees: "$12.25",
      netAmount: "$2,437.75",
      reference: "REF123456",
    },
    {
      id: "PO002",
      amount: "$1,890.50",
      currency: "USD",
      status: "pending",
      method: "bank_transfer",
      recipient: "Sarah's Boutique",
      accountNumber: "****5678",
      scheduledDate: "2024-01-16",
      completedDate: null,
      transactionCount: 32,
      fees: "$9.45",
      netAmount: "$1,881.05",
      reference: "REF789012",
    },
    {
      id: "PO003",
      amount: "$3,200.00",
      currency: "USD",
      status: "processing",
      method: "instant_transfer",
      recipient: "Tech Solutions Inc",
      accountNumber: "****9012",
      scheduledDate: "2024-01-16",
      completedDate: null,
      transactionCount: 67,
      fees: "$32.00",
      netAmount: "$3,168.00",
      reference: "REF345678",
    },
  ])

  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Manual payout form
  const [manualPayoutData, setManualPayoutData] = useState({
    recipient: "",
    amount: "",
    currency: "USD",
    method: "bank_transfer",
    accountNumber: "",
    routingNumber: "",
    reference: "",
  })

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 hover:bg-green-700"
      case "processing":
        return "bg-blue-600 hover:bg-blue-700"
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "failed":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "bg-blue-600 hover:bg-blue-700"
      case "instant_transfer":
        return "bg-purple-600 hover:bg-purple-700"
      case "check":
        return "bg-gray-600 hover:bg-gray-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const handleCreateManualPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const newPayout = {
      id: `PO${String(payouts.length + 1).padStart(3, "0")}`,
      amount: `$${Number.parseFloat(manualPayoutData.amount).toFixed(2)}`,
      currency: manualPayoutData.currency,
      status: "pending",
      method: manualPayoutData.method,
      recipient: manualPayoutData.recipient,
      accountNumber: `****${manualPayoutData.accountNumber.slice(-4)}`,
      scheduledDate: new Date().toISOString().split("T")[0],
      completedDate: null,
      transactionCount: 0,
      fees: `$${(Number.parseFloat(manualPayoutData.amount) * 0.005).toFixed(2)}`,
      netAmount: `$${(Number.parseFloat(manualPayoutData.amount) * 0.995).toFixed(2)}`,
      reference: manualPayoutData.reference || `REF${Date.now()}`,
    }

    setPayouts([newPayout, ...payouts])
    setManualPayoutData({
      recipient: "",
      amount: "",
      currency: "USD",
      method: "bank_transfer",
      accountNumber: "",
      routingNumber: "",
      reference: "",
    })

    toast({
      title: "Payout created",
      description: "Manual payout has been scheduled successfully.",
    })

    setIsLoading(false)
  }

  const handleRetryPayout = async (payoutId: string) => {
    setIsLoading(true)

    const updatedPayouts = payouts.map((payout) =>
      payout.id === payoutId ? { ...payout, status: "processing" } : payout,
    )

    setPayouts(updatedPayouts)

    toast({
      title: "Payout retried",
      description: "Payout has been queued for retry.",
    })

    setIsLoading(false)
  }

  const payoutStats = {
    totalAmount: payouts.reduce(
      (sum, payout) => sum + Number.parseFloat(payout.amount.replace("$", "").replace(",", "")),
      0,
    ),
    completed: payouts.filter((p) => p.status === "completed").length,
    pending: payouts.filter((p) => p.status === "pending").length,
    processing: payouts.filter((p) => p.status === "processing").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payout Management</h1>
          <p className="text-slate-400 mt-1">Manage merchant payouts and transfers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Manual Payout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create Manual Payout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateManualPayout} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-slate-200">
                  Recipient Name
                </Label>
                <Input
                  id="recipient"
                  value={manualPayoutData.recipient}
                  onChange={(e) => setManualPayoutData((prev) => ({ ...prev, recipient: e.target.value }))}
                  placeholder="Business or individual name"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-200">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={manualPayoutData.amount}
                    onChange={(e) => setManualPayoutData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-200">
                    Currency
                  </Label>
                  <Select
                    value={manualPayoutData.currency}
                    onValueChange={(value) => setManualPayoutData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="method" className="text-slate-200">
                  Transfer Method
                </Label>
                <Select
                  value={manualPayoutData.method}
                  onValueChange={(value) => setManualPayoutData((prev) => ({ ...prev, method: value }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="instant_transfer">Instant Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-slate-200">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  value={manualPayoutData.accountNumber}
                  onChange={(e) => setManualPayoutData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Account number"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber" className="text-slate-200">
                  Routing Number
                </Label>
                <Input
                  id="routingNumber"
                  value={manualPayoutData.routingNumber}
                  onChange={(e) => setManualPayoutData((prev) => ({ ...prev, routingNumber: e.target.value }))}
                  placeholder="Routing number"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-slate-200">
                  Reference (Optional)
                </Label>
                <Input
                  id="reference"
                  value={manualPayoutData.reference}
                  onChange={(e) => setManualPayoutData((prev) => ({ ...prev, reference: e.target.value }))}
                  placeholder="Internal reference"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                {isLoading ? "Creating..." : "Create Payout"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Payouts</p>
                <p className="text-2xl font-bold text-white">${payoutStats.totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{payoutStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-blue-400">{payoutStats.processing}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{payoutStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search payouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payouts List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Payouts ({filteredPayouts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayouts.map((payout) => (
              <div
                key={payout.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-white font-medium">{payout.id}</h3>
                    <Badge className={getStatusBadgeColor(payout.status)}>{payout.status}</Badge>
                    <Badge className={getMethodBadgeColor(payout.method)}>{payout.method.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {payout.status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetryPayout(payout.id)}
                        className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                      >
                        Retry
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPayout(payout)}
                          className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Payout Details - {selectedPayout?.id}</DialogTitle>
                        </DialogHeader>
                        {selectedPayout && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-slate-200">Recipient</Label>
                                <p className="text-white">{selectedPayout.recipient}</p>
                                <p className="text-slate-400 text-sm">Account: {selectedPayout.accountNumber}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Amount</Label>
                                <p className="text-white text-2xl font-bold">{selectedPayout.amount}</p>
                                <p className="text-slate-400 text-sm">
                                  Net: {selectedPayout.netAmount} (Fees: {selectedPayout.fees})
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Status</Label>
                                <Badge className={getStatusBadgeColor(selectedPayout.status)}>
                                  {selectedPayout.status}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Method</Label>
                                <Badge className={getMethodBadgeColor(selectedPayout.method)}>
                                  {selectedPayout.method.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Scheduled Date</Label>
                                <p className="text-white">{selectedPayout.scheduledDate}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Completed Date</Label>
                                <p className="text-white">{selectedPayout.completedDate || "Not completed"}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Transaction Count</Label>
                                <p className="text-white">{selectedPayout.transactionCount}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Reference</Label>
                                <p className="text-white">{selectedPayout.reference}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Recipient</p>
                    <p className="text-white">{payout.recipient}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="text-white font-medium">{payout.amount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Scheduled</p>
                    <p className="text-white">{payout.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Transactions</p>
                    <p className="text-white">{payout.transactionCount}</p>
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
