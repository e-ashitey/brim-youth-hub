"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNotification } from "@/components/ui/notification"
import { supabase } from "@/lib/supabase/client"

export type Member = {
  id: string
  full_name: string
  email: string
  phone_number: string
  whatsapp_number: string
  dob: string
  gender: string
  marital_status: string
  branch: string
  location: string
  organization: string
  occupation_status: string
  digital_address?: string
  created_at?: string
  updated_at?: string
}

interface MemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  onSuccess: () => void
  mode?: 'view' | 'edit' | 'create'
}

export function MemberDialog({ open, onOpenChange, member, onSuccess, mode = 'create' }: MemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Member>>({})
  const { showNotification } = useNotification()

  useEffect(() => {
    if (member) {
      setFormData(member)
    } else {
      setFormData({
        id: '',
        full_name: '',
        email: '',
        phone_number: '',
        whatsapp_number: '',
        dob: '',
        gender: '',
        marital_status: '',
        branch: '',
        digital_address: '',
        location: '',
        organization: '',
        occupation_status: '',
      })
    }
  }, [member, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') {
      onOpenChange(false)
      return
    }

    setIsLoading(true)

    try {
      if (member?.id) {
        // Update existing member
        const { error } = await supabase
          .from('members_duplicate')
          .update(formData)
          .eq('id', member.id)

        if (error) throw error
        showNotification({
          title: "Success",
          description: "Member updated successfully",
          variant: "success"
        })
      } else {
        // Create new member
        const { error } = await supabase
          .from('members_duplicate')
          .insert([formData])

        if (error) throw error
        showNotification({
          title: "Success",
          description: "Member created successfully",
          variant: "success"
        })
      }
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error saving member:', error)
      showNotification({
        title: "Error",
        description: "Failed to save member",
        variant: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'view' ? 'Member Details' : member ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription>
              {member ? 'Update the member details below.' : 'Fill in the details to add a new member.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                className="col-span-3"
                required
                readOnly={mode === 'view'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="col-span-3"
                required
                readOnly={mode === 'view'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
                className="col-span-3"
                required
                readOnly={mode === 'view'}
              />
            </div>
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="whatsapp_number" className="text-right">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number || ''}
                  onChange={handleChange}
                  className="col-span-3"
                  // required
                  readOnly={mode === 'view'}
                />
              </div>
            )}
            {(mode === 'create') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                  // readOnly={mode === 'view'}
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              {mode === 'view' ? (
                <Input
                  value={formData.gender || ''}
                  className="col-span-3"
                  readOnly
                />
              ) : (
                <Select
                  value={formData.gender || ''}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marital_status" className="text-right">
                  Marital Status
                </Label>
                {mode === 'view' ? (
                  <Input
                    value={formData.marital_status || ''}
                    className="col-span-3"
                    readOnly
                  />
                ) : (
                  <Select
                    value={formData.marital_status || ''}
                    onValueChange={(value) => handleSelectChange('marital_status', value)}
                    // readOnly={mode === 'view'}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Select
                value={formData.branch || ''}
                onValueChange={(value) => handleSelectChange('branch', value)}
                // readOnly={mode === 'view'}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="La">La</SelectItem>
                  <SelectItem value="Domeabra">Domeabra</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={mode === 'view'}
                  required
                />
              </div>
            )}
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="digital_address" className="text-right">
                  Digital Address
                </Label>
                <Input
                  id="digital_address"
                  name="digital_address"
                  value={formData.digital_address || ''}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={mode === 'view' || formData.digital_address !== ''}
                />
              </div>
            )}
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="occupation_status" className="text-right">
                  Occupation
                </Label>
                {mode === 'view' ? (
                  <Input
                    value={formData.occupation_status || ''}
                    className="col-span-3"
                    readOnly
                  />
                ) : (
                  <Select
                    value={formData.occupation_status || ''}
                    onValueChange={(value) => handleSelectChange('occupation_status', value)}
                    // readOnly={mode === 'view'}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select occupation status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wokring">Working</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Schooling">Schooling</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            {(mode === 'create' || mode === 'view') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">
                  Organization
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization || ''}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={mode === 'view' || formData.organization !== ''}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
