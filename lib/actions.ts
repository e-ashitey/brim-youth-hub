"use server"

import { users, updateRequests } from "./mock-data"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function findUserByEmail(email: string) {
  try {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return { success: false, error: "Member not found" }
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Error finding member by email:", error)
    return { success: false, error: "An error occurred" }
  }
}

export async function findUserByPhone(phone: string) {
  try {
    const user = users.find((u) => u.phone_number === phone || u.whatsapp_number === phone)

    if (!user) {
      return { success: false, error: "Member not found" }
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Error finding member by phone:", error)
    return { success: false, error: "An error occurred" }
  }
}

export async function getUserById(userId: string) {
  try {
    const user = users.find((u) => u.id === userId)
    return user || null
  } catch (error) {
    console.error("Error fetching member:", error)
    return null
  }
}

interface UpdateRequestInput {
  user_id: string
  full_name: string
  gender?: string
  dob?: string
  email: string
  digital_address?: string
  location?: string
  marital_status?: string
  phone_number: string
  whatsapp_number?: string
  occupation_status?: string
  organization?: string
  branch?: string
  reason: string
}

export async function submitUpdateRequest(data: UpdateRequestInput) {
  try {
    // Find the user
    const user = users.find((u) => u.id === data.user_id)

    if (!user) {
      return { success: false, error: "Member not found" }
    }

    // Create a new update request
    const newRequest = {
      id: uuidv4(),
      user_id: data.user_id,
      full_name: data.full_name,
      gender: data.gender || null,
      dob: data.dob || null,
      email: data.email,
      digital_address: data.digital_address || null,
      location: data.location || null,
      marital_status: data.marital_status || null,
      phone_number: data.phone_number,
      whatsapp_number: data.whatsapp_number || null,
      occupation_status: data.occupation_status || null,
      organization: data.organization || null,
      branch: data.branch || null,
      reason: data.reason,
      status: "pending" as const,
      created_at: new Date().toISOString(),
    }

    // Add to mock data
    updateRequests.push(newRequest)

    // Simulate admin notification
    console.log("Admin notification would be sent with the following data:", {
      subject: `Update Request from ${data.full_name}`,
      body: `
        Member ${data.full_name} (ID: ${data.user_id}) has requested an update to their information.
        
        Request ID: ${newRequest.id}
        Reason: ${data.reason}
        
        Please review this request in the admin dashboard.
      `,
    })

    revalidatePath(`/profile/${data.user_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error submitting update request:", error)
    return { success: false, error: "An error occurred" }
  }
}
