"use client"

import type * as React from "react"
import { BarChart3, Calendar, CreditCard, Home, Package, Settings, Users, UserCheck, Info, Bell } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
      badge: "342",
    },
    {
      title: "Trainers",
      url: "/dashboard/trainers",
      icon: UserCheck,
      badge: "12",
    },
    {
      title: "Activities",
      url: "/dashboard/activities",
      icon: Calendar,
      badge: "8",
    },
    {
      title: "Packages",
      url: "/dashboard/packages",
      icon: Package,
      badge: "6",
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: CreditCard,
      badge: "12",
      badgeVariant: "destructive" as const,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "About Us",
      url: "/dashboard/about",
      icon: Info,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <motion.div
          className="flex items-center gap-2 px-2 py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="h-4 w-4" />
          </motion.div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">FitnessPro</span>
            <span className="truncate text-xs text-muted-foreground">Gym Management</span>
          </div>
        </motion.div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <item.icon />
                        </motion.div>
                        <span>{item.title}</span>
                        {item.badge && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Badge variant={item.badgeVariant || "secondary"} className="ml-auto">
                              {item.badge}
                            </Badge>
                          </motion.div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <item.icon />
                        </motion.div>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <motion.div
          className="p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-lg bg-muted p-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">3 pending alerts</p>
            </div>
          </motion.div>
        </motion.div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
