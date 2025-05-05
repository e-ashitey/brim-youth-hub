"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerForCamp } from "@/lib/camp-actions"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useNotification } from "@/components/ui/notification"

const campRegistrationSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
    gender: z.string().min(1, { message: "Please select your gender" }),
    attendee_type: z.enum(["VISITOR", "MEMBER"], {
        required_error: "Please select whether you are a visitor or member",
    }),
    branch: z.string().min(1, { message: "Please select your branch" }),
    attendance_date: z.string().min(1, { message: "Please select which day(s) you will attend" }),
    emergency_contact_name: z.string().min(1, { message: "Emergency contact name is required" }),
    emergency_contact_number: z.string().min(10, { message: "Please enter a valid emergency contact number" }),
})

type CampRegistrationValues = z.infer<typeof campRegistrationSchema>

export function CampRegistrationForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { showNotification, NotificationContainer } = useNotification()

    const form = useForm<CampRegistrationValues>({
        resolver: zodResolver(campRegistrationSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone_number: "",
            gender: "",
            attendee_type: undefined,
            branch: "",
            attendance_date: "",
            emergency_contact_name: "",
            emergency_contact_number: "",
        },
    })

    async function onSubmit(data: CampRegistrationValues) {
        setIsSubmitting(true)
        try {
            const result = await registerForCamp(data)

            if (result.success) {
                showNotification({
                    title: "Registration successful",
                    description: "You have been registered for the camp!",
                    variant: "success",
                    position: "center",
                })
                router.push(`/camp-registration/success?id=${result.registrationId}`)
            } else {
                showNotification({
                    title: "Registration failed",
                    description: result.error || "Failed to register for camp",
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
        <>
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
    <Input placeholder="John Doe" {...field} />
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
    <FormField
    control={form.control}
    name="phone_number"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Phone Number</FormLabel>
    <FormControl>
    <Input placeholder="1234567890" {...field} />
    </FormControl>
    <FormMessage />
    </FormItem>
)}
    />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
    <FormField
        control={form.control}
    name="attendee_type"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Attendee Type</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
    <FormControl>
        <SelectTrigger>
            <SelectValue placeholder="Select type" />
    </SelectTrigger>
    </FormControl>
    <SelectContent>
    <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="VISITOR">Visitor</SelectItem>
        </SelectContent>
        </Select>
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
    name="attendance_date"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Attendance Date</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
    <FormControl>
        <SelectTrigger>
            <SelectValue placeholder="Select date" />
    </SelectTrigger>
    </FormControl>
    <SelectContent>
    <SelectItem value="Thursday, June 20, 2024">Thursday, June 20, 2024</SelectItem>
    <SelectItem value="Friday, June 21, 2024">Friday, June 21, 2024</SelectItem>
    <SelectItem value="Saturday, June 22, 2024">Saturday, June 22, 2024</SelectItem>
    <SelectItem value="All Days">All Days</SelectItem>
    </SelectContent>
    </Select>
    <FormDescription>Select which day(s) you will attend the camp</FormDescription>
    <FormMessage />
    </FormItem>
)}
    />

    <div className="grid gap-4 md:grid-cols-2">
    <FormField
        control={form.control}
    name="emergency_contact_name"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Emergency Contact Name</FormLabel>
    <FormControl>
    <Input placeholder="Jane Doe" {...field} />
    </FormControl>
    <FormMessage />
    </FormItem>
)}
    />
    <FormField
    control={form.control}
    name="emergency_contact_number"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Emergency Contact Number</FormLabel>
    <FormControl>
    <Input placeholder="0987654321" {...field} />
    </FormControl>
    <FormMessage />
    </FormItem>
)}
    />
    </div>

    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
    <Button
        type="submit"
    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
    disabled={isSubmitting}
        >
        {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                </>
) : (
        "Register for Camp"
    )}
    </Button>
    </motion.div>
    </form>
    </Form>
    <NotificationContainer />
    </>
)
}
