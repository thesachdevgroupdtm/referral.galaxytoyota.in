"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Award, Car, Gift, Share2, Shield, Users, Fuel, Calendar, Settings } from "lucide-react"
import Typed from "typed.js"
import AOS from "aos"
import CountUp from "react-countup"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const cars = [
  {
    id: 1,
    name: "Toyota Camry 2024",
    price: "₹32,00,000",
    originalPrice: "₹35,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Hybrid Available", "4 Doors", "Automatic"],
    mpg: "32 city / 41 hwy",
    year: "2024",
    popular: true,
    discount: "₹3,00,000 OFF",
  },
  {
    id: 2,
    name: "Toyota RAV4 2024",
    price: "₹38,50,000",
    originalPrice: "₹42,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["AWD Available", "5 Doors", "CVT"],
    mpg: "27 city / 35 hwy",
    year: "2024",
    popular: false,
    discount: "₹3,50,000 OFF",
  },
  {
    id: 3,
    name: "Toyota Prius 2024",
    price: "₹28,20,000",
    originalPrice: "₹30,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Hybrid", "5 Doors", "CVT"],
    mpg: "57 city / 56 hwy",
    year: "2024",
    popular: true,
    discount: "₹1,80,000 OFF",
  },
  {
    id: 4,
    name: "Toyota Highlander 2024",
    price: "₹45,20,000",
    originalPrice: "₹48,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["3-Row Seating", "8 Seats", "AWD"],
    mpg: "21 city / 29 hwy",
    year: "2024",
    popular: false,
    discount: "₹2,80,000 OFF",
  },
  {
    id: 5,
    name: "Toyota Corolla 2024",
    price: "₹18,50,000",
    originalPrice: "₹20,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Compact", "4 Doors", "CVT"],
    mpg: "35 city / 42 hwy",
    year: "2024",
    popular: true,
    discount: "₹1,50,000 OFF",
  },
  {
    id: 6,
    name: "Toyota Land Cruiser 2024",
    price: "₹85,00,000",
    originalPrice: "₹90,00,000",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Premium SUV", "7 Seats", "4WD"],
    mpg: "18 city / 24 hwy",
    year: "2024",
    popular: false,
    discount: "₹5,00,000 OFF",
  },
]

