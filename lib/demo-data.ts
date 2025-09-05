// Demo data for transport management system
// This file provides realistic static data to showcase the application functionality

export interface DemoRoute {
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
  bus_type: string;
  amenities: string[];
  rating: number;
  total_seats: number;
}

export interface DemoCity {
  id: number;
  name: string;
  region: string;
}

export interface DemoBooking {
  id: string;
  route_id: number;
  from: string;
  to: string;
  date: string;
  seats: string[];
  passengers: DemoPassenger[];
  totalPrice: number;
  status: "confirmed" | "completed" | "cancelled";
  bookingDate: string;
  bus_name: string;
  operator_name: string;
  departure_time: string;
  arrival_time: string;
  payment_status: "paid" | "pending" | "failed";
}

export interface DemoPassenger {
  id: string;
  name: string;
  phone: string;
  seat_number: string;
  age: number;
  gender: "male" | "female";
}

export interface DemoUser {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address: string;
  date_of_birth: string;
  created_at: string;
}

export interface DemoBusLocation {
  lat: number;
  lng: number;
  speed: number;
  lastUpdated: Date;
  bus_number: string;
  operator: string;
  route: string;
  eta: string;
  progress: number;
}

// Demo Cities Data
export const demoCities: DemoCity[] = [
  { id: 1, name: "Addis Ababa", region: "Addis Ababa" },
  { id: 2, name: "Bahir Dar", region: "Amhara" },
  { id: 3, name: "Gondar", region: "Amhara" },
  { id: 4, name: "Mekelle", region: "Tigray" },
  { id: 5, name: "Hawassa", region: "Sidama" },
  { id: 6, name: "Dire Dawa", region: "Dire Dawa" },
  { id: 7, name: "Jimma", region: "Oromia" },
  { id: 8, name: "Dessie", region: "Amhara" },
  { id: 9, name: "Jijiga", region: "Somali" },
  { id: 10, name: "Shashamane", region: "Oromia" },
  { id: 11, name: "Bishoftu", region: "Oromia" },
  { id: 12, name: "Arba Minch", region: "SNNPR" },
  { id: 13, name: "Hosaena", region: "SNNPR" },
  { id: 14, name: "Harar", region: "Harari" },
  { id: 15, name: "Dilla", region: "SNNPR" },
];

// Demo Routes Data
export const demoRoutes: DemoRoute[] = [
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
    bus_type: "Premium",
    amenities: ["WiFi", "AC", "USB Charging", "Refreshments"],
    rating: 4.8,
    total_seats: 45,
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
    bus_type: "Standard",
    amenities: ["AC", "USB Charging"],
    rating: 4.5,
    total_seats: 50,
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
    bus_type: "Deluxe",
    amenities: [
      "WiFi",
      "AC",
      "USB Charging",
      "Refreshments",
      "Reclining Seats",
    ],
    rating: 4.9,
    total_seats: 40,
  },
  {
    id: 4,
    bus_name: "Abay Bus Standard",
    operator_name: "Abay Bus",
    source_name: "Addis Ababa",
    destination_name: "Mekelle",
    departure_time: "06:30",
    arrival_time: "18:00",
    date: "2024-01-15",
    price: "1200",
    available_seats: 6,
    bus_type: "Standard",
    amenities: ["AC"],
    rating: 4.3,
    total_seats: 55,
  },
  {
    id: 5,
    bus_name: "Tana Bus Premium",
    operator_name: "Tana Bus",
    source_name: "Addis Ababa",
    destination_name: "Hawassa",
    departure_time: "09:00",
    arrival_time: "14:30",
    date: "2024-01-15",
    price: "650",
    available_seats: 20,
    bus_type: "Premium",
    amenities: ["WiFi", "AC", "USB Charging", "Refreshments"],
    rating: 4.6,
    total_seats: 45,
  },
  {
    id: 6,
    bus_name: "Rift Valley Express",
    operator_name: "Rift Valley Bus",
    source_name: "Addis Ababa",
    destination_name: "Jimma",
    departure_time: "07:00",
    arrival_time: "12:00",
    date: "2024-01-15",
    price: "550",
    available_seats: 18,
    bus_type: "Standard",
    amenities: ["AC", "USB Charging"],
    rating: 4.4,
    total_seats: 50,
  },
  {
    id: 7,
    bus_name: "Blue Nile Deluxe",
    operator_name: "Blue Nile Bus",
    source_name: "Bahir Dar",
    destination_name: "Gondar",
    departure_time: "08:30",
    arrival_time: "10:30",
    date: "2024-01-15",
    price: "350",
    available_seats: 25,
    bus_type: "Deluxe",
    amenities: ["WiFi", "AC", "USB Charging", "Refreshments"],
    rating: 4.7,
    total_seats: 45,
  },
  {
    id: 8,
    bus_name: "Axum Express",
    operator_name: "Axum Bus",
    source_name: "Mekelle",
    destination_name: "Addis Ababa",
    departure_time: "06:00",
    arrival_time: "17:30",
    date: "2024-01-15",
    price: "1100",
    available_seats: 10,
    bus_type: "Standard",
    amenities: ["AC", "USB Charging"],
    rating: 4.2,
    total_seats: 55,
  },
];

