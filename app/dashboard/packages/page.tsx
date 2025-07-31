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
} from "lucide-react"
import { motion } from "framer-motion"

// Mock data for packages
const mockPackages = [
  {
    id: 1,
    name: "Basic Monthly",
    description: "Access to gym equipment and basic facilities",
    duration: 30,
    price: 49.99,
    discountPercentage: 0,
    subscribers: 85,
    isActive: true,
    features: ["Gym Access", "Locker Room", "Basic Equipment"],
  },
  {
    id: 2,
    name: "Premium Monthly",
    description: "Full access including classes and personal training",
    duration: 30,
    price: 89.99,
    discountPercentage: 10,
    subscribers: 120,
    isActive: true,
    features: ["All Basic Features", "Group Classes", "1 PT Session", "Nutrition Consultation"],
  },
  {
    id: 3,
    name: "Basic Quarterly",
    description: "3-month basic package with discount",
    duration: 90,
    price: 129.99,
    discountPercentage: 15,
    subscribers: 45,
    isActive: true,
    features: ["Gym Access", "Locker Room", "Basic Equipment", "Quarterly Assessment"],
  },
  {
    id: 4,
    name: "Premium Annual",
    description: "Full year premium access with maximum benefits",
    duration: 365,
    price: 899.99,
    discountPercentage: 25,
    subscribers: 78,
    isActive: true,
    features: ["All Premium Features", "Unlimited PT Sessions", "Meal Plans", "Priority Booking"],
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
    features: ["Gym Access", "Student ID Required", "Off-peak Hours Only"],
  },
]

export default function PackagesPage() {
  const [packages, setPackages] = useState(mockPackages)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    discountPercentage: "",
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

  const handleAddPackage = () => {
    const pkg = {
      id: packages.length + 1,
      ...newPackage,
      duration: Number.parseInt(newPackage.duration),
      price: Number.parseFloat(newPackage.price),
      discountPercentage: Number.parseInt(newPackage.discountPercentage) || 0,
      subscribers: 0,
      isActive: true,
      features: ["Basic Features"],
    }
    setPackages([...packages, pkg])
    setNewPackage({
      name: "",
      description: "",
      duration: "",
      price: "",
      discountPercentage: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeletePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id))
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
          <p className="text-muted-foreground">Manage membership packages and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Package
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Package</DialogTitle>
              <DialogDescription>Create a new membership package for your gym.</DialogDescription>
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPackage} className="bg-emerald-600 hover:bg-emerald-700">
                Add Package
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
          { title: "Total Packages", value: packages.length, icon: Package, color: "text-blue-600" },
          {
            title: "Active Packages",
            value: packages.filter((p) => p.isActive).length,
            icon: Package,
            color: "text-green-600",
          },
          {
            title: "Total Subscribers",
            value: packages.reduce((sum, p) => sum + p.subscribers, 0),
            icon: Package,
            color: "text-purple-600",
          },
          {
            title: "Avg. Price",
            value: `$${(packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toFixed(0)}`,
            icon: DollarSign,
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
            <CardDescription>Manage all membership packages and their pricing details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Subscribers</TableHead>
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
                      {pkg.discountPercentage > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Percent className="mr-1 h-3 w-3" />
                          {pkg.discountPercentage}% OFF
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">No discount</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{pkg.subscribers}</div>
                      <div className="text-xs text-muted-foreground">subscribers</div>
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
    </motion.div>
  )
}
