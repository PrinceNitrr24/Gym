"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Target,
  Plus,
  Copy,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Mock data for Personal Trainer reports
const mockPTReports = [
  {
    id: 1,
    serialNumber: "PT001",
    memberName: "John Doe",
    memberId: "M001",
    personalTrainerName: "David Smith",
    amount: 150.0,
    createdOn: "2024-01-15T10:00:00Z",
    updatedOn: "2024-01-15T10:00:00Z",
    joiningDate: "2024-01-15",
    expiryDate: "2024-02-15",
    ptPayDate: "2024-01-15",
    month: "January 2024",
    status: "Active",
  },
  {
    id: 2,
    serialNumber: "PT002",
    memberName: "Sarah Wilson",
    memberId: "M002",
    personalTrainerName: "Maria Rodriguez",
    amount: 200.0,
    createdOn: "2024-01-20T14:30:00Z",
    updatedOn: "2024-01-20T14:30:00Z",
    joiningDate: "2024-01-20",
    expiryDate: "2024-02-20",
    ptPayDate: "2024-01-20",
    month: "January 2024",
    status: "Active",
  },
  {
    id: 3,
    serialNumber: "PT003",
    memberName: "Mike Johnson",
    memberId: "M003",
    personalTrainerName: "James Wilson",
    amount: 175.0,
    createdOn: "2024-02-01T09:15:00Z",
    updatedOn: "2024-02-01T09:15:00Z",
    joiningDate: "2024-02-01",
    expiryDate: "2024-03-01",
    ptPayDate: "2024-02-01",
    month: "February 2024",
    status: "Active",
  },
  {
    id: 4,
    serialNumber: "PT004",
    memberName: "Emma Davis",
    memberId: "M004",
    personalTrainerName: "David Smith",
    amount: 180.0,
    createdOn: "2024-01-10T16:45:00Z",
    updatedOn: "2024-01-10T16:45:00Z",
    joiningDate: "2024-01-10",
    expiryDate: "2024-02-10",
    ptPayDate: "2024-01-10",
    month: "January 2024",
    status: "Expired",
  },
]

const availableTrainers = ["David Smith", "Maria Rodriguez", "James Wilson", "Lisa Chen"]

