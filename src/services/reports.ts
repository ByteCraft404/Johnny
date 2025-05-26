import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export const generateFinancialReport = async () => {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

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
  const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;

  doc.text(`Total Revenue: KSh ${totalRevenue.toLocaleString()}`, 14, 40);
  doc.text(`Confirmed Bookings: ${confirmedBookings}`, 14, 48);
  doc.text(`Pending Bookings: ${pendingBookings}`, 14, 56);

  // Add bookings table
  if (bookings?.length) {
    doc.autoTable({
      head: [['Booking Ref', 'Amount', 'Status', 'Payment Status', 'Date']],
      body: bookings.map(booking => [
        booking.booking_reference,
        `KSh ${Number(booking.total_amount).toLocaleString()}`,
        booking.status,
        booking.payment_status,
        format(new Date(booking.created_at), 'yyyy-MM-dd')
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateDriverReport = async () => {
  const { data: drivers } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false });

  const doc = new jsPDF();
  const title = 'Drivers Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeDrivers = drivers?.filter(d => d.status === 'Active').length || 0;
  const inactiveDrivers = drivers?.filter(d => d.status !== 'Active').length || 0;

  doc.text(`Total Drivers: ${drivers?.length || 0}`, 14, 40);
  doc.text(`Active Drivers: ${activeDrivers}`, 14, 48);
  doc.text(`Inactive Drivers: ${inactiveDrivers}`, 14, 56);

  if (drivers?.length) {
    doc.autoTable({
      head: [['Name', 'License', 'Experience', 'Status', 'Vehicle']],
      body: drivers.map(driver => [
        driver.name,
        driver.license_number,
        `${driver.experience} years`,
        driver.status,
        driver.vehicle_reg
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`drivers-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateVehicleReport = async () => {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  const doc = new jsPDF();
  const title = 'Vehicles Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeVehicles = vehicles?.filter(v => v.status === 'Active').length || 0;
  const maintenanceVehicles = vehicles?.filter(v => v.status === 'Maintenance').length || 0;

  doc.text(`Total Vehicles: ${vehicles?.length || 0}`, 14, 40);
  doc.text(`Active Vehicles: ${activeVehicles}`, 14, 48);
  doc.text(`In Maintenance: ${maintenanceVehicles}`, 14, 56);

  if (vehicles?.length) {
    doc.autoTable({
      head: [['Reg Number', 'Type', 'Capacity', 'Status', 'Driver']],
      body: vehicles.map(vehicle => [
        vehicle.reg_number,
        vehicle.type,
        vehicle.capacity,
        vehicle.status,
        vehicle.assigned_driver || 'Unassigned'
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`vehicles-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateRouteReport = async () => {
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*')
    .order('created_at', { ascending: false });

  const doc = new jsPDF();
  const title = 'Routes Report';
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${date}`, 14, 30);

  const activeRoutes = schedules?.filter(s => s.status === 'Active').length || 0;
  const inactiveRoutes = schedules?.filter(s => s.status !== 'Active').length || 0;

  doc.text(`Total Routes: ${schedules?.length || 0}`, 14, 40);
  doc.text(`Active Routes: ${activeRoutes}`, 14, 48);
  doc.text(`Inactive Routes: ${inactiveRoutes}`, 14, 56);

  if (schedules?.length) {
    doc.autoTable({
      head: [['Route', 'Departure', 'Arrival', 'Days', 'Status']],
      body: schedules.map(schedule => [
        schedule.route,
        schedule.departure_time,
        schedule.arrival_time,
        schedule.days_of_week.join(', '),
        schedule.status
      ]),
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 128] }
    });
  }

  doc.save(`routes-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};