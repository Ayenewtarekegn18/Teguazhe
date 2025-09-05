"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/components/providers";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Calendar, LogOut } from "lucide-react";
import { userService } from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    dateOfBirth: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userService.getUserProfile();
        setFormData({
          name: (userData.first_name || "") + " " + (userData.last_name || ""),
          phoneNumber: userData.phone_number || "",
          email: userData.email || "",
          address: userData.address || "",
          dateOfBirth: userData.date_of_birth || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Backend unavailable. Using stored profile data.");

        // Check if we have stored demo user data from fallback login
        const storedDemoUser = localStorage.getItem("demo_user_data");
        if (storedDemoUser) {
          try {
            const userData = JSON.parse(storedDemoUser);
            setFormData({
              name:
                (userData.first_name || "") + " " + (userData.last_name || ""),
              phoneNumber: userData.phone_number || "",
              email: userData.email || "",
              address: userData.address || "",
              dateOfBirth: userData.date_of_birth || "",
            });
          } catch (parseError) {
            console.error("Error parsing stored user data:", parseError);
            // Set default demo data as final fallback
            setFormData({
              name: "Demo User",
              phoneNumber: "+251911234567",
              email: "demo@example.com",
              address: "Addis Ababa, Ethiopia",
              dateOfBirth: "1990-01-01",
            });
          }
        } else {
          // Set default demo data as fallback
          setFormData({
            name: "Demo User",
            phoneNumber: "+251911234567",
            email: "demo@example.com",
            address: "Addis Ababa, Ethiopia",
            dateOfBirth: "1990-01-01",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = formData.name.split(" ");
      const lastName = lastNameParts.join(" ");

      await userService.updateUserProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-[#528E64] flex items-center justify-center text-white text-2xl font-bold">
                    {user.first_name?.[0] || user.phone_number.slice(-2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{formData.name}</h3>
                    <p className="text-gray-500">{formData.phoneNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <Input
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        style={{
                          backgroundColor: "#528E64",
                          color: "#FFFFFF",
                        }}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      style={{
                        backgroundColor: "#528E64",
                        color: "#FFFFFF",
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Delete Account
              </Button>
              <Separator />
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
