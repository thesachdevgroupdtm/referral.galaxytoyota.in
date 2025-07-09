"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Car, DollarSign, Home, LogOut, Menu, Settings, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function RewardsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [hasActivePendingRequest, setHasActivePendingRequest] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    }
  }, [user])

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch(`/api/withdrawals?userId=${user.id}`)
        const data = await response.json()
        if (response.ok) {
          setWithdrawalRequests(data.withdrawals)
          setHasActivePendingRequest(data.withdrawals.some((w: any) => w.status === "pending"))
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
      }
    }

    if (user) {
      fetchWithdrawals()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const handleWithdrawalRequest = async () => {
    if (user.available_balance < 1000) {
      toast({
        title: "Insufficient Balance",
        description: "You need at least ₹1,000 to request a withdrawal.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          amount: user.available_balance,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Request Sent!",
          description: "Your withdrawal request has been submitted for admin approval.",
        })
        setHasActivePendingRequest(true)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit withdrawal request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sample reward transactions
  const transactions = [
    {
      id: 1,
      type: "referral_reward",
      amount: 10000,
      description: "Referral reward for Atul Kumar",
      date: "2025-06-10",
      status: "completed",
    },
    {
      id: 2,
      type: "referral_reward",
      amount: 10000,
      description: "Referral reward for Sarah Robinson",
      date: "2025-06-08",
      status: "completed",
    },
  ]

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
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/referrals"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Users className="h-4 w-4" />
                    My Referrals
                  </Link>
                  <Link
                    href="/dashboard/cars"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Car className="h-4 w-4" />
                    Cars
                  </Link>
                  <Link
                    href="/dashboard/rewards"
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
                  >
                    <DollarSign className="h-4 w-4" />
                    Rewards
                  </Link>
                  <Link
                    href="/dashboard/settings"
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
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-red-600">
              Dashboard
            </Link>
            <Link href="/dashboard/referrals" className="text-sm font-medium hover:text-red-600">
              My Referrals
            </Link>
            <Link href="/dashboard/cars" className="text-sm font-medium hover:text-red-600">
              Cars
            </Link>
            <Link href="/dashboard/rewards" className="text-sm font-medium text-red-600">
              Rewards
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <NotificationsDropdown userId={user.id} />
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
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
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Rewards & Earnings</h1>
              <p className="text-muted-foreground">Track your earnings and withdraw rewards</p>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{user.total_earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{user.available_balance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Ready to withdraw</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">₹0</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Withdraw Rewards</CardTitle>
              <CardDescription>Transfer your earnings to your bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-800 font-medium mb-2">
                  💰 Available for withdrawal: ₹{user.available_balance.toLocaleString()}
                </div>
                <div className="text-xs text-green-700">
                  Minimum withdrawal amount is ₹1,000. Funds will be transferred within 3-5 business days.
                </div>
              </div>

              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={user.available_balance < 1000 || hasActivePendingRequest || isSubmitting}
                onClick={handleWithdrawalRequest}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : hasActivePendingRequest ? "Request Pending" : "Request Withdrawal"}
              </Button>

              {hasActivePendingRequest && (
                <p className="text-xs text-yellow-600">
                  You have a pending withdrawal request awaiting admin approval.
                </p>
              )}

              {user.available_balance < 1000 && (
                <p className="text-xs text-muted-foreground">You need at least ₹1,000 to request a withdrawal.</p>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your reward earnings and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+₹{transaction.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground capitalize">{transaction.status}</div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet. Start referring to earn rewards!</p>
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
