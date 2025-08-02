"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Palette, Save, Building, Clock, MapPin, Star, Users, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function SettingsPage() {
  const [gymSettings, setGymSettings] = useState({
    gymName: "Demo Fitness Center",
    email: "demo@fitnesspro.com",
    phone: "+1 234 567 8900",
    address: "123 Fitness Street, Health City, HC 12345",
    description: "A modern fitness center dedicated to helping you achieve your health goals.",
    timezone: "America/New_York",
    currency: "USD",
    operatingHours: {
      openTime: "06:00",
      closeTime: "22:00",
      alertBeforeClose: 30, // minutes
    },
    location: {
      latitude: "40.7128",
      longitude: "-74.0060",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    ownerInfo: {
      name: "John Smith",
      email: "owner@fitnesspro.com",
      phone: "+1 234 567 8901",
      license: "GYM123456",
    },
    gymCapacity: 50,
    gymSize: "5000 sq ft",
    sections: ["Cardio", "Strength Training", "Free Weights", "Group Classes"],
    facilities: ["Steam Bath", "Sauna", "Locker Rooms", "Parking", "WiFi"],
    rating: 4.5,
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    membershipExpiry: true,
    paymentReminders: true,
    newMemberAlerts: true,
    systemUpdates: false,
    gymCloseAlert: true,
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    autoHideSidebar: true,
    selectedOptionHighlight: true,
  })

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

  const handleSaveSettings = () => {
    // Here you would typically save to your backend
    console.log("Settings saved:", { gymSettings, notifications, preferences })
    toast.success("Settings saved successfully! ⚙️")
  }

  const handleAddSection = (newSection: string) => {
    if (newSection && !gymSettings.sections.includes(newSection)) {
      setGymSettings({
        ...gymSettings,
        sections: [...gymSettings.sections, newSection],
      })
    }
  }

  const handleRemoveSection = (sectionToRemove: string) => {
    setGymSettings({
      ...gymSettings,
      sections: gymSettings.sections.filter((section) => section !== sectionToRemove),
    })
  }

  const handleAddFacility = (newFacility: string) => {
    if (newFacility && !gymSettings.facilities.includes(newFacility)) {
      setGymSettings({
        ...gymSettings,
        facilities: [...gymSettings.facilities, newFacility],
      })
    }
  }

  const handleRemoveFacility = (facilityToRemove: string) => {
    setGymSettings({
      ...gymSettings,
      facilities: gymSettings.facilities.filter((facility) => facility !== facilityToRemove),
    })
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
          <h2 className="text-3xl font-bold tracking-tight">Gym Settings</h2>
          <p className="text-muted-foreground">Manage your gym information, operations, and preferences</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* Gym Information */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Gym Information
              </CardTitle>
              <CardDescription>Update your gym's basic information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gymName">Gym Name</Label>
                  <Input
                    id="gymName"
                    value={gymSettings.gymName}
                    onChange={(e) => setGymSettings({ ...gymSettings, gymName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={gymSettings.email}
                    onChange={(e) => setGymSettings({ ...gymSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={gymSettings.phone}
                    onChange={(e) => setGymSettings({ ...gymSettings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={gymSettings.timezone}
                    onValueChange={(value) => setGymSettings({ ...gymSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={gymSettings.address}
                  onChange={(e) => setGymSettings({ ...gymSettings, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={gymSettings.description}
                  onChange={(e) => setGymSettings({ ...gymSettings, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Operating Hours & Location */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours & Location
              </CardTitle>
              <CardDescription>Set operating hours with close alerts and location details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={gymSettings.operatingHours.openTime}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        operatingHours: { ...gymSettings.operatingHours, openTime: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={gymSettings.operatingHours.closeTime}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        operatingHours: { ...gymSettings.operatingHours, closeTime: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertTime">Alert Before Close (min)</Label>
                  <Input
                    id="alertTime"
                    type="number"
                    value={gymSettings.operatingHours.alertBeforeClose}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        operatingHours: {
                          ...gymSettings.operatingHours,
                          alertBeforeClose: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={gymSettings.location.city}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        location: { ...gymSettings.location, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={gymSettings.location.state}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        location: { ...gymSettings.location, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={gymSettings.location.latitude}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        location: { ...gymSettings.location, latitude: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={gymSettings.location.longitude}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        location: { ...gymSettings.location, longitude: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Owner Information */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Owner Information
              </CardTitle>
              <CardDescription>Gym owner details and licensing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={gymSettings.ownerInfo.name}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        ownerInfo: { ...gymSettings.ownerInfo, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={gymSettings.ownerInfo.email}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        ownerInfo: { ...gymSettings.ownerInfo, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Owner Phone</Label>
                  <Input
                    id="ownerPhone"
                    value={gymSettings.ownerInfo.phone}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        ownerInfo: { ...gymSettings.ownerInfo, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Business License</Label>
                  <Input
                    id="license"
                    value={gymSettings.ownerInfo.license}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        ownerInfo: { ...gymSettings.ownerInfo, license: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gym Capacity & Size */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Gym Capacity & Size
              </CardTitle>
              <CardDescription>Physical specifications and capacity limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Gym Capacity (people)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={gymSettings.gymCapacity}
                    onChange={(e) => setGymSettings({ ...gymSettings, gymCapacity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Gym Size</Label>
                  <Input
                    id="size"
                    value={gymSettings.gymSize}
                    onChange={(e) => setGymSettings({ ...gymSettings, gymSize: e.target.value })}
                    placeholder="e.g., 5000 sq ft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Gym Rating</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={gymSettings.rating}
                      onChange={(e) => setGymSettings({ ...gymSettings, rating: Number.parseFloat(e.target.value) })}
                    />
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground ml-1">/ 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections & Facilities */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sections & Facilities
              </CardTitle>
              <CardDescription>Manage gym sections and available facilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Gym Sections</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Different areas and sections available in your gym.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {gymSettings.sections.map((section) => (
                    <Badge
                      key={section}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveSection(section)}
                    >
                      {section} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new section (e.g., Yoga Studio)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddSection(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      handleAddSection(input.value)
                      input.value = ""
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-base font-medium">Facilities</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Additional facilities and amenities available to members.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {gymSettings.facilities.map((facility) => (
                    <Badge
                      key={facility}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleRemoveFacility(facility)}
                    >
                      {facility} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new facility (e.g., Juice Bar)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddFacility(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      handleAddFacility(input.value)
                      input.value = ""
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how and when you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gym Close Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get alerts before gym closing time</p>
                  </div>
                  <Switch
                    checked={notifications.gymCloseAlert}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, gymCloseAlert: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Membership Expiry Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when memberships are about to expire</p>
                  </div>
                  <Switch
                    checked={notifications.membershipExpiry}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, membershipExpiry: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send payment reminders to members</p>
                  </div>
                  <Switch
                    checked={notifications.paymentReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminders: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance & UI Preferences */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & UI Preferences
              </CardTitle>
              <CardDescription>Customize the look and behavior of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-hide Sidebar</Label>
                    <p className="text-sm text-muted-foreground">Automatically hide sidebar on mobile</p>
                  </div>
                  <Switch
                    checked={preferences.autoHideSidebar}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoHideSidebar: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Selected Option Highlight</Label>
                    <p className="text-sm text-muted-foreground">Highlight selected navigation options</p>
                  </div>
                  <Switch
                    checked={preferences.selectedOptionHighlight}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, selectedOptionHighlight: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Update your account password for better security.
                  </p>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button variant="outline" className="mt-2 bg-transparent">
                    Update Password
                  </Button>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account.</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Data Export</Label>
                  <p className="text-sm text-muted-foreground mb-3">Download a copy of your gym data.</p>
                  <Button variant="outline">Export Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
