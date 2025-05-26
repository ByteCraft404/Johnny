import React, { useState } from 'react';
import { Search, Mail, Phone, MessageSquare, Filter, X } from 'lucide-react';

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: 'John Mwangi',
    email: 'john.mwangi@example.com',
    phone: '+254 712 345 678',
    bookings: 8,
    lastBooking: '2023-06-12',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Mary Wambui',
    email: 'mary.wambui@example.com',
    phone: '+254 723 456 789',
    bookings: 5,
    lastBooking: '2023-05-30',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Peter Odhiambo',
    email: 'peter.odhiambo@example.com',
    phone: '+254 734 567 890',
    bookings: 12,
    lastBooking: '2023-06-15',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Sarah Njeri',
    email: 'sarah.njeri@example.com',
    phone: '+254 745 678 901',
    bookings: 3,
    lastBooking: '2023-04-22',
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Michael Kimani',
    email: 'michael.kimani@example.com',
    phone: '+254 756 789 012',
    bookings: 7,
    lastBooking: '2023-06-08',
    status: 'Active'
  },
];

const ContactUsers: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [contactMethod, setContactMethod] = useState('email');
  const [message, setMessage] = useState('');
  
  // Filter users based on search query and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleContactClick = (user: any) => {
    setSelectedUser(user);
    setShowContactModal(true);
    setMessage(''); // Reset message when opening modal
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }
    
    // In a real application, you would send the message using the selected method
    console.log('Sending message to:', selectedUser);
    console.log('Method:', contactMethod);
    console.log('Message:', message);
    
    // Close the modal
    setShowContactModal(false);
    setSelectedUser(null);
    
    // Show success message
    alert(`Message sent to ${selectedUser.name} via ${contactMethod}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Users</h1>
        
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-grow md:mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search users by name, email or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0 flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Users</option>
              <option value="Active">Active Users</option>
              <option value="Inactive">Inactive Users</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">Last booking: {user.lastBooking}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.bookings} trips
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleContactClick(user)}
                      className="text-teal-600 hover:text-teal-900 bg-teal-50 px-3 py-1 rounded-md flex items-center"
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Contact User Modal */}
      {showContactModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Contact {selectedUser.name}
              </h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Choose how you'd like to contact this user:
              </p>
              
              <div className="flex space-x-3 mb-4">
                <button
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    contactMethod === 'email' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail size={18} className="mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setContactMethod('sms')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    contactMethod === 'sms' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare size={18} className="mr-2" />
                  SMS
                </button>
                <button
                  onClick={() => setContactMethod('call')}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                    contactMethod === 'call' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Phone size={18} className="mr-2" />
                  Call
                </button>
              </div>
              
              {contactMethod === 'call' ? (
                <div className="text-center py-4">
                  <Phone size={24} className="mx-auto text-teal-600 mb-2" />
                  <p className="text-gray-600">
                    Click the button below to initiate a call to {selectedUser.name} at {selectedUser.phone}
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {contactMethod === 'email' ? 'Email Message' : 'SMS Message'}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder={`Write your ${contactMethod === 'email' ? 'email' : 'SMS'} here...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                {contactMethod === 'call' ? 'Call Now' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUsers;