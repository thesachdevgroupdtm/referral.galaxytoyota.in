"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, Copy, DollarSign, Home, LogOut, Menu, Settings, Share2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function DashboardPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [friendName, setFriendName] = useState("")
  const [friendEmail, setFriendEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Redirect if not authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/referrals/user?userId=${user.id}`)
        const data = await response.json()
        if (response.ok) {
          // Update user data with actual referral count
          // This will be handled by the auth context
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (user) {
      fetchUserData()
    }
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

  const handleSendReferral = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!friendName || !friendEmail) {
      toast({
        title: "Error",
        description: "Please fill in both name and email fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/referrals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrerId: user.id,
          refereeName: friendName,
          refereeEmail: friendEmail,
          referralCode: user.referral_code,
          message: message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Referral sent!",
          description: `Your referral invitation has been sent to ${friendName}`,
        })
        // Clear form
        setFriendName("")
        setFriendEmail("")
        setMessage("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send referral",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send referral. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const tierProgress = Math.min((user.total_referrals / 7) * 100, 100)

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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
            <Link href="/dashboard" className="text-sm font-medium text-red-600">
              Dashboard
            </Link>
            <Link href="/dashboard/referrals" className="text-sm font-medium hover:text-red-600">
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's an overview of your referral program activity.</p>
          </div>

          {/* Referral Code Card */}
          <Card className="mb-8 bg-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Your Referral Code</h2>
                  <p className="text-red-100">Share this code with friends and earn rewards</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Rewards Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{user.total_earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Available: ₹{user.available_balance.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.total_referrals}</div>
                <p className="text-xs text-muted-foreground">Keep referring to earn more!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {user.total_referrals >= 15 ? "Platinum" : user.total_referrals >= 7 ? "Gold" : "Silver"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.total_referrals < 7
                    ? `${7 - user.total_referrals} more for Gold`
                    : user.total_referrals < 15
                      ? `${15 - user.total_referrals} more for Platinum`
                      : "Maximum tier reached!"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tier Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Referral Tier Progress</CardTitle>
              <CardDescription>
                {user.total_referrals < 7
                  ? `You're ${7 - user.total_referrals} referrals away from Gold tier`
                  : user.total_referrals < 15
                    ? `${15 - user.total_referrals} more for Platinum tier`
                    : "Congratulations! You've reached the highest tier!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">
                      {user.total_referrals >= 15 ? "Platinum" : user.total_referrals >= 7 ? "Gold" : "Silver"}
                    </Badge>
                    <span className="font-medium">Current Tier</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{user.total_referrals}/15 referrals</div>
                </div>
                <Progress value={tierProgress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <div>Silver (0)</div>
                  <div>Gold (7)</div>
                  <div>Platinum (15)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refer a Friend */}
          <Card>
            <CardHeader>
              <CardTitle>Refer a Friend</CardTitle>
              <CardDescription>Send a referral invitation to your friends</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendReferral} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="friend-name" className="text-sm font-medium">
                      Friend's Name
                    </label>
                    <Input
                      id="friend-name"
                      placeholder="Enter friend's name"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="friend-email" className="text-sm font-medium">
                      Friend's Email
                    </label>
                    <Input
                      id="friend-email"
                      type="email"
                      placeholder="Enter friend's email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Add a personal message..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  <Share2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Referral"}
                </Button>
              </form>
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
