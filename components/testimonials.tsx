import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Austin, TX",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "I've earned over $2,000 referring friends to Galaxy Toyota. The process is so easy and the staff is incredibly helpful!",
    car: "Toyota Camry",
  },
  {
    name: "Mike Chen",
    location: "Dallas, TX",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Best referral program I've ever used. Got my reward check within 3 weeks of my friend's purchase. Highly recommend!",
    car: "Toyota RAV4",
  },
  {
    name: "Emily Rodriguez",
    location: "Houston, TX",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Galaxy Toyota made the referral process seamless. My friend got a great deal and I earned a nice bonus. Win-win!",
    car: "Toyota Prius",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from satisfied customers who have earned rewards through our referral program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <div className="text-sm text-red-600 font-medium">Purchased: {testimonial.car}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-red-600 text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Join Over 500+ Happy Referrers</h3>
            <p className="text-red-100 mb-6">
              Start earning rewards today by referring friends and family to Galaxy Toyota
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">$150K+</div>
                <div className="text-red-200">Total Rewards Paid</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,200+</div>
                <div className="text-red-200">Successful Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-red-200">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
