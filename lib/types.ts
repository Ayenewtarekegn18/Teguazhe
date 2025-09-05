export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  phone_number: string;
  user_type: "REGULAR" | "COMPANY";
  role:
    | "USER"
    | "ADMIN"
    | "COMPANY_ADMIN"
    | "COMPANY_STAFF"
    | "DRIVER"
    | "CONDUCTOR";
  email?: string;
  company?: Company;
}

export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: number;
  bus: number;
  bus_number: string;
  operator_name: string;
  bus_name: string;
  bus_rating: number;
  bus_logo: string;
  source: number;
  source_name: string;
  destination: number;
  destination_name: string;
  departure_time: string;
  arrival_time: string;
  date: string;
  price: string;
  available_seats: number;
  traffic_condition?: "Light" | "Moderate" | "Heavy" | "Severe";
  weather_condition?:
    | "Sunny"
    | "Cloudy"
    | "Rainy"
    | "Stormy"
    | "Foggy"
    | "Snowy";
  route_safety_score?: number;
  route_efficiency_score?: number;
  ai_insights?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  booking_reference: string;
  user: number;
  user_details: string;
  route: number;
  route_details: {
    id: number;
    name: string;
    departure_time: string;
    arrival_time: string;
  };
  seats: string;
  passenger_name: string;
  passenger_age: number;
  passenger_gender: "M" | "F";
  passenger_email: string;
  passenger_phone: string;
  boarding_point: string;
  deboarding_point: string;
  total_fare: string;
  payment_status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  created_at: string;
  additional_passengers: string;
  booking_detail: string;
}

export interface Seat {
  id: number;
  route: number;
  seat_number: string;
  is_booked: boolean;
}

export interface Payment {
  id: number;
  booking: number;
  booking_details: Booking;
  user: number;
  amount: string;
  currency: string;
  payment_method: "mobile_money" | "bank" | "card";
  status: "pending" | "success" | "failed";
  transaction_ref: string;
  chapa_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: number;
  booking: number;
  booking_details: string;
  user: string;
  feedback_type: "ROUTE" | "BUS" | "SERVICE" | "OTHER";
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  created_at: string;
}

export interface BusLocation {
  id: number;
  bus: number;
  bus_details: Bus;
  latitude: string;
  longitude: string;
  speed?: string;
  heading?: string;
  timestamp: string;
  is_active: boolean;
}

export interface Bus {
  id: number;
  operator: number;
  operator_name: string;
  bus_name: string;
  registration_number: string;
  model?: string;
  total_seats: number;
  is_active: boolean;
  average_rating: string;
  ratings_count: string;
  company_logo: string;
  created_at: string;
  updated_at: string;
}

export interface StopPoint {
  id: number;
  route: number;
  street_name: string;
  arrival_time?: string;
  departure_time?: string;
  created_at: string;
  updated_at: string;
}
