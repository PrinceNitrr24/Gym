"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { UserX, UserCheck, AlertTriangle, CheckCircle, RefreshCw, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Member {
  id: string
  full_name: string
  email: string
  phone: string
  status: string
  package_name?: string
  date_of_joining: string
  cancellation_reason?: string
  cancellation_date?: string
}

interface MemberQuickActionsProps {
  member: Member
  onMemberUpdate: (updatedMember: Member) => void
}

export function MemberQuickActions({ member, onMemberUpdate }: MemberQuickActionsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Auto-filled cancellation form
  const [cancellationData, setCancellationData] = useState({
    reason: "",
    effectiveDate: new Date().toISOString().split("T")[0], // Today's date
    refundAmount: "0.00",
    notes: "",
  })

  // Auto-filled reactivation form
  const [reactivationData, setReactivationData] = useState({
    packageId: "1", // Default package
    startDate: new Date().toISOString().split("T")[0], // Today's date
    promoCode: "",
    notes: `Reactivating membership for ${member.full_name}`,
  })

  const cancellationReasons = [
    "Moving to different location",
    "Financial constraints",
    "Health issues",
    "Dissatisfied with services",
    "Found alternative gym",
    "Temporary break",
    "Other",
  ]

  const handleCancelMembership = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/members/${member.id}/cancel-membership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancellationData),
      })

      const result = await response.json()

      if (result.success) {
        onMemberUpdate({
          ...member,
          status: "Cancelled",
          cancellation_reason: cancellationData.reason,
          cancellation_date: cancellationData.effectiveDate,
        })
        setCancelDialogOpen(false)
        toast.success(`${member.full_name}'s membership has been cancelled successfully!`, {
          description: `Effective date: ${new Date(cancellationData.effectiveDate).toLocaleDateString()}`,
        })
      } else {
        toast.error("Failed to cancel membership")
      }
    } catch (error) {
      console.error("Error cancelling membership:", error)
      toast.error("Failed to cancel membership")
    } finally {
      setLoading(false)
    }
  }

  const handleReactivateMembership = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/members/${member.id}/reactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reactivationData),
      })

      const result = await response.json()

      if (result.success) {
        onMemberUpdate({
          ...member,
          status: "Active",
          cancellation_reason: undefined,
          cancellation_date: undefined,
        })
        setReactivateDialogOpen(false)
        toast.success(`${member.full_name}'s membership has been reactivated!`, {
          description: `Welcome back! Membership is now active.`,
        })
      } else {
        toast.error("Failed to reactivate membership")
      }
    } catch (error) {
      console.error("Error reactivating membership:", error)
      toast.error("Failed to reactivate membership")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <UserX className="h-4 w-4 text-red-600" />
      case "expired":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "expired":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Status Badge */}
      <Badge className={`${getStatusColor(member.status)} flex items-center gap-1`}>
        {getStatusIcon(member.status)}
        {member.status}
      </Badge>

      {/* Quick Actions */}
      {member.status.toLowerCase() === "active" && (
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            >
              <UserX className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Cancel Membership - {member.full_name}
              </DialogTitle>
              <DialogDescription>
                This will cancel the member's active subscription. Please provide details below.
              </DialogDescription>
            </DialogHeader>

            <motion.div
              className="space-y-4 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Member Info Card */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.package_name || "Basic Package"}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(member.date_of_joining).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="reason">Cancellation Reason *</Label>
                  <Select
                    value={cancellationData.reason}
                    onValueChange={(value) => setCancellationData({ ...cancellationData, reason: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason for cancellation" />
                    </SelectTrigger>
                    <SelectContent>
                      {cancellationReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={cancellationData.effectiveDate}
                      onChange={(e) => setCancellationData({ ...cancellationData, effectiveDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refundAmount">Refund Amount ($)</Label>
                    <Input
                      id="refundAmount"
                      type="number"
                      step="0.01"
                      value={cancellationData.refundAmount}
                      onChange={(e) => setCancellationData({ ...cancellationData, refundAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the cancellation..."
                    value={cancellationData.notes}
                    onChange={(e) => setCancellationData({ ...cancellationData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Active
              </Button>
              <Button
                onClick={handleCancelMembership}
                disabled={!cancellationData.reason || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Cancel Membership
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {(member.status.toLowerCase() === "cancelled" || member.status.toLowerCase() === "expired") && (
        <Dialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent"
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Reactivate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Reactivate Membership - {member.full_name}
              </DialogTitle>
              <DialogDescription>Welcome back! Let's reactivate this member's subscription.</DialogDescription>
            </DialogHeader>

            <motion.div
              className="space-y-4 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Member Info Card */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-700">Welcome Back!</p>
                    {member.cancellation_date && (
                      <p className="text-xs text-muted-foreground">
                        Cancelled: {new Date(member.cancellation_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="package">Select Package</Label>
                  <Select
                    value={reactivationData.packageId}
                    onValueChange={(value) => setReactivationData({ ...reactivationData, packageId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Basic Monthly - $49.99</SelectItem>
                      <SelectItem value="2">Premium Monthly - $89.99</SelectItem>
                      <SelectItem value="3">Basic Quarterly - $129.99</SelectItem>
                      <SelectItem value="4">Premium Annual - $899.99</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={reactivationData.startDate}
                      onChange={(e) => setReactivationData({ ...reactivationData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                    <Input
                      id="promoCode"
                      placeholder="WELCOME10"
                      value={reactivationData.promoCode}
                      onChange={(e) => setReactivationData({ ...reactivationData, promoCode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reactivationNotes">Welcome Back Message</Label>
                  <Textarea
                    id="reactivationNotes"
                    value={reactivationData.notes}
                    onChange={(e) => setReactivationData({ ...reactivationData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReactivateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleReactivateMembership}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Reactivating...
                  </>
                ) : (
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Reactivate Membership
                  </div>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
