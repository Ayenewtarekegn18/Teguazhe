"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers";
import { Bus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // If empty, return empty string
    if (!digits) return "";

    // If starts with 0, replace with +251
    if (digits.startsWith("0")) {
      return "+251" + digits.slice(1);
    }

    // If starts with 251, add + prefix
    if (digits.startsWith("251")) {
      return "+" + digits;
    }

    // If starts with 9, add +251 prefix
    if (digits.startsWith("9")) {
      return "+251" + digits;
    }

    // Otherwise, just add +251 prefix
    return "+251" + digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number format
    if (!phoneNumber.match(/^\+251[79]\d{8}$/)) {
      toast({
        title: "Invalid phone number",
        description:
          "Please enter a valid Ethiopian phone number (e.g., +251912345678)",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(phoneNumber, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#528E64]/10 via-background to-[#3A6B4A]/10 p-4">
      <Card className="w-full max-w-md border-[#528E64]/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bus className="h-12 w-12" style={{ color: "#528E64" }} />
          </div>
          <CardTitle className="text-2xl font-semibold text-[#4A4A4A]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[#666666]">
            Sign in to your account to continue booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-[#4A4A4A]">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+251912345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                className="border-[#528E64]/30 focus:border-[#528E64] focus:ring-[#528E64]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4A4A4A]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#528E64]/30 focus:border-[#528E64] focus:ring-[#528E64]/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" style={{ color: "#528E64" }} />
                  ) : (
                    <Eye className="h-4 w-4" style={{ color: "#528E64" }} />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full font-semibold text-white bg-[#528E64] hover:bg-[#3A6B4A] transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="font-medium text-[#528E64] hover:text-[#3A6B4A] hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
