import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fuel } from "lucide-react"

const cars = [
  {
    id: 1,
    name: "Toyota Camry 2024",
    price: "$28,400",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Hybrid Available", "4 Doors", "Automatic"],
    mpg: "32 city / 41 hwy",
    popular: true,
  },
  {
    id: 2,
    name: "Toyota RAV4 2024",
    price: "$32,500",
    image: "/placeholder.svg?height=300&width=400",
    features: ["AWD Available", "5 Doors", "CVT"],
    mpg: "27 city / 35 hwy",
    popular: false,
  },
  {
    id: 3,
    name: "Toyota Prius 2024",
    price: "$25,200",
    image: "/placeholder.svg?height=300&width=400",
    features: ["Hybrid", "5 Doors", "CVT"],
    mpg: "57 city / 56 hwy",
    popular: false,
  },
  {
    id: 4,
    name: "Toyota Highlander 2024",
    price: "$38,420",
    image: "/placeholder.svg?height=300&width=400",
    features: ["3-Row Seating", "8 Seats", "AWD"],
    mpg: "21 city / 29 hwy",
    popular: true,
  },
]

export function FeaturedCars() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Toyota Models</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our latest Toyota vehicles available for referral rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-48 object-cover" />
                {car.popular && <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">Popular</Badge>}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>

                <div className="text-2xl font-bold text-red-600 mb-4">{car.price}</div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Fuel className="h-4 w-4 mr-2" />
                    {car.mpg}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">Refer This Car</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
            View All Models
          </Button>
        </div>
      </div>
    </section>
  )
}