export default function LandingPage() {
  const typedRef = useRef(null)

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false,
    })

    // Initialize Typed.js for the hero text animation
    const typed = new Typed(typedRef.current, {
      strings: ["Refer Friends, <span class='text-red-600'>Earn Rewards</span>"],
      typeSpeed: 50,
      showCursor: false,
      startDelay: 300,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  const handleReferCar = (carName: string) => {
    // In a real app, this would open a referral modal or redirect to referral page
    alert(`Referring ${carName}! This will open the referral form.`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold">Galaxy Toyota</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#cars" className="text-sm font-medium hover:underline">
              Cars
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="#rewards" className="text-sm font-medium hover:underline">
              Rewards
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:underline">
              FAQ
            </Link>
          </nav>
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

      {/* Hero Section */}
      <section className="relative">
        <div className="container flex flex-col items-center justify-center py-20 text-center lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            <span ref={typedRef}></span>
          </h1>
          <p className="mt-6 max-w-3xl text-muted-foreground md:text-xl" data-aos="fade-up" data-aos-delay="300">
            Join our exclusive Car Referral Program and earn amazing rewards when your friends and family purchase a new
            Toyota vehicle through your referral.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row" data-aos="fade-up" data-aos-delay="500">
            <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
              <Link href="/register">
                Join Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center text-center" data-aos="fade-up">
              <span className="text-3xl font-bold text-red-600">
                ₹<CountUp end={50000} duration={2.5} separator="," />+
              </span>
              <span className="mt-1 text-sm text-muted-foreground">In Rewards Earned</span>
            </div>
            <div
              className="flex flex-col items-center justify-center text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span className="text-3xl font-bold text-red-600">
                <CountUp end={500} duration={2} />+
              </span>
              <span className="mt-1 text-sm text-muted-foreground">Successful Referrals</span>
            </div>
            <div
              className="flex flex-col items-center justify-center text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <span className="text-3xl font-bold text-red-600">
                <CountUp end={98} duration={3} />%
              </span>
              <span className="mt-1 text-sm text-muted-foreground">Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section id="cars" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Toyota Models</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest Toyota vehicles available for referral rewards. Refer these cars to your friends and
              earn amazing rewards!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <Card
                key={car.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative">
                  <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-48 object-cover" />
                  {car.popular && (
                    <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">🔥 Popular</Badge>
                  )}
                  {car.discount && (
                    <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-700">{car.discount}</Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{car.year} Model</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl font-bold text-red-600">{car.price}</div>
                    {car.originalPrice && <div className="text-lg text-gray-500 line-through">{car.originalPrice}</div>}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Fuel className="h-4 w-4 mr-2" />
                      {car.mpg}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>{car.features.join(" • ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleReferCar(car.name)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Refer This Car
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/cars/${car.id}`}>View Details</Link>
                    </Button>
                  </div>

                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-800 font-medium">
                      💰 Earn ₹10,000 reward when your friend buys this car!
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-up">
            <Button
              variant="outline"
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              View All Models
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Program Features</h2>
          <p className="mt-4 text-muted-foreground">
            Our referral program is designed to reward you for sharing your love of Toyota vehicles with others.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start gap-2 rounded-lg border p-6" data-aos="fade-up">
            <div className="rounded-full bg-red-100 p-2">
              <Share2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Easy Sharing</h3>
            <p className="text-muted-foreground">
              Share your unique referral code via email, SMS, or social media with just a few clicks.
            </p>
          </div>
          <div
            className="flex flex-col items-start gap-2 rounded-lg border p-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="rounded-full bg-red-100 p-2">
              <Award className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Generous Rewards</h3>
            <p className="text-muted-foreground">
              Earn points, cash rewards, or service vouchers for each successful referral.
            </p>
          </div>
          <div
            className="flex flex-col items-start gap-2 rounded-lg border p-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="rounded-full bg-red-100 p-2">
              <Car className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Car Listings</h3>
            <p className="text-muted-foreground">
              Browse our extensive catalog of Toyota vehicles to recommend to your network.
            </p>
          </div>
          <div
            className="flex flex-col items-start gap-2 rounded-lg border p-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="rounded-full bg-red-100 p-2">
              <Gift className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Incentive Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your rewards and referral status through an intuitive dashboard.
            </p>
          </div>
          <div
            className="flex flex-col items-start gap-2 rounded-lg border p-6"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="rounded-full bg-red-100 p-2">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Multiple Sign-in Options</h3>
            <p className="text-muted-foreground">Register and login using email, password, or social media accounts.</p>
          </div>
          <div
            className="flex flex-col items-start gap-2 rounded-lg border p-6"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="rounded-full bg-red-100 p-2">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Privacy & Security</h3>
            <p className="text-muted-foreground">
              Your data is protected with industry-standard security and privacy measures.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-y bg-muted/50">
        <div className="container py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Our referral process is simple and straightforward. Start earning rewards in just a few steps.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center" data-aos="fade-right">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mt-4 text-xl font-bold">Sign Up</h3>
              <p className="mt-2 text-muted-foreground">Create your account and get your unique referral code.</p>
              <div className="absolute right-0 top-6 hidden h-0.5 w-full bg-red-600 md:block md:w-1/2" />
            </div>
            <div className="relative flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mt-4 text-xl font-bold">Share Your Code</h3>
              <p className="mt-2 text-muted-foreground">
                Invite friends and family using your personalized referral link.
              </p>
              <div className="absolute left-0 right-0 top-6 hidden h-0.5 w-full bg-red-600 md:block md:w-1/2" />
            </div>
            <div className="flex flex-col items-center text-center" data-aos="fade-left" data-aos-delay="400">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mt-4 text-xl font-bold">Earn Rewards</h3>
              <p className="mt-2 text-muted-foreground">Get rewarded when your referrals purchase a Toyota vehicle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Rewards & Benefits</h2>
          <p className="mt-4 text-muted-foreground">
            Enjoy these exclusive rewards when your referrals purchase a Toyota vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-8" data-aos="fade-right">
            <h3 className="text-2xl font-bold">For Referrers</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>₹10,000 cash reward for each successful referral</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Free service vouchers worth ₹5,000</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Priority service appointments</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Exclusive access to new model launches</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Tier-based rewards for multiple referrals</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-8" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-2xl font-bold">For Your Friends</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>₹5,000 discount on their vehicle purchase</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Complimentary first service</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Extended warranty options</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Free accessories worth ₹3,000</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-5 w-5 text-red-600" />
                <span>Special financing rates</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white">
        <div className="container py-16 md:py-24">
          <div className="flex flex-col items-center text-center" data-aos="zoom-in">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Earning Rewards?
            </h2>
            <p className="mt-4 max-w-3xl text-red-100 md:text-xl">
              Join our Car Referral Program today and start earning rewards for sharing your love of Toyota vehicles.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50" asChild>
                <Link href="/register">
                  Join Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground">Find answers to common questions about our Car Referral Program.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6">
          <div className="rounded-lg border p-6" data-aos="fade-up">
            <h3 className="text-lg font-bold">How do I join the referral program?</h3>
            <p className="mt-2 text-muted-foreground">
              Simply sign up on our website or mobile app, and you'll receive your unique referral code that you can
              start sharing immediately.
            </p>
          </div>
          <div className="rounded-lg border p-6" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg font-bold">When do I receive my rewards?</h3>
            <p className="mt-2 text-muted-foreground">
              Rewards are processed within 14 days after your referred friend completes their vehicle purchase.
            </p>
          </div>
          <div className="rounded-lg border p-6" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-bold">Is there a limit to how many people I can refer?</h3>
            <p className="mt-2 text-muted-foreground">
              No, there's no limit! The more friends you refer, the more rewards you can earn.
            </p>
          </div>
          <div className="rounded-lg border p-6" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-bold">How long is my referral code valid?</h3>
            <p className="mt-2 text-muted-foreground">
              Your referral code remains valid as long as you maintain an active account with us.
            </p>
          </div>
        </div>
      </section>

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
