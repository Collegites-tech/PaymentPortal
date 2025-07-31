"use client"
import { useParams } from "next/navigation"

export default function SupportDetail() {
  const { id } = useParams()

  return (
    <div className="text-white space-y-4">
      <h1 className="text-2xl font-bold">Ticket #{id}</h1>
      <p className="text-slate-400">Conversation or response thread goes here.</p>
    </div>
  )
}
