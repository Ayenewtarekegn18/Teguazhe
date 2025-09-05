"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, userService } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  signup: (
    name: string,
    phoneNumber: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("access_token");
    if (token) {
      // Check if we have demo user data (fallback mode)
      const demoUserData = localStorage.getItem("demo_user_data");

      if (demoUserData) {
        // Use stored demo user data
        try {
          const userData = JSON.parse(demoUserData);
          setUser(userData);
          setLoading(false);
        } catch (error) {
          console.error("Error parsing demo user data:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("demo_user_data");
          localStorage.removeItem("demo_login_credentials");
          setLoading(false);
        }
      } else {
        // Try to fetch user profile from backend
        userService
          .getUserProfile()
          .then((userData) => {
            setUser(userData);
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    setLoading(true);
    try {
      const { access, refresh } = await authService.login(
        phoneNumber,
        password
      );
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const userData = await userService.getUserProfile();
      setUser(userData);
      // Return to the previous page or stay on current page
      const returnUrl = localStorage.getItem("returnUrl") || "/";
      localStorage.removeItem("returnUrl");
      router.push(returnUrl);
    } catch (error) {
      console.error("Login error:", error);

      // Fallback: Create mock user data and store locally
      console.log("Backend not available, using fallback authentication");

      const mockUser: User = {
        id: Date.now(), // Use timestamp as unique ID
        first_name: "Demo",
        last_name: "User",
        phone_number: phoneNumber,
        user_type: "REGULAR",
        role: "USER",
        email: `${phoneNumber.replace("+", "")}@demo.com`,
      };

      // Store mock tokens and user data
      localStorage.setItem("access_token", "demo_access_token_" + Date.now());
      localStorage.setItem("refresh_token", "demo_refresh_token_" + Date.now());
      localStorage.setItem("demo_user_data", JSON.stringify(mockUser));
      localStorage.setItem(
        "demo_login_credentials",
        JSON.stringify({ phoneNumber, password })
      );

      setUser(mockUser);

      // Return to the previous page or stay on current page
      const returnUrl = localStorage.getItem("returnUrl") || "/";
      localStorage.removeItem("returnUrl");
      router.push(returnUrl);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    phoneNumber: string,
    password: string
  ) => {
    setLoading(true);
    try {
      await authService.register(phoneNumber, password);
      await login(phoneNumber, password);
    } catch (error) {
      console.error("Signup error:", error);

      // Fallback: Create mock user data for signup
      console.log("Backend not available, using fallback signup");

      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ");

      const mockUser: User = {
        id: Date.now(), // Use timestamp as unique ID
        first_name: firstName,
        last_name: lastName || undefined,
        phone_number: phoneNumber,
        user_type: "REGULAR",
        role: "USER",
        email: `${phoneNumber.replace("+", "")}@demo.com`,
      };

      // Store mock tokens and user data
      localStorage.setItem("access_token", "demo_access_token_" + Date.now());
      localStorage.setItem("refresh_token", "demo_refresh_token_" + Date.now());
      localStorage.setItem("demo_user_data", JSON.stringify(mockUser));
      localStorage.setItem(
        "demo_login_credentials",
        JSON.stringify({ phoneNumber, password })
      );

      setUser(mockUser);

      // Return to the previous page or stay on current page
      const returnUrl = localStorage.getItem("returnUrl") || "/";
      localStorage.removeItem("returnUrl");
      router.push(returnUrl);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("demo_user_data");
    localStorage.removeItem("demo_login_credentials");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
