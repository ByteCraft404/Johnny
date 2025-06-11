import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import ContactUsers from './pages/ContactUsers';
import RoutesPage from './pages/Routes';
import Calendar from './pages/Calendar';
import Vehicles from './pages/Vehicles';
import Schedules from './pages/Schedules';
import AboutUs from './pages/AboutUs';
import AddDriver from './pages/AddDriver';
import AddVehicle from './pages/AddVehicle';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext'; // Assuming you have UserProvider for context


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // Determine authentication status once at the top level
  const isAuthenticated = useRef(localStorage.getItem('token'));
  useEffect(() => {
    isAuthenticated.current = localStorage.getItem('token');
    console.log('isAuthenticated:', isAuthenticated.current); // Debugging line to check authentication status
  }, []); // Empty effect to mimic componentDidMount behavior
// Debugging line to check authentication status

  return (
    <UserProvider> {/* Ensure UserProvider wraps your entire Router */}
      <Router>
        <Routes>
          {/* Route for the root path "/":
            - If authenticated, redirect to /dashboard.
            - If not authenticated, show the Login page.
            This ensures the user lands on the correct page when starting the app.
          */}
          <Route 
            path="/" 
            element={isAuthenticated.current ? <Navigate to="/dashboard" replace /> : <Login />} 
          />

          {/* Public routes that don't require authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes that use the Layout component.
            These routes are nested and will only be accessible if the user is authenticated.
            Note: The 'path' for this parent route is removed, as its children will have absolute paths
            or specific paths relative to their own segment (e.g., "dashboard", "drivers").
            Using a parentless <Route element={...}> means its children paths are absolute from root.
          */}
          <Route element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            {/* Protected routes (formerly nested under path="/").
              Now, their paths are defined directly, or as relative segments if the parent <Route> had a path.
              Since the parent <Route> doesn't have a 'path', these children paths are absolute relative to the root.
              
              Example: if you want '/dashboard', '/drivers', etc.
              If you want the layout to be at a base path like '/app', then you'd use:
              <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} /> // This would be /app
                <Route path="drivers" element={<Drivers />} /> // This would be /app/drivers
              </Route>
              
              Given your previous structure, let's assume you want /dashboard, /drivers, etc., directly.
              Therefore, these should now explicitly be '/dashboard', '/drivers' etc.
            */}
            
            {/* Dashboard is the default protected route after login or for authenticated users */}
            <Route path="dashboard" element={<Dashboard />} /> 
            <Route path="drivers" element={<Drivers />} />
            <Route path="drivers/add" element={<AddDriver />} />
            <Route path="contact-users" element={<ContactUsers />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/add" element={<AddVehicle />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all route for any undefined paths:
            - If authenticated, redirect to dashboard.
            - If not authenticated, redirect to login.
            This handles typos or old bookmarks gracefully.
          */}
          <Route 
            path="*" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;