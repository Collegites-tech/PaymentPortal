"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const mockTickets = [
  { id: "1", subject: "Payment issue", status: "open", createdAt: "2025-07-27" },
  { id: "2", subject: "Login problem", status: "closed", createdAt: "2025-07-25" },
]

export default function SupportIndex() {
  const router = useRouter()
  const [tickets, setTickets] = useState(mockTickets)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
      {tickets.map(ticket => (
        <Card key={ticket.id} onClick={() => router.push(`/Roles/Merchant/Support/${ticket.id}`)} className="hover:bg-slate-800 cursor-pointer">
          <CardHeader>
            <CardTitle className="text-white">{ticket.subject}</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm">
            {ticket.status} • {ticket.createdAt}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
