"use client"
import { useParams } from "next/navigation"

export default function EditStaff() {
  const { id } = useParams()

  return (
    <div className="space-y-4 text-white">
      <h1 className="text-2xl font-bold">Edit Staff #{id}</h1>
      <p>Edit form and permissions here...</p>
    </div>
  )
}
