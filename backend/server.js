const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // or higher if needed

// JWT secret key
const JWT_SECRET = 'your-secret-key';

// Dummy database
let users = [];
let drivers = [];
let vehicles = [];
let schedules = [];
let trips = [];
let bookings = [];
let customers = [];
let routes = []; // Added routes array
let events = []; // Added events array

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: 'Administrator'
    };

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Drivers endpoints
app.get('/api/drivers', authenticateToken, (req, res) => {
  res.json(drivers);
});

app.post('/api/drivers', authenticateToken, (req, res) => {
  const newDriver = {
    id: drivers.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = drivers.findIndex(driver => driver.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  drivers[index] = {
    ...drivers[index],
    ...req.body, // This allows updating status and any other fields
  };
  res.json(drivers[index]);
});

app.delete('/api/drivers/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = drivers.findIndex(driver => driver.id === id);
  if (index !== -1) {
    drivers.splice(index, 1);
    res.status(200).json({ message: 'Driver deleted' });
  } else {
    res.status(404).json({ message: 'Driver not found' });
  }
});

// Vehicles endpoints
app.get('/api/vehicles', authenticateToken, (req, res) => {
  res.json(vehicles);
});

app.post('/api/vehicles', authenticateToken, (req, res) => {
  const newVehicle = {
    id: vehicles.length + 1,
    regNumber: req.body.regNumber,
    type: req.body.type,
    make: req.body.make || '',
    model: req.body.model || '',
    year: req.body.year || '',
    capacity: req.body.capacity,
    fuelType: req.body.fuelType || '',
    fuelCapacity: req.body.fuelCapacity || '',
    condition: req.body.condition || '',
    purchaseDate: req.body.purchaseDate || '',
    assignedDriver: req.body.assignedDriver || '',
    driver: req.body.assignedDriver || '', // for compatibility
    airConditioned: req.body.airConditioned || false,
    wifi: req.body.wifi || false,
    tv: req.body.tv || false,
    refreshments: req.body.refreshments || false,
    imageUrl: req.body.imageUrl || '',
    status: 'Available',
    lastMaintenance: '',
    route: '',
    departureTime: '',
    arrivalTime: '',
    createdAt: new Date().toISOString()
  };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = vehicles.findIndex(vehicle => vehicle.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  // Update all fields
  vehicles[index] = {
    ...vehicles[index],
    regNumber: req.body.regNumber ?? vehicles[index].regNumber,
    type: req.body.type ?? vehicles[index].type,
    make: req.body.make ?? vehicles[index].make,
    model: req.body.model ?? vehicles[index].model,
    year: req.body.year ?? vehicles[index].year,
    capacity: req.body.capacity ?? vehicles[index].capacity,
    fuelType: req.body.fuelType ?? vehicles[index].fuelType,
    condition: req.body.condition ?? vehicles[index].condition,
    status: req.body.status ?? vehicles[index].status,
    assignedDriver: req.body.assignedDriver ?? req.body.driver ?? vehicles[index].assignedDriver,
    driver: req.body.driver ?? vehicles[index].driver,
    route: req.body.route ?? vehicles[index].route,
    departureTime: req.body.departureTime ?? vehicles[index].departureTime,
    arrivalTime: req.body.arrivalTime ?? vehicles[index].arrivalTime,
    lastMaintenance: req.body.lastMaintenance ?? vehicles[index].lastMaintenance,
    imageUrl: req.body.imageUrl ?? vehicles[index].imageUrl,
  };
  res.json(vehicles[index]);
});

app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = vehicles.findIndex(vehicle => vehicle.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicles.splice(index, 1);
  res.status(204).send();
});

// Schedules endpoints
app.get('/api/schedules', authenticateToken, (req, res) => {
  res.json(schedules);
});

app.get('/api/schedules/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const schedule = schedules.find(s => s.id === id);
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  res.json(schedule);
});

app.post('/api/schedules', authenticateToken, (req, res) => {
  const newSchedule = {
    id: schedules.length ? schedules[schedules.length - 1].id + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

app.put('/api/schedules/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = schedules.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  schedules[index] = { ...schedules[index], ...req.body };
  res.json(schedules[index]);
});

app.delete('/api/schedules/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = schedules.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  schedules.splice(index, 1);
  res.status(204).send();
});

// Reports endpoints
app.get('/api/reports/bookings', authenticateToken, (req, res) => {
  const report = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
    bookings: bookings
  };
  res.json(report);
});

app.get('/api/reports/drivers', authenticateToken, (req, res) => {
  const report = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'Active').length,
    inactiveDrivers: drivers.filter(d => d.status === 'Inactive').length,
    drivers: drivers
  };
  res.json(report);
});

app.get('/api/reports/vehicles', authenticateToken, (req, res) => {
  const report = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'Active').length,
    inactiveVehicles: vehicles.filter(v => v.status === 'Inactive').length,
    vehicles: vehicles
  };
  res.json(report);
});

// General reports endpoint
app.get('/api/reports', (req, res) => {
  // Example data, replace with your actual calculations
  res.json({
    totalRevenue: 110000,
    totalExpenses: 8750,
    netProfit: 101250,
    bookings: [
      { name: "John Doe", route: "Nairobi - Mombasa", time: "10:30 AM", status: "Confirmed" },
      { name: "Jane Smith", route: "Nairobi - Nakuru", time: "12:45 PM", status: "Pending" },
      // ...more bookings
    ]
  });
});

