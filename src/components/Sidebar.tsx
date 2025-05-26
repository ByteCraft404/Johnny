import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MessageSquare, Map, 
  CalendarDays, Bus, ClipboardList, Info, 
  FileText, UserCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-teal-800 text-white flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-center">
        <h1 className={`text-2xl font-bold ${isOpen ? 'block' : 'hidden'}`}>Safari Njema</h1>
        <span className={`text-2xl font-bold ${isOpen ? 'hidden' : 'block'}`}>SN</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-2 py-4">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" isOpen={isOpen} />
          <SidebarItem to="/drivers" icon={<Users size={20} />} text="Drivers" isOpen={isOpen} />
          <SidebarItem to="/contact-users" icon={<MessageSquare size={20} />} text="Contact Users" isOpen={isOpen} />
          <SidebarItem to="/routes" icon={<Map size={20} />} text="Routes" isOpen={isOpen} />
          <SidebarItem to="/calendar" icon={<CalendarDays size={20} />} text="Calendar" isOpen={isOpen} />
          <SidebarItem to="/vehicles" icon={<Bus size={20} />} text="Vehicles" isOpen={isOpen} />
          <SidebarItem to="/schedules" icon={<ClipboardList size={20} />} text="Schedules" isOpen={isOpen} />
          <SidebarItem to="/about-us" icon={<Info size={20} />} text="About Us" isOpen={isOpen} />
          <SidebarItem to="/reports" icon={<FileText size={20} />} text="Reports" isOpen={isOpen} />
          <SidebarItem to="/profile" icon={<UserCircle size={20} />} text="Profile" isOpen={isOpen} />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-teal-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
            <span className="text-white font-bold">SN</span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">Safari Njema</p>
              <p className="text-xs text-teal-300">Admin Panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, isOpen }) => {
  return (
    <li className="mb-2">
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-lg transition-colors ${
            isActive 
              ? 'bg-teal-700 text-white' 
              : 'text-teal-100 hover:bg-teal-700'
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        {isOpen && <span>{text}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;