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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Clock, Users, Filter, Activity } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for activities
const mockActivities = [
  {
    id: 1,
    name: "Morning Yoga",
    description: "Start your day with relaxing yoga session",
    duration: 60,
    capacity: 20,
    currentParticipants: 15,
    isActive: true,
    category: "Yoga",
  },
  {
    id: 2,
    name: "HIIT Training",
    description: "High-intensity interval training for maximum results",
    duration: 45,
    capacity: 15,
    currentParticipants: 12,
    isActive: true,
    category: "Cardio",
  },
  {
    id: 3,
    name: "Strength Training",
    description: "Build muscle and increase strength",
    duration: 90,
    capacity: 10,
    currentParticipants: 8,
    isActive: true,
    category: "Strength",
  },
  {
    id: 4,
    name: "Pilates",
    description: "Core strengthening and flexibility",
    duration: 50,
    capacity: 12,
    currentParticipants: 10,
    isActive: true,
    category: "Pilates",
  },
  {
    id: 5,
    name: "Boxing Class",
    description: "Learn boxing techniques and get fit",
    duration: 60,
    capacity: 16,
    currentParticipants: 5,
    isActive: false,
    category: "Boxing",
  },
  {
    id: 6,
    name: "Swimming Lessons",
    description: "Learn to swim or improve your technique",
    duration: 45,
    capacity: 8,
    currentParticipants: 6,
    isActive: true,
    category: "Swimming",
  },
]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(mockActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    duration: "",
    capacity: "",
    category: "",
  })

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && activity.isActive) ||
      (statusFilter === "inactive" && !activity.isActive)
    return matchesSearch && matchesStatus
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      Yoga: "bg-purple-100 text-purple-800",
      Cardio: "bg-red-100 text-red-800",
      Strength: "bg-blue-100 text-blue-800",
      Pilates: "bg-pink-100 text-pink-800",
      Boxing: "bg-orange-100 text-orange-800",
      Swimming: "bg-cyan-100 text-cyan-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const handleAddActivity = () => {
    const activity = {
      id: activities.length + 1,
      ...newActivity,
      duration: Number.parseInt(newActivity.duration),
      capacity: Number.parseInt(newActivity.capacity),
      currentParticipants: 0,
      isActive: true,
    }
    setActivities([...activities, activity])
    setNewActivity({
      name: "",
      description: "",
      duration: "",
      capacity: "",
      category: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteActivity = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const toggleActivityStatus = (id: number) => {
    setActivities(
      activities.map((activity) => (activity.id === id ? { ...activity, isActive: !activity.isActive } : activity)),
    )
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
          <p className="text-muted-foreground">Manage gym activities, classes, and schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>Create a new activity or class for your gym members.</DialogDescription>
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
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
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
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Pilates">Pilates</SelectItem>
                    <SelectItem value="Boxing">Boxing</SelectItem>
                    <SelectItem value="Swimming">Swimming</SelectItem>
                    <SelectItem value="Dance">Dance</SelectItem>
                    <SelectItem value="Martial Arts">Martial Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddActivity} className="bg-emerald-600 hover:bg-emerald-700">
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
          { title: "Total Activities", value: activities.length, icon: Activity, color: "text-blue-600" },
          {
            title: "Active Activities",
            value: activities.filter((a) => a.isActive).length,
            icon: Activity,
            color: "text-green-600",
          },
          {
            title: "Total Participants",
            value: activities.reduce((sum, a) => sum + a.currentParticipants, 0),
            icon: Users,
            color: "text-purple-600",
          },
          {
            title: "Average Duration",
            value: `${Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / activities.length)}min`,
            icon: Clock,
            color: "text-orange-600",
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
            <CardTitle>Activities List</CardTitle>
            <CardDescription>Manage all gym activities, classes, and their schedules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Participants</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(activity.category)}>{activity.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {activity.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        {activity.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-medium ${getCapacityColor(activity.currentParticipants, activity.capacity)}`}
                      >
                        {activity.currentParticipants}/{activity.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((activity.currentParticipants / activity.capacity) * 100)}% full
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activity.isActive ? "default" : "secondary"}>
                        {activity.isActive ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => toggleActivityStatus(activity.id)}>
                            <Activity className="mr-2 h-4 w-4" />
                            {activity.isActive ? "Deactivate" : "Activate"}
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
    </motion.div>
  )
}
