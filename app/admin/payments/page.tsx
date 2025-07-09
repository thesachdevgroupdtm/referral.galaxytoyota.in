"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Car, CreditCard, Download, Home, LogOut, Menu, Settings, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

export default function AdminPaymentsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    } else if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      window.location.href = "/dashboard"
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  // Sample payment data
  const payments = [
    {
      id: 1,
      user_name: "Harsh Patel",
      user_email: "harsh@example.com",
      amount: 10000,
      status: "completed",
      date: "2025-06-10",
      method: "bank_transfer",
      reference: "REF123456",
    },
    {
      id: 2,
      user_name: "Atul Kumar",
      user_email: "atul@example.com",
      amount: 10000,
      status: "pending",
      date: "2025-06-11",
      method: "bank_transfer",
      reference: "REF123457",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "failed":
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
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
            <Link href="/admin/users" className="text-sm font-medium hover:text-red-600">
              Users
            </Link>
            <Link href="/admin/referrals" className="text-sm font-medium hover:text-red-600">
              Referrals
            </Link>
            <Link href="/admin/cars" className="text-sm font-medium hover:text-red-600">
              Cars
            </Link>
            <Link href="/admin/payments" className="text-sm font-medium text-red-600">
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
              <h1 className="text-3xl font-bold">Payment Management</h1>
              <p className="text-muted-foreground">Manage referral reward payments</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ₹
                  {payments
                    .filter((p) => p.status === "completed")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Processed payments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  ₹
                  {payments
                    .filter((p) => p.status === "pending")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">June 2025</p>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All referral reward payments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {payment.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{payment.user_name}</div>
                        <div className="text-sm text-muted-foreground">{payment.user_email}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()} • Ref: {payment.reference}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                      {payment.status === "pending" && (
                        <div className="mt-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Process
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No payment records found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
