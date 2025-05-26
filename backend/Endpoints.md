# API Endpoints Specification

## Authentication

### Register
- **POST** `/api/auth/register`
- **Body:**  
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**  
  - `201 Created` on success

### Login
- **POST** `/api/auth/login`
- **Body:**  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**  
  ```json
  {
    "user": { ...user fields... },
    "token": "JWT token"
  }
  ```

---

## Drivers

### Get All Drivers
- **GET** `/api/drivers`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  [ { ...driver fields... } ]
  ```

### Add Driver
- **POST** `/api/drivers`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "name": "string",
    "gender": "string",
    "age": number,
    "email": "string",
    "phone": "string",
    "address": "string",
    "licenseNumber": "string",
    "licenseExpiry": "string",
    "vehicleReg": "string",
    "vehicleType": "string",
    "experience": "string",
    "status": "Active" | "Inactive"
  }
  ```
- **Response:**  
  - `201 Created` with driver object

---

## Vehicles

### Get All Vehicles
- **GET** `/api/vehicles`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  [ { ...vehicle fields... } ]
  ```

### Add Vehicle
- **POST** `/api/vehicles`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "regNumber": "string",
    "type": "string",
    "make": "string",
    "model": "string",
    "year": "string",
    "capacity": number,
    "fuelType": "string",
    "fuelCapacity": "string",
    "condition": "string",
    "purchaseDate": "string",
    "assignedDriver": "string",
    "airConditioned": boolean,
    "wifi": boolean,
    "tv": boolean,
    "refreshments": boolean,
    "imageUrl": "string"
  }
  ```
- **Response:**  
  - `201 Created` with vehicle object

---

## Schedules

### Get All Schedules
- **GET** `/api/schedules`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  [ { ...schedule fields... } ]
  ```

---

## Routes

### Get All Routes
- **GET** `/api/routes`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  [ { ...route fields... } ]
  ```

---

## Trips

### Get All Trips
- **GET** `/api/trips`
- **Response:**  
  ```json
  [ { ...trip fields... } ]
  ```
- **Trip Model:**
  ```json
  {
    "id": "string",
    "routeId": "string",
    "company": "string",
    "vehicleType": "string",
    "service": "string",
    "departureTime": "string",
    "arrivalTime": "string",
    "price": number,
    "availableSeats": number,
    "totalSeats": number,
    "features": ["string"],
    "fromCity": "string",
    "toCity": "string"
  }
  ```

---

## Bookings

### Get All Bookings
- **GET** `/api/bookings`
- **Response:**  
  ```json
  [ { ...booking fields... } ]
  ```
- **Booking Model:**
  ```json
  {
    "id": "string",
    "bookingReference": "string",
    "tripId": "string",
    "customerId": "string",
    "seatNumbers": [number],
    "totalAmount": number,
    "status": "pending" | "confirmed" | "cancelled",
    "paymentStatus": "pending" | "completed" | "failed",
    "paymentMethod": "string",
    "createdAt": "string"
  }
  ```

---

## Customers

### Get All Customers
- **GET** `/api/customers`
- **Response:**  
  ```json
  [ { ...customer fields... } ]
  ```
- **Customer Model:**
  ```json
  {
    "id": "string",
    "fullName": "string",
    "phoneNumber": "string",
    "email": "string",
    "idNumber": "string",
    "createdAt": "string"
  }
  ```

---

## Events

### Get All Events
- **GET** `/api/events`
- **Response:**  
  ```json
  [ { ...event fields... } ]
  ```

---

## Reports

### General Financial Report
- **GET** `/api/reports`
- **Response:**  
  ```json
  {
    "totalRevenue": number,
    "totalExpenses": number,
    "netProfit": number,
    "bookings": [ ... ]
  }
  ```

### Bookings Report
- **GET** `/api/reports/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  {
    "totalBookings": number,
    "confirmedBookings": number,
    "pendingBookings": number,
    "cancelledBookings": number,
    "totalRevenue": number,
    "bookings": [ ... ]
  }
  ```

### Drivers Report
- **GET** `/api/reports/drivers`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  {
    "totalDrivers": number,
    "activeDrivers": number,
    "inactiveDrivers": number,
    "drivers": [ ... ]
  }
  ```

### Vehicles Report
- **GET** `/api/reports/vehicles`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  ```json
  {
    "totalVehicles": number,
    "activeVehicles": number,
    "inactiveVehicles": number,
    "vehicles": [ ... ]
  }
  ```

---

## Notes

- All endpoints returning sensitive or user-specific data require a valid JWT token in the `Authorization` header.
- All IDs are strings unless otherwise specified.
- Dates are ISO strings.

---

**This document can be used by your backend team to implement the real API with a database.**