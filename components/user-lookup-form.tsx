"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { findUserByEmail, findUserByPhone } from "@/lib/actions"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useNotification } from "@/components/ui/notification"

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

const phoneSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

export function UserLookupForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const { showNotification, NotificationContainer } = useNotification()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  })

  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true)
    try {
      const result = await findUserByEmail(data.email)
      if (result.success) {
        router.push(`/profile/${result.userId}`)
      } else {
        showNotification({
          title: "Member not found",
          description: result.error || "We couldn't find a member with that email address",
          variant: "error",
          position: "center",
        })
      }
    } catch (err) {
      showNotification({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "error",
        position: "center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPhoneSubmit(data: z.infer<typeof phoneSchema>) {
    setIsLoading(true)
    try {
      const result = await findUserByPhone(data.phone)
      if (result.success) {
        router.push(`/profile/${result.userId}`)
      } else {
        showNotification({
          title: "Member not found",
          description: result.error || "We couldn't find a member with that phone number",
          variant: "error",
          position: "center",
        })
      }
    } catch (err) {
      showNotification({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "error",
        position: "center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone Number</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="phone">
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone or WhatsApp number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      <NotificationContainer />
    </>
  )
}
