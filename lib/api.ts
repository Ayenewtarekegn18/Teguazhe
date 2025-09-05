import axios from "axios";
import { demoService, initializeDemoData } from "./demo-data";

const API_BASE_URL = "http://150.40.245.251:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh if user is logged in (has refresh token)
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await api.post("/users/token/refresh/", {
          refresh: refreshToken,
        });

        // Update tokens in localStorage
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Update the original request's authorization header
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Only redirect to login if the current route is protected
        const protectedRoutes = ["/payment", "/bookings", "/profile", "/book"];
        const currentPath = window.location.pathname;
        if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API calls with demo fallback
const apiCallWithFallback = async <T>(
  apiCall: () => Promise<T>,
  demoCall: () => Promise<T>,
  fallbackMessage?: string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn(fallbackMessage || "API call failed, using demo data:", error);
    // Initialize demo data if not already done
    initializeDemoData();
    return await demoCall();
  }
};

// Auth Services
export const authService = {
  login: async (phoneNumber: string, password: string) => {
    const response = await api.post("/users/token/", {
      phone_number: phoneNumber,
      password,
    });
    return response.data;
  },

  register: async (phoneNumber: string, password: string) => {
    const response = await api.post("/users/register/", {
      phone_number: phoneNumber,
      password,
    });
    return response.data;
  },

  verifyOTP: async (phoneNumber: string, otp: string) => {
    const response = await api.post("/users/verify-otp/", {
      phone_number: phoneNumber,
      otp,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/token/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  },
};

// Route Services
export const routeService = {
  searchRoutes: async (
    sourceId: number,
    destinationId: number,
    date: string
  ) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.post("/bus/routes/search/", {
          source_id: sourceId,
          destination_id: destinationId,
          date,
        });
        return response.data;
      },
      () => demoService.searchRoutes(sourceId, destinationId, date),
      "Route search failed, using demo routes"
    );
  },

  getAllRoutes: async () => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get("/bus/routes/");
        return response.data;
      },
      () => demoService.getAllRoutes(),
      "Failed to fetch routes, using demo routes"
    );
  },

  getRouteDetails: async (routeId: number) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(`/bus/routes/${routeId}/`);
        return response.data;
      },
      () => demoService.getRouteDetails(routeId),
      "Failed to fetch route details, using demo data"
    );
  },

  getRouteStopPoints: async (routeId: number) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(`/bus/routes/${routeId}/stops/`);
        return response.data;
      },
      async () => {
        // Demo stop points
        return [
          { id: 1, name: "Addis Ababa", time: "06:00", type: "departure" },
          { id: 2, name: "Debre Berhan", time: "08:30", type: "stop" },
          { id: 3, name: "Bahir Dar", time: "12:30", type: "arrival" },
        ];
      },
      "Failed to fetch stop points, using demo data"
    );
  },
};

// Booking Services
export const bookingService = {
  createBooking: async (bookingData: any) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.post("/booking/bookings/", bookingData);
        return response.data;
      },
      () => demoService.createBooking(bookingData),
      "Failed to create booking, using demo booking"
    );
  },

  getBookings: async () => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get("/booking/bookings/");
        return response.data;
      },
      () => demoService.getBookings(),
      "Failed to fetch bookings, using demo bookings"
    );
  },

  getBookingDetails: async (bookingId: string) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(`/booking/bookings/${bookingId}/`);
        return response.data;
      },
      () => demoService.getBookingDetails(bookingId),
      "Failed to fetch booking details, using demo data"
    );
  },

  cancelBooking: async (bookingId: string) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.post(
          `/booking/bookings/${bookingId}/cancel/`
        );
        return response.data;
      },
      () => demoService.cancelBooking(bookingId),
      "Failed to cancel booking, using demo cancellation"
    );
  },
};

// Seat Services
export const seatService = {
  getRouteSeats: async (routeId: number) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(
          `/seats/seats/route_seats/?route_id=${routeId}`
        );
        return response.data;
      },
      () => demoService.getRouteSeats(routeId),
      "Failed to fetch route seats, using demo seats"
    );
  },

  getAvailableSeats: async (routeId: number) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(
          `/seats/seats/available/?route_id=${routeId}`
        );
        return response.data;
      },
      () => demoService.getAvailableSeats(routeId),
      "Failed to fetch available seats, using demo seats"
    );
  },

  getBookedSeats: async (routeId: number) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(
          `/seats/seats/booked/?route_id=${routeId}`
        );
        return response.data;
      },
      async () => {
        const route = await demoService.getRouteDetails(routeId);
        if (!route) return [];

        const totalSeats = route.total_seats;
        const availableSeats = route.available_seats;
        const bookedSeats = totalSeats - availableSeats;

        const seats = [];
        for (let i = availableSeats + 1; i <= totalSeats; i++) {
          const row = Math.ceil(i / 4);
          const col = ((i - 1) % 4) + 1;
          const seatNumber = `${String.fromCharCode(64 + row)}${col}`;

          seats.push({
            id: i,
            seat_number: seatNumber,
            price: parseFloat(route.price),
          });
        }

        return seats;
      },
      "Failed to fetch booked seats, using demo data"
    );
  },
};

// Payment Services
export const paymentService = {
  createPayment: async (paymentData: any) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.post("/payments/", paymentData);
        return response.data;
      },
      () => demoService.createPayment(paymentData),
      "Failed to create payment, using demo payment"
    );
  },

  verifyPayment: async (paymentData: any) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.post("/payments/verify/", paymentData);
        return response.data;
      },
      () => demoService.verifyPayment(paymentData),
      "Failed to verify payment, using demo verification"
    );
  },

  completePayment: async (bookingId: string) => {
    const response = await api.post(
      `/booking/bookings/${bookingId}/complete_payment/`
    );
    return response.data;
  },
};

// Feedback Services
export const feedbackService = {
  createFeedback: async (feedbackData: any) => {
    const response = await api.post("/booking/feedbacks/", feedbackData);
    return response.data;
  },

  getFeedbackStatistics: async () => {
    const response = await api.get("/booking/feedbacks/statistics/");
    return response.data;
  },
};

// GPS Tracking Services
export const trackingService = {
  getActiveLocations: async () => {
    const response = await api.get("/gps_tracking/locations/active_locations/");
    return response.data;
  },

  getBusHistory: async (busId: number) => {
    const response = await api.get("/gps_tracking/locations/bus_history/", {
      params: { bus_id: busId },
    });
    return response.data;
  },

  getBusLocation: async (bookingId: string) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get(`/tracking/bus/${bookingId}/`);
        return response.data;
      },
      () => demoService.getBusLocation(bookingId),
      "Failed to fetch bus location, using demo location"
    );
  },
};

// User Services
export const userService = {
  getUserProfile: async () => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get("/users/profile/");
        return response.data;
      },
      () => demoService.getUserProfile(),
      "Failed to fetch user profile, using demo profile"
    );
  },

  updateUserProfile: async (userData: any) => {
    return apiCallWithFallback(
      async () => {
        const response = await api.put("/users/profile/", userData);
        return response.data;
      },
      () => demoService.updateUserProfile(userData),
      "Failed to update user profile, using demo update"
    );
  },

  deleteAccount: async () => {
    const response = await api.delete("/users/delete/");
    return response.data;
  },
};

// City Services
export const cityService = {
  getCities: async () => {
    return apiCallWithFallback(
      async () => {
        const response = await api.get("/cities/");
        return response.data;
      },
      () => demoService.getCities(),
      "Failed to fetch cities, using demo cities"
    );
  },
};

export default api;
