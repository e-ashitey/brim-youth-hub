"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/ui/notification"
import { motion } from "framer-motion"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { showNotification } = useNotification()

    const handleSave = () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            showNotification({
                title: "Settings Saved",
                description: "Your settings have been updated successfully.",
                variant: "success",
                position: "topRight",
            })
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your dashboard preferences and system settings.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Church Information</CardTitle>
                            <CardDescription>Update your church's basic information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="church-name">Church Name</Label>
                                    <Input id="church-name" defaultValue="Bushfire Revival International Ministry" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input id="email" type="email" defaultValue="contact@bushfirerevival.org" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+233 20 123 4567" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" defaultValue="https://bushfirerevival.org" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" defaultValue="123 Church Street, Accra, Ghana" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Preferences</CardTitle>
                            <CardDescription>Customize your dashboard experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="compact-view">Compact View</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Display more information on screen with a compact layout.
                                    </p>
                                </div>
                                <Switch id="compact-view" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="analytics">Show Analytics</Label>
                                    <p className="text-sm text-muted-foreground">Display analytics and charts on your dashboard.</p>
                                </div>
                                <Switch id="analytics" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notifications">Desktop Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive desktop notifications for important events.</p>
                                </div>
                                <Switch id="notifications" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </motion.div>
                    </div>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Configure how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email notifications for important events.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New Member Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when new members register.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Update Request Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when members request information updates.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Camp Registration Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when someone registers for camp.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </motion.div>
                    </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced Settings</CardTitle>
                            <CardDescription>Configure advanced system settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Data Backup</Label>
                                    <p className="text-sm text-muted-foreground">Automatically backup your data weekly.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>System Logs</Label>
                                    <p className="text-sm text-muted-foreground">Keep detailed logs of system activities.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="api-key">API Key</Label>
                                <div className="flex gap-2">
                                    <Input id="api-key" defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly />
                                    <Button variant="outline">Regenerate</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Use this key to access the API. Keep it secret.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions that affect your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Reset Dashboard</h4>
                                    <p className="text-sm text-muted-foreground">Reset all dashboard settings to default.</p>
                                </div>
                                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                    Reset
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Delete All Data</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete all your data. This action cannot be undone.
                                    </p>
                                </div>
                                <Button variant="destructive">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
