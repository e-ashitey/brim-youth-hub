import type { User, UpdateRequest } from "./types"

// Mock users data
export const users: User[] = [
  {
    id: "1",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    full_name: "John Doe",
    gender: "Male",
    dob: "1980-01-15",
    email: "john.doe@example.com",
    digital_address: "GA-123-4567",
    location: "Accra, Ghana",
    marital_status: "Married",
    phone_number: "1234567890",
    whatsapp_number: "1234567890",
    occupation_status: "Employed",
    organization: "Tech Company Ltd",
    branch: "Central Branch",
  },
  {
    id: "2",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    full_name: "Jane Smith",
    gender: "Female",
    dob: "1985-05-20",
    email: "jane.smith@example.com",
    digital_address: "GA-987-6543",
    location: "Tema, Ghana",
    marital_status: "Single",
    phone_number: "9876543210",
    whatsapp_number: "9876543210",
    occupation_status: "Student",
    organization: "University of Ghana",
    branch: "East Branch",
  },
]

// Mock update requests
export const updateRequests: UpdateRequest[] = []
