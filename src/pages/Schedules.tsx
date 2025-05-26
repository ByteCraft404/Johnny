import React, { useState } from 'react';
import { Plus, Search, Clock, Calendar, Edit, Trash2 } from 'lucide-react';

// Sample schedules data
const initialSchedules = [
  {
    id: 1,
    route: 'Nairobi - Mombasa',
    departureTime: '08:30 AM',
    arrivalTime: '04:00 PM',
    daysOfWeek: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    vehicle: 'KCE 123X (Bus)',
    driver: 'Daniel Kamau',
    status: 'Active'
  },
  {
    id: 2,
    route: 'Nairobi - Kisumu',
    departureTime: '09:15 AM',
    arrivalTime: '03:30 PM',
    daysOfWeek: ['Tuesday', 'Thursday', 'Saturday'],
    vehicle: 'KDB 456Y (Shuttle)',
    driver: 'Mercy Wanjiku',
    status: 'Active'
  },
  {
    id: 3,
    route: 'Mombasa - Malindi',
    departureTime: '10:00 AM',
    arrivalTime: '12:30 PM',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    vehicle: 'KDD 789Z (Bus)',
    driver: 'Hassan Omar',
    status: 'Active'
  },
  {
    id: 4,
    route: 'Nairobi - Nakuru',
    departureTime: '11:30 AM',
    arrivalTime: '02:15 PM',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    vehicle: 'KDG 234A (Shuttle)',
    driver: 'Jane Muthoni',
    status: 'Inactive'
  },
  {
    id: 5,
    route: 'Kisumu - Kakamega',
    departureTime: '02:00 PM',
    arrivalTime: '03:15 PM',
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
    vehicle: 'KDH 567B (Bus)',
    driver: 'Joseph Kimani',
    status: 'Active'
  },
];

const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  
  // Get unique routes for filter dropdown
  const routes = ['All', ...new Set(schedules.map(schedule => schedule.route))];
  
  // Filter schedules based on search query and route filter
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          schedule.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          schedule.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = routeFilter === 'All' || schedule.route === routeFilter;
    return matchesSearch && matchesRoute;
  });
  
  const handleDeleteClick = (id: number) => {
    setScheduleToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleToDelete));
      setShowDeleteModal(false);
      setScheduleToDelete(null);
    }
  };
  
  const toggleScheduleStatus = (id: number) => {
    setSchedules(schedules.map(schedule => {
      if (schedule.id === id) {
        return {
          ...schedule,
          status: schedule.status === 'Active' ? 'Inactive' : 'Active'
        };
      }
      return schedule;
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Schedules Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Schedule
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-grow md:mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search by route, vehicle or driver"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
            >
              {routes.map((route, index) => (
                <option key={index} value={route}>{route}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle & Driver
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
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.route}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={16} className="text-teal-600 mr-1" />
                      <div className="text-sm text-gray-900">
                        {schedule.departureTime} - {schedule.arrivalTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {schedule.daysOfWeek.map((day, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.vehicle}</div>
                    <div className="text-sm text-gray-500">{schedule.driver}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      schedule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleScheduleStatus(schedule.id)}
                        className={`px-2 py-1 rounded-md text-xs ${
                          schedule.status === 'Active' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {schedule.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="text-teal-600 hover:text-teal-900" title="Edit Schedule">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Schedule"
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
        
        {filteredSchedules.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No schedules found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Schedule</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  id="route"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Route</option>
                  <option value="Nairobi - Mombasa">Nairobi - Mombasa</option>
                  <option value="Nairobi - Kisumu">Nairobi - Kisumu</option>
                  <option value="Mombasa - Malindi">Mombasa - Malindi</option>
                  <option value="Nairobi - Nakuru">Nairobi - Nakuru</option>
                  <option value="Kisumu - Kakamega">Kisumu - Kakamega</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    id="departureTime"
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
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days of Operation
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <label key={index} className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="sr-only" />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  id="vehicle"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Vehicle</option>
                  <option value="KCE 123X (Bus)">KCE 123X (Bus)</option>
                  <option value="KDB 456Y (Shuttle)">KDB 456Y (Shuttle)</option>
                  <option value="KDD 789Z (Bus)">KDD 789Z (Bus)</option>
                  <option value="KDG 234A (Shuttle)">KDG 234A (Shuttle)</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <select
                  id="driver"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Driver</option>
                  <option value="Daniel Kamau">Daniel Kamau</option>
                  <option value="Mercy Wanjiku">Mercy Wanjiku</option>
                  <option value="Hassan Omar">Hassan Omar</option>
                  <option value="Jane Muthoni">Jane Muthoni</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this schedule? This action cannot be undone.
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

export default Schedules;