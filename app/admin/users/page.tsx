"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Car, CreditCard, Download, Home, LogOut, Menu, Settings, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  referral_code: string
  phone?: string
  is_active: boolean
  created_at: string
  total_referrals: number
  completed_referrals: number
  total_earnings: number
}

export default function AdminUsersPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<AdminUser[]>([])
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

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      fetchUsers()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referral_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    logout()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-purple-600"
      case "ADMIN":
        return "bg-blue-600"
      default:
        return "bg-green-600"
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
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
            <Link href="/admin/dashboard" className="text-sm font-medium hover:text-red-600">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium text-red-600">
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
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600" />
            </Button>
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
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage all users and their referral activities</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">Active accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Regular Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{users.filter((u) => u.role === "USER").length}</div>
                    <p className="text-xs text-muted-foreground">Standard accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Admin Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {users.filter((u) => u.role === "ADMIN" || u.role === "SUPERADMIN").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Admin accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ₹{users.reduce((sum, u) => sum + u.total_earnings, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">All user earnings</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Search Users</CardTitle>
                  <CardDescription>Find users by name, email, or referral code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Complete list of registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">
                              Code: {user.referral_code} • Joined: {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {user.total_referrals} referrals • ₹{user.total_earnings.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{user.completed_referrals} completed</div>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No users found matching your search.</p>
                      </div>
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
