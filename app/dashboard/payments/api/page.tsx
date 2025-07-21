"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Loader2, PlusCircle } from "lucide-react"

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
      status: "active",
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
      status: "active",
    },
  ])

  const [newKeyData, setNewKeyData] = useState({
    name: "",
    type: "test",
    permissions: ["read"],
  })

  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const keyPrefix = newKeyData.type === "live" ? "pk_live_" : "pk_test_"
    const secretPrefix = newKeyData.type === "live" ? "sk_live_" : "sk_test_"
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    const newKey = {
      id: `key_${String(apiKeys.length + 1).padStart(3, "0")}`,
      name: newKeyData.name,
      key: `${keyPrefix}${randomString}`,
      secret: `${secretPrefix}${randomString}`,
      type: newKeyData.type,
      permissions: newKeyData.permissions,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
    }

    setApiKeys([newKey, ...apiKeys])
    setNewKeyData({ name: "", type: "test", permissions: ["read"] })

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

  const handleToggleSecret = (keyId: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">API Keys</h1>

      <form onSubmit={handleGenerateKey} className="space-y-4">
        <h2 className="text-xl font-semibold text-metallic-100 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Generate New API Key
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-metallic-300">Name</Label>
            <Input
              value={newKeyData.name}
              onChange={(e) =>
                setNewKeyData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My Service Key"
              className="bg-metallic-800 border-metallic-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-metallic-300">Type</Label>
            <select
              value={newKeyData.type}
              onChange={(e) =>
                setNewKeyData((prev) => ({
                  ...prev,
                  type: e.target.value as "live" | "test",
                }))
              }
              className="w-full p-2 rounded-md bg-metallic-800 text-white border border-metallic-600"
            >
              <option value="test">Test</option>
              <option value="live">Live</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-gradient-to-r from-metallic-600 to-metallic-400 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Key"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-metallic-100">Your API Keys</h2>
        {apiKeys.map((keyData) => (
          <div
            key={keyData.id}
            className="p-4 rounded-md border border-metallic-600 bg-metallic-900/50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{keyData.name}</p>
                <p className="text-sm text-metallic-400">Created: {keyData.createdAt}</p>
              </div>
              <span className="text-xs text-metallic-300 px-2 py-1 bg-metallic-800 rounded-full uppercase">
                {keyData.type}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between bg-metallic-800 text-white px-3 py-2 rounded-md">
                <span className="truncate">{keyData.key}</span>
                <Copy
                  className="w-4 h-4 cursor-pointer hover:text-metallic-300"
                  onClick={() => handleCopyKey(keyData.key, "Public Key")}
                />
              </div>

              <div className="flex items-center justify-between bg-metallic-800 text-white px-3 py-2 rounded-md">
                <span className="truncate">
                  {showSecrets[keyData.id] ? keyData.secret : "••••••••••••••••••••••••••"}
                </span>
                <div className="flex gap-3">
                  <Copy
                    className="w-4 h-4 cursor-pointer hover:text-metallic-300"
                    onClick={() => handleCopyKey(keyData.secret, "Secret Key")}
                  />
                  {showSecrets[keyData.id] ? (
                    <EyeOff
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleToggleSecret(keyData.id)}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleToggleSecret(keyData.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
