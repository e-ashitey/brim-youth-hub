"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle, Home } from "lucide-react"
import { getCampRegistrationById } from "@/lib/camp-actions"
import type { CampRegistration } from "@/lib/types"

export default function RegistrationSuccessPage() {
    const searchParams = useSearchParams()
    const registrationId = searchParams.get("id")
    const [registration, setRegistration] = useState<CampRegistration | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRegistration() {
            if (registrationId) {
                const data = await getCampRegistrationById(registrationId)
                setRegistration(data)
            }
            setLoading(false)
        }

        fetchRegistration()
    }, [registrationId])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-orange-50 to-yellow-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md flex flex-col items-center"
            >
                <div className="mb-6 w-32 h-32 relative">
                    <Image
                        src="/logo.png"
                        alt="Bushfire Revival International Ministry"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full"
                >
                    <Card className="shadow-lg border-t-4 border-t-green-500">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-800">Registration Successful!</CardTitle>
                            <CardDescription>Your camp registration has been confirmed</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {loading ? (
                                <div className="text-center py-4">Loading registration details...</div>
                            ) : registration ? (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-slate-800">Registration Details</h3>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <div className="grid grid-cols-2">
                                                <span className="font-medium">Name:</span>
                                                <span>{registration.full_name}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-medium">Email:</span>
                                                <span>{registration.email}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-medium">Phone:</span>
                                                <span>{registration.phone_number}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-medium">Attendance Date:</span>
                                                <span>{registration.attendance_date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center text-sm text-slate-600">
                                        <p>Please save this information for your records.</p>
                                        <p>We look forward to seeing you at the camp!</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-red-500">
                                    Registration details not found. Please contact the administrator.
                                </div>
                            )}

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                                >
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Return to Home
                                    </Link>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </main>
    )
}
