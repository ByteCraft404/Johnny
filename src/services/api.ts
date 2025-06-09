import api from '../utils/api';
import { Driver, Vehicle, Schedule, Trip, Booking, Customer } from '../types';

export const driversApi = {
  async getAll() {
    const { data } = await api.get<Driver[]>('/api/drivers');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Driver>(`/api/drivers/${id}`);
    return data;
  },

  async create(driver: Omit<Driver, 'id'>) {
    const { data } = await api.post<Driver>('/api/drivers', driver);
    return data;
  },

  async update(id: string, driver: Partial<Driver>) {
    const { data } = await api.put<Driver>(`/api/drivers/${id}`, driver);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/api/drivers/${id}`);
  }
};

export const vehiclesApi = {
  async getAll() {
    const { data } = await api.get<Vehicle[]>('/api/vehicles');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Vehicle>(`/api/vehicles/${id}`);
    return data;
  },

  async create(vehicle: Omit<Vehicle, 'id'>) {
    const { data } = await api.post<Vehicle>('/api/vehicles', vehicle);
    return data;
  },

  async update(id: string, vehicle: Partial<Vehicle>) {
    const { data } = await api.put<Vehicle>(`/api/vehicles/${id}`, vehicle);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/api/vehicles/${id}`);
  }
};

export const schedulesApi = {
  async getAll() {
    const { data } = await api.get<Schedule[]>('/api/schedules');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Schedule>(`/api/schedules/${id}`);
    return data;
  },

  async create(schedule: Omit<Schedule, 'id'>) {
    const { data } = await api.post<Schedule>('/api/schedules', schedule);
    return data;
  },

  async update(id: string, schedule: Partial<Schedule>) {
    const { data } = await api.put<Schedule>(`/api/schedules/${id}`, schedule);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/api/schedules/${id}`);
  }
};

export const tripsApi = {
  async getAll() {
    const { data } = await api.get<Trip[]>('/api/trips');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Trip>(`/api/trips/${id}`);
    return data;
  },

  async create(trip: Omit<Trip, 'id'>) {
    const { data } = await api.post<Trip>('/api/trips', trip);
    return data;
  },

  async update(id: string, trip: Partial<Trip>) {
    const { data } = await api.put<Trip>(`/api/trips/${id}`, trip);
    return data;
  }
};

export const bookingsApi = {
  async getAll() {
    const { data } = await api.get<Booking[]>('/api/bookings');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Booking>(`/api/bookings/${id}`);
    return data;
  },

  async create(booking: Omit<Booking, 'id'>) {
    const { data } = await api.post<Booking>('/api/bookings', booking);
    return data;
  },

  async update(id: string, booking: Partial<Booking>) {
    const { data } = await api.put<Booking>(`/api/bookings/${id}`, booking);
    return data;
  }
};

export const customersApi = {
  async getAll() {
    const { data } = await api.get<Customer[]>('/api/customers');
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Customer>(`/api/customers/${id}`);
    return data;
  },

  async create(customer: Omit<Customer, 'id'>) {
    const { data } = await api.post<Customer>('/api/customers', customer);
    return data;
  },

  async update(id: string, customer: Partial<Customer>) {
    const { data } = await api.put<Customer>(`/api/customers/${id}`, customer);
    return data;
  }
};