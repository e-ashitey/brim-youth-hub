export interface User {
  id: string
  created_at: string
  updated_at: string
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
}

export interface UpdateRequest {
  id: string
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
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export interface CampRegistration {
  id: string
  full_name: string
  email: string
  phone_number: string
  gender: string
  attendee_type: "VISITOR" | "MEMBER"
  branch: string
  attendance_date: string
  emergency_contact_name: string
  emergency_contact_number: string
  created_at: string
}
