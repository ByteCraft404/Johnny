import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';

interface Route {
  id: number;
  name: string;
  distance: string;
  duration: string;
  fare: string;
  stops: string[];
  schedules: number;
  active: boolean;
  startTime: string;
  arrivalTime: string;
}

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [newRoute, setNewRoute] = useState({
    name: '',
    distance: '',
    fare: '',
    stops: '',
    startTime: '',
    arrivalTime: '',
    duration: '',
  });

  // Fetch routes from backend
  useEffect(() => {
    const fetchRoutes = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/routes', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      }
    };
    fetchRoutes();
  }, []);

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate duration from start and arrival time
  const calculateDuration = (start: string, arrival: string) => {
    if (!start || !arrival) return '';
    const [sh, sm] = start.split(':').map(Number);
    const [ah, am] = arrival.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    let arrivalMinutes = ah * 60 + am;
    if (arrivalMinutes < startMinutes) arrivalMinutes += 24 * 60; // handle overnight
    const diff = arrivalMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  // Add Route
  const handleAddRoute = async () => {
    const stopsArray = newRoute.stops.split(',').map(stop => stop.trim()).filter(stop => stop);
    const duration = calculateDuration(newRoute.startTime, newRoute.arrivalTime);
    const token = localStorage.getItem('token');
    const route = {
      ...newRoute,
      stops: stopsArray,
      schedules: 0,
      active: true,
      duration,
    };
    // Remove id if present
    delete (route as Partial<Route>).id;
    const response = await fetch('http://localhost:3001/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(route),
    });
    if (response.ok) {
      const saved = await response.json();
      setRoutes([...routes, saved]);
      setShowAddModal(false);
      setNewRoute({ name: '', distance: '', fare: '', stops: '', startTime: '', arrivalTime: '', duration: '' });
    } else {
      alert('Failed to add route');
    }
  };

  // Edit Route
  const handleEditRoute = async () => {
    if (!editingRoute) return;
    const stopsArray = Array.isArray(editingRoute.stops)
      ? editingRoute.stops
      : typeof editingRoute.stops === 'string'
        ? (editingRoute.stops as string).split(',').map((stop: string) => stop.trim()).filter((stop: string) => stop)
        : [];
    const duration = calculateDuration(editingRoute.startTime, editingRoute.arrivalTime);
    const token = localStorage.getItem('token');
    const updatedRoute = { ...editingRoute, stops: stopsArray, duration };
    const response = await fetch(`http://localhost:3001/api/routes/${editingRoute.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(updatedRoute),
    });
    if (response.ok) {
      const saved = await response.json();
      setRoutes(routes.map(r => r.id === saved.id ? saved : r));
      setShowEditModal(false);
      setEditingRoute(null);
    }
  };

  // Delete Route
  const handleDeleteClick = (id: number) => {
    setRouteToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (routeToDelete) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/routes/${routeToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setRoutes(routes.filter(route => route.id !== routeToDelete));
      setShowDeleteModal(false);
      setRouteToDelete(null);
    }
  };

  // Toggle Route Status
  const toggleRouteStatus = async (id: number) => {
    const route = routes.find(r => r.id === id);
    if (!route) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/routes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ ...route, active: !route.active }),
    });
    if (response.ok) {
      const updated = await response.json();
      setRoutes(routes.map(r => r.id === id ? updated : r));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Routes Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add New Route
          </button>
        </div>
        
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Search routes by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance/Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fare
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedules
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
              {filteredRoutes.map((route) => (
                <tr key={route.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <MapPin size={18} className="text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{route.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.distance}</div>
                    <div className="text-xs text-gray-500">{route.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.fare}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {route.stops.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.schedules} daily
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      route.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {route.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleRouteStatus(route.id)}
                        className={`px-2 py-1 rounded-md text-xs ${
                          route.active 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {route.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingRoute(route);
                          setShowEditModal(true);
                        }}
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit Route"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(route.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Route"
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
        
        {filteredRoutes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No routes found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Add Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Route</h3>
            <form onSubmit={e => { e.preventDefault(); handleAddRoute(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Route Name (Origin - Destination)
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. Nairobi - Mombasa"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                    Distance
                  </label>
                  <input
                    type="text"
                    id="distance"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. 485 km"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. 7h 30m"
                    value={calculateDuration(newRoute.startTime, newRoute.arrivalTime)}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
                  Fare
                </label>
                <input
                  type="text"
                  id="fare"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. KSh 1,500"
                  value={newRoute.fare}
                  onChange={(e) => setNewRoute({ ...newRoute, fare: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">
                  Stops (comma separated)
                </label>
                <input
                  type="text"
                  id="stops"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. Mtito Andei, Voi, Mariakani"
                  value={newRoute.stops}
                  onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={newRoute.startTime}
                    onChange={(e) => setNewRoute({ ...newRoute, startTime: e.target.value })}
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
                    value={newRoute.arrivalTime}
                    onChange={(e) => setNewRoute({ ...newRoute, arrivalTime: e.target.value })}
                  />
                </div>
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
                  Add Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Route Modal */}
      {showEditModal && editingRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Route</h3>
            <form onSubmit={e => { e.preventDefault(); handleEditRoute(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Route Name (Origin - Destination)
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. Nairobi - Mombasa"
                  value={editingRoute.name}
                  onChange={(e) => setEditingRoute({ ...editingRoute, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                    Distance
                  </label>
                  <input
                    type="text"
                    id="distance"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. 485 km"
                    value={editingRoute.distance}
                    onChange={(e) => setEditingRoute({ ...editingRoute, distance: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="e.g. 7h 30m"
                    value={calculateDuration(editingRoute.startTime, editingRoute.arrivalTime)}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
                  Fare
                </label>
                <input
                  type="text"
                  id="fare"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. KSh 1,500"
                  value={editingRoute.fare}
                  onChange={(e) => setEditingRoute({ ...editingRoute, fare: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">
                  Stops (comma separated)
                </label>
                <input
                  type="text"
                  id="stops"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="e.g. Mtito Andei, Voi, Mariakani"
                  value={Array.isArray(editingRoute.stops) ? editingRoute.stops.join(', ') : editingRoute.stops}
                  onChange={(e) => setEditingRoute({ ...editingRoute, stops: e.target.value.split(',').map(stop => stop.trim()) })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={editingRoute.startTime}
                    onChange={(e) => setEditingRoute({ ...editingRoute, startTime: e.target.value })}
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
                    value={editingRoute.arrivalTime}
                    onChange={(e) => setEditingRoute({ ...editingRoute, arrivalTime: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
              Are you sure you want to delete this route? This action cannot be undone.
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

export default Routes;