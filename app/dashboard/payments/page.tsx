"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  CreditCard,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Filter,
  Receipt,
  Plus,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    invoiceId: "INV-2024-001",
    memberName: "John Doe",
    memberEmail: "john.doe@email.com",
    packageName: "Premium Monthly",
    amount: 89.99,
    paymentMode: "Credit Card",
    transactionDate: "2024-01-15",
    paymentStatus: "Paid",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    invoiceId: "INV-2024-002",
    memberName: "Sarah Wilson",
    memberEmail: "sarah.wilson@email.com",
    packageName: "Basic Quarterly",
    amount: 129.99,
    paymentMode: "Bank Transfer",
    transactionDate: "2024-01-10",
    paymentStatus: "Paid",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    invoiceId: "INV-2024-003",
    memberName: "Mike Johnson",
    memberEmail: "mike.johnson@email.com",
    packageName: "Premium Annual",
    amount: 899.99,
    paymentMode: "UPI",
    transactionDate: "2023-12-20",
    paymentStatus: "Paid",
    dueDate: "2023-12-20",
  },
  {
    id: 4,
    invoiceId: "INV-2024-004",
    memberName: "Emma Davis",
    memberEmail: "emma.davis@email.com",
    packageName: "Basic Monthly",
    amount: 49.99,
    paymentMode: "Cash",
    transactionDate: null,
    paymentStatus: "Overdue",
    dueDate: "2024-01-25",
  },
  {
    id: 5,
    invoiceId: "INV-2024-005",
    memberName: "Alex Brown",
    memberEmail: "alex.brown@email.com",
    packageName: "Premium Monthly",
    amount: 89.99,
    paymentMode: "Credit Card",
    transactionDate: null,
    paymentStatus: "Pending",
    dueDate: "2024-02-05",
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentModeFilter, setPaymentModeFilter] = useState("all")
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false)
  const [addingPayment, setAddingPayment] = useState(false)
  const [newPayment, setNewPayment] = useState({
    memberName: "",
    memberEmail: "",
    packageName: "",
    amount: "",
    paymentMode: "",
    paymentStatus: "Paid",
    transactionDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
    const matchesPaymentMode =
      paymentModeFilter === "all" || payment.paymentMode.toLowerCase() === paymentModeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesPaymentMode
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentModeColor = (mode: string) => {
    const colors = {
      "Credit Card": "bg-blue-100 text-blue-800",
      "Debit Card": "bg-purple-100 text-purple-800",
      "Bank Transfer": "bg-green-100 text-green-800",
      UPI: "bg-orange-100 text-orange-800",
      Cash: "bg-gray-100 text-gray-800",
    }
    return colors[mode as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTotalRevenue = () => {
    return payments.filter((p) => p.paymentStatus === "Paid").reduce((sum, p) => sum + p.amount, 0)
  }

  const getPendingAmount = () => {
    return payments
      .filter((p) => p.paymentStatus === "Pending" || p.paymentStatus === "Overdue")
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const handleAddPayment = async () => {
    setAddingPayment(true)
    try {
      const response = await fetch("/api/payments/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPayment,
          amount: Number.parseFloat(newPayment.amount),
        }),
      })

      const result = await response.json()

      if (result.data) {
        setPayments([result.data, ...payments])
        setNewPayment({
          memberName: "",
          memberEmail: "",
          packageName: "",
          amount: "",
          paymentMode: "",
          paymentStatus: "Paid",
          transactionDate: new Date().toISOString().split("T")[0],
          dueDate: new Date().toISOString().split("T")[0],
        })
        setIsAddPaymentDialogOpen(false)
        toast.success("Payment record added successfully! 💰", {
          description: `Payment of $${newPayment.amount} has been recorded.`,
        })
      } else {
        toast.error("Failed to add payment record")
      }
    } catch (error) {
      console.error("Error adding payment:", error)
      toast.error("Failed to add payment record")
    } finally {
      setAddingPayment(false)
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
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Track payments, invoices, and revenue</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="text-green-600 hover:text-green-700 bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Payment History Manually</DialogTitle>
                <DialogDescription>Record a payment transaction manually for tracking purposes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="memberName" className="text-right">
                    Member Name
                  </Label>
                  <Input
                    id="memberName"
                    value={newPayment.memberName}
                    onChange={(e) => setNewPayment({ ...newPayment, memberName: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter member name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="memberEmail" className="text-right">
                    Member Email
                  </Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    value={newPayment.memberEmail}
                    onChange={(e) => setNewPayment({ ...newPayment, memberEmail: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter member email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="packageName" className="text-right">
                    Package
                  </Label>
                  <Select onValueChange={(value) => setNewPayment({ ...newPayment, packageName: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic Monthly">Basic Monthly</SelectItem>
                      <SelectItem value="Premium Monthly">Premium Monthly</SelectItem>
                      <SelectItem value="Basic Quarterly">Basic Quarterly</SelectItem>
                      <SelectItem value="Premium Annual">Premium Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="relative col-span-3">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMode" className="text-right">
                    Payment Mode
                  </Label>
                  <Select onValueChange={(value) => setNewPayment({ ...newPayment, paymentMode: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentStatus" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newPayment.paymentStatus}
                    onValueChange={(value) => setNewPayment({ ...newPayment, paymentStatus: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transactionDate" className="text-right">
                    Transaction Date
                  </Label>
                  <Input
                    id="transactionDate"
                    type="date"
                    value={newPayment.transactionDate}
                    onChange={(e) => setNewPayment({ ...newPayment, transactionDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newPayment.dueDate}
                    onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPayment}
                  disabled={
                    addingPayment ||
                    !newPayment.memberName ||
                    !newPayment.amount ||
                    !newPayment.packageName ||
                    !newPayment.paymentMode
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {addingPayment ? "Adding..." : "Add Payment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Receipt className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </motion.div>
        </div>
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
            title: "Total Revenue",
            value: `$${getTotalRevenue().toFixed(2)}`,
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            title: "Pending Payments",
            value: `$${getPendingAmount().toFixed(2)}`,
            icon: AlertTriangle,
            color: "text-yellow-600",
          },
          {
            title: "Paid Invoices",
            value: payments.filter((p) => p.paymentStatus === "Paid").length,
            icon: CheckCircle,
            color: "text-blue-600",
          },
          {
            title: "Overdue",
            value: payments.filter((p) => p.paymentStatus === "Overdue").length,
            icon: AlertTriangle,
            color: "text-red-600",
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
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
          <SelectTrigger className="w-[150px]">
            <CreditCard className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="credit card">Credit Card</SelectItem>
            <SelectItem value="debit card">Debit Card</SelectItem>
            <SelectItem value="bank transfer">Bank Transfer</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Complete payment history with invoice details and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{payment.invoiceId}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.memberName}</div>
                        <div className="text-sm text-muted-foreground">{payment.memberEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.packageName}</TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                        {payment.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentModeColor(payment.paymentMode)}>{payment.paymentMode}</Badge>
                    </TableCell>
                    <TableCell>
                      {payment.transactionDate ? (
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {new Date(payment.transactionDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not paid</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Invoice
                          </DropdownMenuItem>
                          {payment.paymentStatus !== "Paid" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
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