// Demo User Data
export const demoUser: DemoUser = {
  id: 1,
  first_name: "Abebe",
  last_name: "Kebede",
  phone_number: "+251911234567",
  email: "abebe.kebede@email.com",
  address: "Bole, Addis Ababa, Ethiopia",
  date_of_birth: "1990-05-15",
  created_at: "2023-01-15T10:30:00Z",
};

// Demo Bookings Data
export const demoBookings: DemoBooking[] = [
  {
    id: "BK001",
    route_id: 1,
    from: "Addis Ababa",
    to: "Bahir Dar",
    date: "2024-01-15",
    seats: ["A1", "A2"],
    passengers: [
      {
        id: "P001",
        name: "Abebe Kebede",
        phone: "+251911234567",
        seat_number: "A1",
        age: 34,
        gender: "male",
      },
      {
        id: "P002",
        name: "Tigist Haile",
        phone: "+251922345678",
        seat_number: "A2",
        age: 28,
        gender: "female",
      },
    ],
    totalPrice: 1700,
    status: "confirmed",
    bookingDate: "2024-01-10T14:30:00Z",
    bus_name: "Sky Bus Premium",
    operator_name: "Sky Bus",
    departure_time: "06:00",
    arrival_time: "12:30",
    payment_status: "paid",
  },
  {
    id: "BK002",
    route_id: 3,
    from: "Addis Ababa",
    to: "Gondar",
    date: "2024-01-20",
    seats: ["B3"],
    passengers: [
      {
        id: "P003",
        name: "Abebe Kebede",
        phone: "+251911234567",
        seat_number: "B3",
        age: 34,
        gender: "male",
      },
    ],
    totalPrice: 950,
    status: "confirmed",
    bookingDate: "2024-01-12T09:15:00Z",
    bus_name: "Ethio Bus Deluxe",
    operator_name: "Ethio Bus",
    departure_time: "08:00",
    arrival_time: "16:30",
    payment_status: "paid",
  },
  {
    id: "BK003",
    route_id: 5,
    from: "Addis Ababa",
    to: "Hawassa",
    date: "2024-01-08",
    seats: ["C5", "C6", "C7"],
    passengers: [
      {
        id: "P004",
        name: "Abebe Kebede",
        phone: "+251911234567",
        seat_number: "C5",
        age: 34,
        gender: "male",
      },
      {
        id: "P005",
        name: "Tigist Haile",
        phone: "+251922345678",
        seat_number: "C6",
        age: 28,
        gender: "female",
      },
      {
        id: "P006",
        name: "Yohannes Tadesse",
        phone: "+251933456789",
        seat_number: "C7",
        age: 45,
        gender: "male",
      },
    ],
    totalPrice: 1950,
    status: "completed",
    bookingDate: "2024-01-05T11:20:00Z",
    bus_name: "Tana Bus Premium",
    operator_name: "Tana Bus",
    departure_time: "09:00",
    arrival_time: "14:30",
    payment_status: "paid",
  },
  {
    id: "BK004",
    route_id: 2,
    from: "Addis Ababa",
    to: "Bahir Dar",
    date: "2024-01-12",
    seats: ["D2"],
    passengers: [
      {
        id: "P007",
        name: "Abebe Kebede",
        phone: "+251911234567",
        seat_number: "D2",
        age: 34,
        gender: "male",
      },
    ],
    totalPrice: 750,
    status: "cancelled",
    bookingDate: "2024-01-08T16:45:00Z",
    bus_name: "Selam Bus Express",
    operator_name: "Selam Bus",
    departure_time: "07:30",
    arrival_time: "14:00",
    payment_status: "paid",
  },
];

// Demo Bus Location Data
export const demoBusLocations: Record<string, DemoBusLocation> = {
  BK001: {
    lat: 9.145,
    lng: 40.4897,
    speed: 65,
    lastUpdated: new Date(),
    bus_number: "ET-1234",
    operator: "Sky Bus",
    route: "Addis Ababa → Bahir Dar",
    eta: "12:30",
    progress: 65,
  },
  BK002: {
    lat: 9.0192,
    lng: 38.7525,
    speed: 0,
    lastUpdated: new Date(),
    bus_number: "ET-5678",
    operator: "Ethio Bus",
    route: "Addis Ababa → Gondar",
    eta: "16:30",
    progress: 0,
  },
};

