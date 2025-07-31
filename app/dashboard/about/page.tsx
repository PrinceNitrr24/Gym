"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Target, Users, Award, Mail, Phone, MapPin, Globe, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
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

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Gym Owner & Founder",
      experience: "15+ years",
      specialization: "Business Management",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Mike Rodriguez",
      role: "Head Trainer",
      experience: "12+ years",
      specialization: "Strength & Conditioning",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Lisa Chen",
      role: "Nutrition Specialist",
      experience: "8+ years",
      specialization: "Sports Nutrition",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const achievements = [
    { title: "Best Gym 2023", organization: "Fitness Awards" },
    { title: "Customer Choice Award", organization: "Local Business Awards" },
    { title: "Excellence in Service", organization: "Health & Fitness Association" },
    { title: "Community Impact Award", organization: "City Council" },
  ]

  return (
    <motion.div
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight mb-2">About FitnessPro</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Empowering fitness journeys since 2010. We're more than just a gym - we're your partners in health and
          wellness.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div className="grid gap-4 md:grid-cols-2" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-emerald-600" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide a welcoming, inclusive environment where people of all fitness levels can achieve their
                health and wellness goals through expert guidance, state-of-the-art equipment, and a supportive
                community.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600" />
                <CardTitle>Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be the leading fitness destination that transforms lives by making health and fitness accessible,
                enjoyable, and sustainable for everyone in our community.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid gap-4 md:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
        {[
          { title: "Happy Members", value: "500+", icon: Users, color: "text-blue-600" },
          { title: "Years of Service", value: "14+", icon: Award, color: "text-green-600" },
          { title: "Expert Trainers", value: "25+", icon: Users, color: "text-purple-600" },
          { title: "Success Stories", value: "1000+", icon: Star, color: "text-yellow-600" },
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

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meet Our Team</CardTitle>
            <CardDescription>
              Our experienced team of professionals is dedicated to helping you achieve your fitness goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-emerald-600 font-medium">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.experience} experience</p>
                  <Badge variant="outline" className="mt-2">
                    {member.specialization}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Our Achievements
            </CardTitle>
            <CardDescription>Recognition and awards that reflect our commitment to excellence.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.organization}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>Have questions or want to learn more? We'd love to hear from you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">123 Fitness Street, Health City, HC 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">info@fitnesspro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-sm text-muted-foreground">www.fitnesspro.com</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Operating Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-muted-foreground">5:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">7:00 AM - 9:00 PM</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
