"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      totalSpent: "$1,299.00",
      transactions: 8,
      status: "Active",
      joinDate: "2024-01-10",
      lastPurchase: "2 days ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, USA",
      totalSpent: "$849.99",
      transactions: 5,
      status: "Active",
      joinDate: "2024-01-08",
      lastPurchase: "1 week ago",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 (555) 456-7890",
      location: "Chicago, USA",
      totalSpent: "$2,150.50",
      transactions: 12,
      status: "VIP",
      joinDate: "2023-12-15",
      lastPurchase: "3 days ago",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1 (555) 321-0987",
      location: "Miami, USA",
      totalSpent: "$399.99",
      transactions: 3,
      status: "New",
      joinDate: "2024-01-12",
      lastPurchase: "5 days ago",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-600 hover:bg-purple-700"
      case "Active":
        return "bg-green-600 hover:bg-green-700"
      case "New":
        return "bg-blue-600 hover:bg-blue-700"
      case "Inactive":
        return "bg-gray-600 hover:bg-gray-700"
      default:
        return "bg-slate-600 hover:bg-slate-700"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Manage customer profiles and payment history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">1,234</div>
            <p className="text-slate-400 text-sm">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">89</div>
            <p className="text-slate-400 text-sm">New This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">$1,250</div>
            <p className="text-slate-400 text-sm">Avg. Order Value</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">92%</div>
            <p className="text-slate-400 text-sm">Retention Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 bg-slate-700">
                    <AvatarFallback className="text-white">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white text-lg">{customer.name}</CardTitle>
                    <Badge className={getStatusBadgeColor(customer.status)}>{customer.status}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                  <Eye className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-300">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  {customer.location}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  Joined {customer.joinDate}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{customer.totalSpent}</div>
                    <div className="text-xs text-slate-400">Total Spent</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{customer.transactions}</div>
                    <div className="text-xs text-slate-400">Transactions</div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm text-slate-300">Last purchase: {customer.lastPurchase}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
