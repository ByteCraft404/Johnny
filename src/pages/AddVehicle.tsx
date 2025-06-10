import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../utils/api';

// Define the Route type once, and use it everywhere
type RouteType = {
  id: string;
  name: string;
  startTime: string;
  arrivalTime: string;
  active: boolean;
};

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [formData, setFormData] = useState({
    regNumber: '',
    type: '',
    make: '',
    model: '',
    year: '',
    capacity: '',
    fuelType: '',
    fuelCapacity: '',
    condition: 'Excellent',
    purchaseDate: '',
    assignedDriver: '',
    airConditioned: false,
    wifi: false,
    tv: false,
    refreshments: false,
    route: '',
    departureTime: '',
    arrivalTime: '',
    status: '',
    lastMaintenance: '',
  });
  const [vehicleImage, setVehicleImage] = useState<string>('');

  useEffect(() => {
    const fetchDrivers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/api/drivers', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        setDrivers(response.data);
      } catch {
        // Optionally handle error
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/api/routes', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        setRoutes(
          response.data
            .filter((r: RouteType) => r.active)
            .map((r: RouteType) => ({
              id: r.id,
              name: r.name,
              startTime: r.startTime,
              arrivalTime: r.arrivalTime,
              active: r.active,
            }))
        );
      } catch {
        // Optionally handle error
      }
    };
    fetchRoutes();
  }, []);

  // When route changes, auto-fill departure and arrival time
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "route") {
      const selectedRoute = routes.find(r => r.name === value);
      setFormData(prev => ({
        ...prev,
        route: value,
        departureTime: selectedRoute?.startTime || "",
        arrivalTime: selectedRoute?.arrivalTime || "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const vehicleData = {
      ...formData,
      imageUrl: vehicleImage,
    };
    try {
      await api.post('/api/vehicles', vehicleData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      navigate('/vehicles');
    } catch {
      alert('Failed to add vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Link to="/vehicles" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Vehicle Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-700 border-b pb-2">Vehicle Information</h2>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={vehicleImage || 'https://via.placeholder.com/120x80?text=Vehicle'}
                  alt="Vehicle"
                  className="h-24 w-32 rounded-lg object-cover border-4 border-teal-200 shadow mb-2"
                />
                <label className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {vehicleImage && (
                  <button
                    type="button"
                    className="mt-2 text-red-600 hover:text-red-800 text-xs"
                    onClick={() => setVehicleImage('')}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              <div>
                <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="regNumber"
                  name="regNumber"
                  required
                  value={formData.regNumber}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Shuttle">Shuttle</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    required
                    value={formData.make}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    min="1990"
                    max="2025"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
            {/* Right Column - Technical Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-700 border-b pb-2">Technical Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    required
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="fuelCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Capacity (Liters)
                  </label>
                  <input
                    type="number"
                    id="fuelCapacity"
                    name="fuelCapacity"
                    min="1"
                    value={formData.fuelCapacity}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  id="lastMaintenance"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="assignedDriver" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver (Optional)
                </label>
                <select
                  id="assignedDriver"
                  name="assignedDriver"
                  value={formData.assignedDriver}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">No Driver Assigned</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.name}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  id="route"
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.name}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start">
                    <input
                      id="airConditioned"
                      name="airConditioned"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.airConditioned}
                      onChange={handleChange}
                    />
                    <label htmlFor="airConditioned" className="ml-2 text-sm text-gray-700">
                      Air Conditioned
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      id="wifi"
                      name="wifi"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.wifi}
                      onChange={handleChange}
                    />
                    <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">
                      WiFi
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      id="tv"
                      name="tv"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.tv}
                      onChange={handleChange}
                    />
                    <label htmlFor="tv" className="ml-2 text-sm text-gray-700">
                      TV/Entertainment
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      id="refreshments"
                      name="refreshments"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.refreshments}
                      onChange={handleChange}
                    />
                    <label htmlFor="refreshments" className="ml-2 text-sm text-gray-700">
                      Refreshments
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="In Service">In Service</option>
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              to="/vehicles"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;