"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, CreditCard, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface SmartMemberFormProps {
  onSubmit: (memberData: any) => void
  loading?: boolean
}

export function SmartMemberForm({ onSubmit, loading = false }: SmartMemberFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    emergency_contact: "",
    emergency_contact_name: "",
    address: "",
    package_id: "2", // Default to Premium Monthly
    payment_method: "Credit Card",
    notes: "",
    referral_source: "",
    health_conditions: "",
    fitness_goals: "",
  })

  const [suggestions, setSuggestions] = useState({
    package: null as any,
    emergencyContact: "",
    fitnessGoals: [] as string[],
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Auto-suggestions based on user input
  useEffect(() => {
    // Auto-suggest emergency contact based on name similarity
    if (formData.full_name && formData.full_name.length > 2) {
      const firstName = formData.full_name.split(" ")[0]
      setSuggestions((prev) => ({
        ...prev,
        emergencyContact: `${firstName} Family Contact`,
      }))
    }

    // Auto-suggest package based on age (if date of birth is provided)
    if (formData.date_of_birth) {
      const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear()
      let suggestedPackage = null

      if (age < 25) {
        suggestedPackage = { id: "1", name: "Basic Monthly", reason: "Great starter package for young adults" }
      } else if (age >= 25 && age < 50) {
        suggestedPackage = { id: "2", name: "Premium Monthly", reason: "Perfect for working professionals" }
      } else {
        suggestedPackage = { id: "3", name: "Basic Quarterly", reason: "Flexible option for mature members" }
      }

      setSuggestions((prev) => ({ ...prev, package: suggestedPackage }))
    }
  }, [formData.full_name, formData.date_of_birth])

  // Auto-fill emergency contact name
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, full_name: value }))

    // Auto-suggest emergency contact name
    if (value && !formData.emergency_contact_name) {
      const firstName = value.split(" ")[0]
      setFormData((prev) => ({
        ...prev,
        emergency_contact_name: `${firstName}'s Emergency Contact`,
      }))
    }
  }

  // Auto-format phone number
  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    let formatted = cleaned

    if (cleaned.length >= 6) {
      formatted = `+1 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
    } else if (cleaned.length >= 3) {
      formatted = `+1 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    } else if (cleaned.length > 0) {
      formatted = `+1 ${cleaned}`
    }

    setFormData((prev) => ({ ...prev, phone: formatted }))
  }

  // Auto-generate email suggestion
  const handleEmailSuggestion = () => {
    if (formData.full_name && !formData.email) {
      const name = formData.full_name.toLowerCase().replace(/\s+/g, ".")
      const suggestion = `${name}@gmail.com`
      setFormData((prev) => ({ ...prev, email: suggestion }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.full_name.trim()) errors.full_name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    if (!formData.phone.trim()) errors.phone = "Phone is required"
    if (!formData.gender) errors.gender = "Gender is required"
    if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Auto-fill additional data
      const memberData = {
        ...formData,
        date_of_joining: new Date().toISOString().split("T")[0],
        status: "Active",
        notes: formData.notes || `New member joined on ${new Date().toLocaleDateString()}. Welcome to FitnessPro!`,
      }
      onSubmit(memberData)
    }
  }

  const fitnessGoalOptions = [
    "Weight Loss",
    "Muscle Building",
    "General Fitness",
    "Strength Training",
    "Cardio Improvement",
    "Flexibility",
    "Sports Performance",
    "Rehabilitation",
  ]

  const referralSources = [
    "Google Search",
    "Social Media",
    "Friend Referral",
    "Walk-in",
    "Advertisement",
    "Website",
    "Other Gym",
    "Corporate Program",
  ]

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Smart Suggestions Card */}
      {suggestions.package && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Smart Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-emerald-800">{suggestions.package.name}</p>
                  <p className="text-sm text-emerald-600">{suggestions.package.reason}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 bg-transparent"
                  onClick={() => setFormData((prev) => ({ ...prev, package_id: suggestions.package.id }))}
                >
                  Use This
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic member details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter member's full name"
                className={validationErrors.full_name ? "border-red-500" : ""}
              />
              {validationErrors.full_name && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.full_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              >
                <SelectTrigger className={validationErrors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                Email *
                {!formData.email && formData.full_name && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEmailSuggestion}
                    className="h-auto p-1 text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Auto-fill
                  </Button>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="member@example.com"
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+1 234 567 8900"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                className={validationErrors.date_of_birth ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Street address, City, State"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
          <CardDescription>Person to contact in case of emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergency_contact_name: e.target.value }))}
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact">Contact Phone</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergency_contact: e.target.value }))}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership & Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Membership & Payment
          </CardTitle>
          <CardDescription>Select membership package and payment method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="package_id">Membership Package</Label>
              <Select
                value={formData.package_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, package_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex flex-col">
                      <span>Basic Monthly - $49.99</span>
                      <span className="text-xs text-muted-foreground">Gym access + basic facilities</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex flex-col">
                      <span>Premium Monthly - $89.99</span>
                      <span className="text-xs text-muted-foreground">All access + classes + 1 PT session</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex flex-col">
                      <span>Basic Quarterly - $129.99</span>
                      <span className="text-xs text-muted-foreground">3 months basic with 15% discount</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex flex-col">
                      <span>Premium Annual - $899.99</span>
                      <span className="text-xs text-muted-foreground">Full year premium with 25% discount</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Optional details to personalize the member experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fitness_goals">Fitness Goals</Label>
              <Select
                value={formData.fitness_goals}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, fitness_goals: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary fitness goal" />
                </SelectTrigger>
                <SelectContent>
                  {fitnessGoalOptions.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="referral_source">How did you hear about us?</Label>
              <Select
                value={formData.referral_source}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, referral_source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select referral source" />
                </SelectTrigger>
                <SelectContent>
                  {referralSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="health_conditions">Health Conditions (Optional)</Label>
            <Textarea
              id="health_conditions"
              value={formData.health_conditions}
              onChange={(e) => setFormData((prev) => ({ ...prev, health_conditions: e.target.value }))}
              placeholder="Any health conditions or injuries we should be aware of..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about the member..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button">
          Save as Draft
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {loading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              Adding Member...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Add Member
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
