import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import api from '../utils/api';

// Vehicle interface for type safety
interface Vehicle {
    id: number;
    regNumber: string;
    type: string;
    capacity: number;
    driver: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    lastMaintenance: string;
    imageUrl?: string;
}

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
    const [routes, setRoutes] = useState<{ id: number; name: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [editForm, setEditForm] = useState<Partial<Vehicle>>({});

    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/vehicles', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            setVehicles(response.data);
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        const fetchDrivers = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/drivers', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            setDrivers(response.data);
        };
        fetchDrivers();
    }, []);

    useEffect(() => {
        const fetchRoutes = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/routes', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            setRoutes(response.data);
        };
        fetchRoutes();
    }, []);

    // Filter vehicles based on search query, type filter, and status filter
    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleDeleteClick = (id: number) => {
        setVehicleToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (vehicleToDelete) {
            const token = localStorage.getItem('token');
            await api.delete(`/api/vehicles/${vehicleToDelete}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete));
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        }
    };

    // Edit logic
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVehicle) return;
        const token = localStorage.getItem('token');
        const response = await api.put(`/api/vehicles/${editingVehicle.id}`, editForm, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });
        const updated = response.data;
        setVehicles(vehicles.map((v) => (v.id === updated.id ? updated : v)));
        setShowEditModal(false);
        setEditingVehicle(null);
        setEditForm({});
    };

    // Change status logic
    const handleStatusChange = async (vehicle: Vehicle) => {
        const nextStatus =
            vehicle.status === 'In Service'
                ? 'Available'
                : vehicle.status === 'Available'
                ? 'Maintenance'
                : 'In Service';
        const updatedVehicle = { ...vehicle, status: nextStatus };

        const token = localStorage.getItem('token');
        // Update vehicle status
        const response = await api.put(`/api/vehicles/${vehicle.id}`, updatedVehicle, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        // Update driver status if driver exists
        const driverName = vehicle.driver;
        const driver = drivers.find(d => d.name === driverName);
        if (driver) {
            const driverStatus = nextStatus === 'In Service' ? 'Driving' : 'Not Driving';
            await api.put(`/api/drivers/${driver.id}`, { status: driverStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
        }

        const updated = response.data;
        setVehicles(vehicles.map(v => v.id === updated.id ? updated : v));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Vehicle Management</h1>
                    <Link
                        to="/vehicles/add"
                        className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-200"
                    >
                        <Plus size={18} className="mr-1" />
                        Add New Vehicle
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
                            placeholder="Search by registration number or driver"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <select
                            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Bus">Bus</option>
                            <option value="Shuttle">Shuttle</option>
                        </select>

                        <select
                            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="In Service">In Service</option>
                            <option value="Available">Available</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type/Capacity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Driver
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-14 w-20">
                                                <img
                                                    className="h-14 w-20 rounded-lg object-cover border"
                                                    src={vehicle.imageUrl || 'https://via.placeholder.com/120x80?text=Vehicle'}
                                                    alt={vehicle.regNumber}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{vehicle.regNumber}</div>
                                                <div className="text-xs text-gray-500">
                                                    Last maintenance: {vehicle.lastMaintenance}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{vehicle.type}</div>
                                        <div className="text-xs text-gray-500">{vehicle.capacity} seats</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {vehicle.driver}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vehicle.route}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Dep: {vehicle.departureTime}</div>
                                        <div className="text-sm text-gray-900">Arr: {vehicle.arrivalTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                vehicle.status === 'In Service'
                                                    ? 'bg-green-100 text-green-800'
                                                    : vehicle.status === 'Available'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Change Status"
                                                onClick={() => handleStatusChange(vehicle)}
                                            >
                                                <RefreshCw size={18} />
                                            </button>
                                            <button
                                                className="text-teal-600 hover:text-teal-900"
                                                title="Edit Vehicle"
                                                onClick={() => {
                                                    setEditingVehicle(vehicle);
                                                    setEditForm(vehicle);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(vehicle.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Vehicle"
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

                {filteredVehicles.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No vehicles found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this vehicle? This action cannot be undone.
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

            {/* Edit Vehicle Modal */}
            {showEditModal && editingVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-auto animate-fade-in"
                        style={{ maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <h3 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
                            <Edit className="inline-block" /> Edit Vehicle
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="flex items-center gap-6 mb-4">
                                <div className="relative">
                                    <img
                                        src={editForm.imageUrl || 'https://via.placeholder.com/120x80?text=Vehicle'}
                                        alt="Vehicle"
                                        className="h-24 w-32 rounded-lg object-cover border-4 border-teal-200 shadow transition-all duration-300"
                                    />
                                    {editForm.imageUrl && (
                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-31 bg-red-600 hover:bg-red-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg transition-all duration-200 border-2 border-white"
                                            title="Remove Image"
                                            onClick={() => setEditForm(prev => ({ ...prev, imageUrl: '' }))}
                                            style={{ zIndex: 2 }}
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                    <label className="absolute bottom-0 right-0.5 bg-green-600 hover:bg-green-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 border-2 border-white">
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
                                                        setEditForm(prev => ({ ...prev, imageUrl: reader.result as string }));
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Number
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.regNumber || ''}
                                        name="regNumber"
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.type || ''}
                                        name="type"
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.capacity || ''}
                                        name="capacity"
                                        type="number"
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.driver || ''}
                                        name="driver"
                                        onChange={handleEditChange}
                                    >
                                        <option value="">Select a driver</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.id} value={driver.name}>
                                                {driver.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.route || ''}
                                        name="route"
                                        onChange={handleEditChange}
                                    >
                                        <option value="">Select a route</option>
                                        {routes.map((route) => (
                                            <option key={route.id} value={route.name}>
                                                {route.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.departureTime || ''}
                                        name="departureTime"
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.arrivalTime || ''}
                                        name="arrivalTime"
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.status || ''}
                                        name="status"
                                        onChange={handleEditChange}
                                    >
                                        <option value="In Service">In Service</option>
                                        <option value="Available">Available</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
                                    <input
                                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-teal-400 transition"
                                        value={editForm.lastMaintenance || ''}
                                        name="lastMaintenance"
                                        type="date"
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

export default Vehicles;