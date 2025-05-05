"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/ui/notification"
import { motion } from "framer-motion"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { showNotification, NotificationContainer } = useNotification()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate authentication
        setTimeout(() => {
            setIsLoading(false)
            if (email === "admin@example.com" && password === "password") {
                router.push("/dashboard")
            } else {
                showNotification({
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again.",
                    variant: "error",
                    position: "center",
                })
            }
        }, 1500)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-yellow-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="relative h-24 w-24">
                        <Image src="/logo.png" alt="Bushfire Revival International Ministry" fill className="object-contain" />
                    </div>
                </div>

                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-xs text-orange-500 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <p className="mt-2 text-xs text-center text-muted-foreground">
                            <span>Demo credentials: admin@example.com / password</span>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
            <NotificationContainer />
        </div>
    )
}
