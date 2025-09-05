"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  MapPin,
  Search,
  Star,
  Clock,
  Shield,
  Users,
  TrendingUp,
  Award,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
  Bus,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { routeService, cityService } from "@/lib/api";
import type { Route } from "@/lib/types";

interface City {
  id: number;
  name: string;
}

export default function HomePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredRoutes, setFeaturedRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();

  // Use useEffect for client-side only code
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Fetch cities
    const fetchCities = async () => {
      try {
        const citiesData = await cityService.getCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    // Fetch featured routes
    const fetchFeaturedRoutes = async () => {
      try {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        const routes = await routeService.searchRoutes(1, 2, formattedDate);
        setFeaturedRoutes(routes.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRoutes();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    setSearchError(null);

    if (!from || !to || !date) {
      setSearchError("Please fill in all fields");
      return;
    }

    // Find the city IDs for the selected cities
    const sourceCity = cities.find(
      (city) => city.name.toLowerCase() === from.toLowerCase()
    );
    const destinationCity = cities.find(
      (city) => city.name.toLowerCase() === to.toLowerCase()
    );

    if (!sourceCity || !destinationCity) {
      setSearchError("Please select valid cities from the dropdown");
      return;
    }

    if (sourceCity.id === destinationCity.id) {
      setSearchError("Source and destination cities cannot be the same");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    const searchParams = new URLSearchParams({
      source_id: sourceCity.id.toString(),
      destination_id: destinationCity.id.toString(),
      date: formattedDate,
    });

    router.push(`/routes?${searchParams.toString()}`);
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description:
        "Your payments and personal data are protected with bank-level security",
      color: "#528E64",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your bus location in real-time with GPS technology",
      color: "#FF6B35",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help anytime with our round-the-clock customer support",
      color: "#FFD166",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description:
        "Book your tickets in under 2 minutes with our streamlined process",
      color: "#6BA67E",
    },
    {
      icon: Award,
      title: "Best Prices",
      description:
        "Compare prices across operators and get the best deals guaranteed",
      color: "#EF476F",
    },
    {
      icon: Globe,
      title: "Wide Coverage",
      description:
        "Access to 500+ routes covering all major cities in Ethiopia",
      color: "#528E64",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Travelers", icon: Users },
    { number: "500+", label: "Routes Available", icon: MapPin },
    { number: "4.8", label: "Average Rating", icon: Star },
    { number: "99.9%", label: "Uptime", icon: TrendingUp },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Belayneh Defaru",
      role: "Regular Traveler",
      image: "/images/testimony-male-1.png",
      quote:
        "The real-time tracking feature is amazing! I always know exactly where my bus is.",
    },
    {
      id: 2,
      name: "Mihiret Tesfaye",
      role: "Business Traveler",
      image: "/images/testimony-female.jpeg",
      quote:
        "Booking tickets has never been easier. The app is intuitive and user-friendly.",
    },
    {
      id: 3,
      name: "Seyoum Tafesse",
      role: "Student",
      image: "/images/testimony-male-2.jpeg",
      quote: "Great service and competitive prices. Highly recommended!",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Search Routes",
      description:
        "Enter your departure and destination cities along with your travel date",
    },
    {
      step: 2,
      title: "Choose Your Bus",
      description: "Select from available buses based on your preferences",
    },
    {
      step: 3,
      title: "Book Tickets",
      description: "Select your seats and complete the booking process",
    },
    {
      step: 4,
      title: "Track & Travel",
      description: "Track your bus in real-time and enjoy your journey",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Animation */}
      <section
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(82, 142, 100, 0.1) 0%, #F5F7F6 50%, rgba(107, 166, 126, 0.1) 100%)",
        }}
      >
        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-bounce"
            style={{
              backgroundColor: "#6BA67E",
              animationDelay: "0s",
              animationDuration: "3s",
            }}
          ></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-20 animate-bounce"
            style={{
              backgroundColor: "#FF6B35",
              animationDelay: "1s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full opacity-20 animate-bounce"
            style={{
              backgroundColor: "#FFD166",
              animationDelay: "2s",
              animationDuration: "5s",
            }}
          ></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <Badge
              className="mb-4 px-4 py-2 font-urbanist-medium"
              style={{
                backgroundColor: "#6BA67E",
                color: "#FFFFFF",
                fontWeight: 500,
              }}
            >
              🚀 Ethiopia's #1 Bus Booking Platform
            </Badge>
            <h1
              className={`text-4xl md:text-6xl mb-6 font-urbanist-bold transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                background: "linear-gradient(135deg, #528E64 0%, #3A6B4A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
                animationDelay: "0.2s",
              }}
            >
              AI-Powered Bus Booking
            </h1>
            <p
              className={`text-xl max-w-2xl mx-auto font-urbanist-medium transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                color: "#4A4A4A",
                fontWeight: 500,
                animationDelay: "0.4s",
              }}
            >
              Book your bus tickets with ease, track your journey in real-time,
              and enjoy a seamless travel experience across Ethiopia. Join
              50,000+ satisfied travelers!
            </p>
          </div>

          {/* Enhanced Search Form */}
          <Card
            className={`max-w-4xl mx-auto shadow-xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ borderColor: "#E0E6E2", animationDelay: "0.6s" }}
          >
            <CardHeader style={{ backgroundColor: "#FFFFFF" }}>
              <CardTitle
                className="text-center font-urbanist-semibold"
                style={{ color: "#2D2D2D", fontWeight: 600 }}
              >
                Find Your Perfect Journey
              </CardTitle>
              <CardDescription
                className="text-center font-urbanist-normal"
                style={{ color: "#4A4A4A", fontWeight: 400 }}
              >
                Search and book bus tickets for your next trip • Over 500 routes
                available
              </CardDescription>
            </CardHeader>
            <CardContent style={{ backgroundColor: "#FFFFFF" }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="from"
                    className="font-urbanist-medium"
                    style={{ color: "#2D2D2D", fontWeight: 500 }}
                  >
                    From
                  </Label>
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger id="from">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="to"
                    className="font-urbanist-medium"
                    style={{ color: "#2D2D2D", fontWeight: 500 }}
                  >
                    To
                  </Label>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger id="to">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    className="font-urbanist-medium"
                    style={{ color: "#2D2D2D", fontWeight: 500 }}
                  >
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-urbanist-normal transition-all duration-200 hover:border-green-primary",
                          !date && "text-muted-foreground"
                        )}
                        style={{
                          borderColor: "#E0E6E2",
                          backgroundColor: "#FFFFFF",
                          color: date ? "#2D2D2D" : "#4A4A4A",
                          fontFamily: "var(--font-urbanist)",
                          fontWeight: 400,
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E0E6E2",
                      }}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {searchError && (
                <div className="mt-4 text-red-600 text-sm text-center">
                  {searchError}
                </div>
              )}

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  onClick={handleSearch}
                  className="w-full text-white font-urbanist-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: "#FF6B35", fontWeight: 600 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#E55A2B")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#FF6B35")
                  }
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Routes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "rgba(82, 142, 100, 0.1)" }}
                >
                  <stat.icon className="h-8 w-8" style={{ color: "#528E64" }} />
                </div>
                <div
                  className="text-3xl font-urbanist-bold mb-2"
                  style={{ color: "#2D2D2D", fontWeight: 700 }}
                >
                  {stat.number}
                </div>
                <div
                  className="font-urbanist-medium"
                  style={{ color: "#4A4A4A", fontWeight: 500 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Routes with Enhanced Design */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7F6" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-urbanist-bold mb-4"
              style={{ color: "#2D2D2D", fontWeight: 700 }}
            >
              Popular Routes
            </h2>
            <p
              className="font-urbanist-normal"
              style={{ color: "#4A4A4A", fontWeight: 400 }}
            >
              Discover our most traveled routes with special offers and
              discounts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div>Loading featured routes...</div>
            ) : (
              featuredRoutes.map((route, index) => (
                <Card
                  key={route.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2"
                  style={{ borderColor: "#E0E6E2" }}
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bus className="h-4 w-4" style={{ color: "#528E64" }} />
                        <span
                          className="font-urbanist-semibold"
                          style={{ color: "#2D2D2D", fontWeight: 600 }}
                        >
                          {route.bus_name}
                        </span>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        style={{ color: "#4A4A4A" }}
                      />
                      <div className="flex items-center space-x-2">
                        <MapPin
                          className="h-4 w-4"
                          style={{ color: "#6BA67E" }}
                        />
                        <span
                          className="font-urbanist-semibold"
                          style={{ color: "#2D2D2D", fontWeight: 600 }}
                        >
                          {route.source_name} → {route.destination_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="text-2xl font-urbanist-bold"
                        style={{ color: "#528E64", fontWeight: 700 }}
                      >
                        ETB {route.price}
                      </div>
                      <div
                        className="flex items-center space-x-1 font-urbanist-normal"
                        style={{ color: "#4A4A4A", fontWeight: 400 }}
                      >
                        <Clock className="h-4 w-4" />
                        <div>
                          {route.departure_time} - {route.arrival_time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4"
                            style={{ fill: "#FFD166", color: "#FFD166" }}
                          />
                        ))}
                        <span
                          className="ml-2 text-sm font-urbanist-normal"
                          style={{ color: "#4A4A4A", fontWeight: 400 }}
                        >
                          4.8
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="text-white font-urbanist-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ backgroundColor: "#528E64", fontWeight: 600 }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3A6B4A")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#528E64")
                        }
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-urbanist-bold mb-4"
              style={{ color: "#2D2D2D", fontWeight: 700 }}
            >
              How It Works
            </h2>
            <p
              className="font-urbanist-normal"
              style={{ color: "#4A4A4A", fontWeight: 400 }}
            >
              Book your bus ticket in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "#528E64" }}
                  >
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-urbanist-bold text-sm"
                    style={{ backgroundColor: "#FF6B35", fontWeight: 700 }}
                  >
                    {step.step}
                  </div>
                </div>
                <h3
                  className="text-xl font-urbanist-semibold mb-2"
                  style={{ color: "#2D2D2D", fontWeight: 600 }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-urbanist-normal"
                  style={{ color: "#4A4A4A", fontWeight: 400 }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7F6" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-urbanist-bold mb-4"
              style={{ color: "#2D2D2D", fontWeight: 700 }}
            >
              Why Choose Teguazh?
            </h2>
            <p
              className="font-urbanist-normal"
              style={{ color: "#4A4A4A", fontWeight: 400 }}
            >
              Experience the future of bus travel with our cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 group border-0"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <CardContent className="p-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon
                      className="h-8 w-8"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3
                    className="text-xl font-urbanist-semibold mb-2"
                    style={{ color: "#2D2D2D", fontWeight: 600 }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="font-urbanist-normal"
                    style={{ color: "#4A4A4A", fontWeight: 400 }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-urbanist-bold mb-4"
              style={{ color: "#2D2D2D", fontWeight: 700 }}
            >
              What Our Travelers Say
            </h2>
            <p
              className="font-urbanist-normal"
              style={{ color: "#4A4A4A", fontWeight: 400 }}
            >
              Join thousands of satisfied customers who trust TransportAI
            </p>
          </div>

          <div className="relative">
            <div className="flex space-x-6 overflow-hidden">
              {(() => {
                // Create infinite loop by getting 3 testimonials starting from currentTestimonial
                const getTestimonials = () => {
                  const result = [];
                  for (let i = 0; i < 3; i++) {
                    const index =
                      (currentTestimonial + i) % testimonials.length;
                    result.push(testimonials[index]);
                  }
                  return result;
                };
                return getTestimonials();
              })().map((testimonial, index) => (
                <Card
                  key={`${testimonial.id}-${currentTestimonial}-${index}`}
                  className="min-w-[300px] flex-shrink-0 shadow rounded-2xl transition-all duration-300 border hover:shadow-lg transform hover:-translate-y-1"
                  style={{
                    borderColor: "#E0E6E2",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5" // Adjust size as needed
                          style={{ fill: "#528E64", color: "#528E64" }} // Adjust color as needed
                        />
                      ))}
                    </div>
                    <div
                      className="font-urbanist-semibold mb-2"
                      style={{ color: "#2D2D2D", fontWeight: 600 }}
                    >
                      {testimonial.name}
                    </div>
                    <p
                      className="text-sm font-urbanist-normal leading-relaxed"
                      style={{ color: "#4A4A4A", fontWeight: 400 }}
                    >
                      {testimonial.quote}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 rounded-full shadow-md"
              onClick={() =>
                setCurrentTestimonial(
                  (prev) =>
                    (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E0E6E2" }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full shadow-md"
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev + 1) % testimonials.length
                )
              }
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E0E6E2" }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Testimonial Indicators - Removed for this carousel style */}
          {/* <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "scale-125" : "scale-100"
                }`}
                style={{
                  backgroundColor:
                    index === currentTestimonial ? "#528E64" : "#E0E6E2",
                }}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section with Video */}

      <Footer />
    </div>
  );
}
