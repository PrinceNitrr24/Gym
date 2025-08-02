"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Filter,
  Star,
  Bell,
  Plus,
  DollarSign,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { MemberQuickActions } from "@/components/member-quick-actions"
import { SmartMemberForm } from "@/components/smart-member-form"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  full_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  date_of_joining: string
  emergency_contact: string
  status: string
  package_name?: string
  package_end_date?: string
  created_at: string
  cancellation_reason?: string
  cancellation_date?: string
  rating?: number
  balance?: number
  personal_trainer?: boolean
  govt_id_type?: string
  govt_id_num?: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [addLoading, setAddLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "",
    type: "subscription", // subscription or refund
    description: "",
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members")
      const result = await response.json()

      if (result.data) {
        setMembers(result.data)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleAddMember = async (memberData: any) => {
    setAddLoading(true)
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const result = await response.json()

      if (result.data) {
        setMembers([result.data, ...members])
        setIsAddDialogOpen(false)
        toast.success(`Welcome ${memberData.full_name}! 🎉`, {
          description: "Member has been successfully added to your gym. Login credentials sent via SMS/Email.",
        })
      } else {
        toast.error("Failed to add member")
      }
    } catch (error) {
      console.error("Error adding member:", error)
      toast.error("Failed to add member")
    } finally {
      setAddLoading(false)
    }
  }

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers(members.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
  }

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMembers(members.filter((member) => member.id !== id))
        toast.success("Member removed successfully")
      } else {
        toast.error("Failed to delete member")
      }
    } catch (error) {
      console.error("Error deleting member:", error)
      toast.error("Failed to delete member")
    }
  }

  const handleSendNotification = async () => {
    if (!selectedMember) return

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "custom",
          recipients: [selectedMember.full_name],
          title: "Important Update",
          message: notificationMessage,
        }),
      })

      const result = await response.json()
      if (result.data) {
        toast.success("Notification sent successfully! 📧")
        setIsNotificationDialogOpen(false)
        setNotificationMessage("")
        setSelectedMember(null)
      }
    } catch (error) {
      toast.error("Failed to send notification")
    }
  }

  const handleLogPayment = async () => {
    if (!selectedMember) return

    try {
      const response = await fetch("/api/payments/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: selectedMember.id,
          memberName: selectedMember.full_name,
          amount: Number.parseFloat(paymentData.amount),
          method: paymentData.method,
          type: paymentData.type,
          description: paymentData.description,
        }),
      })

      const result = await response.json()
      if (result.data) {
        toast.success(`Payment ${paymentData.type === "refund" ? "refund" : "received"} logged successfully! 💰`)
        setIsPaymentDialogOpen(false)
        setPaymentData({ amount: "", method: "", type: "subscription", description: "" })
        setSelectedMember(null)
      }
    } catch (error) {
      toast.error("Failed to log payment")
    }
  }

  const handleRatingUpdate = async (memberId: string, rating: number) => {
    try {
      const response = await fetch(`/api/members/${memberId}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      })

      if (response.ok) {
        setMembers(members.map((member) => (member.id === memberId ? { ...member, rating } : member)))
        toast.success("Member rating updated!")
      }
    } catch (error) {
      toast.error("Failed to update rating")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p>Loading members...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">Manage your gym members and their memberships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Create a new member profile with enhanced features including govt ID, balance tracking, and personal
                trainer options.
              </DialogDescription>
            </DialogHeader>
            <SmartMemberForm onSubmit={handleAddMember} loading={addLoading} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards - All Clickable */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Members",
            value: members.length,
            icon: Users,
            color: "text-blue-600",
            filter: "all",
          },
          {
            title: "Active Members",
            value: members.filter((m) => m.status === "Active").length,
            icon: Users,
            color: "text-green-600",
            filter: "active",
          },
          {
            title: "Cancelled",
            value: members.filter((m) => m.status === "Cancelled").length,
            icon: Users,
            color: "text-red-600",
            filter: "cancelled",
          },
          {
            title: "Dormant",
            value: members.filter((m) => m.status === "Dormant").length,
            icon: Users,
            color: "text-orange-600",
            filter: "dormant",
          },
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setStatusFilter(stat.filter)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="dormant">Dormant</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Members Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Members List</CardTitle>
            <CardDescription>
              Manage all members with enhanced features including ratings, notifications, and payment logging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Package End Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status & Actions</TableHead>
                  <TableHead className="text-right">More</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {member.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.full_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {member.gender}
                            {member.personal_trainer && (
                              <Badge variant="outline" className="text-xs">
                                PT
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(member.date_of_joining).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.package_end_date ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(member.package_end_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (member.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => handleRatingUpdate(member.id, star)}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">{member.rating || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.balance ? (
                        <div className="flex items-center text-sm">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {member.balance}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">$0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <MemberQuickActions member={member} onMemberUpdate={handleMemberUpdate} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member)
                              setIsNotificationDialogOpen(true)
                            }}
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Send Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member)
                              setIsPaymentDialogOpen(true)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Log Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Send Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>Send a custom notification to {selectedMember?.full_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-message">Message</Label>
              <Textarea
                id="notification-message"
                placeholder="Enter your message here..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} disabled={!notificationMessage.trim()}>
              Send Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Payment</DialogTitle>
            <DialogDescription>Record a payment transaction for {selectedMember?.full_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-amount">Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select onValueChange={(value) => setPaymentData({ ...paymentData, method: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-type">Payment Type</Label>
              <Select
                value={paymentData.type}
                onValueChange={(value) => setPaymentData({ ...paymentData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Received (Subscription)</SelectItem>
                  <SelectItem value="refund">Given (Refund)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-description">Description</Label>
              <Textarea
                id="payment-description"
                placeholder="Payment description..."
                value={paymentData.description}
                onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogPayment} disabled={!paymentData.amount || !paymentData.method}>
              Log Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
