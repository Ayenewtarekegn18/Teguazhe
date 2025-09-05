"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, MapPin, Star, ArrowRight } from "lucide-react";
import { routeService } from "@/lib/api";
import type { Route } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const date = searchParams.get("date");

        if (!from || !to || !date) {
          setError("Missing search parameters");
          setLoading(false);
          return;
        }

        // Convert city names to IDs (you'll need to implement this)
        const sourceId = await getCityId(from);
        const destinationId = await getCityId(to);

        const results = await routeService.searchRoutes(
          sourceId,
          destinationId,
          date
        );
        setRoutes(results);
      } catch (err) {
        setError("Failed to fetch routes");
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [searchParams]);

  const getCityId = async (cityName: string): Promise<number> => {
    // This is a placeholder. You should implement a proper city lookup
    // based on your API's city endpoints
    const cityMap: { [key: string]: number } = {
      "Addis Ababa": 1,
      "Bahir Dar": 2,
      Hawassa: 3,
      Mekelle: 4,
      Gondar: 5,
      Jimma: 6,
    };
    return cityMap[cityName] || 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
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

  if (routes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">
            No routes found for your search criteria
          </p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Try Different Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      <div className="grid grid-cols-1 gap-6">
        {routes.map((route) => (
          <Card
            key={route.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Bus className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{route.bus_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{route.bus_rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {route.source_name} → {route.destination_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {route.departure_time} - {route.arrival_time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-4">
                <div className="text-2xl font-bold">ETB {route.price}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {route.available_seats} seats left
                  </Badge>
                  {route.traffic_condition && (
                    <Badge
                      variant="outline"
                      className={
                        route.traffic_condition === "Light"
                          ? "text-green-600"
                          : route.traffic_condition === "Moderate"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {route.traffic_condition} Traffic
                    </Badge>
                  )}
                </div>
                <Button
                  className="w-full md:w-auto"
                  onClick={() =>
                    (window.location.href = `/booking?routeId=${route.id}`)
                  }
                >
                  Book Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
