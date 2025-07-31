"use client"
import { useRouter } from "next/navigation"

const mockRequests = [
  { id: "a1", type: "Feature access", status: "pending" },
  { id: "a2", type: "Payout approval", status: "approved" },
]

export default function RequestsPage() {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Your Requests</h1>
      <ul className="space-y-2">
        {mockRequests.map((req) => (
          <li
            key={req.id}
            onClick={() => router.push(`/Roles/Merchant/Requests/${req.id}`)}
            className="p-4 bg-slate-800 rounded cursor-pointer hover:bg-slate-700 text-white"
          >
            {req.type} • <span className="text-slate-400">{req.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
