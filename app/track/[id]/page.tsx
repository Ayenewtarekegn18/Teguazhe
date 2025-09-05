"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"
import { MapPin, Clock, Navigation, Phone, ArrowLeft, Bus, Users } from "lucide-react"

interface Booking {
  id: string
  from: string
  to: string
  date: string
  seats: string[]
  passengers: any[]
  totalPrice: number
  status: "confirmed" | "completed" | "cancelled"
  bookingDate: string
}

export default function TrackBookingPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [busLocation, setBusLocation] = useState({
    lat: 9.0192,
    lng: 38.7525,
    speed: 45,
    lastUpdated: new Date(),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load booking details
    const savedBookings = localStorage.getItem("userBookings")
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings)
      const foundBooking = bookings.find((b: Booking) => b.id === params.id)
      setBooking(foundBooking || null)
    }
    setLoading(false)

    // Simulate real-time location updates
    const interval = setInterval(() => {
      setBusLocation((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        speed: 40 + Math.random() * 20,
        lastUpdated: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-4">The booking you're trying to track doesn't exist.</p>
            <Button asChild>
              <Link href="/bookings">Back to Bookings</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/bookings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Track Your Bus</h1>
        </div>

        {/* Booking Info Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{booking.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Route</p>
                  <p className="font-medium">
                    {booking.from} → {booking.to}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-medium">{booking.seats.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Travel Date</p>
                  <p className="font-medium">{booking.date}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Live Location</span>
                  <Badge variant="secondary" className="ml-auto">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>

                  {/* Route Line */}
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-blue-500 transform rotate-12"></div>

                  {/* Bus Icon */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 text-white p-2 rounded-full animate-pulse">
                      <Bus className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Location Markers */}
                  <div className="absolute top-1/4 left-1/4">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <p className="text-xs mt-1 font-medium">{booking.from}</p>
                  </div>

                  <div className="absolute top-1/4 right-1/4">
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <p className="text-xs mt-1 font-medium">{booking.to}</p>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-xs">
                    <p className="text-muted-foreground">
                      Lat: {busLocation.lat.toFixed(4)}, Lng: {busLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4 text-center">
                  🗺️ Interactive Google Maps integration would be displayed here with real GPS tracking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bus Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bus Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Bus Number</span>
                  <span className="font-medium">ET-1234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Operator</span>
                  <span className="font-medium">Sky Bus</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Navigation className="h-4 w-4" />
                    <span>Current Speed</span>
                  </div>
                  <span className="font-medium">{Math.round(busLocation.speed)} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last Updated</span>
                  </div>
                  <span className="font-medium text-sm">{busLocation.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journey Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{booking.from}</span>
                    <span>{booking.to}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Departed: 06:00</span>
                    <span>65% Complete</span>
                    <span>ETA: 12:30</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trip Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Departed on time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Currently en route</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Expected arrival: 12:30</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Customer Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
