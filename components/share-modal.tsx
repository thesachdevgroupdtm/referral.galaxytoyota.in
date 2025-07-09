"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Facebook, MessageCircle, Share2, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ShareModalProps {
  carName: string
  referralLink: string
  children: React.ReactNode
}

export function ShareModal({ carName, referralLink, children }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to clipboard.",
    })
  }

  const handleWhatsAppShare = () => {
    const message = `Check out this amazing ${carName} at Galaxy Toyota! 🚗\n\nUse my referral link to get a special discount:\n${referralLink}\n\n#GalaxyToyota #CarReferral`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    window.open(facebookUrl, "_blank", "width=600,height=400")
  }

  const handleTwitterShare = () => {
    const message = `Check out this amazing ${carName} at Galaxy Toyota! Get a special discount with my referral link: ${referralLink} #GalaxyToyota #CarReferral`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
    window.open(twitterUrl, "_blank", "width=600,height=400")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {carName}
          </DialogTitle>
          <DialogDescription>
            Share this car with your friends and earn rewards when they make a purchase!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-link">Your Referral Link</Label>
            <div className="flex gap-2">
              <Input id="referral-link" value={referralLink} readOnly className="flex-1" />
              <Button size="icon" variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleWhatsAppShare}>
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleFacebookShare}>
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleTwitterShare}>
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>💰 Earn ₹10,000</strong> when your friend purchases this car through your referral link! Your friend
            also gets a special discount.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
