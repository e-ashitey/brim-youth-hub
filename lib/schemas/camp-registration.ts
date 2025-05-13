import { z } from "zod"

export interface MemberData {
    full_name: string
    email: string
    gender: string
    branch: string
    phone_number?: string
}

export interface RegistrationInput {
    full_name: string
    email: string
    phone_number: string
    gender: string
    attendee_type: "VISITOR" | "MEMBER"
    branch: string
    attendance_date: string
    emergency_contact_name?: string
    emergency_contact_number?: string
}

export const visitorSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
    gender: z.string().min(1, { message: "Please select a gender" }),
    branch: z.string().min(1, { message: "Please select a branch" }),
    attendance_date: z.string().min(1, { message: "Please select which day you will attend" }),
    emergency_contact_name: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    attendee_type: z.literal("VISITOR"),
})

export const memberSchema = z.object({
    phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
    attendance_date: z.string().min(1, { message: "Please select which day you will attend" }),
    emergency_contact_name: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    attendee_type: z.literal("MEMBER"),
})

export const campRegistrationSchema = z.discriminatedUnion("attendee_type", [
    visitorSchema,
    memberSchema,
])

export type CampRegistrationValues = z.infer<typeof campRegistrationSchema>

export const DEFAULT_VISITOR_VALUES: CampRegistrationValues = {
    attendee_type: "VISITOR",
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    branch: "",
    attendance_date: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
}

export const DEFAULT_MEMBER_VALUES: CampRegistrationValues = {
    attendee_type: "MEMBER",
    phone_number: "",
    attendance_date: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
}