// Demo Service Functions
export const demoService = {
  // Route Services
  searchRoutes: async (
    sourceId: number,
    destinationId: number,
    date: string
  ) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sourceCity = demoCities.find((city) => city.id === sourceId);
    const destCity = demoCities.find((city) => city.id === destinationId);

    if (!sourceCity || !destCity) {
      return [];
    }

    return demoRoutes.filter(
      (route) =>
        route.source_name === sourceCity.name &&
        route.destination_name === destCity.name &&
        route.date === date
    );
  },

  getAllRoutes: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return demoRoutes;
  },

  getRouteDetails: async (routeId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return demoRoutes.find((route) => route.id === routeId);
  },

  // City Services
  getCities: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return demoCities;
  },

  // Booking Services
  getBookings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Check if we have user-specific bookings stored
    const userBookings = localStorage.getItem("userBookings");
    if (userBookings) {
      try {
        return JSON.parse(userBookings);
      } catch (error) {
        console.error("Error parsing user bookings:", error);
      }
    }

    return demoBookings;
  },

  getBookingDetails: async (bookingId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return demoBookings.find((booking) => booking.id === bookingId);
  },

  createBooking: async (bookingData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get existing user bookings or start with empty array
    const existingBookings = localStorage.getItem("userBookings");
    let userBookings = [];
    if (existingBookings) {
      try {
        userBookings = JSON.parse(existingBookings);
      } catch (error) {
        console.error("Error parsing existing bookings:", error);
      }
    }

    const newBooking: DemoBooking = {
      id: `BK${String(userBookings.length + 1).padStart(3, "0")}`,
      route_id: bookingData.route_id,
      from: bookingData.from,
      to: bookingData.to,
      date: bookingData.date,
      seats: bookingData.seats,
      passengers: bookingData.passengers,
      totalPrice: bookingData.totalPrice,
      status: "confirmed",
      bookingDate: new Date().toISOString(),
      bus_name: bookingData.bus_name,
      operator_name: bookingData.operator_name,
      departure_time: bookingData.departure_time,
      arrival_time: bookingData.arrival_time,
      payment_status: "paid",
    };

    // Add to user bookings and save to localStorage
    userBookings.push(newBooking);
    localStorage.setItem("userBookings", JSON.stringify(userBookings));

    return newBooking;
  },

  cancelBooking: async (bookingId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const booking = demoBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = "cancelled";
    }
    return { success: true };
  },

  // User Services
  getUserProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if we have stored demo user data from fallback login
    const storedDemoUser = localStorage.getItem("demo_user_data");
    if (storedDemoUser) {
      try {
        return JSON.parse(storedDemoUser);
      } catch (error) {
        console.error("Error parsing stored demo user data:", error);
      }
    }

    return demoUser;
  },

  updateUserProfile: async (userData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if we have stored demo user data from fallback login
    const storedDemoUser = localStorage.getItem("demo_user_data");
    if (storedDemoUser) {
      try {
        const currentUser = JSON.parse(storedDemoUser);
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem("demo_user_data", JSON.stringify(updatedUser));
        return updatedUser;
      } catch (error) {
        console.error("Error updating stored demo user data:", error);
      }
    }

    Object.assign(demoUser, userData);
    return demoUser;
  },

  // Bus Tracking Services
  getBusLocation: async (bookingId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return demoBusLocations[bookingId] || null;
  },

  // Seat Services
  getRouteSeats: async (routeId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const route = demoRoutes.find((r) => r.id === routeId);
    if (!route) return [];

    const totalSeats = route.total_seats;
    const availableSeats = route.available_seats;
    const bookedSeats = totalSeats - availableSeats;

    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / 4);
      const col = ((i - 1) % 4) + 1;
      const seatNumber = `${String.fromCharCode(64 + row)}${col}`;

      seats.push({
        id: i,
        seat_number: seatNumber,
        is_available: i <= availableSeats,
        price: parseFloat(route.price),
      });
    }

    return seats;
  },

  getAvailableSeats: async (routeId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const route = demoRoutes.find((r) => r.id === routeId);
    if (!route) return [];

    const seats = [];
    for (let i = 1; i <= route.available_seats; i++) {
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

  // Payment Services
  createPayment: async (paymentData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: `PAY${Date.now()}`,
      status: "success",
      transaction_id: `TXN${Date.now()}`,
      amount: paymentData.amount,
      currency: "ETB",
      payment_method: paymentData.payment_method,
      created_at: new Date().toISOString(),
    };
  },

  verifyPayment: async (paymentData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      verified: true,
      transaction_id: paymentData.transaction_id,
      status: "completed",
    };
  },
};

// Initialize demo data in localStorage if not exists
export const initializeDemoData = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("userBookings")) {
    localStorage.setItem("userBookings", JSON.stringify(demoBookings));
  }

  if (!localStorage.getItem("demoUser")) {
    localStorage.setItem("demoUser", JSON.stringify(demoUser));
  }
};
