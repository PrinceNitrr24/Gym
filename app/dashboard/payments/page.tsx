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
} from "lucide-react"
import { motion } from "framer-motion"

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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Receipt className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </motion.div>
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
