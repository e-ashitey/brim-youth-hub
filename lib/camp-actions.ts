"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "./supabase/server"
import { CampRegistrationValues } from "./schemas/camp-registration"

interface RegistrationInput {
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

export async function registerForCamp(data: RegistrationInput) {
    try {
        const supabase = await createServerClient()

        // Create a new registration
        const { data: registration, error } = await supabase
            .from("camp_2025")
            .insert({
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                gender: data.gender,
                attendee_type: data.attendee_type,
                branch: data.branch,
                attendance_date: data.attendance_date,
                emergency_contact_name: data.emergency_contact_name || null,
                emergency_contact_number: data.emergency_contact_number || null,
            })
            .select()
            .single()

        if (error) {
            console.error("Error registering for camp:", error)
            return { success: false, error: error.message }
        }

        revalidatePath("/camp-registration")
        return { success: true, data: registration }
    } catch (error: any) {
        console.error("Error registering for camp:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}

export async function getCampRegistrationById(id: string) {
    try {
        const supabase = await createServerClient()

        const { data: registration, error } = await supabase.from("camp_2025").select("*").eq("id", id).single()

        if (error) {
            console.error("Error fetching registration:", error)
            return null
        }

        return registration
    } catch (error) {
        console.error("Error fetching registration:", error)
        return null
    }
}

export async function findUserByPhone(phoneNumber: string) {
    try {
        const supabase = await createServerClient()

        const { data: user, error } = await supabase
            .from("members")
            .select("*")
            .or(`phone_number.eq.${phoneNumber},whatsapp_number.eq.${phoneNumber}`)
            .single()

        if (error || !user) {
            return { success: false, error: "User not found" }
        }

        return { success: true, userId: user.id, userData: user }
    } catch (error: any) {
        console.error("Error finding user:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
