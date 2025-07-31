"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function SubAdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Super Admin Dashboard</CardTitle>
          <p className="text-slate-400 mt-2">Welcome, Super Admin! Manage your company, users, and settings here.</p>
        </CardHeader>
        <CardContent>
          {/* Add admin dashboard widgets/components here */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow">
              <h2 className="text-xl font-semibold mb-2">Company Overview</h2>
              <p className="text-slate-400">View stats and analytics for your company.</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow">
              <h2 className="text-xl font-semibold mb-2">User Management</h2>
              <p className="text-slate-400">Invite, edit, or remove users.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}