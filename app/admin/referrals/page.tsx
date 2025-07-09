"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Car, CreditCard, Home, LogOut, Menu, Settings, User, Users, DollarSign } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface AdminReferral {
  id: number
  referee_name: string
  referee_email: string
  status: string
  reward_amount: number
  created_at: string
  referrer_name: string
  referrer_email: string
}

export default function AdminReferralsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [referrals, setReferrals] = useState<AdminReferral[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    } else if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      window.location.href = "/dashboard"
    }
  }, [user])

  // Fetch referrals data
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        if (response.ok) {
          setReferrals(data.recentReferrals)
        }
      } catch (error) {
        console.error("Error fetching referrals:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      fetchReferrals()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const handleApproveReferral = async (referralId: number, status: string) => {
    try {
      const response = await fetch("/api/referrals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralId,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })

        // Update the referral status in the local state
        setReferrals((prev) => prev.map((ref) => (ref.id === referralId ? { ...ref, status } : ref)))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update referral status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update referral status",
        variant: "destructive",
      })
    }
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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
                  <Link
                    href="/admin/withdrawals"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <DollarSign className="h-4 w-4" />
                    Withdrawals
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
            <Link href="/admin/referrals" className="text-sm font-medium text-red-600">
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
              <h1 className="text-3xl font-bold">Referral Management</h1>
              <p className="text-muted-foreground">Approve or reject referral requests</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading referrals...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Referrals</CardTitle>
                <CardDescription>Manage referral approvals and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                            {referral.referrer_name} → {referral.referee_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {referral.referrer_email} referred {referral.referee_email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                        {referral.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveReferral(referral.id, "completed")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproveReferral(referral.id, "cancelled")}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {referral.status === "completed" && (
                          <div className="text-sm font-medium text-green-600">
                            ₹{referral.reward_amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No referrals found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
