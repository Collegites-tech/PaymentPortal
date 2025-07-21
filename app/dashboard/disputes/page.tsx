"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, Search, Eye, MessageSquare, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([
    {
      id: "DIS001",
      transactionId: "TXN123456",
      customer: "John Doe",
      customerEmail: "john@example.com",
      amount: "$250.00",
      reason: "Product not received",
      status: "open",
      priority: "high",
      createdAt: "2024-01-15",
      lastUpdate: "2024-01-16",
      description: "Customer claims they never received the product they ordered.",
      evidence: ["receipt.pdf", "shipping_label.jpg"],
      responses: [
        {
          id: 1,
          author: "Support Team",
          message: "We have initiated an investigation into this dispute.",
          timestamp: "2024-01-15 10:30 AM",
          type: "internal",
        },
      ],
    },
    {
      id: "DIS002",
      transactionId: "TXN789012",
      customer: "Jane Smith",
      customerEmail: "jane@example.com",
      amount: "$89.99",
      reason: "Unauthorized transaction",
      status: "investigating",
      priority: "medium",
      createdAt: "2024-01-14",
      lastUpdate: "2024-01-15",
      description: "Customer reports they did not authorize this transaction.",
      evidence: ["bank_statement.pdf"],
      responses: [
        {
          id: 1,
          author: "Fraud Team",
          message: "Reviewing transaction details and customer verification.",
          timestamp: "2024-01-14 2:15 PM",
          type: "internal",
        },
      ],
    },
    {
      id: "DIS003",
      transactionId: "TXN345678",
      customer: "Bob Johnson",
      customerEmail: "bob@example.com",
      amount: "$150.00",
      reason: "Defective product",
      status: "resolved",
      priority: "low",
      createdAt: "2024-01-10",
      lastUpdate: "2024-01-12",
      description: "Product arrived damaged and unusable.",
      evidence: ["damage_photos.zip"],
      responses: [
        {
          id: 1,
          author: "Support Team",
          message: "Refund processed successfully.",
          timestamp: "2024-01-12 11:45 AM",
          type: "resolution",
        },
      ],
    },
  ])

  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [newResponse, setNewResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter
    const matchesPriority = priorityFilter === "all" || dispute.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-600 hover:bg-red-700"
      case "investigating":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "resolved":
        return "bg-green-600 hover:bg-green-700"
      case "closed":
        return "bg-gray-600 hover:bg-gray-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600 hover:bg-red-700"
      case "medium":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "low":
        return "bg-green-600 hover:bg-green-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !selectedDispute) return

    setIsLoading(true)

    const response = {
      id: selectedDispute.responses.length + 1,
      author: "Admin User",
      message: newResponse,
      timestamp: new Date().toLocaleString(),
      type: "internal",
    }

    const updatedDispute = {
      ...selectedDispute,
      responses: [...selectedDispute.responses, response],
      lastUpdate: new Date().toISOString().split("T")[0],
    }

    setSelectedDispute(updatedDispute)
    setDisputes(disputes.map((d) => (d.id === selectedDispute.id ? updatedDispute : d)))
    setNewResponse("")

    toast({
      title: "Response added",
      description: "Your response has been added to the dispute.",
    })

    setIsLoading(false)
  }

  const handleStatusChange = async (disputeId: string, newStatus: string) => {
    setIsLoading(true)

    const updatedDisputes = disputes.map((dispute) =>
      dispute.id === disputeId
        ? { ...dispute, status: newStatus, lastUpdate: new Date().toISOString().split("T")[0] }
        : dispute,
    )

    setDisputes(updatedDisputes)

    if (selectedDispute && selectedDispute.id === disputeId) {
      setSelectedDispute({ ...selectedDispute, status: newStatus })
    }

    toast({
      title: "Status updated",
      description: `Dispute status changed to ${newStatus}.`,
    })

    setIsLoading(false)
  }

  const disputeStats = {
    total: disputes.length,
    open: disputes.filter((d) => d.status === "open").length,
    investigating: disputes.filter((d) => d.status === "investigating").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dispute Management</h1>
          <p className="text-slate-400 mt-1">Handle customer disputes and chargebacks</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Disputes</p>
                <p className="text-2xl font-bold text-white">{disputeStats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Open</p>
                <p className="text-2xl font-bold text-red-400">{disputeStats.open}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Investigating</p>
                <p className="text-2xl font-bold text-yellow-400">{disputeStats.investigating}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{disputeStats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
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
                  placeholder="Search disputes..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Disputes ({filteredDisputes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-white font-medium">{dispute.id}</h3>
                    <Badge className={getStatusBadgeColor(dispute.status)}>{dispute.status}</Badge>
                    <Badge className={getPriorityBadgeColor(dispute.priority)}>{dispute.priority} priority</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={dispute.status} onValueChange={(value) => handleStatusChange(dispute.id, value)}>
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDispute(dispute)}
                          className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Dispute Details - {selectedDispute?.id}</DialogTitle>
                        </DialogHeader>
                        {selectedDispute && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-slate-200">Customer</Label>
                                <p className="text-white">{selectedDispute.customer}</p>
                                <p className="text-slate-400 text-sm">{selectedDispute.customerEmail}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Transaction</Label>
                                <p className="text-white">{selectedDispute.transactionId}</p>
                                <p className="text-slate-400 text-sm">Amount: {selectedDispute.amount}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Reason</Label>
                                <p className="text-white">{selectedDispute.reason}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-200">Created</Label>
                                <p className="text-white">{selectedDispute.createdAt}</p>
                                <p className="text-slate-400 text-sm">Last update: {selectedDispute.lastUpdate}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-200">Description</Label>
                              <p className="text-white bg-slate-800/50 p-3 rounded-lg">{selectedDispute.description}</p>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-200">Evidence Files</Label>
                              <div className="flex flex-wrap gap-2">
                                {selectedDispute.evidence.map((file: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-slate-800/50 p-2 rounded-lg"
                                  >
                                    <FileText className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-300 text-sm">{file}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-slate-200">Response History</Label>
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {selectedDispute.responses.map((response: any) => (
                                  <div key={response.id} className="bg-slate-800/50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-white font-medium">{response.author}</span>
                                      <span className="text-slate-400 text-sm">{response.timestamp}</span>
                                    </div>
                                    <p className="text-slate-300">{response.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-200">Add Response</Label>
                              <Textarea
                                value={newResponse}
                                onChange={(e) => setNewResponse(e.target.value)}
                                placeholder="Enter your response..."
                                className="bg-slate-800/50 border-slate-700 text-white"
                                rows={3}
                              />
                              <Button
                                onClick={handleAddResponse}
                                disabled={isLoading || !newResponse.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {isLoading ? "Adding..." : "Add Response"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Customer</p>
                    <p className="text-white">{dispute.customer}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="text-white">{dispute.amount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Reason</p>
                    <p className="text-white">{dispute.reason}</p>
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
