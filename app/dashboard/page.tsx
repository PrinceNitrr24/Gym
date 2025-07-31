"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, DollarSign, UserPlus, AlertTriangle, CheckCircle, UserCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

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
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setSupabaseConfigured(false)
        // Set demo user for when Supabase is not configured
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
        // Fallback to demo mode
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
    { id: 1, name: "John Doe", checkInTime: "08:30 AM", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Sarah Wilson", checkInTime: "09:15 AM", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Mike Johnson", checkInTime: "10:00 AM", avatar: "/placeholder.svg?height=32&width=32" },
  ])

  const [upcomingExpirations] = useState([
    { id: 1, name: "Emma Davis", package: "Premium Monthly", expiryDate: "2024-02-05", daysLeft: 3 },
    { id: 2, name: "Alex Brown", package: "Basic Quarterly", expiryDate: "2024-02-07", daysLeft: 5 },
    { id: 3, name: "Lisa Garcia", package: "Premium Annual", expiryDate: "2024-02-10", daysLeft: 8 },
  ])

  const [trainersOnDuty] = useState([
    { id: 1, name: "David Smith", specialization: "Strength Training", status: "Available" },
    { id: 2, name: "Maria Rodriguez", specialization: "Yoga", status: "In Session" },
    { id: 3, name: "James Wilson", specialization: "Cardio", status: "Available" },
  ])

  const [newJoinees] = useState([
    { id: 1, name: "Tom Anderson", joinDate: "2024-01-28", package: "Basic Monthly" },
    { id: 2, name: "Rachel Green", joinDate: "2024-01-30", package: "Premium Monthly" },
  ])

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
            className="text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Today's Present Members",
            value: "23",
            change: "+12% from yesterday",
            icon: UserCheck,
            color: "text-emerald-600",
          },
          {
            title: "Total Active Members",
            value: "342",
            change: "+8 new this week",
            icon: Users,
            color: "text-emerald-600",
          },
          {
            title: "Pending Payments",
            value: "$2,450",
            change: "12 overdue invoices",
            icon: AlertTriangle,
            color: "text-amber-600",
          },
          {
            title: "Revenue This Month",
            value: "$12,450",
            change: "+15% from last month",
            icon: DollarSign,
            color: "text-emerald-600",
          },
        ].map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
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
        {/* Today's Check-ins */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Today's Check-ins</CardTitle>
              <CardDescription>Members currently in the gym</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {checkedInMembers.map((member, index) => (
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
                      <p className="text-sm text-muted-foreground">Checked in at {member.checkInTime}</p>
                    </div>
                    <Badge variant="secondary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Gym Capacity", value: 68 },
                { label: "Monthly Target", value: 84 },
                { label: "Member Retention", value: 92 },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>{stat.label}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                  >
                    <Progress value={stat.value} className="h-2" />
                  </motion.div>
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
        {/* Upcoming Expirations */}
        <motion.div className="col-span-3" variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Upcoming Expirations</CardTitle>
              <CardDescription>Memberships expiring within 7 days</CardDescription>
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

        {/* Trainers on Duty */}
        <motion.div className="col-span-2" variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Trainers on Duty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                    </div>
                    <Badge variant={trainer.status === "Available" ? "secondary" : "outline"}>{trainer.status}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Joinees */}
        <motion.div className="col-span-2" variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>New Joinees This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newJoinees.map((member, index) => (
                  <motion.div
                    key={member.id}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {member.joinDate} • {member.package}
                    </p>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-medium text-emerald-600">+{newJoinees.length} new members</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
