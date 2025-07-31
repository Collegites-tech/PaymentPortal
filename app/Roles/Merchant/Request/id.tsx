"use client"
import { useParams } from "next/navigation"

export default function RequestDetail() {
  const { id } = useParams()

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold">Request #{id}</h1>
      <p className="text-slate-400 mt-2">Details of the request. Actions: cancel, edit, track status.</p>
    </div>
  )
}
