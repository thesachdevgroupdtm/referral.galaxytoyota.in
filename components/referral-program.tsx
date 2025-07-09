import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Gift, TrendingUp, Users } from "lucide-react"

const rewards = [
  {
    icon: DollarSign,
    title: "Cash Rewards",
    amount: "$500",
    description: "Earn up to $500 for each successful referral",
  },
  {
    icon: Gift,
    title: "Bonus Incentives",
    amount: "$100",
    description: "Additional bonuses during special promotions",
  },
  {
    icon: TrendingUp,
    title: "Tier Benefits",
    amount: "10%",
    description: "Increase rewards by 10% after 5 referrals",
  },
]

export function ReferralProgram() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Our Referral Program Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to start earning rewards by referring friends to Galaxy Toyota
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Refer a Friend</h3>
                <p className="text-gray-600">
                  Share your unique referral link with friends and family who are looking for a new Toyota vehicle.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">They Purchase</h3>
                <p className="text-gray-600">
                  When your referral visits Galaxy Toyota and purchases a vehicle, you both benefit from special deals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-gray-600">
                  Receive your cash reward within 30 days of the completed purchase. It's that simple!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {rewards.map((reward, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <reward.icon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600 mb-1">{reward.amount}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{reward.title}</div>
                    <div className="text-xs text-gray-600">{reward.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-900">Start Referring Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" />
              </div>

              <div>
                <Label htmlFor="friend-name">Friend's Name</Label>
                <Input id="friend-name" placeholder="Enter friend's name" />
              </div>

              <div>
                <Label htmlFor="friend-email">Friend's Email</Label>
                <Input id="friend-email" type="email" placeholder="Enter friend's email" />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                <Users className="h-5 w-5 mr-2" />
                Send Referral
              </Button>

              <p className="text-xs text-gray-500 text-center">By submitting, you agree to our terms and conditions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
