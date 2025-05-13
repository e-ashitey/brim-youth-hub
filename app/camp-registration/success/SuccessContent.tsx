"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function SuccessContent({ registration }: { registration: any }) {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-green-50 to-emerald-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl flex flex-col items-center"
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
                            <CardDescription>Thank you for registering for our camp event</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                {/* <h3 className="text-2xl font-bold text-center mb-2">Registration Successful!</h3> */}
                                <p className="text-center text-muted-foreground mb-6">
                                    We look forward to seeing you on {new Date(registration.attendance_date).toLocaleDateString()}!
                                </p>
                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Name</p>
                                            <p className="font-medium">{registration.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{registration.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{registration.phone_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Branch</p>
                                            <p className="font-medium">{registration.branch}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div >
                                            <p className="text-sm text-muted-foreground">Registration Type</p>
                                            <p className="font-medium">{registration.attendee_type === 'MEMBER' ? 'Member' : 'Visitor'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Registration ID</p>
                                            <p className="font-medium">{registration.unique_tag}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
                                <p className="text-sm text-blue-700">
                                    Please save your registration ID. You will need to present it when you arrive at the camp. We look
                                    forward to seeing you!
                                </p>
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button asChild variant="outline">
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Return to Home
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </main>
    )
}
