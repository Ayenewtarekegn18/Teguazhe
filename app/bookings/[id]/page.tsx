"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/layout/navbar"
import { MapPin, Calendar, Users, Clock, ArrowLeft, Download, QrCode } from "lucide-react"

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

export default function BookingDetailPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedBookings = localStorage.getItem("userBookings")
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings)
      const foundBooking = bookings.find((b: Booking) => b.id === params.id)
      setBooking(foundBooking || null)
    }
    setLoading(false)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-muted rounded"></div>
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
            <p className="text-muted-foreground mb-4">The booking you're looking for doesn't exist.</p>
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/bookings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Booking Details</h1>
        </div>

        <div className="space-y-6">
          {/* Booking Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking #{booking.id}</CardTitle>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Booked: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Travel Date: {booking.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journey Details */}
          <Card>
            <CardHeader>
              <CardTitle>Journey Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Route</span>
                </div>
                <span className="font-medium">
                  {booking.from} → {booking.to}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Seats</span>
                </div>
                <span className="font-medium">{booking.seats.join(", ")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total Amount</span>
                <span className="text-xl font-bold text-primary">ETB {booking.totalPrice}</span>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengers.map((passenger, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {passenger.gender} • {passenger.phone} • Seat {booking.seats[index]}
                        </p>
                      </div>
                    </div>
                    {index < booking.passengers.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>Digital Ticket</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Show this QR code to the bus conductor</p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {booking.status === "confirmed" && (
            <div className="flex space-x-4">
              <Button asChild className="flex-1">
                <Link href={`/track/${booking.id}`}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Bus
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
