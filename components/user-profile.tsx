"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"
import { ArrowLeft, Pencil } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitUpdateRequest } from "@/lib/actions"
import { useNotification } from "@/components/ui/notification"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { showNotification, NotificationContainer } = useNotification()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{user.full_name}</h2>
          <p className="text-muted-foreground">Member ID: {user.id}</p>
        </div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Request Update
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-orange-600">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Full Name:</p>
                  <p className="text-sm">{user.full_name}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Gender:</p>
                  <p className="text-sm">{user.gender || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Date of Birth:</p>
                  <p className="text-sm">{user.dob ? formatDate(user.dob) : "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Phone Number:</p>
                  <p className="text-sm">{user.phone_number}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">WhatsApp Number:</p>
                  <p className="text-sm">{user.whatsapp_number || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Marital Status:</p>
                  <p className="text-sm">{user.marital_status || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-orange-600">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Digital Address:</p>
                  <p className="text-sm">{user.digital_address || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Location:</p>
                  <p className="text-sm">{user.location || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Occupation Status:</p>
                  <p className="text-sm">{user.occupation_status || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Organization:</p>
                  <p className="text-sm">{user.organization || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Branch:</p>
                  <p className="text-sm">{user.branch || "Not provided"}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-sm font-medium">Member Since:</p>
                  <p className="text-sm">{formatDate(user.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="update-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UpdateRequestForm user={user} onCancel={() => setIsEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <NotificationContainer />
    </div>
  )
}

const updateFormSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  gender: z.string().optional(),
  dob: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  digital_address: z.string().optional(),
  location: z.string().optional(),
  marital_status: z.string().optional(),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
  whatsapp_number: z.string().optional(),
  occupation_status: z.string().optional(),
  organization: z.string().optional(),
  branch: z.string().optional(),
  reason: z.string().min(10, { message: "Please provide a reason for the update request" }),
})

type UpdateFormValues = z.infer<typeof updateFormSchema>

function UpdateRequestForm({ user, onCancel }: { user: User; onCancel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showNotification } = useNotification()

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      full_name: user.full_name,
      gender: user.gender || "",
      dob: user.dob || "",
      email: user.email,
      digital_address: user.digital_address || "",
      location: user.location || "",
      marital_status: user.marital_status || "",
      phone_number: user.phone_number,
      whatsapp_number: user.whatsapp_number || "",
      occupation_status: user.occupation_status || "",
      organization: user.organization || "",
      branch: user.branch || "",
      reason: "",
    },
  })

  async function onSubmit(data: UpdateFormValues) {
    setIsSubmitting(true)
    try {
      const result = await submitUpdateRequest({
        user_id: user.id,
        ...data,
      })

      if (result.success) {
        showNotification({
          title: "Update request submitted",
          description: "An administrator will review your request shortly.",
          variant: "success",
          position: "center",
        })
        onCancel()
      } else {
        showNotification({
          title: "Error",
          description: result.error || "Failed to submit update request",
          variant: "error",
          position: "center",
        })
      }
    } catch (error) {
      showNotification({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
        position: "center",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-orange-500">
      <CardHeader>
        <CardTitle className="text-slate-800">Request Information Update</CardTitle>
        <CardDescription>Update your information below. Changes will be reviewed by an administrator.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="digital_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digital Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="occupation_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                        <SelectItem value="Unemployed">Unemployed</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Central Branch">Central Branch</SelectItem>
                        <SelectItem value="East Branch">East Branch</SelectItem>
                        <SelectItem value="West Branch">West Branch</SelectItem>
                        <SelectItem value="North Branch">North Branch</SelectItem>
                        <SelectItem value="South Branch">South Branch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Update</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you're requesting these changes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a brief explanation for why you're requesting these changes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" type="button" onClick={onCancel}>
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Update Request"}
                </Button>
              </motion.div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
