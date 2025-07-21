"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, RefreshCw } from "lucide-react"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const transactions = [
    {
      id: "TXN001",
      customer: "John Doe",
      email: "john@example.com",
      amount: "$299.00",
      status: "completed",
      method: "Credit Card",
      date: "2024-01-15",
      time: "10:30 AM",
    },
    {
      id: "TXN002",
      customer: "Jane Smith",
      email: "jane@example.com",
      amount: "$149.99",
      status: "pending",
      method: "PayPal",
      date: "2024-01-15",
      time: "09:45 AM",
    },
    {
      id: "TXN003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      amount: "$89.50",
      status: "completed",
      method: "Bank Transfer",
      date: "2024-01-14",
      time: "03:20 PM",
    },
    {
      id: "TXN004",
      customer: "Alice Brown",
      email: "alice@example.com",
      amount: "$199.99",
      status: "failed",
      method: "Credit Card",
      date: "2024-01-14",
      time: "11:15 AM",
    },
    {
      id: "TXN005",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      amount: "$75.00",
      status: "refunded",
      method: "Credit Card",
      date: "2024-01-13",
      time: "02:30 PM",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 hover:bg-green-700"
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "failed":
        return "bg-red-600 hover:bg-red-700"
      case "refunded":
        return "bg-blue-600 hover:bg-blue-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 mt-1">View and manage all payment transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <p className="text-slate-400 text-sm">{filteredTransactions.length} transactions found</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px] space-y-4">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium text-slate-400 border-b border-slate-800 pb-2">
                <div>Transaction ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Method</div>
                <div>Date & Time</div>
                <div>Actions</div>
              </div>

              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-7 gap-4 items-center py-3 border-b border-slate-800 last:border-b-0"
                >
                  <div>
                    <p className="text-white font-medium">{transaction.id}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.customer}</p>
                    <p className="text-slate-400 text-sm">{transaction.email}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.amount}</p>
                  </div>
                  <div>
                    <Badge className={getStatusBadgeColor(transaction.status)}>{transaction.status}</Badge>
                  </div>
                  <div className="text-slate-300 text-sm">{transaction.method}</div>
                  <div>
                    <p className="text-slate-300 text-sm">{transaction.date}</p>
                    <p className="text-slate-400 text-xs">{transaction.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </Button>
                    {transaction.status === "completed" && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                        <RefreshCw className="h-4 w-4 text-blue-400" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
