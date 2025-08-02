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
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Percent,
  Filter,
  Clock,
  Bell,
  Send,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Mock data for packages (limited to 5)
const mockPackages = [
  {
    id: 1,
    name: "Premium Monthly",
    description: "Full access including classes and personal training",
    duration: 30,
    price: 89.99,
    discountPercentage: 10,
    subscribers: 120,
    isActive: true,
    timing: "10:00 AM - 12:00 PM",
    weekdays: ["Monday", "Wednesday", "Friday"],
    notificationSent: true,
    responses: [
      { member: "John Doe", status: "interested" },
      { member: "Sarah Wilson", status: "maybe" },
    ],
    features: ["All Basic Features", "Group Classes", "1 PT Session", "Nutrition Consultation"],
  },
  {
    id: 2,
    name: "Basic Monthly",
    description: "Access to gym equipment and basic facilities",
    duration: 30,
    price: 49.99,
    discountPercentage: 0,
    subscribers: 85,
    isActive: true,
    timing: "08:00 AM - 10:00 AM",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    notificationSent: false,
    responses: [],
    features: ["Gym Access", "Locker Room", "Basic Equipment"],
  },
  {
    id: 3,
    name: "Premium Annual",
    description: "Full year premium access with maximum benefits",
    duration: 365,
    price: 899.99,
    discountPercentage: 25,
    subscribers: 78,
    isActive: true,
    timing: "02:00 PM - 04:00 PM",
    weekdays: ["Tuesday", "Thursday", "Saturday"],
    notificationSent: true,
    responses: [{ member: "Mike Johnson", status: "interested" }],
    features: ["All Premium Features", "Unlimited PT Sessions", "Meal Plans", "Priority Booking"],
  },
  {
    id: 4,
    name: "Basic Quarterly",
    description: "3-month basic package with discount",
    duration: 90,
    price: 129.99,
    discountPercentage: 15,
    subscribers: 45,
    isActive: true,
    timing: "04:00 PM - 06:00 PM",
    weekdays: ["Monday", "Wednesday", "Friday"],
    notificationSent: false,
    responses: [],
    features: ["Gym Access", "Locker Room", "Basic Equipment", "Quarterly Assessment"],
  },
  {
    id: 5,
    name: "Student Package",
    description: "Special discounted package for students",
    duration: 30,
    price: 29.99,
    discountPercentage: 40,
    subscribers: 32,
    isActive: false,
    timing: "06:00 PM - 08:00 PM",
    weekdays: ["Tuesday", "Thursday"],
    notificationSent: true,
    responses: [],
    features: ["Gym Access", "Student ID Required", "Off-peak Hours Only"],
  },
]

const weekdayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function PackagesPage() {
  const [packages, setPackages] = useState(mockPackages)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [notificationType, setNotificationType] = useState<"all" | "interested">("all")
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    discountPercentage: "",
    timing: "",
    weekdays: [] as string[],
  })

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && pkg.isActive) ||
      (statusFilter === "inactive" && !pkg.isActive)
    return matchesSearch && matchesStatus
  })

  const getDurationText = (days: number) => {
    if (days === 30) return "Monthly"
    if (days === 90) return "Quarterly"
    if (days === 365) return "Annual"
    return `${days} days`
  }

  const getDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100
  }

  const handleWeekdayChange = (weekday: string, checked: boolean) => {
    if (checked) {
      setNewPackage({
        ...newPackage,
        weekdays: [...newPackage.weekdays, weekday],
      })
    } else {
      setNewPackage({
        ...newPackage,
        weekdays: newPackage.weekdays.filter((day) => day !== weekday),
      })
    }
  }

  const handleAddPackage = () => {
    if (packages.length >= 5) {
      toast.error("Maximum 5 packages allowed!")
      return
    }

    const pkg = {
      id: packages.length + 1,
      ...newPackage,
      duration: Number.parseInt(newPackage.duration),
      price: Number.parseFloat(newPackage.price),
      discountPercentage: Number.parseInt(newPackage.discountPercentage) || 0,
      subscribers: 0,
      isActive: true,
      notificationSent: false,
      responses: [],
      features: ["Basic Features"],
    }
    setPackages([...packages, pkg])
    setNewPackage({
      name: "",
      description: "",
      duration: "",
      price: "",
      discountPercentage: "",
      timing: "",
      weekdays: [],
    })
    setIsAddDialogOpen(false)
    toast.success("Package added successfully!")
  }

  const handleDeletePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id))
    toast.success("Package deleted successfully!")
  }

  const handleSendNotification = async () => {
    if (!selectedPackage) return

    const recipients = notificationType === "all" ? "all members" : `members interested in ${selectedPackage.name}`

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "package_notification",
          package_id: selectedPackage.id,
          notification_type: notificationType,
          title: `${selectedPackage.name} - Package Update`,
          message: `Check out our ${selectedPackage.name} package available ${selectedPackage.weekdays.join(", ")} at ${selectedPackage.timing}`,
        }),
      })

      const result = await response.json()
      if (result.data) {
        // Update notification sent status
        setPackages(packages.map((pkg) => (pkg.id === selectedPackage.id ? { ...pkg, notificationSent: true } : pkg)))

        toast.success(`Notifications sent to ${recipients}! 📧`)
        setIsNotificationDialogOpen(false)
        setSelectedPackage(null)
      }
    } catch (error) {
      toast.error("Failed to send notifications")
    }
  }

  const togglePackageStatus = (id: number) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg)))
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
          <h2 className="text-3xl font-bold tracking-tight">Packages</h2>
          <p className="text-muted-foreground">
            Manage membership packages with timing and notifications (Max 5 packages)
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={packages.length >= 5}>
                <Plus className="mr-2 h-4 w-4" />
                Add Package {packages.length >= 5 && "(Max Reached)"}
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Package</DialogTitle>
              <DialogDescription>Create a new membership package with timing and weekday schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (days)
                </Label>
                <Select onValueChange={(value) => setNewPackage({ ...newPackage, duration: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days (Monthly)</SelectItem>
                    <SelectItem value="90">90 days (Quarterly)</SelectItem>
                    <SelectItem value="365">365 days (Annual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">
                  Discount (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={newPackage.discountPercentage}
                  onChange={(e) => setNewPackage({ ...newPackage, discountPercentage: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timing" className="text-right">
                  Timing
                </Label>
                <Input
                  id="timing"
                  value={newPackage.timing}
                  onChange={(e) => setNewPackage({ ...newPackage, timing: e.target.value })}
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
                        checked={newPackage.weekdays.includes(weekday)}
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
                onClick={handleAddPackage}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!newPackage.name || !newPackage.timing || newPackage.weekdays.length === 0}
              >
                Add Package
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards - Removed total subscribers, min, max, avg as requested */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: "Total Packages", value: `${packages.length}/5`, icon: Package, color: "text-blue-600" },
          {
            title: "Active Packages",
            value: packages.filter((p) => p.isActive).length,
            icon: Package,
            color: "text-green-600",
          },
          {
            title: "With Notifications",
            value: packages.filter((p) => p.notificationSent).length,
            icon: Bell,
            color: "text-purple-600",
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
            placeholder="Search packages..."
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
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Packages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Packages List</CardTitle>
            <CardDescription>
              Manage all membership packages with automatic notifications and member responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Weekdays</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg, index) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-sm text-muted-foreground">{pkg.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{pkg.subscribers} subscribers</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {getDurationText(pkg.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {pkg.discountPercentage > 0 ? (
                          <>
                            <div className="flex items-center">
                              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-green-600">
                                ${getDiscountedPrice(pkg.price, pkg.discountPercentage).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground line-through">${pkg.price.toFixed(2)}</div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Percent className="mr-1 h-3 w-3" />
                              {pkg.discountPercentage}% OFF
                            </Badge>
                          </>
                        ) : (
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">${pkg.price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {pkg.timing}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pkg.weekdays.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={pkg.notificationSent ? "secondary" : "destructive"}>
                            {pkg.notificationSent ? "Sent" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPackage(pkg)
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
                              setSelectedPackage(pkg)
                              setNotificationType("interested")
                              setIsNotificationDialogOpen(true)
                            }}
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Interested
                          </Button>
                        </div>
                        {pkg.responses.length > 0 && (
                          <div className="text-xs text-muted-foreground">{pkg.responses.length} responses</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => togglePackageStatus(pkg.id)}>
                            <Package className="mr-2 h-4 w-4" />
                            {pkg.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePackage(pkg.id)}>
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
              Send Package Notification
            </DialogTitle>
            <DialogDescription>
              Send notification for "{selectedPackage?.name}" to{" "}
              {notificationType === "all" ? "all members" : "interested members"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Package Details:</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedPackage?.name}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedPackage?.price}
                </p>
                <p>
                  <strong>Time:</strong> {selectedPackage?.timing}
                </p>
                <p>
                  <strong>Days:</strong> {selectedPackage?.weekdays.join(", ")}
                </p>
                <p>
                  <strong>Subscribers:</strong> {selectedPackage?.subscribers}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                {notificationType === "all"
                  ? "This will send notifications to all gym members about this package."
                  : "This will send notifications to members who have shown interest in this package."}
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
