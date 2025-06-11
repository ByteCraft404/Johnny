import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';

interface Driver {
  id: string; 
  name: string;
  gender?: string;
  age?: number;
  vehicleReg?: string;
  vehicleType?: string;
  status: 'Active' | 'Inactive' | string;
  route?: string;
  phone?: string;
  profileImage?: string;
  photo?: string;
  email?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  experience?: string;
  assignedVehicle?: string; 
}

const Drivers: React.FC = () => {
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editForm, setEditForm] = useState<Partial<Driver>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsDriver, setDetailsDriver] = useState<Driver | null>(null);

  interface Vehicle {
    id: string;
    regNumber: string;
    type: string;
    status: string;
    route?: string;
    [key: string]: unknown;
  }
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  interface Route {
    id: string;
    name: string;
    startTime?: string;
    arrivalTime?: string;
    
  }
  const [routes, setRoutes] = useState<Route[]>([]);

  
  const fetchDrivers = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/drivers', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    setDrivers(
      (response.data as (Omit<Driver, 'id'> & { _id: string })[]).map((driver) => ({
        ...driver,
        id: driver._id,
      }))
    );
  };

  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const fetchVehicles = React.useCallback(async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/api/vehicles', {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  setVehicles(
    (response.data as (Omit<Vehicle, 'id'> & { _id: string })[]).map((vehicle) => ({
      id: String(vehicle._id),
      regNumber: String(vehicle.regNumber ?? ""),
      type: String(vehicle.type ?? ""),
      status: String(vehicle.status ?? ""),
      
      route: typeof vehicle.route === 'string' ? vehicle.route : undefined,
    }))
  );
}, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  
  const fetchRoutes = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/routes', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    setRoutes(
      (response.data as (Omit<Route, 'id'> & { _id: string })[]).map((route) => ({
        ...route,
        id: route._id,
      }))
    );
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  
  const filteredDrivers = drivers.filter((driver: Driver) => {
    const matchesSearch =
      driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicleReg?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (id: string) => {
    setDriverToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (driverToDelete) {
      const token = localStorage.getItem('token');
      try {
        await api.delete(`/api/drivers/${driverToDelete}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        setDrivers(drivers.filter((driver: Driver) => driver.id !== driverToDelete));
        setShowDeleteModal(false);
        setDriverToDelete(null);
      } catch {
        // Optionally handle error
      }
    }
  };

  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "assignedVehicle") {
      
      const selectedVehicle = vehicles.find(v => v.id === value);
      setEditForm(prev => ({
              ...prev,
              assignedVehicle: value,
              vehicleReg: selectedVehicle ? selectedVehicle.regNumber : "",
              vehicleType: selectedVehicle && typeof selectedVehicle.type === "string" ? selectedVehicle.type : "",
            }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

 
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) {
      alert('No driver selected for editing.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await api.put(`/api/drivers/${editingDriver.id}`, editForm, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (response.status === 200) {
        await fetchDrivers();
        await fetchVehicles();
        setShowEditModal(false);
        setEditingDriver(null);
        setEditForm({});
      } else {
        alert('Failed to update driver.');
      }
    } catch {
      alert('Failed to update driver.');
    }
  };

  
  
  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Driver Management</h1>
          <Link 
            to="/drivers/add" 
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Driver
          </Link>
        </div>
        
        
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-grow md:mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search drivers by name or vehicle reg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver: Driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            driver.profileImage
                              ? driver.profileImage.startsWith('data:image')
                                ? driver.profileImage
                                : `data:image/png;base64,${driver.profileImage}`
                              : driver.photo || 'https://via.placeholder.com/100'
                          }
                          alt={driver.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-xs text-gray-500">{driver.gender}, {driver.age} years</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.vehicleReg}</div>
                    <div className="text-xs text-gray-500">{driver.vehicleType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      driver.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {
                      (() => {
                        const vehicle = vehicles.find(v => v.regNumber === driver.vehicleReg);
                        if (!vehicle) return "";
                        const route = routes.find(r => r.id === vehicle.route || r.name === vehicle.route);
                        return route ? route.name : "";
                      })()
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                        onClick={() => {
                          setDetailsDriver(driver);
                          setShowDetailsModal(true);
                        }}
                      >
                        Details
                      </button>
                      <button 
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit Driver"
                        onClick={() => {
                          setEditingDriver(driver);
                          setEditForm(driver);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(driver.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Driver"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDrivers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No drivers found matching your criteria.</p>
          </div>
        )}
      </div>
      
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this driver? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showEditModal && editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-auto animate-fade-in"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
              <Edit className="inline-block" /> Edit Driver
            </h3>
            <form
              onSubmit={handleEditSubmit}
              className="space-y-6"
            >
              <div className="flex items-center gap-6 mb-4">
                <div className="relative">
                  <img
                    src={editForm.profileImage || 'https://via.placeholder.com/100'}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-teal-200 shadow transition-all duration-300"
                  />
                  {editForm.profileImage && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-19 bg-red-600 hover:bg-red-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg transition-all duration-200 border-2 border-white"
                      title="Remove Image"
                      onClick={() => setEditForm(prev => ({ ...prev, profileImage: '' }))}
                      style={{ zIndex: 2 }}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 border-2 border-white">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditForm(prev => ({ ...prev, profileImage: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.name || ''}
                    name="name"
                    onChange={handleEditChange}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.age || ''}
                    name="age"
                    onChange={handleEditChange}
                    type="number"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.gender || ''}
                    name="gender"
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.phone || ''}
                    name="phone"
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.email || ''}
                    name="email"
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.vehicleReg || ''}
                    name="vehicleReg"
                    onChange={handleEditChange}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.vehicleType || ''}
                    name="vehicleType"
                    onChange={handleEditChange}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.licenseNumber || ''}
                    name="licenseNumber"
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.licenseExpiry || ''}
                    name="licenseExpiry"
                    onChange={handleEditChange}
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.experience || ''}
                    name="experience"
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Vehicle</label>
                  <select
                    name="assignedVehicle"
                    value={editForm.assignedVehicle || ''}
                    onChange={handleEditChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles
                      .filter(vehicle =>
                        
                        vehicle.status !== "In Service" || vehicle.id === editForm.assignedVehicle
                      )
                      .map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>{vehicle.regNumber}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showDetailsModal && detailsDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-auto animate-fade-in"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
              <Edit className="inline-block" /> Driver Details
            </h3>
            <div className="flex items-center gap-6 mb-4">
              <div className="relative">
                <img
                  src={detailsDriver.profileImage || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-teal-200 shadow transition-all duration-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.name || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.age || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.gender || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.phone || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.email || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.vehicleReg || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.vehicleType || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.licenseNumber || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.licenseExpiry || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.experience || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input className="w-full border rounded px-3 py-2 bg-gray-100" value={detailsDriver.status || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={
                    (() => {
                      const vehicle = vehicles.find(v => v.regNumber === detailsDriver.vehicleReg);
                      if (!vehicle) return "";
                      const route = routes.find(r => r.id === vehicle.route || r.name === vehicle.route);
                      return route ? route.name : "";
                    })()
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;