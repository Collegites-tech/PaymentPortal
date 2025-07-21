"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Building, Key, Shield, Bell } from "lucide-react"

export default function SettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and application settings</p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="business" className="data-[state=active]:bg-slate-700">
            <Building className="h-4 w-4 mr-2" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-slate-700">
            <Key className="h-4 w-4 mr-2" />
            API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Business Information</CardTitle>
                <p className="text-slate-400 text-sm">Update your business details and contact information</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-slate-200">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    defaultValue="PayFlow Inc."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail" className="text-slate-200">
                    Business Email
                  </Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    defaultValue="contact@payflow.com"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone" className="text-slate-200">
                    Phone Number
                  </Label>
                  <Input
                    id="businessPhone"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="text-slate-200">
                    Business Address
                  </Label>
                  <Textarea
                    id="businessAddress"
                    defaultValue="123 Business St, Suite 100, New York, NY 10001"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Payment Settings</CardTitle>
                <p className="text-slate-400 text-sm">Configure payment processing options</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-200">
                    Default Currency
                  </Label>
                  <Input id="currency" defaultValue="USD" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-slate-200">
                    Minimum Payment Amount
                  </Label>
                  <Input id="minAmount" defaultValue="$1.00" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-slate-200">
                    Maximum Payment Amount
                  </Label>
                  <Input
                    id="maxAmount"
                    defaultValue="$10,000.00"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200">Auto-capture payments</Label>
                    <p className="text-slate-400 text-sm">Automatically capture authorized payments</p>
                  </div>
                  <Switch />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">API Keys</CardTitle>
                <p className="text-slate-400 text-sm">Manage your API keys for integration</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Publishable Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      value="pk_test_51234567890abcdef..."
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Secret Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      value="sk_test_51234567890abcdef..."
                      type="password"
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                    >
                      Reveal
                    </Button>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Generate New Keys</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Webhooks</CardTitle>
                <p className="text-slate-400 text-sm">Configure webhook endpoints for real-time notifications</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="text-slate-200">
                    Webhook URL
                  </Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-domain.com/webhook"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Events to Subscribe</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label className="text-slate-300">Payment Completed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label className="text-slate-300">Payment Failed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label className="text-slate-300">Refund Processed</Label>
                    </div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Webhook</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Password & Authentication</CardTitle>
                <p className="text-slate-400 text-sm">Manage your login credentials and security settings</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-200">
                    Current Password
                  </Label>
                  <Input id="currentPassword" type="password" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-200">
                    New Password
                  </Label>
                  <Input id="newPassword" type="password" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-200">
                    Confirm New Password
                  </Label>
                  <Input id="confirmPassword" type="password" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200">Enable 2FA</Label>
                    <p className="text-slate-400 text-sm">Use authenticator app for login</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
                {twoFactorEnabled && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-slate-300 text-sm mb-2">Scan this QR code with your authenticator app:</p>
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-slate-900 text-xs">QR Code</span>
                    </div>
                  </div>
                )}
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {twoFactorEnabled ? "Disable 2FA" : "Setup 2FA"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <p className="text-slate-400 text-sm">Choose how you want to receive notifications</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200">Email Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200">SMS Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive notifications via SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-white font-medium mb-4">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Payment Received</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Payment Failed</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Refund Processed</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">New Team Member</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Security Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
