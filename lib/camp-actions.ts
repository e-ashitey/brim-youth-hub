"use server"

import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import type { CampRegistration } from "./types"

// Mock storage for camp registrations
const campRegistrations: CampRegistration[] = []

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
        // Create a new registration
        const newRegistration: CampRegistration = {
            id: uuidv4(),
            ...data,
            created_at: new Date().toISOString(),
        }

        // Add to mock data
        campRegistrations.push(newRegistration)

        // Simulate admin notification
        console.log("New camp registration:", newRegistration)

        revalidatePath("/camp-registration")
        return { success: true, registrationId: newRegistration.id }
    } catch (error) {
        console.error("Error registering for camp:", error)
        return { success: false, error: "An error occurred" }
    }
}

export async function getCampRegistrationById(id: string) {
    try {
        const registration = campRegistrations.find((r) => r.id === id)
        return registration || null
    } catch (error) {
        console.error("Error fetching registration:", error)
        return null
    }
}
