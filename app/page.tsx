"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserCircle, Tent, Settings } from "lucide-react"

export default function Home() {
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
          <Card className="shadow-lg border-t-4 border-t-orange-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-800">Welcome</CardTitle>
              <CardDescription>Choose a service to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 h-auto py-6"
                >
                  <Link href="/member-info" className="flex items-center">
                    <UserCircle className="mr-4 h-5 w-5" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-lg font-semibold">Member Information System</span>
                      <span className="text-xs">Update your personal information</span>
                    </div>
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-auto py-6"
                >
                  <Link href="/camp-registration" className="flex items-center">
                    <Tent className="mr-4 h-5 w-5" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-lg font-semibold">Camp Registration</span>
                      <span className="text-xs">Register for our upcoming camp</span>
                    </div>
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
