"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, CreditCard, Download, Home, LogOut, Menu, Settings, User, Users, DollarSign } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

interface DashboardStats {
  total_users: number
  total_referrals: number
  completed_referrals: number
  total_cars: number
  total_rewards_paid: number
}

interface RecentReferral {
  id: number
  referee_name: string
  referee_email: string
  status: string
  reward_amount: number
  created_at: string
  referrer_name: string
  referrer_email: string
}

interface TopReferrer {
  name: string
  email: string
  referral_code: string
  referral_count: number
  total_earnings: number
}

export default function AdminDashboardPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([])
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    } else if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      window.location.href = "/dashboard"
    }
  }, [user])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        if (response.ok) {
          setStats(data.stats)
          setRecentReferrals(data.recentReferrals)
          setTopReferrers(data.topReferrers)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      fetchDashboardData()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center gap-2 pb-4">
                  <Car className="h-6 w-6 text-red-600" />
                  <span className="text-xl font-bold">Galaxy Toyota</span>
                  <Badge className="ml-2 bg-red-600">Admin</Badge>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Link>
                  <Link
                    href="/admin/referrals"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    Referrals
                  </Link>
                  <Link
                    href="/admin/cars"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Car className="h-4 w-4" />
                    Cars
                  </Link>
                  <Link
                    href="/admin/payments"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <CreditCard className="h-4 w-4" />
                    Payments
                  </Link>
                  <Link
                    href="/admin/withdrawals"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <DollarSign className="h-4 w-4" />
                    Withdrawals
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">Galaxy Toyota</span>
              <Badge className="bg-red-600">Admin</Badge>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-sm font-medium text-red-600">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium hover:text-red-600">
              Users
            </Link>
            <Link href="/admin/referrals" className="text-sm font-medium hover:text-red-600">
              Referrals
            </Link>
            <Link href="/admin/cars" className="text-sm font-medium hover:text-red-600">
              Cars
            </Link>
            <Link href="/admin/payments" className="text-sm font-medium hover:text-red-600">
              Payments
            </Link>
            <Link href="/admin/withdrawals" className="text-sm font-medium hover:text-red-600">
              Withdrawals
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <NotificationsDropdown userId={user.id} />
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your referral program and users.</p>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading dashboard data...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.total_users || 0}</div>
                    <p className="text-xs text-muted-foreground">Active accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.total_referrals || 0}</div>
                    <p className="text-xs text-muted-foreground">Total referrals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.completed_referrals || 0}</div>
                    <p className="text-xs text-muted-foreground">Approved referrals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Rewards Paid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{(stats?.total_rewards_paid || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total payouts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Referral Performance */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Referral Performance</CardTitle>
                  <CardDescription>Monthly referral completion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Current Performance</p>
                        <p className="text-xs text-muted-foreground">
                          {stats?.total_referrals
                            ? Math.round((stats.completed_referrals / stats.total_referrals) * 100)
                            : 0}
                          % completion rate
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {stats?.completed_referrals || 0}/{stats?.total_referrals || 0}
                      </div>
                    </div>
                    <Progress
                      value={stats?.total_referrals ? (stats.completed_referrals / stats.total_referrals) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest referral activities</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {referral.referrer_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {referral.referrer_name} referred {referral.referee_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(referral.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                    {recentReferrals.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No recent referral activities</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Referrers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Referrers</CardTitle>
                  <CardDescription>Users with most referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topReferrers.map((referrer, index) => (
                      <div key={referrer.email} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{referrer.name}</div>
                            <div className="text-sm text-muted-foreground">{referrer.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{referrer.referral_count} referrals</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{referrer.total_earnings.toLocaleString()} earned
                          </div>
                        </div>
                      </div>
                    ))}
                    {topReferrers.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No referrers yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Galaxy Toyota</span>
            </div>
            <p className="text-center text-xs text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Galaxy Toyota. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
