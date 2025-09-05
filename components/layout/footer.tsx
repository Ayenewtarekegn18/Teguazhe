"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bus,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Shield,
  Clock,
  Star,
  Download,
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Safety", href: "/safety" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
  ]

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Live Chat", href: "/chat" },
    { name: "Report Issue", href: "/report" },
    { name: "Feedback", href: "/feedback" },
  ]

  const legal = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refunds" },
    { name: "Accessibility", href: "/accessibility" },
  ]

  const popularRoutes = [
    "Addis Ababa → Bahir Dar",
    "Addis Ababa → Hawassa",
    "Addis Ababa → Mekelle",
    "Bahir Dar → Gondar",
    "Hawassa → Arba Minch",
  ]

  return (
    <footer style={{ backgroundColor: "#2D2D2D" }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Bus className="h-8 w-8" style={{ color: "#6BA67E" }} />
              <span className="text-2xl font-urbanist-bold text-white" style={{ fontWeight: 700 }}>
                Teguazhe
              </span>
            </div>
            <p className="text-gray-300 mb-6 font-urbanist-normal leading-relaxed" style={{ fontWeight: 400 }}>
              Ethiopia's leading online bus booking platform. We connect travelers with reliable, comfortable, and
              affordable bus services across the country. Experience the future of travel with real-time tracking,
              secure payments, and 24/7 customer support.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" style={{ color: "#6BA67E" }} />
                <span className="text-gray-300 font-urbanist-normal" style={{ fontWeight: 400 }}>
                  +251-911-123456
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" style={{ color: "#6BA67E" }} />
                <span className="text-gray-300 font-urbanist-normal" style={{ fontWeight: 400 }}>
                  support@transportai.et
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" style={{ color: "#6BA67E" }} />
                <span className="text-gray-300 font-urbanist-normal" style={{ fontWeight: 400 }}>
                  Bole, Addis Ababa, Ethiopia
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-4 mt-6">
              <span className="text-gray-400 font-urbanist-medium" style={{ fontWeight: 500 }}>
                Follow us:
              </span>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#6BA67E"
                    e.currentTarget.style.color = "#FFFFFF"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#9CA3AF"
                  }}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-urbanist-semibold mb-4" style={{ fontWeight: 600 }}>
              Company
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors font-urbanist-normal"
                    style={{ fontWeight: 400 }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-urbanist-semibold mb-4" style={{ fontWeight: 600 }}>
              Support
            </h3>
            <ul className="space-y-3">
              {support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors font-urbanist-normal"
                    style={{ fontWeight: 400 }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="text-white font-urbanist-semibold mb-4" style={{ fontWeight: 600 }}>
              Popular Routes
            </h3>
            <ul className="space-y-3">
              {popularRoutes.map((route) => (
                <li key={route}>
                  <Link
                    href={`/search?route=${encodeURIComponent(route)}`}
                    className="text-gray-300 hover:text-white transition-colors font-urbanist-normal text-sm"
                    style={{ fontWeight: 400 }}
                  >
                    {route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid #4A4A4A" }}>
          <div className="max-w-md">
            <h3 className="text-white font-urbanist-semibold mb-2" style={{ fontWeight: 600 }}>
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4 font-urbanist-normal" style={{ fontWeight: 400 }}>
              Get the latest updates on new routes, promotions, and travel tips.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-urbanist-normal"
                style={{ fontWeight: 400 }}
              />
              <Button
                className="text-white font-urbanist-semibold"
                style={{ backgroundColor: "#528E64", fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3A6B4A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#528E64")}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h3 className="text-white font-urbanist-semibold mb-2" style={{ fontWeight: 600 }}>
              Download Our App
            </h3>
            <p className="text-gray-300 font-urbanist-normal" style={{ fontWeight: 400 }}>
              Book tickets on the go with our mobile app
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-white font-urbanist-medium"
              style={{ fontWeight: 500 }}
            >
              <Download className="h-4 w-4 mr-2" />
              App Store
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-white font-urbanist-medium"
              style={{ fontWeight: 500 }}
            >
              <Download className="h-4 w-4 mr-2" />
              Google Play
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ backgroundColor: "#1A1A1A", borderTop: "1px solid #4A4A4A" }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 font-urbanist-normal" style={{ fontWeight: 400 }}>
                © {currentYear} TransportAI. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                {legal.slice(0, 3).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-urbanist-normal"
                    style={{ fontWeight: 400 }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" style={{ color: "#6BA67E" }} />
                <span className="text-gray-400 text-sm font-urbanist-normal" style={{ fontWeight: 400 }}>
                  Secure
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" style={{ color: "#6BA67E" }} />
                <span className="text-gray-400 text-sm font-urbanist-normal" style={{ fontWeight: 400 }}>
                  24/7 Support
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" style={{ color: "#FFD166" }} />
                <span className="text-gray-400 text-sm font-urbanist-normal" style={{ fontWeight: 400 }}>
                  4.8 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