export default function ReportsPage() {
  const [ptReports, setPtReports] = useState(mockPTReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")
  const [trainerFilter, setTrainerFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPTReport, setNewPTReport] = useState({
    memberName: "",
    memberId: "",
    personalTrainerName: "",
    amount: "",
    joiningDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  })

  const filteredReports = ptReports.filter((report) => {
    const matchesSearch =
      report.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.personalTrainerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = monthFilter === "all" || report.month.includes(monthFilter)
    const matchesTrainer = trainerFilter === "all" || report.personalTrainerName === trainerFilter
    return matchesSearch && matchesMonth && matchesTrainer
  })

  const calculateMonth = (joiningDate: string) => {
    const date = new Date(joiningDate)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const generateSerialNumber = () => {
    const nextNumber = ptReports.length + 1
    return `PT${nextNumber.toString().padStart(3, "0")}`
  }

  const handleAddPTReport = () => {
    const report = {
      id: ptReports.length + 1,
      serialNumber: generateSerialNumber(),
      ...newPTReport,
      amount: Number.parseFloat(newPTReport.amount),
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      ptPayDate: newPTReport.joiningDate,
      month: calculateMonth(newPTReport.joiningDate),
      status: "Active",
    }
    setPtReports([...ptReports, report])
    setNewPTReport({
      memberName: "",
      memberId: "",
      personalTrainerName: "",
      amount: "",
      joiningDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
    })
    setIsAddDialogOpen(false)
    toast.success("PT Report added successfully!")
  }

  const handleDuplicate = (report: any) => {
    const duplicatedReport = {
      ...report,
      id: ptReports.length + 1,
      serialNumber: generateSerialNumber(),
      joiningDate: "",
      expiryDate: "",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      ptPayDate: "",
      month: "",
      status: "Active",
    }
    setPtReports([...ptReports, duplicatedReport])
    toast.success("PT Report duplicated successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTotalRevenue = () => {
    return ptReports.reduce((sum, report) => sum + report.amount, 0)
  }

  const getActiveReports = () => {
    return ptReports.filter((report) => report.status === "Active").length
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
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Personal trainer reports and comprehensive gym insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add PT Report
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Personal Trainer Report</DialogTitle>
                <DialogDescription>Create a new personal trainer report entry.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="memberName" className="text-right">
                    Member Name *
                  </Label>
                  <Input
                    id="memberName"
                    value={newPTReport.memberName}
                    onChange={(e) => setNewPTReport({ ...newPTReport, memberName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="memberId" className="text-right">
                    Member ID *
                  </Label>
                  <Input
                    id="memberId"
                    value={newPTReport.memberId}
                    onChange={(e) => setNewPTReport({ ...newPTReport, memberId: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="trainerName" className="text-right">
                    PT Name *
                  </Label>
                  <Select onValueChange={(value) => setNewPTReport({ ...newPTReport, personalTrainerName: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTrainers.map((trainer) => (
                        <SelectItem key={trainer} value={trainer}>
                          {trainer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newPTReport.amount}
                    onChange={(e) => setNewPTReport({ ...newPTReport, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joiningDate" className="text-right">
                    Joining Date *
                  </Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={newPTReport.joiningDate}
                    onChange={(e) => setNewPTReport({ ...newPTReport, joiningDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newPTReport.expiryDate}
                    onChange={(e) => setNewPTReport({ ...newPTReport, expiryDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPTReport}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={
                    !newPTReport.memberName ||
                    !newPTReport.memberId ||
                    !newPTReport.personalTrainerName ||
                    !newPTReport.amount ||
                    !newPTReport.joiningDate ||
                    !newPTReport.expiryDate
                  }
                >
                  Add Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total PT Revenue",
            value: `$${getTotalRevenue().toFixed(2)}`,
            change: "+15%",
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            title: "Active PT Sessions",
            value: getActiveReports(),
            change: "+8%",
            icon: Users,
            color: "text-blue-600",
          },
          { title: "PT Completion Rate", value: "92%", change: "+3%", icon: Target, color: "text-purple-600" },
          {
            title: "Avg. Session Value",
            value: `$${(getTotalRevenue() / ptReports.length).toFixed(0)}`,
            change: "+12%",
            icon: Activity,
            color: "text-orange-600",
          },
        ].map((metric, index) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                >
                  {metric.value}
                </motion.div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  {metric.change} from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Personal Trainer Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Personal Trainer Reports</CardTitle>
            <CardDescription>Detailed tracking of personal trainer sessions and payments</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by member name, ID, or trainer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="January">January 2024</SelectItem>
                  <SelectItem value="February">February 2024</SelectItem>
                  <SelectItem value="March">March 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={trainerFilter} onValueChange={setTrainerFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by trainer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trainers</SelectItem>
                  {availableTrainers.map((trainer) => (
                    <SelectItem key={trainer} value={trainer}>
                      {trainer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Member Name/ID</TableHead>
                  <TableHead>Personal Trainer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created/Updated</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>PT Pay Date</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{report.serialNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.memberName}</div>
                        <div className="text-sm text-muted-foreground">{report.memberId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{report.personalTrainerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        {report.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Created: {new Date(report.createdOn).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Updated: {new Date(report.updatedOn).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {new Date(report.joiningDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {new Date(report.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {new Date(report.ptPayDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.month}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDuplicate(report)} className="mr-2">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>PT Revenue Trend</CardTitle>
              <CardDescription>Personal trainer revenue over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">PT Revenue Chart</p>
                  <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trainer Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Trainer Performance</CardTitle>
              <CardDescription>Individual trainer session counts and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Trainer Performance Chart</p>
                  <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
