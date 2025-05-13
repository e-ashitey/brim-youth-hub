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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotification } from "@/components/ui/notification"
import { getMockUpdateRequests } from "@/lib/mock-dashboard-data"
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function UpdateRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [filteredRequests, setFilteredRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // In a real app, this would be an API call
        const data = getMockUpdateRequests()
        setRequests(data)
        setFilteredRequests(data)
      } catch (error) {
        showNotification({
          title: "Error",
          description: "Failed to load update requests",
          variant: "error",
          position: "topRight",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let result = requests

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
          (request) =>
              request.full_name.toLowerCase().includes(query) ||
              request.email.toLowerCase().includes(query) ||
              request.reason.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(result)
  }, [searchQuery, statusFilter, requests])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Pending
            </Badge>
        )
      case "approved":
        return (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Approved
            </Badge>
        )
      case "rejected":
        return (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
              Rejected
            </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleApprove = (id: string) => {
    // In a real app, this would be an API call
    const updatedRequests = requests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request,
    )
    setRequests(updatedRequests)
    showNotification({
      title: "Request Approved",
      description: "The update request has been approved successfully.",
      variant: "success",
      position: "topRight",
    })
  }

  const handleReject = (id: string) => {
    // In a real app, this would be an API call
    const updatedRequests = requests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request,
    )
    setRequests(updatedRequests)
    showNotification({
      title: "Request Rejected",
      description: "The update request has been rejected.",
      variant: "info",
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
            <h1 className="text-2xl font-bold tracking-tight">Update Requests</h1>
            <p className="text-muted-foreground">Review and manage member information update requests.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Review and approve or reject member update requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, or reason..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="font-medium">{request.full_name}</div>
                              <div className="text-xs text-muted-foreground">{request.email}</div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">{request.reason}</div>
                            </TableCell>
                            <TableCell>{formatDate(request.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="text-right">
                              {request.status === "pending" ? (
                                  <div className="flex justify-end gap-2">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-600 hover:bg-green-50"
                                          onClick={() => handleApprove(request.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-600 hover:bg-red-50"
                                          onClick={() => handleReject(request.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </motion.div>
                                  </div>
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
                                      <DropdownMenuItem>View Member</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No update requests found. Try adjusting your filters.
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
