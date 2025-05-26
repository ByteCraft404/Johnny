import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, Edit, Trash2 } from 'lucide-react';

const Schedules: React.FC = () => {
  interface Schedule {
    id: number;
    route: string;
    departureTime: string;
    arrivalTime: string;
    daysOfWeek: string[];
    vehicle: string;
    driver: string;
    status: string;
  }

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  interface Route {
    id: number;
    name: string;
    active: boolean;
    startTime?: string;
    arrivalTime?: string;
    // Add other properties if needed
  }
  const [routes, setRoutes] = useState<Route[]>([]);
  interface Vehicle {
    id: number;
    regNumber: string;
    type: string;
    status: string;
    // Add other properties if needed
  }
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  interface Driver {
    id: number;
    name: string;
    status: string;
    // Add other properties if needed
  }
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const [addForm, setAddForm] = useState({
    route: '',
    departureTime: '',
    arrivalTime: '',
    daysOfWeek: [] as string[],
    vehicle: '',
    driver: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('http://localhost:3001/api/routes', { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
      fetch('http://localhost:3001/api/vehicles', { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
      fetch('http://localhost:3001/api/drivers', { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
      fetch('http://localhost:3001/api/schedules', { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
    ]).then(async ([routesRes, vehiclesRes, driversRes, schedulesRes]) => {
      setRoutes(await routesRes.json());
      setVehicles(await vehiclesRes.json());
      setDrivers(await driversRes.json());
      setSchedules(await schedulesRes.json());
    });
  }, []);

  // Filter for dropdowns
  const availableRoutes = routes.filter((r: Route) => r.active);
  const availableVehicles = vehicles.filter((v: Vehicle) => v.status === 'Available' || v.status === 'In Service');
  const availableDrivers = drivers.filter((d: Driver) => d.status === 'Available' || d.status === 'Driving');

  // Filter schedules based on search query and route filter
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.route?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.vehicle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.driver?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    if (type === 'checkbox' && name === 'daysOfWeek') {
      const checked = (target as HTMLInputElement).checked;
      setAddForm(prev => ({
        ...prev,
        daysOfWeek: checked
          ? [...prev.daysOfWeek, value]
          : prev.daysOfWeek.filter(day => day !== value),
      }));
    } else if (name === 'route') {
      const selectedRoute = routes.find((r: Route) => r.name === value);
      setAddForm(prev => ({
        ...prev,
        route: value,
        departureTime: selectedRoute && selectedRoute.startTime ? selectedRoute.startTime : '',
        arrivalTime: selectedRoute && selectedRoute.arrivalTime ? selectedRoute.arrivalTime : '',
      }));
    } else {
      setAddForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newSchedule = {
      ...addForm,
      id: Date.now(),
      status: 'Active',
    };
    const response = await fetch('http://localhost:3001/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(newSchedule),
    });
    if (response.ok) {
      const saved = await response.json();
      setSchedules([...schedules, saved]);
      setShowAddModal(false);
      setAddForm({
        route: '',
        departureTime: '',
        arrivalTime: '',
        daysOfWeek: [],
        vehicle: '',
        driver: '',
      });
    } else {
      alert('Failed to add schedule');
    }
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
              {['All', ...availableRoutes.map((route) => route.name)].map((route, index) => (
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
                      <button
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit Schedule"
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setShowEditModal(true);
                        }}
                      >
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
            <form onSubmit={handleAddSchedule}>
              <div className="mb-4">
                <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  id="route"
                  name="route"
                  value={addForm.route}
                  onChange={handleAddFormChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Route</option>
                  {availableRoutes.map(route => (
                    <option key={route.id} value={route.name}>{route.name}</option>
                  ))}
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
                    name="departureTime"
                    value={addForm.departureTime}
                    onChange={handleAddFormChange}
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
                    value={addForm.arrivalTime}
                    onChange={handleAddFormChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days of Operation
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const isSelected = addForm.daysOfWeek.includes(day);
                    return (
                      <label
                        key={index}
                        className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors
                          ${isSelected ? 'bg-green-100 text-green-800 border-green-400' : 'bg-white text-gray-700'}
                          hover:bg-green-50`}
                      >
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={day}
                          checked={isSelected}
                          onChange={handleAddFormChange}
                          className="sr-only"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={addForm.vehicle}
                  onChange={handleAddFormChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Vehicle</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.regNumber}>{vehicle.regNumber} ({vehicle.type})</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <select
                  id="driver"
                  name="driver"
                  value={addForm.driver}
                  onChange={handleAddFormChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Driver</option>
                  {availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.name}>{driver.name}</option>
                  ))}
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
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Schedule Modal */}
      {showEditModal && editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Schedule</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/schedules/${editingSchedule.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                  },
                  body: JSON.stringify(editingSchedule),
                });
                if (response.ok) {
                  const updated = await response.json();
                  setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
                  setShowEditModal(false);
                  setEditingSchedule(null);
                } else {
                  alert('Failed to update schedule');
                }
              }}
            >
              {/* Route */}
              <div className="mb-4">
                <label htmlFor="edit-route" className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  id="edit-route"
                  name="route"
                  value={editingSchedule.route}
                  onChange={e => {
                    const value = e.target.value;
                    const selectedRoute = routes.find(r => r.name === value);
                    setEditingSchedule(prev => prev ? ({
                      ...prev,
                      route: value,
                      departureTime: selectedRoute?.startTime || '',
                      arrivalTime: selectedRoute?.arrivalTime || '',
                    }) : null);
                  }}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Route</option>
                  {availableRoutes.map(route => (
                    <option key={route.id} value={route.name}>{route.name}</option>
                  ))}
                </select>
              </div>
              {/* Departure & Arrival */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="edit-departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    id="edit-departureTime"
                    name="departureTime"
                    value={editingSchedule.departureTime}
                    onChange={e => setEditingSchedule(prev => prev ? ({ ...prev, departureTime: e.target.value }) : null)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    id="edit-arrivalTime"
                    name="arrivalTime"
                    value={editingSchedule.arrivalTime}
                    onChange={e => setEditingSchedule(prev => prev ? ({ ...prev, arrivalTime: e.target.value }) : null)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* Days of Operation */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days of Operation
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const isSelected = editingSchedule.daysOfWeek.includes(day);
                    return (
                      <label
                        key={index}
                        className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors
                          ${isSelected ? 'bg-green-100 text-green-800 border-green-400' : 'bg-white text-gray-700'}
                          hover:bg-green-50`}
                      >
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={day}
                          checked={isSelected}
                          onChange={e => {
                            const checked = e.target.checked;
                            setEditingSchedule(prev => prev ? ({
                              ...prev,
                              daysOfWeek: checked
                                ? [...prev.daysOfWeek, day]
                                : prev.daysOfWeek.filter(d => d !== day)
                            }) : null);
                          }}
                          className="sr-only"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {/* Vehicle */}
              <div className="mb-4">
                <label htmlFor="edit-vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  id="edit-vehicle"
                  name="vehicle"
                  value={editingSchedule.vehicle}
                  onChange={e => setEditingSchedule(prev => prev ? ({ ...prev, vehicle: e.target.value }) : null)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Vehicle</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.regNumber}>{vehicle.regNumber} ({vehicle.type})</option>
                  ))}
                </select>
              </div>
              {/* Driver */}
              <div className="mb-4">
                <label htmlFor="edit-driver" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <select
                  id="edit-driver"
                  name="driver"
                  value={editingSchedule.driver}
                  onChange={e => setEditingSchedule(prev => prev ? ({ ...prev, driver: e.target.value }) : null)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Driver</option>
                  {availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.name}>{driver.name}</option>
                  ))}
                </select>
              </div>
              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingSchedule(null); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Save Changes
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