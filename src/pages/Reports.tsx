import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Calendar, Users, Bus, CreditCard, 
  Route
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const revenueData = [
  { name: 'Jan', revenue: 150000, expenses: 85000 },
  { name: 'Feb', revenue: 180000, expenses: 90000 },
  { name: 'Mar', revenue: 210000, expenses: 95000 },
  { name: 'Apr', revenue: 190000, expenses: 88000 },
  { name: 'May', revenue: 240000, expenses: 110000 },
  { name: 'Jun', revenue: 230000, expenses: 105000 },
];

interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  bookings?: {
    name: string;
    route: string;
    time: string;
    status: string;
  }[];
}

interface Vehicle {
  id?: string | number;
  regNumber: string;
  type: string;
  status: string;
  capacity: number;
}

interface Driver {
  id?: string | number;
  name: string;
  licenseNumber: string;
  status: string;
}

interface RouteType {
  id?: string | number;
  name: string;
  distance: string;
  fare: string;
  active: boolean;
}

interface Booking {
  id?: string | number;
  name: string;
  route: string;
  time: string;
  status: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Removed unused financial state

  const generateFinancialPDF = async (report: FinancialReport) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Financial Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text('Summary:', 14, 40);
    doc.text(`Total Revenue: KSh ${report.totalRevenue}`, 14, 48);
    doc.text(`Total Expenses: KSh ${report.totalExpenses}`, 14, 56);
    doc.text(`Net Profit: KSh ${report.netProfit}`, 14, 64);

    // --- Add Bar Chart as Image ---
    if (chartRef.current) {
      const chartCanvas = await html2canvas(chartRef.current);
      const chartImg = chartCanvas.toDataURL('image/png');
      doc.addImage(chartImg, 'PNG', 14, 70, 180, 60); // Adjust position and size as needed
    }

