"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Plus, Search, MoreHorizontal, Edit, Trash2, Clock, Users, Filter, Bell, Send } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Mock data for activities (limited to 5, sorted by latest)
const mockActivities = [
  {
    id: 1,
    name: "HIIT Training",
    description: "High-intensity interval training for maximum results",
    duration_minutes: 45,
    capacity: 15,
    current_participants: 12,
    is_active: true,
    timing: "10:00 AM - 12:00 PM",
    weekdays: ["Monday", "Wednesday", "Friday"],
    created_at: "2024-02-01T10:00:00Z",
    notification_sent: true,
    responses: [
      { member: "John Doe", status: "confirmed" },
      { member: "Sarah Wilson", status: "maybe" },
      { member: "Mike Johnson", status: "confirmed" },
    ],
  },
  {
    id: 2,
    name: "Morning Yoga",
    description: "Start your day with peaceful yoga sessions",
    duration_minutes: 60,
    capacity: 20,
    current_participants: 18,
    is_active: true,
    timing: "08:00 AM - 09:00 AM",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    created_at: "2024-01-30T08:00:00Z",
    notification_sent: false,
    responses: [
      { member: "Emma Davis", status: "confirmed" },
      { member: "Alex Brown", status: "confirmed" },
    ],
  },
  {
    id: 3,
    name: "Strength Training",
    description: "Build muscle and increase strength",
    duration_minutes: 90,
    capacity: 10,
    current_participants: 8,
    is_active: true,
    timing: "02:00 PM - 03:30 PM",
    weekdays: ["Tuesday", "Thursday", "Saturday"],
    created_at: "2024-01-28T14:00:00Z",
    notification_sent: true,
    responses: [],
  },
  {
    id: 4,
    name: "Pilates",
    description: "Core strengthening and flexibility",
    duration_minutes: 50,
    capacity: 12,
    current_participants: 10,
    is_active: true,
    timing: "04:00 PM - 04:50 PM",
    weekdays: ["Monday", "Wednesday", "Friday"],
    created_at: "2024-01-25T16:00:00Z",
    notification_sent: false,
    responses: [],
  },
  {
    id: 5,
    name: "Boxing Class",
    description: "Learn boxing techniques and get fit",
    duration_minutes: 60,
    capacity: 8,
    current_participants: 5,
    is_active: false,
    timing: "06:00 PM - 07:00 PM",
    weekdays: ["Tuesday", "Thursday"],
    created_at: "2024-01-20T18:00:00Z",
    notification_sent: true,
    responses: [],
  },
]

const weekdayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(
    mockActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [notificationType, setNotificationType] = useState<"all" | "near_full">("all")
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    duration_minutes: "",
    capacity: "",
    timing: "",
    weekdays: [] as string[],
  })

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && activity.is_active) ||
      (statusFilter === "inactive" && !activity.is_active)
    return matchesSearch && matchesStatus
  })

  const handleWeekdayChange = (weekday: string, checked: boolean) => {
    if (checked) {
      setNewActivity({
        ...newActivity,
        weekdays: [...newActivity.weekdays, weekday],
      })
    } else {
      setNewActivity({
        ...newActivity,
        weekdays: newActivity.weekdays.filter((day) => day !== weekday),
      })
    }
  }

  const handleAddActivity = () => {
    if (activities.length >= 5) {
      toast.error("Maximum 5 activities allowed!")
      return
    }

    const activity = {
      id: activities.length + 1,
      ...newActivity,
      duration_minutes: Number.parseInt(newActivity.duration_minutes),
      capacity: Number.parseInt(newActivity.capacity),
      current_participants: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      notification_sent: false,
      responses: [],
    }

    // Add to beginning (latest first)
    setActivities([activity, ...activities])
    setNewActivity({
      name: "",
      description: "",
      duration_minutes: "",
      capacity: "",
      timing: "",
      weekdays: [],
    })
    setIsAddDialogOpen(false)
    toast.success("Activity added successfully!")
  }

  const handleDeleteActivity = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
    toast.success("Activity deleted successfully!")
  }

  const handleSendNotification = async () => {
    if (!selectedActivity) return

    const recipients =
      notificationType === "all"
        ? "all members"
        : `members for activities ${Math.round((selectedActivity.current_participants / selectedActivity.capacity) * 100)}% full`

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "activity_notification",
          activity_id: selectedActivity.id,
          notification_type: notificationType,
          title: `${selectedActivity.name} - Class Update`,
          message: `Join us for ${selectedActivity.name} on ${selectedActivity.weekdays.join(", ")} at ${selectedActivity.timing}`,
        }),
      })

      const result = await response.json()
      if (result.data) {
        // Update notification sent status
        setActivities(
          activities.map((activity) =>
            activity.id === selectedActivity.id ? { ...activity, notification_sent: true } : activity,
          ),
        )

        toast.success(`Notifications sent to ${recipients}! 📧`)
        setIsNotificationDialogOpen(false)
        setSelectedActivity(null)
      }
    } catch (error) {
      toast.error("Failed to send notifications")
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
          <h2 className="text-3xl font-bold tracking-tight">Activities</h2>
          <p className="text-muted-foreground">Manage gym activities and classes (Max 5 activities)</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={activities.length >= 5}>
                <Plus className="mr-2 h-4 w-4" />
                Add Activity {activities.length >= 5 && "(Max Reached)"}
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>Create a new activity with timing and weekday schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={newActivity.duration_minutes}
                  onChange={(e) => setNewActivity({ ...newActivity, duration_minutes: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newActivity.capacity}
                  onChange={(e) => setNewActivity({ ...newActivity, capacity: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timing" className="text-right">
                  Timing
                </Label>
                <Input
                  id="timing"
                  value={newActivity.timing}
                  onChange={(e) => setNewActivity({ ...newActivity, timing: e.target.value })}
                  placeholder="e.g., 10:00 AM - 12:00 PM"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Weekdays</Label>
                <div className="col-span-3 space-y-2">
                  {weekdayOptions.map((weekday) => (
                    <div key={weekday} className="flex items-center space-x-2">
                      <Checkbox
                        id={weekday}
                        checked={newActivity.weekdays.includes(weekday)}
                        onCheckedChange={(checked) => handleWeekdayChange(weekday, checked as boolean)}
                      />
                      <Label htmlFor={weekday} className="text-sm">
                        {weekday}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddActivity}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!newActivity.name || !newActivity.timing || newActivity.weekdays.length === 0}
              >
                Add Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Activities",
            value: `${activities.length}/5`,
            icon: Activity,
            color: "text-blue-600",
          },
          {
            title: "Active Activities",
            value: activities.filter((a) => a.is_active).length,
            icon: Activity,
            color: "text-green-600",
          },
          {
            title: "Total Participants",
            value: activities.reduce((sum, a) => sum + a.current_participants, 0),
            icon: Users,
            color: "text-purple-600",
          },
          {
            title: "Avg. Capacity",
            value: `${Math.round(activities.reduce((sum, a) => sum + (a.current_participants / a.capacity) * 100, 0) / activities.length || 0)}%`,
            icon: Users,
            color: "text-emerald-600",
          },
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card>
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
            placeholder="Search activities..."
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
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Activities Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Activities List (Sorted by Latest)</CardTitle>
            <CardDescription>Manage all activities with automatic notifications and member responses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Weekdays</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity, index) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.duration_minutes} minutes
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {activity.timing}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {activity.current_participants}/{activity.capacity}
                          </span>
                        </div>
                        <Badge
                          variant={
                            activity.current_participants >= activity.capacity * 0.8
                              ? "destructive"
                              : activity.current_participants >= activity.capacity * 0.5
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {Math.round((activity.current_participants / activity.capacity) * 100)}% full
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {activity.weekdays.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={activity.notification_sent ? "secondary" : "destructive"}>
                            {activity.notification_sent ? "Sent" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedActivity(activity)
                              setNotificationType("all")
                              setIsNotificationDialogOpen(true)
                            }}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            All
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedActivity(activity)
                              setNotificationType("near_full")
                              setIsNotificationDialogOpen(true)
                            }}
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Near Full
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activity.is_active ? "default" : "secondary"}>
                        {activity.is_active ? "Active" : "Inactive"}
                      </Badge>
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
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Responses ({activity.responses.length})
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteActivity(activity.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Send Activity Notification
            </DialogTitle>
            <DialogDescription>
              Send notification for "{selectedActivity?.name}" to{" "}
              {notificationType === "all" ? "all members" : "members for near-full activities"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Activity Details:</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedActivity?.name}
                </p>
                <p>
                  <strong>Time:</strong> {selectedActivity?.timing}
                </p>
                <p>
                  <strong>Days:</strong> {selectedActivity?.weekdays.join(", ")}
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedActivity?.current_participants}/{selectedActivity?.capacity}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                {notificationType === "all"
                  ? "This will send notifications to all gym members about this activity."
                  : "This will send notifications to members for activities that are nearly full (80%+ capacity)."}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} className="bg-blue-600 hover:bg-blue-700">
              Send Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
