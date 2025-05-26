import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  gender?: string;
  age?: number;
  vehicleReg?: string;
  vehicleType?: string;
  status: 'Driving' | 'Not Driving' | string;
  route?: string;
  phone?: string;
  profileImage?: string;
  photo?: string;
  email?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  experience?: string;
}

const Drivers: React.FC = () => {
  // --- State Management ---
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editForm, setEditForm] = useState<Partial<Driver>>({});
  const [showEditModal, setShowEditModal] = useState(false);

  // --- Fetch Drivers (Polling) ---
  useEffect(() => {
    const fetchDrivers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/drivers', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
        setDrivers(data);
      } else {
        // Handle error if needed
      }
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Filtering Logic ---
  const filteredDrivers = drivers.filter((driver: Driver) => {
    const matchesSearch =
      driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicleReg?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Delete Logic ---
  const handleDeleteClick = (id: number) => {
    setDriverToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (driverToDelete) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/drivers/${driverToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      setDrivers(drivers.filter((driver: Driver) => driver.id !== driverToDelete));
      setShowDeleteModal(false);
      setDriverToDelete(null);
    }
  };

  // --- Status Change Logic ---
  const changeDriverStatus = async (id: number) => {
    const driver = drivers.find((d) => d.id === id);
    if (!driver) return;
    const newStatus = driver.status === 'Driving' ? 'Not Driving' : 'Driving';
    const updatedDriver = { ...driver, status: newStatus, route: newStatus === 'Not Driving' ? 'N/A' : driver.route };
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(updatedDriver),
    });
    if (response.ok) {
      setDrivers(drivers.map((d) => (d.id === id ? updatedDriver : d)));
    } else {
      alert('Failed to update driver status.');
    }
  };

  // --- Edit Form Change Handler ---
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Main Render ---
  return (
    <div className="space-y-6">
      {/* --- Driver Management Header & Actions --- */}
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
        
        {/* --- Search & Filter --- */}
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
              <option value="Driving">Driving</option>
              <option value="Not Driving">Not Driving</option>
            </select>
          </div>
        </div>
        
        {/* --- Drivers Table --- */}
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
                          src={driver.profileImage || driver.photo || 'https://via.placeholder.com/100'}
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
                      driver.status === 'Driving' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => changeDriverStatus(driver.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title={driver.status === 'Driving' ? 'Mark as Not Driving' : 'Mark as Driving'}
                      >
                        <RefreshCw size={18} />
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
      
      {/* --- Delete Confirmation Modal --- */}
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

      {/* --- Edit Driver Modal --- */}
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
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/drivers/${editingDriver.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                  },
                  body: JSON.stringify(editForm),
                });
                if (response.ok) {
                  const updated = await response.json();
                  setDrivers(drivers.map((d) => (d.id === updated.id ? updated : d)));
                  setShowEditModal(false);
                  setEditingDriver(null);
                  setEditForm({});
                } else {
                  alert('Failed to update driver.');
                }
              }}
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                    value={editForm.vehicleType || ''}
                    name="vehicleType"
                    onChange={handleEditChange}
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
    </div>
  );
};

export default Drivers;