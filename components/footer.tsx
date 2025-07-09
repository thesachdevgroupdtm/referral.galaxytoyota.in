import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-2xl font-bold">Galaxy Toyota</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted Toyota dealer with the best referral program in Texas. Earn rewards while helping friends
              find their perfect vehicle.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  New Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Used Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Service Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Parts & Accessories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Financing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Trade-In Value
                </a>
              </li>
            </ul>
          </div>

          {/* Referral Program */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Referral Program</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Rewards Structure
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Track Referrals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-3 text-gray-400 mb-6">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@galaxytoyota.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Toyota Drive, Austin, TX 78701</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Get updates on new models and referral bonuses</p>
              <div className="flex">
                <Input placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white" />
                <Button className="ml-2 bg-red-600 hover:bg-red-700">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Galaxy Toyota. All rights reserved.</div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
