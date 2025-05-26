import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';

// Sample routes data
const initialRoutes = [
  {
    id: 1,
    name: 'Nairobi - Mombasa',
    distance: '485 km',
    duration: '7h 30m',
    fare: 'KSh 1,500',
    stops: ['Mtito Andei', 'Voi', 'Mariakani'],
    schedules: 8,
    active: true
  },
  {
    id: 2,
    name: 'Nairobi - Kisumu',
    distance: '350 km',
    duration: '6h 15m',
    fare: 'KSh 1,200',
    stops: ['Nakuru', 'Kericho', 'Ahero'],
    schedules: 6,
    active: true
  },
  {
    id: 3,
    name: 'Mombasa - Malindi',
    distance: '120 km',
    duration: '2h 30m',
    fare: 'KSh 800',
    stops: ['Kilifi', 'Watamu'],
    schedules: 10,
    active: true
  },
  {
    id: 4,
    name: 'Nairobi - Nakuru',
    distance: '160 km',
    duration: '2h 45m',
    fare: 'KSh 700',
    stops: ['Naivasha', 'Gilgil'],
    schedules: 12,
    active: true
  },
  {
    id: 5,
    name: 'Kisumu - Kakamega',
    distance: '60 km',
    duration: '1h 15m',
    fare: 'KSh 400',
    stops: ['Luanda'],
    schedules: 5,
    active: false
  },
];

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState(initialRoutes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [newRoute, setNewRoute] = useState({
    name: '',
    distance: '',
    duration: '',
    fare: '',
    stops: ''
  });
  
  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteClick = (id: number) => {
    setRouteToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (routeToDelete) {
      setRoutes(routes.filter(route => route.id !== routeToDelete));
      setShowDeleteModal(false);
      setRouteToDelete(null);
    }
  };
  
  const handleAddRoute = () => {
    const stopsArray = newRoute.stops.split(',').map(stop => stop.trim()).filter(stop => stop);
    
    const route = {
      id: routes.length + 1,
      name: newRoute.name,
      distance: newRoute.distance,
      duration: newRoute.duration,
      fare: newRoute.fare,
      stops: stopsArray,
      schedules: 0,
      active: true
    };
    
    setRoutes([...routes, route]);
    setShowAddModal(false);
    setNewRoute({
      name: '',
      distance: '',
      duration: '',
      fare: '',
      stops: ''
    });
  };
  
  const toggleRouteStatus = (id: number) => {
    setRoutes(routes.map(route => {
      if (route.id === id) {
        return {
          ...route,
          active: !route.active
        };
      }
      return route;
    }));
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
                      <button className="text-teal-600 hover:text-teal-900" title="Edit Route">
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
            <form>
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
                    value={newRoute.duration}
                    onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
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
                  onClick={handleAddRoute}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Route
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