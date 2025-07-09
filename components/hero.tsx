import { Button } from "@/components/ui/button"
import { Car, Users, Award } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Car className="h-12 w-12" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Galaxy Toyota
            <span className="block text-3xl md:text-5xl text-red-200 mt-2">Referral Program</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
            Earn rewards by referring friends and family to Galaxy Toyota. Get cash bonuses for every successful
            referral!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 text-lg px-8 py-4">
              Start Referring Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-700 text-lg px-8 py-4"
            >
              View Cars
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Referrals</h3>
              <p className="text-red-200">Simple process to refer friends and family</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Great Rewards</h3>
              <p className="text-red-200">Earn up to $500 per successful referral</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Cars</h3>
              <p className="text-red-200">Latest Toyota models with best prices</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
