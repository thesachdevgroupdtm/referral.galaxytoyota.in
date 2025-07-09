"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, CarIcon, Copy, DollarSign, Home, LogOut, Menu, Settings, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface Car {
  id: number
  name: string
  brand: string
  model: string
  price: number
  original_price?: number
  description: string
  fuel_type: string
  transmission: string
  year: number
  features: string
  image_url?: string
  referral_reward: number
  is_popular: boolean
  discount_amount?: number
}

export default function CarsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    }
  }, [user])

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars")
        const data = await response.json()
        if (response.ok) {
          setCars(data.cars)
        }
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCars()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const generateReferralLink = (carId: number) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/register?ref=${user.referral_code}&car=${carId}`
  }

  const handleCopyReferralLink = (carId: number, carName: string) => {
    const link = generateReferralLink(carId)
    navigator.clipboard.writeText(link)
    toast({
      title: "Referral link copied!",
      description: `Referral link for ${carName} copied to clipboard.`,
    })
  }

  const handleShareWhatsApp = (carId: number, carName: string) => {
    const link = generateReferralLink(carId)
    const message = `Check out this amazing ${carName} at Galaxy Toyota! Use my referral link to get a special discount: ${link}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
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
                  <CarIcon className="h-6 w-6 text-red-600" />
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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
                  >
                    <CarIcon className="h-4 w-4" />
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
              <CarIcon className="h-6 w-6 text-red-600" />
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
            <Link href="/dashboard/cars" className="text-sm font-medium text-red-600">
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
              <h1 className="text-3xl font-bold">Toyota Cars</h1>
              <p className="text-muted-foreground">Browse our collection and refer to friends</p>
            </div>
          </div>

          {/* Referral Info Card */}
          <Card className="mb-8 bg-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Earn ₹10,000 per Referral!</h2>
                  <p className="text-red-100">Share any car with your referral code and earn rewards</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-white/10 px-4 py-2 font-mono text-lg font-bold">
                    {user.referral_code}
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30"
                    onClick={() => {
                      navigator.clipboard.writeText(user.referral_code)
                      toast({ title: "Referral code copied!" })
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cars Grid */}
          {loading ? (
            <div className="text-center py-8">Loading cars...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={car.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={car.name}
                      className="w-full h-48 object-cover"
                    />
                    {car.is_popular && <Badge className="absolute top-2 left-2 bg-red-600">🔥 Popular</Badge>}
                    {car.discount_amount && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        ₹{car.discount_amount.toLocaleString()} OFF
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{car.name}</CardTitle>
                    <CardDescription>
                      {car.year} • {car.fuel_type} • {car.transmission}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-red-600">₹{car.price.toLocaleString()}</div>
                      {car.original_price && (
                        <div className="text-lg text-gray-500 line-through">₹{car.original_price.toLocaleString()}</div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>

                    <div className="text-sm font-medium text-green-600">
                      Referral Reward: ₹{car.referral_reward.toLocaleString()}
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => handleCopyReferralLink(car.id, car.name)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Referral Link
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShareWhatsApp(car.id, car.name)}>
                          WhatsApp
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/cars/${car.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {cars.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cars available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <CarIcon className="h-5 w-5 text-red-600" />
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
