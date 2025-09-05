"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { routeService, cityService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  Star,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface Route {
  id: number;
  bus_name: string;
  operator_name: string;
  source_name: string;
  destination_name: string;
  departure_time: string;
  arrival_time: string;
  date: string;
  price: string;
  available_seats: number;
}

interface City {
  id: number;
  name: string;
}

export default function RoutesPage() {
  const searchParams = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    date: "",
    priceRange: "",
    sortBy: "price_asc",
  });
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await cityService.getCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Set demo cities as fallback
        setCities([
          { id: 1, name: "Addis Ababa" },
          { id: 2, name: "Bahir Dar" },
          { id: 3, name: "Gondar" },
          { id: 4, name: "Mekelle" },
          { id: 5, name: "Hawassa" },
          { id: 6, name: "Dire Dawa" },
          { id: 7, name: "Jimma" },
        ]);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const sourceId = searchParams.get("source_id");
        const destinationId = searchParams.get("destination_id");
        const date = searchParams.get("date");

        let data: Route[];

        if (sourceId && destinationId && date) {
          data = await routeService.searchRoutes(
            parseInt(sourceId),
            parseInt(destinationId),
            date
          );
        } else {
          data = await routeService.getAllRoutes();
        }

        setRoutes(data);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Backend unavailable. Showing demo data instead.");
        // Set demo routes as fallback
        setRoutes([
          {
            id: 1,
            bus_name: "Sky Bus Premium",
            operator_name: "Sky Bus",
            source_name: "Addis Ababa",
            destination_name: "Bahir Dar",
            departure_time: "06:00",
            arrival_time: "12:30",
            date: "2024-01-15",
            price: "850",
            available_seats: 12,
          },
          {
            id: 2,
            bus_name: "Selam Bus Express",
            operator_name: "Selam Bus",
            source_name: "Addis Ababa",
            destination_name: "Bahir Dar",
            departure_time: "07:30",
            arrival_time: "14:00",
            date: "2024-01-15",
            price: "750",
            available_seats: 8,
          },
          {
            id: 3,
            bus_name: "Ethio Bus Deluxe",
            operator_name: "Ethio Bus",
            source_name: "Addis Ababa",
            destination_name: "Gondar",
            departure_time: "08:00",
            arrival_time: "16:30",
            date: "2024-01-15",
            price: "950",
            available_seats: 15,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRoutes = routes
    .filter((route) => {
      if (filters.source && route.source_name !== filters.source) return false;
      if (filters.destination && route.destination_name !== filters.destination)
        return false;
      if (filters.date && route.date !== filters.date) return false;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        const price = parseFloat(route.price);
        if (price < min || price > max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price_asc") {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (filters.sortBy === "price_desc") {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#528E64]"></div>
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
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              {error}
            </h2>
            <Button asChild>
              <Link href="/">Back to Home</Link>
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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-[#528E64]" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select
                    value={filters.source}
                    onValueChange={(value) =>
                      handleFilterChange("source", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label>To</Label>
                  <Select
                    value={filters.destination}
                    onValueChange={(value) =>
                      handleFilterChange("destination", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500">Under ETB 500</SelectItem>
                      <SelectItem value="500-1000">ETB 500 - 1000</SelectItem>
                      <SelectItem value="1000-2000">ETB 1000 - 2000</SelectItem>
                      <SelectItem value="2000-999999">
                        Above ETB 2000
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_desc">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Routes List */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {searchParams.has("source_id")
                  ? "Search Results"
                  : "All Available Routes"}
              </h1>
              <Badge variant="secondary" className="bg-[#528E64] text-white">
                {filteredRoutes.length} Routes Found
              </Badge>
            </div>

            {filteredRoutes.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No routes found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to find more routes
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredRoutes.map((route) => (
                  <Card
                    key={route.id}
                    className="p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#528E64] flex items-center justify-center">
                            <Bus className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {route.bus_name}
                            </h3>
                            <p className="text-gray-600">
                              {route.operator_name}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">From</p>
                              <p className="font-medium">{route.source_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">To</p>
                              <p className="font-medium">
                                {route.destination_name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Boarding Point
                              </p>
                              <p className="font-medium">{route.source_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Deboarding Point
                              </p>
                              <p className="font-medium">
                                {route.destination_name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-medium">
                                {formatDate(route.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#528E64]" />
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-medium">
                                {route.departure_time} - {route.arrival_time}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700"
                          >
                            {route.available_seats} Seats Available
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#528E64]">
                            ETB {parseFloat(route.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">per person</p>
                        </div>

                        <Button
                          asChild
                          className="w-full md:w-auto bg-[#528E64] hover:bg-[#3A6B4A]"
                        >
                          <Link href={`/booking?routeId=${route.id}`}>
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
