"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { CampRegistrationForm } from "@/components/camp-registration-form"

export default function CampRegistrationPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-orange-50 to-yellow-50">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-3xl flex flex-col items-center"
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
    <Card className="shadow-lg border-t-4 border-t-orange-500">
    <CardHeader className="text-center">
    <div className="absolute top-4 left-4">
        <Button asChild variant="ghost" size="icon">
    <Link href="/">
    <ArrowLeft className="h-4 w-4" />
    <span className="sr-only">Back</span>
        </Link>
        </Button>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">Camp Registration</CardTitle>
    <CardDescription>Register for our upcoming camp event</CardDescription>
    </CardHeader>
    <CardContent>
    <CampRegistrationForm />
    </CardContent>
    </Card>
    </motion.div>
    </motion.div>
    </main>
)
}
