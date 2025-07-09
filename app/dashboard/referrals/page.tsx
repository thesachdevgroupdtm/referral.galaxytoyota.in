"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Car, Copy, DollarSign, Home, LogOut, Menu, Settings, Share2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface Referral {
  id: number
  referee_name: string
  referee_email: string
  referee_phone?: string
  status: string
  reward_amount: number
  notes?: string
  created_at: string
  updated_at: string
  car_name?: string
  car_model?: string
}

export default function ReferralsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    }
  }, [user])

  // Fetch user's referrals
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/referrals/user?userId=${user.id}`)
        const data = await response.json()
        if (response.ok) {
          setReferrals(data.referrals)
        }
      } catch (error) {
        console.error("Error fetching referrals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferrals()
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code)
    toast({
      title: "Referral code copied!",
      description: "Your referral code has been copied to clipboard.",
    })
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Approved"
      case "pending":
        return "Pending"
      case "cancelled":
        return "Cancelled"
      default:
        return status
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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
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
            <Link href="/dashboard/referrals" className="text-sm font-medium text-red-600">
              My Referrals
            </Link>
            <Link href="/dashboard/cars" className="text-sm font-medium hover:text-red-600">
              Cars
            </Link>
            <Link href="/dashboard/rewards" className="text-sm font-medium hover:text-red-600">
              Rewards
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600" />
            </Button>
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
              <h1 className="text-3xl font-bold">My Referrals</h1>
              <p className="text-muted-foreground">Track your referral activity and earnings</p>
            </div>
          </div>

          {/* Referral Code Card */}
          <Card className="mb-8 bg-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Your Referral Code</h2>
                  <p className="text-red-100">Share this code to earn ₹10,000 per successful referral</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-white/10 px-4 py-2 font-mono text-lg font-bold">
                    {user.referral_code}
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30"
                    onClick={handleCopyReferralCode}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                </div>
                <Button className="bg-white text-red-600 hover:bg-red-50">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{referrals.length}</div>
                <p className="text-xs text-muted-foreground">Lifetime referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{referrals.filter((r) => r.status === "completed").length}</div>
                <p className="text-xs text-muted-foreground">Successful conversions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₹
                  {referrals
                    .filter((r) => r.status === "completed")
                    .reduce((sum, r) => sum + r.reward_amount, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From approved referrals</p>
              </CardContent>
            </Card>
          </div>

          {/* Referrals List */}
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>All your referral activities</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading referrals...</div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {referral.referee_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{referral.referee_name}</div>
                          <div className="text-sm text-muted-foreground">{referral.referee_email}</div>
                          {referral.car_name && (
                            <div className="text-xs text-muted-foreground">Car: {referral.car_name}</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(referral.status)}>{getStatusText(referral.status)}</Badge>
                        {referral.status === "completed" && (
                          <div className="text-sm font-medium text-green-600 mt-1">
                            +₹{referral.reward_amount.toLocaleString()}
                          </div>
                        )}
                        {referral.status === "pending" && (
                          <div className="text-xs text-muted-foreground mt-1">Pending admin approval</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No referrals yet. Start sharing your referral code!</p>
                    </div>
                  )}
                </div>
              )}
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
