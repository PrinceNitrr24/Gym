"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, DollarSign, UserPlus, AlertTriangle, UserCheck, Bell, Send, LogOut, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dynamically import Supabase to handle missing env vars
const createClientComponentClient = () => {
  try {
    const { createClientComponentClient } = require("@supabase/auth-helpers-nextjs")
    return createClientComponentClient()
  } catch (error) {
    return null
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [sendingNotification, setSendingNotification] = useState(false)
  const [gymCapacity] = useState(50) // Default capacity, can be made editable
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setSupabaseConfigured(false)
        setUser({
          email: "demo@fitnesspro.com",
          user_metadata: {
            gym_name: "Demo Fitness Center",
          },
        })
        setLoading(false)
        return
      }

      try {
        const supabase = createClientComponentClient()
        if (!supabase) {
          setSupabaseConfigured(false)
          setUser({
            email: "demo@fitnesspro.com",
            user_metadata: {
              gym_name: "Demo Fitness Center",
            },
          })
          setLoading(false)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setSupabaseConfigured(false)
        setUser({
          email: "demo@fitnesspro.com",
          user_metadata: {
            gym_name: "Demo Fitness Center",
          },
        })
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const [checkedInMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      checkInTime: "08:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      autoCheckout: "12:30 PM",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      checkInTime: "09:15 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      autoCheckout: "01:15 PM",
    },
    {
      id: 3,
      name: "Mike Johnson",
      checkInTime: "10:00 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      autoCheckout: "02:00 PM",
    },
    {
      id: 4,
      name: "Emma Davis",
      checkInTime: "07:45 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      autoCheckout: "11:45 AM",
    },
    {
      id: 5,
      name: "Alex Brown",
      checkInTime: "11:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
      autoCheckout: "03:30 PM",
    },
  ])

  const [upcomingExpirations] = useState([
    { id: 1, name: "Emma Davis", package: "Premium Monthly", expiryDate: "2024-02-05", daysLeft: 3 },
    { id: 2, name: "Alex Brown", package: "Basic Quarterly", expiryDate: "2024-02-07", daysLeft: 5 },
    { id: 3, name: "Lisa Garcia", package: "Premium Annual", expiryDate: "2024-02-10", daysLeft: 8 },
  ])

  const [trainersOnDuty] = useState([
    {
      id: 1,
      name: "David Smith",
      specialization: "Strength Training",
      status: "Available",
      checkIn: "08:00 AM",
      checkOut: null,
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      specialization: "Yoga",
      status: "In Session",
      checkIn: "09:00 AM",
      checkOut: null,
    },
    { id: 3, name: "James Wilson", specialization: "Cardio", status: "On Leave", checkIn: null, checkOut: null },
  ])

  // Limited activities (max 5)
  const [recentActivities] = useState([
    { id: 1, name: "Morning Yoga", time: "08:00 AM", participants: 15, maxCapacity: 20 },
    { id: 2, name: "HIIT Training", time: "10:00 AM", participants: 12, maxCapacity: 15 },
    { id: 3, name: "Strength Training", time: "02:00 PM", participants: 8, maxCapacity: 10 },
    { id: 4, name: "Pilates", time: "04:00 PM", participants: 10, maxCapacity: 12 },
    { id: 5, name: "Boxing Class", time: "06:00 PM", participants: 5, maxCapacity: 8 },
  ])

  const totalActiveMembers = 342
  const membersInGym = checkedInMembers.length
  const pendingPayments = 12
  const monthlyRevenue = 12450

  const handleCheckOut = (memberId: number) => {
    toast.success("Member checked out successfully!")
  }

  const handleSendNotification = async () => {
    setSendingNotification(true)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "membership_expiry",
          recipients: upcomingExpirations.map((member) => member.name),
          title: "Membership Renewal Reminder",
          message:
            notificationMessage || "Your membership is expiring soon. Please renew to continue enjoying our services.",
        }),
      })

      const result = await response.json()

      if (result.data) {
        toast.success("Notifications sent successfully! 📧", {
          description: `Sent to ${result.data.sent} members with upcoming expirations.`,
        })
        setNotificationDialogOpen(false)
        setNotificationMessage("")
      } else {
        toast.error("Failed to send notifications")
      }
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast.error("Failed to send notifications")
    } finally {
      setSendingNotification(false)
    }
  }

  const handleCardClick = (type: string, filter?: string) => {
    switch (type) {
      case "members":
        router.push(`/dashboard/members${filter ? `?status=${filter}` : ""}`)
        break
      case "payments":
        router.push(`/dashboard/payments${filter ? `?status=${filter}` : ""}`)
        break
      case "trainers":
        router.push("/dashboard/trainers")
        break
      default:
        break
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
          <p>Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <motion.div
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-between space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Welcome back, {user.user_metadata?.gym_name || "Gym Owner"}!
          </motion.h2>
          <motion.p
            className="text-muted-foreground flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapPin className="h-4 w-4" />
            Here's what's happening at your gym today.
            {!supabaseConfigured && <span className="text-amber-600 font-medium"> (Demo Mode)</span>}
          </motion.p>
        </div>
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button onClick={() => handleCardClick("members")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </motion.div>
      </motion.div>

      {/* KPI Cards - All Clickable */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Current Capacity",
            value: `${membersInGym}/${gymCapacity}`,
            change: `${Math.round((membersInGym / gymCapacity) * 100)}% occupied`,
            icon: UserCheck,
            color: "text-emerald-600",
            clickable: true,
            onClick: () => setCheckInDialogOpen(true),
          },
          {
            title: "Total Active Members",
            value: "342",
            change: "+8 new this week",
            icon: Users,
            color: "text-emerald-600",
            clickable: true,
            onClick: () => handleCardClick("members", "active"),
          },
          {
            title: "Pending Payments",
            value: `$2,450`,
            change: `${pendingPayments} overdue invoices`,
            icon: AlertTriangle,
            color: "text-amber-600",
            clickable: true,
            onClick: () => handleCardClick("payments", "pending"),
          },
          {
            title: "Revenue This Month",
            value: `$${monthlyRevenue.toLocaleString()}`,
            change: "+15% from last month",
            icon: DollarSign,
            color: "text-emerald-600",
            clickable: true,
            onClick: () => handleCardClick("payments"),
          },
        ].map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card
              className={`hover:shadow-lg transition-all duration-300 ${kpi.clickable ? "cursor-pointer hover:scale-105" : ""}`}
              onClick={kpi.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                >
                  {kpi.value}
                </motion.div>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Check-ins with Checkout Options */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Check-ins ({membersInGym})</CardTitle>
                  <CardDescription>Members currently in the gym • Auto-checkout in 4 hours</CardDescription>
                </div>
                <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>All Check-ins Today</DialogTitle>
                      <DialogDescription>
                        Complete list of members who checked in today with checkout options.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Check-in</TableHead>
                            <TableHead>Auto Checkout</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {checkedInMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {member.name}
                              </TableCell>
                              <TableCell>{member.checkInTime}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {member.autoCheckout}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" onClick={() => handleCheckOut(member.id)}>
                                  <LogOut className="h-3 w-3 mr-1" />
                                  Checkout
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {checkedInMembers.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={member.id}
                    className="flex items-center space-x-4"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        In: {member.checkInTime} • Auto out: {member.autoCheckout}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleCheckOut(member.id)}>
                      <LogOut className="h-3 w-3 mr-1" />
                      Checkout
                    </Button>
                  </motion.div>
                ))}
                {checkedInMembers.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{checkedInMembers.length - 3} more members checked in
                  </p>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trainers on Duty with Check-in/out */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Trainers on Duty</CardTitle>
              <CardDescription>Current trainer availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainersOnDuty.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{trainer.name}</p>
                    <p className="text-xs text-muted-foreground">{trainer.specialization}</p>
                    {trainer.checkIn && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        In: {trainer.checkIn}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        trainer.status === "Available"
                          ? "secondary"
                          : trainer.status === "On Leave"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {trainer.status}
                    </Badge>
                    {trainer.status !== "On Leave" && !trainer.checkIn && (
                      <Button size="sm" variant="outline">
                        Check In
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Upcoming Expirations - Clickable to Payments */}
        <motion.div className="col-span-3" variants={itemVariants}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => handleCardClick("payments", "expiring")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Expirations</CardTitle>
                  <CardDescription>Memberships expiring within 7 days • Click to view payments</CardDescription>
                </div>
                <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Send Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-blue-600" />
                        Send Renewal Notifications
                      </DialogTitle>
                      <DialogDescription>
                        Send renewal reminders to {upcomingExpirations.length} members with upcoming expirations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Notification Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Your membership is expiring soon. Please renew to continue enjoying our services."
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Recipients:</p>
                        <div className="space-y-1">
                          {upcomingExpirations.map((member) => (
                            <div key={member.id} className="flex justify-between text-sm">
                              <span>{member.name}</span>
                              <Badge variant="outline">{member.daysLeft} days left</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setNotificationDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendNotification}
                        disabled={sendingNotification}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {sendingNotification ? "Sending..." : "Send Notifications"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingExpirations.map((member, index) => (
                  <motion.div
                    key={member.id}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.package}</p>
                    </div>
                    <Badge variant={member.daysLeft <= 3 ? "destructive" : "secondary"}>
                      {member.daysLeft} days left
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities (Limited to 5) */}
        <motion.div className="col-span-4" variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Today's Activities (Max 5)</CardTitle>
              <CardDescription>Current activity schedule and capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={activity.participants >= activity.maxCapacity * 0.8 ? "destructive" : "secondary"}
                      >
                        {activity.participants}/{activity.maxCapacity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.maxCapacity - activity.participants} spots left
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
