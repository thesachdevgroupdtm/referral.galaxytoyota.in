"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Car, DollarSign, Home, LogOut, Menu, Settings, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

interface WithdrawalRequest {
  id: number
  amount: number
  status: string
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
}

export default function AdminWithdrawalsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
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

  // Fetch withdrawals data
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch("/api/withdrawals")
        const data = await response.json()
        if (response.ok) {
          setWithdrawals(data.withdrawals)
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      fetchWithdrawals()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const handleApproveWithdrawal = async (withdrawalId: number, status: string) => {
    try {
      const response = await fetch("/api/withdrawals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          withdrawalId,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })

        // Update the withdrawal status in the local state
        setWithdrawals((prev) => prev.map((w) => (w.id === withdrawalId ? { ...w, status } : w)))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update withdrawal status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "rejected":
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
                    href="/admin/withdrawals"
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
            <Link href="/admin/withdrawals" className="text-sm font-medium text-red-600">
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
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
              <p className="text-muted-foreground">Approve or reject user withdrawal requests</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading withdrawal requests...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Withdrawal Requests</CardTitle>
                <CardDescription>Manage user withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {withdrawal.user_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{withdrawal.user_name}</div>
                          <div className="text-sm text-muted-foreground">{withdrawal.user_email}</div>
                          <div className="text-xs text-muted-foreground">
                            Requested: {new Date(withdrawal.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{withdrawal.amount.toLocaleString()}</div>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </Badge>
                        </div>
                        {withdrawal.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveWithdrawal(withdrawal.id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproveWithdrawal(withdrawal.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {withdrawals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No withdrawal requests found.</p>
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
