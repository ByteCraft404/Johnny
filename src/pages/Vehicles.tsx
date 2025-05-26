import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

// Sample vehicle data
const initialVehicles = [
  {
    id: 1,
    regNumber: 'KCE 123X',
    type: 'Bus',
    capacity: 45,
    driver: 'Daniel Kamau',
    route: 'Nairobi - Mombasa',
    departureTime: '08:30 AM',
    arrivalTime: '2:30 PM',
    status: 'In Service',
    lastMaintenance: '2023-05-15'
  },
  {
    id: 2,
    regNumber: 'KDB 456Y',
    type: 'Shuttle',
    capacity: 18,
    driver: 'Mercy Wanjiku',
    route: 'Nairobi - Kisumu',
    departureTime: '09:15 AM',
    arrivalTime: '3:45 PM',
    status: 'In Service',
    lastMaintenance: '2023-06-02'
  },
  {
    id: 3,
    regNumber: 'KDD 789Z',
    type: 'Bus',
    capacity: 50,
    driver: 'Hassan Omar',
    route: 'Mombasa - Malindi',
    departureTime: '10:00 AM',
    arrivalTime: '12:30 PM',
    status: 'In Service',
    lastMaintenance: '2023-04-20'
  },
  {
    id: 4,
    regNumber: 'KDG 234A',
    type: 'Shuttle',
    capacity: 14,
    driver: 'Unassigned',
    route: 'N/A',
    departureTime: 'N/A',
    arrivalTime: 'N/A',
    status: 'Maintenance',
    lastMaintenance: '2023-06-10'
  },
  {
    id: 5,
    regNumber: 'KDH 567B',
    type: 'Bus',
    capacity: 42,
    driver: 'Unassigned',
    route: 'N/A',
    departureTime: 'N/A',
    arrivalTime: 'N/A',
    status: 'Available',
    lastMaintenance: '2023-05-28'
  },
];

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  
  // Filter vehicles based on search query, type filter, and status filter
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleDeleteClick = (id: number) => {
    setVehicleToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleToDelete));
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type/Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.regNumber}</div>
                    <div className="text-xs text-gray-500">Last maintenance: {vehicle.lastMaintenance}</div>
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
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vehicle.status === 'In Service' 
                        ? 'bg-green-100 text-green-800' 
                        : vehicle.status === 'Available'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900" title="Edit Vehicle">
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
    </div>
  );
};

export default Vehicles;