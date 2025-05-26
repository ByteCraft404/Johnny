const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

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
  
  drivers[index] = { ...drivers[index], ...req.body };
  res.json(drivers[index]);
});

app.delete('/api/drivers/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = drivers.findIndex(driver => driver.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  
  drivers.splice(index, 1);
  res.status(204).send();
});

// Vehicles endpoints
app.get('/api/vehicles', authenticateToken, (req, res) => {
  res.json(vehicles);
});

app.post('/api/vehicles', authenticateToken, (req, res) => {
  const newVehicle = {
    id: vehicles.length + 1,
    ...req.body,
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
  
  vehicles[index] = { ...vehicles[index], ...req.body };
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

app.post('/api/schedules', authenticateToken, (req, res) => {
  const newSchedule = {
    id: schedules.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

app.put('/api/schedules/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = schedules.findIndex(schedule => schedule.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  
  schedules[index] = { ...schedules[index], ...req.body };
  res.json(schedules[index]);
});

app.delete('/api/schedules/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = schedules.findIndex(schedule => schedule.id === id);
  
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
      status: 'Active',
      assignedDriver: 'Daniel Kamau'
    },
    // Add more dummy vehicles...
  ];

  // Add some dummy schedules
  schedules = [
    {
      id: 1,
      route: 'Nairobi - Mombasa',
      departureTime: '08:30 AM',
      arrivalTime: '04:00 PM',
      vehicle: 'KCE 123X',
      driver: 'Daniel Kamau',
      status: 'Active',
      daysOfWeek: ['Monday', 'Wednesday', 'Friday']
    },
    // Add more dummy schedules...
  ];
};

// Initialize dummy data
initializeDummyData();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});