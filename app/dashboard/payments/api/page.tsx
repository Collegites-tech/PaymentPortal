"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key_001",
      name: "Production API Key",
      key: "pk_live_51234567890abcdefghijklmnopqrstuvwxyz",
      secret: "sk_live_51234567890abcdefghijklmnopqrstuvwxyz",
      type: "live",
      permissions: ["read", "write"],
      createdAt: "2024-01-10",
      lastUsed: "2024-01-15",
      status: "active"
    },
    {
      id: "key_002", 
      name: "Test API Key",
      key: "pk_test_51234567890abcdefghijklmnopqrstuvwxyz",
      secret: "sk_test_51234567890abcdefghijklmnopqrstuvwxyz",
      type: "test",
      permissions: ["read", "write"],
      createdAt: "2024-01-08",
      lastUsed: "2024-01-14",
      status: "active"
    }
  ])

  const [newKeyData, setNewKeyData] = useState({
    name: "",
    type: "test",
    permissions: ["read"]
  })

  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate API key generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const keyPrefix = newKeyData.type === "live" ? "pk_live_" : "pk_test_"
    const secretPrefix = newKeyData.type === "live" ? "sk_live_" : "sk_test_"
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const newKey = {
      id: `key_${String(apiKeys.length + 1).padStart(3, '0')}`,
      name: newKeyData.name,
      key: `${keyPrefix}${randomString}`,
      secret: `${secretPrefix}${randomString}`,
      type: newKeyData.type,
      permissions: newKeyData.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "active"
    }

    setApiKeys([newKey, ...apiKeys])
    setNewKeyData({
      name: "",
      type: "test",
      permissions: ["read"]
    })

    toast({
      title: "API Key generated",
      description: "Your new API key has been created successfully.",
    })

    setIsGenerating(false)
  }

  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    })
  }

  const handleToggleSecret = (keyId:\
