"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import { trackingService } from "@/lib/api";

export default function TrackPage() {
  const [busLocation, setBusLocation] = useState({
    lat: 9.0192,
    lng: 38.7525,
    speed: 45,
    lastUpdated: new Date(),
    bus_number: "ET-1234",
    operator: "Sky Bus",
    route: "Addis Ababa → Bahir Dar",
    eta: "12:30",
    progress: 65,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        // For demo purposes, use a sample booking ID
        const locationData = await trackingService.getBusLocation("BK001");
        if (locationData) {
          setBusLocation(locationData);
        }
      } catch (error) {
        console.error("Error fetching bus location:", error);
        setError("Backend unavailable. Showing demo tracking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusLocation();
  }, []);

  useEffect(() => {
    // Simulate real-time location updates
    const interval = setInterval(() => {
      setBusLocation((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        speed: 40 + Math.random() * 20,
        lastUpdated: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

        <h1 className="text-3xl font-bold mb-8">Track Your Bus</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Live Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Interactive map would be displayed here
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current Location: {busLocation.lat.toFixed(4)},{" "}
                      {busLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bus Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bus Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Bus Number</span>
                  <span className="font-medium">{busLocation.bus_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Operator</span>
                  <span className="font-medium">{busLocation.operator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Navigation className="h-4 w-4" />
                    <span>Speed</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(busLocation.speed)} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last Updated</span>
                  </div>
                  <span className="font-medium text-sm">
                    {busLocation.lastUpdated.toLocaleTimeString()}
                  </span>
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
                    <span>{busLocation.route.split("→")[0]}</span>
                    <span>{busLocation.route.split("→")[1]}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${busLocation.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Departed: 06:00</span>
                    <span>ETA: {busLocation.eta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
