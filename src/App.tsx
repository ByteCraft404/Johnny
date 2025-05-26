import React from 'react';
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
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
      </Routes>
    </Router>
  );
}

export default App;