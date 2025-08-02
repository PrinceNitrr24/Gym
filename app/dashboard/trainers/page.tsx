"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  UserCheck,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Star,
  Filter,
  Upload,
  FileText,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Mock data for trainers with enhanced fields
const mockTrainers = [
  {
    id: 1,
    name: "David Smith",
    email: "david.smith@gym.com",
    phone: "+1 234 567 8910",
    specializations: ["Strength Training", "CrossFit"],
    employmentType: "Full-time",
    joinedDate: "2023-06-15",
    rating: 4.8,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    govtIdType: "Aadhar",
    govtIdNum: "1234-5678-9012",
    attachments: [
      { id: 1, name: "Certificate.pdf", size: "2.5 MB", type: "application/pdf" },
      { id: 2, name: "Resume.pdf", size: "1.2 MB", type: "application/pdf" },
    ],
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria.rodriguez@gym.com",
    phone: "+1 234 567 8911",
    specializations: ["Yoga", "Pilates", "Dance"],
    employmentType: "Part-time",
    joinedDate: "2023-08-20",
    rating: 4.9,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    govtIdType: "Driving Licence",
    govtIdNum: "DL123456789",
    attachments: [{ id: 3, name: "Yoga_Certification.pdf", size: "3.1 MB", type: "application/pdf" }],
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.wilson@gym.com",
    phone: "+1 234 567 8912",
    specializations: ["Cardio", "HIIT"],
    employmentType: "Full-time",
    joinedDate: "2023-05-10",
    rating: 4.7,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    govtIdType: "Aadhar",
    govtIdNum: "9876-5432-1098",
    attachments: [],
  },
]

const availableSpecializations = [
  "Strength Training",
  "Cardio",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Boxing",
  "Swimming",
  "Dance",
  "HIIT",
  "Martial Arts",
]

const govtIdTypes = ["Aadhar", "Driving Licence"]

export default function TrainersPage() {
  const [trainers, setTrainers] = useState(mockTrainers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    specializations: [] as string[],
    employmentType: "",
    govtIdType: "",
    govtIdNum: "",
  })

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specializations.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || trainer.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmploymentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "bg-blue-100 text-blue-800"
      case "part-time":
        return "bg-purple-100 text-purple-800"
      case "freelance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    if (checked) {
      setNewTrainer({
        ...newTrainer,
        specializations: [...newTrainer.specializations, specialization],
      })
    } else {
      setNewTrainer({
        ...newTrainer,
        specializations: newTrainer.specializations.filter((spec) => spec !== specialization),
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const totalFiles = selectedFiles.length + files.length

    if (totalFiles > 5) {
      toast.error("Maximum 5 files allowed!")
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum 10MB allowed.`)
        return false
      }
      return true
    })

    setSelectedFiles([...selectedFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleAddTrainer = () => {
    const trainer = {
      id: trainers.length + 1,
      ...newTrainer,
      joinedDate: new Date().toISOString().split("T")[0],
      rating: 0,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
      attachments: selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type,
      })),
    }
    setTrainers([...trainers, trainer])
    setNewTrainer({
      name: "",
      email: "",
      phone: "",
      specializations: [],
      employmentType: "",
      govtIdType: "",
      govtIdNum: "",
    })
    setSelectedFiles([])
    setIsAddDialogOpen(false)
    toast.success("Trainer added successfully!")
  }

  const handleDeleteTrainer = (id: number) => {
    setTrainers(trainers.filter((trainer) => trainer.id !== id))
    toast.success("Trainer deleted successfully!")
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
          <h2 className="text-3xl font-bold tracking-tight">Trainers</h2>
          <p className="text-muted-foreground">Manage your gym trainers with attachments and specializations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Trainer
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Trainer</DialogTitle>
              <DialogDescription>Add a new trainer with attachments and government ID details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newTrainer.email}
                  onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  value={newTrainer.phone}
                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="govtIdType" className="text-right">
                  Govt ID Type *
                </Label>
                <Select onValueChange={(value) => setNewTrainer({ ...newTrainer, govtIdType: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {govtIdTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="govtIdNum" className="text-right">
                  Govt ID Number *
                </Label>
                <Input
                  id="govtIdNum"
                  value={newTrainer.govtIdNum}
                  onChange={(e) => setNewTrainer({ ...newTrainer, govtIdNum: e.target.value })}
                  placeholder="Enter alphanumeric ID"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Specializations *</Label>
                <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
                  {availableSpecializations.map((specialization) => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialization}
                        checked={newTrainer.specializations.includes(specialization)}
                        onCheckedChange={(checked) => handleSpecializationChange(specialization, checked as boolean)}
                      />
                      <Label htmlFor={specialization} className="text-sm">
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employment" className="text-right">
                  Employment *
                </Label>
                <Select onValueChange={(value) => setNewTrainer({ ...newTrainer, employmentType: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Attachments</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full bg-transparent">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files (Max 5, 10MB each)
                      </Button>
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG</div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTrainer}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={
                  !newTrainer.name ||
                  !newTrainer.email ||
                  !newTrainer.phone ||
                  !newTrainer.govtIdType ||
                  !newTrainer.govtIdNum ||
                  newTrainer.specializations.length === 0 ||
                  !newTrainer.employmentType
                }
              >
                Add Trainer
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
          { title: "Total Trainers", value: trainers.length, icon: UserCheck, color: "text-blue-600" },
          {
            title: "Active Trainers",
            value: trainers.filter((t) => t.status === "Active").length,
            icon: UserCheck,
            color: "text-green-600",
          },
          { title: "Average Rating", value: "4.7", icon: Star, color: "text-yellow-600" },
          {
            title: "With Attachments",
            value: trainers.filter((t) => t.attachments.length > 0).length,
            icon: FileText,
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
            placeholder="Search trainers..."
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Trainers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Trainers List</CardTitle>
            <CardDescription>
              Complete trainer information with government ID, attachments, and specializations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Government ID</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead>Attachments</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainers.map((trainer, index) => (
                  <motion.tr
                    key={trainer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={trainer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {trainer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{trainer.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Joined {new Date(trainer.joinedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {trainer.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {trainer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">{trainer.govtIdType}</Badge>
                        <div className="text-sm text-muted-foreground">{trainer.govtIdNum}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {trainer.specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEmploymentColor(trainer.employmentType)}>{trainer.employmentType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{trainer.attachments.length} files</span>
                        {trainer.attachments.length > 0 && (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{trainer.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trainer.status)}>{trainer.status}</Badge>
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
                            <Upload className="mr-2 h-4 w-4" />
                            Update Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTrainer(trainer.id)}>
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
