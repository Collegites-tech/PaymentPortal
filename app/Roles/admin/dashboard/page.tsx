"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Bell, 
  Activity, 
  UserCheck, 
  TrendingUp,
  Plus,
  Eye,
  AlertTriangle
} from "lucide-react"
import { DashboardService } from "@/services/dashboard.service"