import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import api from '../utils/api';

interface Booking {
  totalAmount: number;
  status: string;
  bookingReference: string;
  paymentStatus: string;
  createdAt: string;
}

interface Driver {
  name: string;
  licenseNumber: string;
  experience: number;
  status: string;
  vehicleReg: string;
}

interface Vehicle {
  regNumber: string;
  type: string;
  capacity: string; // Assuming capacity can be a string like '40-seater'
  status: string;
  driver: string | null; // Driver can be unassigned
}

interface Schedule {
  route: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string[];
  status: string;
}

// Financial Report
export const generateFinancialReport = async () => {
  const { data: bookings } = await api.get<Booking[]>('/api/bookings');

  const doc = new jsPDF();
  const title = 'Financial Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  // Add summary
  const totalRevenue = bookings?.reduce((sum: number, booking: Booking) => sum + Number(booking.totalAmount || 0), 0) || 0;
  const confirmedBookings = bookings?.filter((b: Booking) => b.status === 'confirmed').length || 0;
  const pendingBookings = bookings?.filter((b: Booking) => b.status === 'pending').length || 0;

  doc.text(`Total Revenue: KSh ${totalRevenue.toLocaleString()}`, 14, 40);
  doc.text(`Confirmed Bookings: ${confirmedBookings}`, 14, 48);
  doc.text(`Pending Bookings: ${pendingBookings}`, 14, 56);

  // Add bookings table
  if (bookings?.length) {
    doc.autoTable({
      head: [['Booking Ref', 'Amount', 'Status', 'Payment Status', 'Date']],
      body: bookings.map((booking: Booking) => [
        booking.bookingReference,
        `KSh ${Number(booking.totalAmount || 0).toLocaleString()}`,
        booking.status,
        booking.paymentStatus,
        format(new Date(booking.createdAt), 'yyyy-MM-dd')
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Drivers Report
export const generateDriverReport = async () => {
  const { data: drivers } = await api.get<Driver[]>('/api/drivers');

  const doc = new jsPDF();
  const title = 'Drivers Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeDrivers = drivers?.filter((d: Driver) => d.status === 'Active').length || 0;
  const inactiveDrivers = drivers?.filter((d: Driver) => d.status !== 'Active').length || 0;

  doc.text(`Total Drivers: ${drivers?.length || 0}`, 14, 40);
  doc.text(`Active Drivers: ${activeDrivers}`, 14, 48);
  doc.text(`Inactive Drivers: ${inactiveDrivers}`, 14, 56);

  if (drivers?.length) {
    doc.autoTable({
      head: [['Name', 'License', 'Experience', 'Status', 'Vehicle']],
      body: drivers.map((driver: Driver) => [
        driver.name,
        driver.licenseNumber,
        `${driver.experience} years`,
        driver.status,
        driver.vehicleReg
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`drivers-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Vehicles Report
export const generateVehicleReport = async () => {
  const { data: vehicles } = await api.get<Vehicle[]>('/api/vehicles');

  const doc = new jsPDF();
  const title = 'Vehicles Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeVehicles = vehicles?.filter((v: Vehicle) => v.status === 'Active').length || 0;
  const maintenanceVehicles = vehicles?.filter((v: Vehicle) => v.status === 'Maintenance').length || 0;

  doc.text(`Total Vehicles: ${vehicles?.length || 0}`, 14, 40);
  doc.text(`Active Vehicles: ${activeVehicles}`, 14, 48);
  doc.text(`In Maintenance: ${maintenanceVehicles}`, 14, 56);

  if (vehicles?.length) {
    doc.autoTable({
      head: [['Reg Number', 'Type', 'Capacity', 'Status', 'Driver']],
      body: vehicles.map((vehicle: Vehicle) => [
        vehicle.regNumber,
        vehicle.type,
        vehicle.capacity,
        vehicle.status,
        vehicle.driver || 'Unassigned'
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`vehicles-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Routes Report (using schedules)
export const generateRouteReport = async () => {
  const { data: schedules } = await api.get<Schedule[]>('/api/schedules');

  const doc = new jsPDF();
  const title = 'Routes Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeRoutes = schedules?.filter((s: Schedule) => s.status === 'Active').length || 0;
  const inactiveRoutes = schedules?.filter((s: Schedule) => s.status !== 'Active').length || 0;

  doc.text(`Total Routes: ${schedules?.length || 0}`, 14, 40);
  doc.text(`Active Routes: ${activeRoutes}`, 14, 48);
  doc.text(`Inactive Routes: ${inactiveRoutes}`, 14, 56);

  if (schedules?.length) {
    doc.autoTable({
      head: [['Route', 'Departure', 'Arrival', 'Days', 'Status']],
      body: schedules.map((schedule: Schedule) => [
        schedule.route,
        schedule.departureTime,
        schedule.arrivalTime,
        Array.isArray(schedule.daysOfWeek) ? schedule.daysOfWeek.join(', ') : '',
        schedule.status
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`routes-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};