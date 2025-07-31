"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateStaff() {
  const [form, setForm] = useState({ name: "", email: "" })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Add Staff Member</h1>
      <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Button>Add Staff</Button>
    </div>
  )
}
