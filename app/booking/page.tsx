"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  routeService,
  seatService,
  bookingService,
  userService,
} from "@/lib/api";
import type { Route, Seat, User } from "@/lib/types";
import { Bus, Clock, MapPin, User as UserIcon, ArrowRight } from "lucide-react";

interface PassengerInfo {
  name: string;
  gender: string;
  phone: string;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [route, setRoute] = useState<Route | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const routeId = searchParams.get("routeId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUserProfile();
        setCurrentUser(userData);

        // Pre-populate the first passenger's data
        if (userData) {
          setPassengers((prev) => {
            const updatedPassengers = [...prev];
            updatedPassengers[0] = {
              name: `${userData.first_name || ""} ${
                userData.last_name || ""
              }`.trim(),
              gender: userData.gender || "",
              phone: userData.phone_number || "",
            };
            return updatedPassengers;
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [toast]);

  useEffect(() => {
    const fetchRouteAndSeats = async () => {
      try {
        if (!routeId) {
          setError("Route ID is required");
          setLoading(false);
          return;
        }

        // Fetch route details
        const routeDetails = await routeService.getRouteDetails(
          parseInt(routeId)
        );
        setRoute(routeDetails);

        // Fetch all seats for the route
        const routeSeats = await seatService.getRouteSeats(parseInt(routeId));
        console.log("Route seats from API:", routeSeats);
        setSeats(routeSeats);
      } catch (err) {
        console.error("Error fetching route or seats:", err);
        setError("Failed to fetch route details");
      } finally {
        setLoading(false);
      }
    };

    fetchRouteAndSeats();
  }, [routeId]);

  const handleSeatSelection = (seatId: number, seatNumber: string) => {
    setSelectedSeats((prev) => {
      const newSelected = prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber];

      // Update passenger info array
      setPassengers(
        newSelected.map(
          (_, index) => passengers[index] || { name: "", gender: "", phone: "" }
        )
      );

      return newSelected;
    });
  };

  const updatePassenger = (
    index: number,
    field: keyof PassengerInfo,
    value: string
  ) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleBooking = async () => {
    try {
      if (
        !route ||
        selectedSeats.length === 0 ||
        !passengers.every((p) => p.name.trim() && p.gender && p.phone.trim())
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Get the selected seat IDs
      const selectedSeatIds = seats
        .filter((seat) => selectedSeats.includes(seat.seat_number))
        .map((seat) => seat.id);

      const bookingData = {
        route: route.id,
        seats: selectedSeatIds, // Send seat IDs instead of seat numbers
        passenger_name: passengers[0].name,
        passenger_gender: passengers[0].gender,
        passenger_email: currentUser?.email || "",
        passenger_phone: passengers[0].phone,
        boarding_point: route.source,
        deboarding_point: route.destination,
        total_fare: route.price.toString(),
        payment_status: "PENDING",
        additional_passengers: passengers.slice(1).map((p) => ({
          full_name: p.name,
          phone_number: p.phone,
          age: 25, // Default age since we're not collecting it
          gender: p.gender,
        })),
      };

      console.log("Booking Data being sent:", bookingData);
      console.log("Route data:", route);
      console.log("Selected seats:", selectedSeats);
      console.log("Selected seat IDs:", selectedSeatIds);
      console.log("Passengers data:", passengers);
      console.log("Current user:", currentUser);

      const booking = await bookingService.createBooking(bookingData);

      // Redirect to payment page
      router.push(`/payment?bookingId=${booking.id}`);
    } catch (err) {
      console.error("Booking Error:", err);
      setError("Failed to create booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded-full w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-2xl"></div>
              <div className="h-96 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Button
              className="mt-4 bg-[#528E64] hover:bg-[#3A6B4A]"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">Route not found</p>
            <Button
              className="mt-4 bg-[#528E64] hover:bg-[#3A6B4A]"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div
        className="container mx-auto px-4 py-8"
        style={{ fontFamily: "var(--font-urbanist)" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Book Your Seat
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Details */}
          <Card className="p-6 lg:col-span-2 rounded-2xl shadow-lg border-0 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Route Details
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-[#528E64]/10">
                  <Bus className="h-5 w-5 text-[#528E64]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bus</p>
                  <p className="font-medium text-gray-800">{route.bus_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-[#528E64]/10">
                  <MapPin className="h-5 w-5 text-[#528E64]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium text-gray-800">
                    {route.source_name}{" "}
                    <ArrowRight className="inline h-4 w-4 mx-2" />{" "}
                    {route.destination_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-[#528E64]/10">
                  <Clock className="h-5 w-5 text-[#528E64]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">
                    {route.departure_time} - {route.arrival_time}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Price per seat</p>
                <p className="text-2xl font-bold text-[#528E64]">
                  ETB {route.price}
                </p>
              </div>
            </div>
          </Card>

          {/* Passenger Details */}
          <Card className="p-6 rounded-2xl shadow-lg border-0 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Passenger Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={passengers[0]?.name || ""}
                  onChange={(e) => updatePassenger(0, "name", e.target.value)}
                  placeholder="Enter your full name"
                  className="rounded-lg border-gray-200 focus:border-[#528E64] focus:ring-[#528E64]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={passengers[0]?.phone || ""}
                  onChange={(e) => updatePassenger(0, "phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="rounded-lg border-gray-200 focus:border-[#528E64] focus:ring-[#528E64]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Gender</Label>
                <Select
                  value={passengers[0]?.gender || ""}
                  onValueChange={(value) => updatePassenger(0, "gender", value)}
                >
                  <SelectTrigger className="rounded-lg border-gray-200 focus:border-[#528E64] focus:ring-[#528E64] bg-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 relative">
                    <SelectItem
                      value="M"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="F"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Seat Selection */}
          <Card className="p-6 lg:col-span-3 rounded-2xl shadow-lg border-0 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Select Your Seat
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {seats.map((seat) => (
                <Button
                  key={seat.id}
                  variant="outline"
                  className={cn(
                    "w-full aspect-square rounded-xl transition-all duration-200",
                    seat.is_booked &&
                      "opacity-50 cursor-not-allowed bg-gray-100",
                    selectedSeats.includes(seat.seat_number) &&
                      "bg-[#528E64] text-white border-[#528E64] hover:bg-[#3A6B4A] hover:border-[#3A6B4A]"
                  )}
                  disabled={seat.is_booked}
                  onClick={() => handleSeatSelection(seat.id, seat.seat_number)}
                >
                  {seat.seat_number}
                </Button>
              ))}
            </div>
          </Card>

          {/* Booking Button */}
          <div className="lg:col-span-3 flex justify-end">
            <Button
              size="lg"
              onClick={handleBooking}
              disabled={
                selectedSeats.length === 0 ||
                !passengers.every(
                  (p) => p.name.trim() && p.gender && p.phone.trim()
                )
              }
              className="bg-[#528E64] hover:bg-[#3A6B4A] rounded-xl px-8 py-6 text-lg font-medium"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
