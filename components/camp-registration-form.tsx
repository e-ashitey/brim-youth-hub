"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { registerForCamp } from "@/lib/camp-actions"
import { findUserByPhone } from "@/lib/actions"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useNotification } from "@/components/ui/notification"

// Schema for visitors (full form)
const visitorSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
    gender: z.string().min(1, { message: "Please select your gender" }),
    attendee_type: z.literal("VISITOR"),
    branch: z.string().min(1, { message: "Please select your branch" }),
    attendance_date: z.string().min(1, { message: "Please select which day you will attend" }),
    emergency_contact_name: z.string().optional(),
    emergency_contact_number: z.string().optional(),
})

// Schema for members (simplified form)
const memberSchema = z.object({
    phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
    attendance_date: z.string().min(1, { message: "Please select which day you will attend" }),
    emergency_contact_name: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    attendee_type: z.literal("MEMBER"),
})

// Combined schema with discriminated union
const campRegistrationSchema = z.discriminatedUnion("attendee_type", [visitorSchema, memberSchema])

type CampRegistrationValues = z.infer<typeof campRegistrationSchema>

export function CampRegistrationForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isMember, setIsMember] = useState(false)
    const [isCheckingMember, setIsCheckingMember] = useState(false)
    const [memberFound, setMemberFound] = useState(false)
    const [memberData, setMemberData] = useState<any>(null)
    const { showNotification, NotificationContainer } = useNotification()

    const form = useForm<CampRegistrationValues>({
        resolver: zodResolver(campRegistrationSchema),
        defaultValues: isMember
            ? {
                attendee_type: "MEMBER",
                phone_number: "",
                attendance_date: "",
                emergency_contact_name: "",
                emergency_contact_number: "",
            }
            : {
                attendee_type: "VISITOR",
                full_name: "",
                email: "",
                phone_number: "",
                gender: "",
                branch: "",
                attendance_date: "",
                emergency_contact_name: "",
                emergency_contact_number: "",
            },
    })

    // Reset form when isMember changes
    useEffect(() => {
        form.reset(
            isMember
                ? {
                    attendee_type: "MEMBER",
                    phone_number: "",
                    attendance_date: "",
                    emergency_contact_name: "",
                    emergency_contact_number: "",
                }
                : {
                    attendee_type: "VISITOR",
                    full_name: "",
                    email: "",
                    phone_number: "",
                    gender: "",
                    branch: "",
                    attendance_date: "",
                    emergency_contact_name: "",
                    emergency_contact_number: "",
                },
        )
        setMemberFound(false)
        setMemberData(null)
    }, [isMember, form])

    // Check if phone number belongs to a member
    const checkMember = async (phone: string) => {
        if (!phone || phone.length < 10) return

        setIsCheckingMember(true)
        try {
            const result = await findUserByPhone(phone)
            if (result.success) {
                // Fetch member data
                const userData = await fetch(`/api/members/${result.userId}`).then((res) => res.json())
                setMemberFound(true)
                setMemberData(userData)
                showNotification({
                    title: "Member found",
                    description: `Welcome, ${userData.full_name}!`,
                    variant: "success",
                    position: "center",
                })
            } else {
                setMemberFound(false)
                setMemberData(null)
                showNotification({
                    title: "Member not found",
                    description: "We couldn't find a member with that phone number",
                    variant: "error",
                    position: "center",
                })
            }
        } catch (err) {
            showNotification({
                title: "Error",
                description: "An error occurred while checking membership",
                variant: "error",
                position: "center",
            })
        } finally {
            setIsCheckingMember(false)
        }
    }

    // Handle phone number change for member check
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (isMember && name === "phone_number") {
                const phone = value.phone_number as string
                if (phone && phone.length >= 10) {
                    checkMember(phone)
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [form, isMember])

    async function onSubmit(data: CampRegistrationValues) {
        setIsSubmitting(true)
        try {
            // // For members, use the member data we retrieved
            // let registrationData = data
            let registrationData;

            if (data.attendee_type === "MEMBER") {
                if (!memberFound || !memberData) {
                    showNotification({
                        title: "Member not found",
                        description: "Please verify your phone number or register as a visitor",
                        variant: "error",
                        position: "center",
                    })
                    setIsSubmitting(false)
                    return
                }
                // console.log("Registration", registrationData)
                // Combine member data with form data
                registrationData = {
                    ...data,
                    full_name: memberData.full_name,
                    email: memberData.email,
                    gender: memberData.gender,
                    branch: memberData.branch,
                }
            }

            if (!registrationData) {
                throw new Error("Registration data is undefined");
            }
            const result = await registerForCamp(registrationData);

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
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="isMember" checked={isMember} onCheckedChange={(checked) => setIsMember(checked === true)} />
                    <label
                        htmlFor="isMember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I am a member
                    </label>
                </div>

                {isMember && (
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-blue-800">
                            As a member, you only need to enter your phone number and select your attendance date.
                            {memberFound && memberData && (
                                <span className="block mt-2 font-semibold">Welcome, {memberData.full_name}!</span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {isMember ? (
                        // Member form (simplified)
                        <>
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="Enter your registered phone number" {...field} />
                                                {isCheckingMember && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                <SelectItem value="August 14, 2024">August 14, 2024</SelectItem>
                                                <SelectItem value="August 15, 2024">August 15, 2024</SelectItem>
                                                <SelectItem value="August 16, 2024">August 16, 2024</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select which day you will attend the camp</FormDescription>
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
                                            <FormLabel>Emergency Contact Name (Optional)</FormLabel>
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
                                            <FormLabel>Emergency Contact Number (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0987654321" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    ) : (
                        // Visitor form (full)
                        <>
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
                                                    <SelectItem value="La">La</SelectItem>
                                                    <SelectItem value="Budumburam">Budumburam</SelectItem>
                                                    <SelectItem value="Domeabra">Domeabra</SelectItem>
                                                    <SelectItem value="UK">UK</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                                    <SelectItem value="August 14, 2024">August 14, 2024</SelectItem>
                                                    <SelectItem value="August 15, 2024">August 15, 2024</SelectItem>
                                                    <SelectItem value="August 16, 2024">August 16, 2024</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select which day you will attend the camp</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="emergency_contact_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Name (Optional)</FormLabel>
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
                                            <FormLabel>Emergency Contact Number (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0987654321" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            disabled={isSubmitting || (isMember && !memberFound)}
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
