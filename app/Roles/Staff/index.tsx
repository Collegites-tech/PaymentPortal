"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const mockStaff = [
  { id: "u1", name: "John Doe", role: "Support" },
  { id: "u2", name: "Jane Smith", role: "Refund Manager" },
]

export default function StaffIndex() {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Merchant Staff</h1>
        <Button onClick={() => router.push("/Roles/Merchant/Staff/create")}>Add Staff</Button>
      </div>
      <ul className="space-y-2">
        {mockStaff.map((staff) => (
          <li
            key={staff.id}
            className="bg-slate-800 p-4 rounded text-white hover:bg-slate-700 cursor-pointer"
            onClick={() => router.push(`/Roles/Merchant/Staff/${staff.id}`)}
          >
            {staff.name} • {staff.role}
          </li>
        ))}
      </ul>
    </div>
  )
}
