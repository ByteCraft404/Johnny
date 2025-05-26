import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';

// Sample driver data
const initialDrivers = [
  {
    id: 1,
    name: 'Daniel Kamau',
    gender: 'Male',
    age: 32,
    phone: '+254 712 345 678',
    vehicleReg: 'KCE 123X',
    vehicleType: 'Bus',
    status: 'Driving',
    route: 'Nairobi - Mombasa',
    photo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    name: 'Mercy Wanjiku',
    gender: 'Female',
    age: 29,
    phone: '+254 723 456 789',
    vehicleReg: 'KDB 456Y',
    vehicleType: 'Shuttle',
    status: 'Driving',
    route: 'Nairobi - Kisumu',
    photo: 'https://images.pexels.com/photos/4420634/pexels-photo-4420634.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'Hassan Omar',
    gender: 'Male',
    age: 35,
    phone: '+254 734 567 890',
    vehicleReg: 'KDD 789Z',
    vehicleType: 'Bus',
    status: 'Driving',
    route: 'Mombasa - Malindi',
    photo: 'https://images.pexels.com/photos/6437565/pexels-photo-6437565.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 4,
    name: 'Jane Muthoni',
    gender: 'Female',
    age: 31,
    phone: '+254 745 678 901',
    vehicleReg: 'KDG 234A',
    vehicleType: 'Shuttle',
    status: 'Not Driving',
    route: 'N/A',
    photo: 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 5,
    name: 'Joseph Kimani',
    gender: 'Male',
    age: 33,
    phone: '+254 756 789 012',
    vehicleReg: 'KDH 567B',
    vehicleType: 'Bus',
    status: 'Not Driving',
    route: 'N/A',
    photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
];

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
  
  // Filter drivers based on search query and status filter
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          driver.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleDeleteClick = (id: number) => {
    setDriverToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (driverToDelete) {
      setDrivers(drivers.filter(driver => driver.id !== driverToDelete));
      setShowDeleteModal(false);
      setDriverToDelete(null);
    }
  };
  
  const changeDriverStatus = (id: number) => {
    setDrivers(drivers.map(driver => {
      if (driver.id === id) {
        const newStatus = driver.status === 'Driving' ? 'Not Driving' : 'Driving';
        return {
          ...driver,
          status: newStatus,
          route: newStatus === 'Not Driving' ? 'N/A' : driver.route
        };
      }
      return driver;
    }));
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
              <option value="Driving">Driving</option>
              <option value="Not Driving">Not Driving</option>
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
              {filteredDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={driver.photo} alt={driver.name} />
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
                      <button className="text-teal-600 hover:text-teal-900" title="Edit Driver">
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
      
      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

export default Drivers;