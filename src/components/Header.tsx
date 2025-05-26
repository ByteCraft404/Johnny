import React, { useContext } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { UserContext } from '../context/UserContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useContext(UserContext);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search size={18} className="text-gray-500" />
            </span>
            <input
              className="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 border-gray-300 focus:border-teal-600"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
              <span className="sr-only">Notifications</span>
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
          
          <div className="relative ml-4 flex items-center">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatar}
                alt="User avatar"
              />
              <span className="ml-2 font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;