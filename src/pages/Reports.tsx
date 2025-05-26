import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Users, Bus, CreditCard, 
  TrendingUp, Route, Clock, CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  generateFinancialReport, 
  generateDriverReport,
  generateVehicleReport,
  generateRouteReport
} from '../services/reports';

const revenueData = [
  { name: 'Jan', revenue: 150000, expenses: 85000 },
  { name: 'Feb', revenue: 180000, expenses: 90000 },
  { name: 'Mar', revenue: 210000, expenses: 95000 },
  { name: 'Apr', revenue: 190000, expenses: 88000 },
  { name: 'May', revenue: 240000, expenses: 110000 },
  { name: 'Jun', revenue: 230000, expenses: 105000 },
];

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      switch (reportType) {
        case 'financial':
          await generateFinancialReport();
          break;
        case 'drivers':
          await generateDriverReport();
          break;
        case 'vehicles':
          await generateVehicleReport();
          break;
        case 'routes':
          await generateRouteReport();
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Options */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Report Type</h2>
              <div className="space-y-2">
                <ReportTypeOption 
                  id="financial"
                  label="Financial Reports"
                  icon={<CreditCard size={18} />}
                  description="Revenue, expenses, profit margins"
                  selected={reportType === 'financial'}
                  onChange={() => setReportType('financial')}
                />
                <ReportTypeOption 
                  id="bookings"
                  label="Booking Reports"
                  icon={<Calendar size={18} />}
                  description="Booking trends, popular routes"
                  selected={reportType === 'bookings'}
                  onChange={() => setReportType('bookings')}
                />
                <ReportTypeOption 
                  id="drivers"
                  label="Driver Reports"
                  icon={<Users size={18} />}
                  description="Driver performance, schedules"
                  selected={reportType === 'drivers'}
                  onChange={() => setReportType('drivers')}
                />
                <ReportTypeOption 
                  id="vehicles"
                  label="Vehicle Reports"
                  icon={<Bus size={18} />}
                  description="Vehicle usage, maintenance"
                  selected={reportType === 'vehicles'}
                  onChange={() => setReportType('vehicles')}
                />
                <ReportTypeOption 
                  id="routes"
                  label="Route Reports"
                  icon={<Route size={18} />}
                  description="Route performance, occupancy rates"
                  selected={reportType === 'routes'}
                  onChange={() => setReportType('routes')}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Time Period</h2>
              <div className="space-y-2">
                <DateRangeOption 
                  id="day"
                  label="Daily"
                  selected={dateRange === 'day'}
                  onChange={() => setDateRange('day')}
                />
                <DateRangeOption 
                  id="week"
                  label="Weekly"
                  selected={dateRange === 'week'}
                  onChange={() => setDateRange('week')}
                />
                <DateRangeOption 
                  id="month"
                  label="Monthly"
                  selected={dateRange === 'month'}
                  onChange={() => setDateRange('month')}
                />
                <DateRangeOption 
                  id="quarter"
                  label="Quarterly"
                  selected={dateRange === 'quarter'}
                  onChange={() => setDateRange('quarter')}
                />
                <DateRangeOption 
                  id="year"
                  label="Yearly"
                  selected={dateRange === 'year'}
                  onChange={() => setDateRange('year')}
                />
                <DateRangeOption 
                  id="custom"
                  label="Custom Range"
                  selected={dateRange === 'custom'}
                  onChange={() => setDateRange('custom')}
                />
              </div>
              
              {dateRange === 'custom' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                isGenerating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={18} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Recent Reports</h2>
              <div className="space-y-3">
                <RecentReportItem 
                  title="Financial Report - May 2023"
                  date="June 1, 2023"
                  type="financial"
                />
                <RecentReportItem 
                  title="Vehicle Maintenance Summary"
                  date="May 28, 2023"
                  type="vehicles"
                />
                <RecentReportItem 
                  title="Driver Performance Q1 2023"
                  date="April 15, 2023"
                  type="drivers"
                />
                <RecentReportItem 
                  title="Route Profitability Analysis"
                  date="April 10, 2023"
                  type="routes"
                />
              </div>
            </div>
          </div>
          
          {/* Report Preview */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {reportType === 'financial' && 'Financial Report Preview'}
                  {reportType === 'bookings' && 'Booking Report Preview'}
                  {reportType === 'drivers' && 'Driver Report Preview'}
                  {reportType === 'vehicles' && 'Vehicle Report Preview'}
                  {reportType === 'routes' && 'Route Report Preview'}
                </h2>
                <span className="text-sm text-gray-500">
                  {dateRange === 'day' && 'Daily View'}
                  {dateRange === 'week' && 'Weekly View'}
                  {dateRange === 'month' && 'Monthly View'}
                  {dateRange === 'quarter' && 'Quarterly View'}
                  {dateRange === 'year' && 'Yearly View'}
                  {dateRange === 'custom' && 'Custom Range View'}
                </span>
              </div>
              
              {reportType === 'financial' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                      <p className="text-2xl font-bold text-gray-900">KSh 1,200,000</p>
                      <span className="text-xs text-green-600">+8.2% from previous period</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
                      <p className="text-2xl font-bold text-gray-900">KSh 573,000</p>
                      <span className="text-xs text-red-600">+5.4% from previous period</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Revenue vs. Expenses</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Revenue Breakdown by Route</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nairobi - Mombasa</span>
                        <span className="text-sm font-medium">KSh 520,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '43%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nairobi - Kisumu</span>
                        <span className="text-sm font-medium">KSh 310,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '26%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mombasa - Malindi</span>
                        <span className="text-sm font-medium">KSh 180,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nairobi - Nakuru</span>
                        <span className="text-sm font-medium">KSh 120,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Other Routes</span>
                        <span className="text-sm font-medium">KSh 70,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: '6%' }}></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {reportType === 'bookings' && (
                <div className="text-center py-20">
                  <p className="text-gray-500">Select options and generate report to see booking data</p>
                </div>
              )}
              
              {reportType === 'drivers' && (
                <div className="text-center py-20">
                  <p className="text-gray-500">Select options and generate report to see driver performance data</p>
                </div>
              )}
              
              {reportType === 'vehicles' && (
                <div className="text-center py-20">
                  <p className="text-gray-500">Select options and generate report to see vehicle utilization data</p>
                </div>
              )}
              
              {reportType === 'routes' && (
                <div className="text-center py-20">
                  <p className="text-gray-500">Select options and generate report to see route analysis data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReportTypeOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  selected: boolean;
  onChange: () => void;
}

const ReportTypeOption: React.FC<ReportTypeOptionProps> = ({ 
  id, label, icon, description, selected, onChange 
}) => {
  return (
    <label 
      htmlFor={id}
      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
        selected 
          ? 'bg-teal-50 border-teal-500' 
          : 'border-gray-300 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-start">
        <input
          type="radio"
          id={id}
          name="reportType"
          checked={selected}
          onChange={onChange}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
        />
        <div className="ml-3 flex items-center">
          <span className="mr-2 text-teal-600">{icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </label>
  );
};

interface DateRangeOptionProps {
  id: string;
  label: string;
  selected: boolean;
  onChange: () => void;
}

const DateRangeOption: React.FC<DateRangeOptionProps> = ({ id, label, selected, onChange }) => {
  return (
    <label 
      htmlFor={id}
      className={`block p-2 border rounded-lg cursor-pointer transition-colors ${
        selected 
          ? 'bg-teal-50 border-teal-500' 
          : 'border-gray-300 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          id={id}
          name="dateRange"
          checked={selected}
          onChange={onChange}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
        />
        <span className="ml-2 text-sm font-medium text-gray-900">{label}</span>
      </div>
    </label>
  );
};

interface RecentReportItemProps {
  title: string;
  date: string;
  type: string;
}

const RecentReportItem: React.FC<RecentReportItemProps> = ({ title, date, type }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'financial': return <CreditCard size={16} className="text-green-500" />;
      case 'bookings': return <Calendar size={16} className="text-blue-500" />;
      case 'drivers': return <Users size={16} className="text-purple-500" />;
      case 'vehicles': return <Bus size={16} className="text-orange-500" />;
      case 'routes': return <Route size={16} className="text-red-500" />;
      default: return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="flex items-center">
        <div className="mr-3">
          {getIcon(type)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <button className="text-teal-600 hover:text-teal-700">
        <Download size={16} />
      </button>
    </div>
  );
};

export default Reports;