    let y = 140;
    doc.text('Bookings:', 14, y);
    y += 8;
    (report.bookings || []).forEach((booking, idx) => {
      doc.text(
        `${idx + 1}. ${booking.name} | ${booking.route} | ${booking.time} | ${booking.status}`,
        14,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('financial_report.pdf');
  };

  const generateVehiclePDF = (vehicles: Vehicle[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Vehicle Report', 14, 20);

    doc.setFontSize(12);
    let y = 30;
    if (!vehicles || vehicles.length === 0) {
      doc.text('No vehicle data available.', 14, y);
    } else {
      vehicles.forEach((vehicle, idx) => {
        doc.text(
          `${idx + 1}. Reg: ${vehicle.regNumber} | Type: ${vehicle.type} | Status: ${vehicle.status} | Capacity: ${vehicle.capacity}`,
          14,
          y
        );
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save('vehicle_report.pdf');
  };

  const generateDriverPDF = (drivers: Driver[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Driver Report', 14, 20);

    doc.setFontSize(12);
    let y = 30;
    drivers.forEach((driver, idx) => {
      doc.text(
        `${idx + 1}. Name: ${driver.name} | License: ${driver.licenseNumber} | Status: ${driver.status}`,
        14,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('driver_report.pdf');
  };

  const generateRoutePDF = (routes: RouteType[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Route Report', 14, 20);

    doc.setFontSize(12);
    let y = 30;
    routes.forEach((route, idx) => {
      doc.text(
        `${idx + 1}. Name: ${route.name} | Distance: ${route.distance} | Fare: ${route.fare} | Active: ${route.active ? 'Yes' : 'No'}`,
        14,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('route_report.pdf');
  };

  const generateBookingPDF = (bookings: Booking[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Booking Report', 14, 20);

    doc.setFontSize(12);
    let y = 30;
    bookings.forEach((booking, idx) => {
      doc.text(
        `${idx + 1}. Name: ${booking.name} | Route: ${booking.route} | Time: ${booking.time} | Status: ${booking.status}`,
        14,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('booking_report.pdf');
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      switch (reportType) {
        case 'financial': {
          const response = await fetch('http://localhost:3001/api/reports');
          if (!response.ok) {
            alert('Failed to fetch report data');
            break;
          }
          const report = await response.json();
          await generateFinancialPDF(report);
          break;
        }
        case 'drivers': {
          const response = await fetch('http://localhost:3001/api/drivers');
          if (!response.ok) {
            alert('Failed to fetch drivers');
            break;
          }
          const drivers = await response.json();
          generateDriverPDF(drivers);
          break;
        }
        case 'vehicles': {
          const response = await fetch('http://localhost:3001/api/vehicles');
          if (!response.ok) {
            alert('Failed to fetch vehicles');
            break;
          }
          const vehicles = await response.json();
          generateVehiclePDF(vehicles);
          break;
        }
        case 'routes': {
          const response = await fetch('http://localhost:3001/api/routes');
          if (!response.ok) {
            alert('Failed to fetch routes');
            break;
          }
          const routes = await response.json();
          generateRoutePDF(routes);
          break;
        }
        case 'bookings': {
          const response = await fetch('http://localhost:3001/api/bookings');
          if (!response.ok) {
            alert('Failed to fetch bookings');
            break;
          }
          const bookings = await response.json();
          generateBookingPDF(bookings);
          break;
        }
        default:
          alert('Unknown report type');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (type: string) => {
    try {
      switch (type) {
        case 'financial': {
          const response = await fetch('http://localhost:3001/api/reports');
          const report = response.ok ? await response.json() : {};
          await generateFinancialPDF(report || {});
          break;
        }
        case 'vehicles': {
          const response = await fetch('http://localhost:3001/api/vehicles');
          const vehiclesData = response.ok ? await response.json() : [];
          generateVehiclePDF(vehiclesData || []);
          break;
        }
        case 'drivers': {
          const response = await fetch('http://localhost:3001/api/drivers');
          const driversData = response.ok ? await response.json() : [];
          generateDriverPDF(driversData || []);
          break;
        }
        case 'routes': {
          const response = await fetch('http://localhost:3001/api/routes');
          const routesData = response.ok ? await response.json() : [];
          generateRoutePDF(routesData || []);
          break;
        }
        case 'bookings': {
          const response = await fetch('http://localhost:3001/api/bookings');
          const bookingsData = response.ok ? await response.json() : [];
          generateBookingPDF(bookingsData || []);
          break;
        }
        default: {
          // Always generate a blank PDF with a title for unknown types
          const doc = new jsPDF();
          doc.text('Blank Report', 14, 20);
          doc.save('blank_report.pdf');
          break;
        }
      }
    } catch {
      // On any error, generate a blank PDF with a title
      const doc = new jsPDF();
      doc.text('Blank Report', 14, 20);
      doc.save('blank_report.pdf');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (reportType === 'vehicles') {
        const res = await fetch('http://localhost:3001/api/vehicles');
        setVehicles(await res.json());
      } else if (reportType === 'drivers') {
        const res = await fetch('http://localhost:3001/api/drivers');
        setDrivers(await res.json());
      } else if (reportType === 'routes') {
        const res = await fetch('http://localhost:3001/api/routes');
        setRoutes(await res.json());
      } else if (reportType === 'bookings') {
        const res = await fetch('http://localhost:3001/api/bookings');
        setBookings(await res.json());
      } else if (reportType === 'financial') {
        // Optionally fetch financial report data here if needed for preview
        // const res = await fetch('http://localhost:3001/api/reports');
        // const financialData = await res.json();
        // Use financialData as needed
      }
    };
    fetchData();
  }, [reportType]);

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
                  handleDownloadReport={handleDownloadReport}
                />
                <RecentReportItem 
                  title="Vehicle Maintenance Summary"
                  date="May 28, 2023"
                  type="vehicles"
                  handleDownloadReport={handleDownloadReport}
                />
                <RecentReportItem 
                  title="Driver Performance Q1 2023"
                  date="April 15, 2023"
                  type="drivers"
                  handleDownloadReport={handleDownloadReport}
                />
                <RecentReportItem 
                  title="Route Profitability Analysis"
                  date="April 10, 2023"
                  type="routes"
                  handleDownloadReport={handleDownloadReport}
                />
                <RecentReportItem 
                  title="Booking Trends"
                  date="March 20, 2023"
                  type="bookings"
                  handleDownloadReport={handleDownloadReport}
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
                    <div className="h-64" ref={chartRef}>
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
                <div>
                  <h3 className="text-lg font-bold mb-2">All Vehicles</h3>
                  <ul>
                    {vehicles.map(v => (
                      <li key={v.id || v.regNumber} className="mb-1">
                        {v.regNumber} - {v.type} ({v.status})
                      </li>
                    ))}
                  </ul>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Available', count: vehicles.filter(v => v.status === 'Available').length },
                      { name: 'In Service', count: vehicles.filter(v => v.status === 'In Service').length },
                      { name: 'Maintenance', count: vehicles.filter(v => v.status === 'Maintenance').length }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {reportType === 'drivers' && (
                <div>
                  <h3 className="text-lg font-bold mb-2">All Drivers</h3>
                  <ul>
                    {drivers.map(d => (
                      <li key={d.id || d.licenseNumber} className="mb-1">
                        {d.name} - {d.licenseNumber} ({d.status})
                      </li>
                    ))}
                  </ul>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Active', count: drivers.filter(d => d.status === 'Active').length },
                      { name: 'Inactive', count: drivers.filter(d => d.status === 'Inactive').length }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {reportType === 'routes' && (
                <div>
                  <h3 className="text-lg font-bold mb-2">All Routes</h3>
                  <ul>
                    {routes.map(r => (
                      <li key={r.id || r.name} className="mb-1">
                        {r.name} - {r.distance} ({r.active ? 'Active' : 'Inactive'})
                      </li>
                    ))}
                  </ul>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Active', count: routes.filter(r => r.active).length },
                      { name: 'Inactive', count: routes.filter(r => !r.active).length }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {reportType === 'bookings' && (
                <div>
                  <h3 className="text-lg font-bold mb-2">All Bookings</h3>
                  <ul>
                    {bookings.map(b => (
                      <li key={b.id || b.name} className="mb-1">
                        {b.name} - {b.route} ({b.status})
                      </li>
                    ))}
                  </ul>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
                      { name: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                      { name: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
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
  handleDownloadReport: (type: string) => void;
}

const RecentReportItem: React.FC<RecentReportItemProps> = ({ title, date, type, handleDownloadReport }) => {
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
      <button
        className="text-teal-600 hover:text-teal-700"
        onClick={() => handleDownloadReport(type)}
        type="button"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

export default Reports;