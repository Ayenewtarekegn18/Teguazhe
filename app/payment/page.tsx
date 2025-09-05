"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  Bus,
  Clock,
  Wallet,
} from "lucide-react";
import { bookingService, paymentService } from "@/lib/api";
import type { Booking, Payment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/providers";

export default function PaymentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [processing, setProcessing] = useState(false);

  // Card payment details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) {
          setError("Booking ID is required");
          setLoading(false);
          return;
        }

        // Mock data for testing
        const mockBooking: Booking = {
          booking_reference: "BK123456",
          user: 1,
          user_details: "John Doe",
          route: 1,
          route_details: {
            id: 1,
            name: "Addis Ababa - Hawassa",
            departure_time: "08:00 AM",
            arrival_time: "12:00 PM",
          },
          seats: "A1, A2",
          passenger_name: "Admin User",
          passenger_age: 30,
          passenger_gender: "M",
          passenger_email: "admin@gmail.com",
          passenger_phone: "+251912345678",
          boarding_point: "Addis Ababa",
          deboarding_point: "Hawassa",
          total_fare: "200",
          payment_status: "PENDING",
          created_at: new Date().toISOString(),
          additional_passengers: JSON.stringify([
            {
              
            },
          ]),
          booking_detail: "Standard booking",
        };

        console.log("Using mock booking data:", mockBooking);
        setBooking(mockBooking);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch booking details");
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      if (!booking) {
        throw new Error("Booking not found");
      }

      // Mock payment data
      const mockPaymentData: Partial<Payment> = {
        booking: parseInt(booking.booking_reference),
        amount: booking.total_fare,
        currency: "ETB",
        payment_method: paymentMethod as "card" | "mobile_money" | "bank",
        transaction_ref: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: "success"
      };

      console.log("Mock payment data:", mockPaymentData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store mock booking in localStorage for the bookings page
      const mockBookings = [{
        id: booking.booking_reference,
        from: booking.boarding_point,
        to: booking.deboarding_point,
        date: new Date().toLocaleDateString(),
        seats: booking.seats.split(", "),
        passengers: [
          {
            name: booking.passenger_name,
            gender: booking.passenger_gender,
            phone: booking.passenger_phone
          },
          ...JSON.parse(booking.additional_passengers)
        ],
        totalPrice: parseInt(booking.total_fare),
        status: "confirmed",
        bookingDate: new Date().toISOString()
      }];

      localStorage.setItem("userBookings", JSON.stringify(mockBookings));

      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
      });

      // Redirect to bookings page
      router.push("/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      console.error("Error:", err);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Booking not found</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Bus className="h-5 w-5 text-blue-600" />
                    <span>Booking Reference: {booking.booking_reference}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>
                      {booking.boarding_point} → {booking.deboarding_point}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>
                      {booking.route_details?.departure_time} -{" "}
                      {booking.route_details?.arrival_time}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-2xl font-bold">
                        ETB {booking.total_fare}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <div className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center space-x-2"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label
                        htmlFor="mobile"
                        className="flex items-center space-x-2"
                      >
                        <Wallet className="h-5 w-5" />
                        <span>Mobile Money</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label
                        htmlFor="bank"
                        className="flex items-center space-x-2"
                      >
                        <span>Bank Transfer</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Card Holder Name</Label>
                        <Input
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "mobile" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        You will be redirected to your mobile money provider to
                        complete the payment.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Please use the following bank details to make your
                        payment:
                      </p>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="font-medium">
                          Bank: Commercial Bank of Ethiopia
                        </p>
                        <p>Account Number: 1000123456789</p>
                        <p>Account Name: Transport Management System</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handlePayment}
                className="w-full"
                style={{
                  backgroundColor: "#528E64",
                  color: "#FFFFFF",
                }}
                disabled={
                  processing ||
                  (paymentMethod === "card" &&
                    (!cardNumber || !cardName || !expiryDate || !cvv))
                }
              >
                {processing ? "Processing..." : `Proceed to Payment`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
