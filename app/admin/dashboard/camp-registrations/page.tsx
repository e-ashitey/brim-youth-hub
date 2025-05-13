"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotification } from "@/components/ui/notification"
import { getMockCampRegistrations } from "@/lib/mock-dashboard-data"
import { Search, Filter, MoreHorizontal, Download, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function CampRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        // In a real app, this would be an API call
        const data = getMockCampRegistrations()
        setRegistrations(data)
        setFilteredRegistrations(data)
      } catch (error) {
        showNotification({
          title: "Error",
          description: "Failed to load camp registrations",
          variant: "error",
          position: "topRight",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let result = registrations

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (registration) =>
          registration.full_name.toLowerCase().includes(query) ||
          registration.email.toLowerCase().includes(query) ||
          registration.phone_number.includes(query),
      )
    }

    // Apply date filter
    if (dateFilter !== "all") {
      result = result.filter((registration) => registration.attendance_date === dateFilter)
    }

    setFilteredRegistrations(result)
  }, [searchQuery, dateFilter, registrations])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCheckIn = (id: string) => {
    // In a real app, this would be an API call
    const updatedRegistrations = registrations.map((registration) =>
      registration.id === id ? { ...registration, checked_in: true } : registration,
    )
    setRegistrations(updatedRegistrations)
    showNotification({
      title: "Checked In",
      description: "Attendee has been checked in successfully.",
      variant: "success",
      position: "topRight",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Camp Registrations</h1>
          <p className="text-muted-foreground">Manage and track camp attendees.</p>
        </div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Attendee List
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              Generate QR Codes
            </Button>
          </motion.div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Camp Attendees</CardTitle>
          <CardDescription>View and manage camp registrations and check-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Date</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="August 14, 2024">August 14, 2024</SelectItem>
                  <SelectItem value="August 15, 2024">August 15, 2024</SelectItem>
                  <SelectItem value="August 16, 2024">August 16, 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div className="font-medium">{registration.full_name}</div>
                        <div className="text-xs text-muted-foreground">{registration.branch}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{registration.email}</div>
                        <div className="text-xs text-muted-foreground">{registration.phone_number}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            registration.attendee_type === "MEMBER"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-purple-100 text-purple-800 border-purple-300"
                          }
                        >
                          {registration.attendee_type === "MEMBER" ? "Member" : "Visitor"}
                        </Badge>
                      </TableCell>
                      <TableCell>{registration.attendance_date}</TableCell>
                      <TableCell>
                        {registration.checked_in ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Checked In
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Not Checked In
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!registration.checked_in ? (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleCheckIn(registration.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Check In
                            </Button>
                          </motion.div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Print Badge</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Check-in</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No registrations found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
