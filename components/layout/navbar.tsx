"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bus,
  Menu,
  User,
  LogOut,
  Ticket,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", icon: Bus },
    { name: "Routes", href: "/routes", icon: MapPin },
    { name: "My Bookings", href: "/bookings", icon: Ticket },
    { name: "Track Bus", href: "/track", icon: MapPin },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="border-b backdrop-blur shadow-sm"
      style={{
        borderColor: "#E0E6E2",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Bus className="h-6 w-6" style={{ color: "#528E64" }} />
              <span
                className="text-xl font-bold"
                style={{ color: "#2D2D2D", fontWeight: 700 }}
              >
                Teguazhe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm transition-colors"
                style={{
                  color: isActive(item.href) ? "#528E64" : "#4A4A4A",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#528E64")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(item.href)
                    ? "#528E64"
                    : "#4A4A4A")
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Demo Mode Indicator */}
            {typeof window !== "undefined" &&
              localStorage.getItem("demo_user_data") && (
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: "#FF6B35",
                    color: "#FF6B35",
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  }}
                >
                  Demo Mode
                </Badge>
              )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(107, 166, 126, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className="-semibold"
                        style={{
                          backgroundColor: "#528E64",
                          color: "#FFFFFF",
                          fontWeight: 600,
                        }}
                      >
                        {user.first_name
                          ? user.first_name[0]
                          : user.phone_number.slice(-2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="font-medium"
                  style={{
                    borderColor: "#528E64",
                    color: "#528E64",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#528E64";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#528E64";
                  }}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(107, 166, 126, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Menu className="h-5 w-5" style={{ color: "#2D2D2D" }} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px]"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E0E6E2",
                }}
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 text-sm"
                      style={{
                        color: isActive(item.href) ? "#528E64" : "#4A4A4A",
                        fontWeight: 500,
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
