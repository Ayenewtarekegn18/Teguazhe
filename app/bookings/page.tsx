"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { MapPin, Calendar, Users, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bookingService } from "@/lib/api";

interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  seats: string[];
  passengers: any[];
  totalPrice: number;
  status: "confirmed" | "completed" | "cancelled";
  bookingDate: string;
  bus_name?: string;
  operator_name?: string;
  departure_time?: string;
  arrival_time?: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await bookingService.getBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Backend unavailable. Showing demo bookings.");
        // Load bookings from localStorage as fallback
        const savedBookings = localStorage.getItem("userBookings");
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" as const }
            : booking
        )
      );

      // Update localStorage
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "cancelled" as const }
          : booking
      );
      localStorage.setItem("userBookings", JSON.stringify(updatedBookings));

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterBookings = (status: string) => {
    if (status === "active") {
      return bookings.filter((b) => b.status === "confirmed");
    }
    return bookings.filter((b) => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Booking #{booking.id}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Booked on {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {booking.from} → {booking.to}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Seats: {booking.seats.join(", ")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Total: ETB {booking.totalPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/bookings/${booking.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </Button>
          {booking.status === "confirmed" && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/track/${booking.id}`}>
                  <MapPin className="h-4 w-4 mr-1" />
                  Track Bus
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cancelBooking(booking.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-blue-800 font-medium">Demo Mode Active</p>
                <p className="text-blue-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({filterBookings("active").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filterBookings("completed").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({filterBookings("cancelled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filterBookings("active").length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No active bookings found
                  </p>
                  <Button asChild>
                    <Link href="/">Book Your First Trip</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filterBookings("active").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterBookings("completed").length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No completed trips yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterBookings("completed").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterBookings("cancelled").length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            ) : (
              filterBookings("cancelled").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
