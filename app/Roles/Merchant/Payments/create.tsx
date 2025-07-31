"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { merchantService } from "@/services/merchant.service"
import { useRouter } from "next/navigation"

export default function CreatePaymentPage() {
  const [form, setForm] = useState({ amount: "", recipient: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    await merchantService.createPayment(form)
    router.push("/Roles/Merchant/Payments")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Create Payment</h1>
      <Input placeholder="Recipient" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
      <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-3" />
      <Button onClick={handleSubmit} loading={loading} className="mt-4">Submit</Button>
    </div>
  )
}
