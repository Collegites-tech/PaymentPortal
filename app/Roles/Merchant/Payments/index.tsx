"use client"
import { useEffect, useState } from "react"
import { merchantService } from "@/services/merchant.service"

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await merchantService.getPayments()
      setPayments(data)
    }
    fetchPayments()
  }, [])

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-white text-2xl font-semibold">All Payments</h2>
      {payments.map((p: any) => (
        <div key={p.id} className="bg-slate-800 p-4 rounded-lg text-white">{p.recipient} - ${p.amount}</div>
      ))}
    </div>
  )
}
