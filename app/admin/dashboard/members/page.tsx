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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotification } from "@/components/ui/notification"
import { supabase } from "@/lib/supabase/client"
import { UserPlus, MoreHorizontal, Search, Download, Filter, Eye, Pencil } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MemberDialog, Member } from "./MemberDialog"


export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('create')
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members_duplicate')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMembers(data || []);
        setFilteredMembers(data || []);
      } catch (error) {
        console.error('Error fetching members:', error);
        showNotification({
          title: "Error",
          description: "Failed to load members data",
          variant: "error",
          position: "topRight",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [showNotification]);

  useEffect(() => {
    let result = members

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (member) =>
          (member.full_name?.toLowerCase() || '').includes(query) ||
          (member.email?.toLowerCase() || '').includes(query) ||
          (member.phone_number || '').includes(query)
      )
    }

    // Apply branch filter
    if (branchFilter !== "all") {
      result = result.filter((member) => member.branch === branchFilter)
    }

    setFilteredMembers(result)
  }, [searchQuery, branchFilter, members])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('members_duplicate')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error('Error refreshing members:', error);
      showNotification({
        title: "Error",
        description: "Failed to refresh members data",
        variant: "error",
        position: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage your members and their details</p>
        </div>
        <Button onClick={() => {
          setSelectedMember(null)
          setDialogMode('create')
          setIsDialogOpen(true)
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <MemberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={selectedMember}
        onSuccess={handleRefresh}
        mode={dialogMode}
      />

      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
          <CardDescription>View and manage all registered members.</CardDescription>
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
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Branch</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="La">La</SelectItem>
                  <SelectItem value="Budumburam">Budumburam</SelectItem>
                  <SelectItem value="Domeabra">Domeabra</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.full_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{member.email}</span>
                          <span className="text-xs text-muted-foreground">{member.phone_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.branch}</TableCell>
                      <TableCell>{formatDate(member.created_at || '')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMember(member)
                                setDialogMode('edit')
                                setIsDialogOpen(true)
                              }}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMember(member)
                                setDialogMode('view')
                                setIsDialogOpen(true)
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No members found. Try adjusting your filters.
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
