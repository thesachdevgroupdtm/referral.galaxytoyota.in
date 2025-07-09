"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Car, Fuel, Heart, Settings, Share2, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ShareModal } from "@/components/share-modal"

interface CarDetail {
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
  image_url: string
  referral_reward: number
  friend_discount: number
  is_popular: boolean
  discount_amount?: number
}

export default function CarDetailPage() {
  const params = useParams()
  const carId = Number.parseInt(params.id as string)
  const [car, setCar] = useState<CarDetail | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [referralFormData, setReferralFormData] = useState({
    yourName: "",
    yourEmail: "",
    friendName: "",
    friendEmail: "",
    friendPhone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Mock car images
  const carImages = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch("/api/cars")
        const data = await response.json()
        if (response.ok) {
          const foundCar = data.cars.find((c: CarDetail) => c.id === carId)
          if (foundCar) {
            setCar(foundCar)
          }
        }
      } catch (error) {
        console.error("Error fetching car details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCarDetails()
  }, [carId])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const validateReferralForm = () => {
    const newErrors: Record<string, string> = {}

    if (!referralFormData.yourName.trim()) {
      newErrors.yourName = "Your name is required"
    }

    if (!referralFormData.yourEmail) {
      newErrors.yourEmail = "Your email is required"
    } else if (!validateEmail(referralFormData.yourEmail)) {
      newErrors.yourEmail = "Please enter a valid email address"
    }

    if (!referralFormData.friendName.trim()) {
      newErrors.friendName = "Friend's name is required"
    }

    if (!referralFormData.friendEmail) {
      newErrors.friendEmail = "Friend's email is required"
    } else if (!validateEmail(referralFormData.friendEmail)) {
      newErrors.friendEmail = "Please enter a valid email address"
    }

    if (!referralFormData.friendPhone) {
      newErrors.friendPhone = "Friend's phone number is required"
    } else if (!validatePhone(referralFormData.friendPhone)) {
      newErrors.friendPhone = "Please enter a valid 10-digit mobile number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateReferralForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // This would normally get the user's referral code from auth context
      const userReferralCode = "USER123" // Replace with actual user referral code

      const response = await fetch("/api/referrals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrerId: 1, // Replace with actual user ID
          refereeName: referralFormData.friendName,
          refereeEmail: referralFormData.friendEmail,
          refereePhone: referralFormData.friendPhone,
          carId: car?.id,
          referralCode: userReferralCode,
          message: referralFormData.message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Referral sent successfully!",
          description: `Your referral for ${car?.name} has been sent to ${referralFormData.friendName}.`,
        })

        // Reset form
        setReferralFormData({
          yourName: "",
          yourEmail: "",
          friendName: "",
          friendEmail: "",
          friendPhone: "",
          message: "",
        })
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
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? `${car?.name} removed from your wishlist.` : `${car?.name} added to your wishlist.`,
    })
  }

  const generateReferralLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/register?ref=USER123&car=${car?.id}`
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!car) {
    return <div className="flex items-center justify-center min-h-screen">Car not found</div>
  }

  const featuresArray = car.features ? car.features.split(", ") : []

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">Galaxy Toyota</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Images */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={carImages[selectedImage] || "/placeholder.svg"}
                  alt={car.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {car.is_popular && (
                  <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">🔥 Popular</Badge>
                )}
                {car.discount_amount && (
                  <Badge className="absolute top-4 right-4 bg-green-600 hover:bg-green-700">
                    ₹{car.discount_amount.toLocaleString()} OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {carImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-red-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${car.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{car.year} Model</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8/5 from 124 reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-red-600">₹{car.price.toLocaleString()}</div>
                {car.original_price && (
                  <div className="text-xl text-gray-500 line-through">₹{car.original_price.toLocaleString()}</div>
                )}
              </div>

              <p className="text-gray-600">{car.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Fuel className="h-4 w-4 mr-2" />
                  {car.fuel_type}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  {car.transmission}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuresArray.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                <ShareModal carName={car.name} referralLink={generateReferralLink()}>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                    <Share2 className="h-5 w-5 mr-2" />
                    Refer This Car & Earn ₹{car.referral_reward.toLocaleString()}
                  </Button>
                </ShareModal>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleWishlist}>
                    <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                  <ShareModal carName={car.name} referralLink={generateReferralLink()}>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </ShareModal>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-800 font-medium mb-2">
                  💰 Referral Reward: ₹{car.referral_reward.toLocaleString()}
                </div>
                <div className="text-xs text-green-700">
                  Earn ₹{car.referral_reward.toLocaleString()} when your friend purchases this car through your
                  referral. Your friend also gets ₹{car.friend_discount.toLocaleString()} discount!
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="mt-12">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="referral">Referral Form</TabsTrigger>
              </TabsList>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Engine</span>
                      <span className="text-gray-600">2.5L 4-Cylinder</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Transmission</span>
                      <span className="text-gray-600">{car.transmission}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fuel Type</span>
                      <span className="text-gray-600">{car.fuel_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Year</span>
                      <span className="text-gray-600">{car.year}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Seating</span>
                      <span className="text-gray-600">5 Passengers</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Safety Rating</span>
                      <span className="text-gray-600">5-Star Overall</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Safety Features</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Toyota Safety Sense 2.0</li>
                          <li>• Pre-Collision System</li>
                          <li>• Lane Departure Alert</li>
                          <li>• Automatic High Beams</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Comfort Features</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Dual-Zone Climate Control</li>
                          <li>• Heated Front Seats</li>
                          <li>• Power-Adjustable Driver Seat</li>
                          <li>• Wireless Phone Charging</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="referral" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Refer This Car to a Friend</CardTitle>
                    <p className="text-sm text-gray-600">
                      Fill out this form to refer the {car.name} to your friend and earn ₹
                      {car.referral_reward.toLocaleString()} reward!
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReferralSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="your-name">Your Name</Label>
                          <Input
                            id="your-name"
                            placeholder="Enter your full name"
                            value={referralFormData.yourName}
                            onChange={(e) => setReferralFormData((prev) => ({ ...prev, yourName: e.target.value }))}
                            className={errors.yourName ? "border-red-500" : ""}
                          />
                          {errors.yourName && <p className="text-sm text-red-500">{errors.yourName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="your-email">Your Email</Label>
                          <Input
                            id="your-email"
                            type="email"
                            placeholder="Enter your email"
                            value={referralFormData.yourEmail}
                            onChange={(e) => setReferralFormData((prev) => ({ ...prev, yourEmail: e.target.value }))}
                            className={errors.yourEmail ? "border-red-500" : ""}
                          />
                          {errors.yourEmail && <p className="text-sm text-red-500">{errors.yourEmail}</p>}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="friend-name">Friend's Name</Label>
                          <Input
                            id="friend-name"
                            placeholder="Enter friend's name"
                            value={referralFormData.friendName}
                            onChange={(e) => setReferralFormData((prev) => ({ ...prev, friendName: e.target.value }))}
                            className={errors.friendName ? "border-red-500" : ""}
                          />
                          {errors.friendName && <p className="text-sm text-red-500">{errors.friendName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="friend-email">Friend's Email</Label>
                          <Input
                            id="friend-email"
                            type="email"
                            placeholder="Enter friend's email"
                            value={referralFormData.friendEmail}
                            onChange={(e) => setReferralFormData((prev) => ({ ...prev, friendEmail: e.target.value }))}
                            className={errors.friendEmail ? "border-red-500" : ""}
                          />
                          {errors.friendEmail && <p className="text-sm text-red-500">{errors.friendEmail}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="friend-phone">Friend's Phone Number</Label>
                        <Input
                          id="friend-phone"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={referralFormData.friendPhone}
                          onChange={(e) => setReferralFormData((prev) => ({ ...prev, friendPhone: e.target.value }))}
                          className={errors.friendPhone ? "border-red-500" : ""}
                          maxLength={10}
                        />
                        {errors.friendPhone && <p className="text-sm text-red-500">{errors.friendPhone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <textarea
                          id="message"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Add a personal message for your friend..."
                          rows={4}
                          value={referralFormData.message}
                          onChange={(e) => setReferralFormData((prev) => ({ ...prev, message: e.target.value }))}
                        />
                      </div>

                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                        <Share2 className="h-4 w-4 mr-2" />
                        {isSubmitting
                          ? "Sending Referral..."
                          : `Send Referral & Earn ₹${car.referral_reward.toLocaleString()}`}
                      </Button>

                      <div className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our terms and conditions. Reward will be processed after
                        successful purchase.
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">Galaxy Toyota</span>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Galaxy Toyota. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
