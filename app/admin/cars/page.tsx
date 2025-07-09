"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Car, CreditCard, Home, LogOut, Menu, Plus, Settings, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

interface AdminCar {
  id: number
  name: string
  brand: string
  model: string
  price: number
  original_price?: number
  year: number
  fuel_type: string
  transmission: string
  referral_reward: number
  is_active: boolean
  is_popular: boolean
  created_at: string
}

export default function AdminCarsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cars, setCars] = useState<AdminCar[]>([])
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

    if (user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      fetchCars()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
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
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
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
            <Link href="/admin/users" className="text-sm font-medium hover:text-red-600">
              Users
            </Link>
            <Link href="/admin/referrals" className="text-sm font-medium hover:text-red-600">
              Referrals
            </Link>
            <Link href="/admin/cars" className="text-sm font-medium text-red-600">
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
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Car Management</h1>
                <p className="text-muted-foreground">Manage car inventory and referral rewards</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Car
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading cars...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Cars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{cars.length}</div>
                    <p className="text-xs text-muted-foreground">In inventory</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Cars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{cars.filter((c) => c.is_active).length}</div>
                    <p className="text-xs text-muted-foreground">Available for sale</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Popular Cars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{cars.filter((c) => c.is_popular).length}</div>
                    <p className="text-xs text-muted-foreground">Featured models</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Reward</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ₹
                      {cars.length > 0
                        ? Math.round(cars.reduce((sum, c) => sum + c.referral_reward, 0) / cars.length).toLocaleString()
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Per referral</p>
                  </CardContent>
                </Card>
              </div>

              {/* Cars Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=200&width=300"
                        alt={car.name}
                        className="w-full h-48 object-cover"
                      />
                      {car.is_popular && <Badge className="absolute top-2 left-2 bg-red-600">🔥 Popular</Badge>}
                      {!car.is_active && <Badge className="absolute top-2 right-2 bg-gray-600">Inactive</Badge>}
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
                          <div className="text-lg text-gray-500 line-through">
                            ₹{car.original_price.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="text-sm font-medium text-green-600">
                        Referral Reward: ₹{car.referral_reward.toLocaleString()}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant={car.is_active ? "destructive" : "default"} size="sm" className="flex-1">
                          {car.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {cars.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No cars in inventory.</p>
                </div>
              )}
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
