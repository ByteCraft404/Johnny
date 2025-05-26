import React from 'react';
import { useContext } from 'react';
import { 
  TrendingUp, 
  Users, 
  Bus, 
  Wallet,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Mon', amount: 12000 },
  { name: 'Tue', amount: 19000 },
  { name: 'Wed', amount: 10000 },
  { name: 'Thu', amount: 15000 },
  { name: 'Fri', amount: 20000 },
  { name: 'Sat', amount: 25000 },
  { name: 'Sun', amount: 18000 },
];

const Dashboard: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}👋</h1>
        <p className="text-gray-600">Here's what's happening with your transportation business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="KSh 110,000" 
          change="+14%" 
          icon={<TrendingUp className="text-teal-500" />} 
        />
        <StatCard 
          title="Total Bookings" 
          value="156" 
          change="+7.2%" 
          icon={<CalendarIcon className="text-blue-500" />} 
        />
        <StatCard 
          title="Active Drivers" 
          value="24" 
          change="+2.3%" 
          icon={<Users className="text-purple-500" />} 
        />
        <StatCard 
          title="Available Vehicles" 
          value="32" 
          change="-4%" 
          icon={<Bus className="text-orange-500" />} 
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
            <select className="form-select border-gray-300 rounded-md text-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            <BookingItem 
              name="John Doe" 
              route="Nairobi - Mombasa" 
              time="10:30 AM" 
              status="Confirmed" 
            />
            <BookingItem 
              name="Jane Smith" 
              route="Nairobi - Nakuru" 
              time="12:45 PM" 
              status="Pending" 
            />
            <BookingItem 
              name="Robert Johnson" 
              route="Mombasa - Malindi" 
              time="2:15 PM" 
              status="Confirmed" 
            />
            <BookingItem 
              name="Sarah Williams" 
              route="Nairobi - Kisumu" 
              time="4:30 PM" 
              status="Cancelled" 
            />
            <BookingItem 
              name="Michael Brown" 
              route="Nakuru - Eldoret" 
              time="6:00 PM" 
              status="Confirmed" 
            />
          </div>
          <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium">
            View all bookings
          </button>
        </div>
      </div>

      {/* Financial Summary and Active Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <FinanceStat 
              title="Today's Revenue" 
              value="KSh 25,400" 
              icon={<Wallet size={20} className="text-green-500" />} 
            />
            <FinanceStat 
              title="Today's Expenses" 
              value="KSh 8,750" 
              icon={<Wallet size={20} className="text-red-500" />} 
            />
            <FinanceStat 
              title="This Week" 
              value="KSh 110,000" 
              icon={<Wallet size={20} className="text-blue-500" />} 
            />
            <FinanceStat 
              title="This Month" 
              value="KSh 435,600" 
              icon={<Wallet size={20} className="text-purple-500" />} 
            />
          </div>
          <button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200">
            Generate Financial Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Trips</h2>
          <div className="space-y-4">
            <TripItem 
              route="Nairobi - Mombasa" 
              driver="Daniel Kamau" 
              vehicleReg="KCE 123X" 
              departure="08:30 AM" 
              arrival="2:30 PM" 
            />
            <TripItem 
              route="Nairobi - Kisumu" 
              driver="Mercy Wanjiku" 
              vehicleReg="KDB 456Y" 
              departure="09:15 AM" 
              arrival="3:45 PM" 
            />
            <TripItem 
              route="Mombasa - Malindi" 
              driver="Hassan Omar" 
              vehicleReg="KDD 789Z" 
              departure="10:00 AM" 
              arrival="12:30 PM" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
      <div className="mt-2">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-600 ml-1">from last week</span>
      </div>
    </div>
  );
};

interface FinanceStatProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const FinanceStat: React.FC<FinanceStatProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface BookingItemProps {
  name: string;
  route: string;
  time: string;
  status: string;
}

const BookingItem: React.FC<BookingItemProps> = ({ name, route, time, status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">{route}</p>
        <div className="flex items-center mt-1">
          <Clock size={14} className="text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
};

interface TripItemProps {
  route: string;
  driver: string;
  vehicleReg: string;
  departure: string;
  arrival: string;
}

const TripItem: React.FC<TripItemProps> = ({ route, driver, vehicleReg, departure, arrival }) => {
  return (
    <div className="p-4 border border-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">{route}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          In Progress
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Driver:</p>
          <p className="font-medium">{driver}</p>
        </div>
        <div>
          <p className="text-gray-600">Vehicle:</p>
          <p className="font-medium">{vehicleReg}</p>
        </div>
        <div>
          <p className="text-gray-600">Departure:</p>
          <p className="font-medium">{departure}</p>
        </div>
        <div>
          <p className="text-gray-600">Arrival:</p>
          <p className="font-medium">{arrival}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;