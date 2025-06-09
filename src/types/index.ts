export interface Driver {
  id: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleReg: string;
  vehicleType: string;
  experience: number;
  status: string;
  photoUrl?: string;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  type: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  fuelType: string;
  condition: string;
  status: string;
  assignedDriver: string;
}

export interface Schedule {
  id: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  vehicleId: string;
  driverId: string;
  daysOfWeek: string[];
  status: string;
}

export interface Trip {
  id: string;
  routeId: string;
  company: string;
  vehicleType: string;
  service: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  features: string[];
  fromCity: string;
  toCity: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  tripId: string;
  customerId: string;
  seatNumbers: number[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  idNumber: string;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  distance: string;
  duration: string;
  fare: string;
  stops: string[];
  schedules: number;
  active: boolean;
  startTime: string;
  arrivalTime: string;
}