// Routes endpoints
app.get('/api/routes', authenticateToken, (req, res) => {
  res.json(routes);
});

app.post('/api/routes', authenticateToken, (req, res) => {
  const newRoute = {
    id: routes.length ? routes[routes.length - 1].id + 1 : 1,
    name: req.body.name,
    distance: req.body.distance,
    duration: req.body.duration,
    fare: req.body.fare,
    stops: req.body.stops, // should be an array
    schedules: req.body.schedules || 0,
    active: req.body.active !== undefined ? req.body.active : true,
    startTime: req.body.startTime,
    arrivalTime: req.body.arrivalTime,
  };
  routes.push(newRoute);
  res.status(201).json(newRoute);
});

app.put('/api/routes/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = routes.findIndex(route => route.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Route not found' });
  }
  
  routes[index] = { ...routes[index], ...req.body };
  res.json(routes[index]);
});

app.delete('/api/routes/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = routes.findIndex(route => route.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Route not found' });
  }
  
  routes.splice(index, 1);
  res.status(204).send();
});

// Events endpoints
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const newEvent = {
    id: events.length ? events[events.length - 1].id + 1 : 1,
    ...req.body,
    date: new Date(req.body.date), // Ensure date is a Date object
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Trips endpoints
app.get('/api/trips', (req, res) => {
  res.json(trips);
});

// Bookings endpoints
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Customers endpoints
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Initialize some dummy data
const initializeDummyData = () => {
  // Add some dummy drivers
  drivers = [
    {
      id: 1,
      name: 'Daniel Kamau',
      gender: 'Male',
      age: 32,
      email: 'daniel@example.com',
      phone: '+254 712 345 678',
      address: 'Nairobi, Kenya',
      licenseNumber: 'DL123456',
      licenseExpiry: '2024-12-31',
      vehicleReg: 'KCE 123X',
      vehicleType: 'Bus',
      experience: '5',
      status: 'Active'
    },
    // Add more dummy drivers...
  ];

  // Add some dummy vehicles
  vehicles = [
    {
      id: 1,
      regNumber: 'KCE 123X',
      type: 'Bus',
      make: 'Scania',
      model: 'K410',
      year: '2020',
      capacity: 45,
      fuelType: 'Diesel',
      condition: 'Excellent',
      status: 'In Service', // Use 'In Service', 'Available', 'Maintenance' for status
      assignedDriver: 'Daniel Kamau',
      driver: 'Daniel Kamau', // For compatibility with frontend
      route: 'Nairobi - Mombasa',
      departureTime: '08:30 AM',
      arrivalTime: '04:00 PM',
      lastMaintenance: '2024-05-01',
      imageUrl: '', // Add this for vehicle image
      createdAt: new Date().toISOString()
    },
    // Add more dummy vehicles...
  ];

  // Add some dummy schedules
  schedules = [
    {
      id: 1,
      name: 'Nairobi - Mombasa',
      distance: '485 km',
      duration: '7h 30m',
      fare: 'KSh 1,500',
      stops: ['Mtito Andei', 'Voi', 'Mariakani'],
      schedules: 8,
      active: true,
      startTime: '08:00',
      arrivalTime: '15:30'
    },
    // Add more dummy schedules...
  ];

  // Add some dummy routes
  routes = [
    {
      id: 1,
      name: 'Nairobi - Mombasa',
      distance: '485 km',
      duration: '7h 30m',
      fare: 'KSh 1,500',
      stops: ['Mtito Andei', 'Voi', 'Mariakani'],
      schedules: 8,
      active: true,
      startTime: '08:00',
      arrivalTime: '15:30'
    },
    // Add more dummy routes...
  ];

  // Add some dummy events
  events = [
    {
      id: 1,
      name: 'Annual General Meeting',
      date: new Date('2023-12-15T10:00:00Z'),
      location: 'Nairobi Office',
      description: 'End of year meeting for all staff.',
      participants: 50,
      status: 'Scheduled'
    },
    // Add more dummy events...
  ];

  // Add some dummy trips
  trips = [
    {
      id: '1',
      routeId: '1',
      company: 'Express Bus Co.',
      vehicleType: 'Bus',
      service: 'Standard',
      departureTime: '2024-06-01T08:00:00Z',
      arrivalTime: '2024-06-01T15:30:00Z',
      price: 1500,
      availableSeats: 30,
      totalSeats: 45,
      features: ['AC', 'WiFi'],
      fromCity: 'Nairobi',
      toCity: 'Mombasa'
    },
    // ...more trips
  ];

  // Add some dummy bookings
  bookings = [
    {
      id: '1',
      bookingReference: 'ABC123',
      tripId: '1',
      customerId: '1',
      seatNumbers: [12, 13],
      totalAmount: 3000,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'Mpesa',
      createdAt: '2024-05-25T10:00:00Z'
    },
    // ...more bookings
  ];

  // Add some dummy customers
  customers = [
    {
      id: '1',
      fullName: 'John Doe',
      phoneNumber: '+254712345678',
      email: 'john@example.com',
      idNumber: '12345678',
      createdAt: '2024-05-20T09:00:00Z'
    },
    // ...more customers
  ];
};

// Initialize dummy data
initializeDummyData();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});