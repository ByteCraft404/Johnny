import { supabase } from '../lib/supabase';
import { Driver, Vehicle, Schedule, Trip, Booking, Customer } from '../types';

export const driversApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(driver: Omit<Driver, 'id'>) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([driver])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, driver: Partial<Driver>) {
    const { data, error } = await supabase
      .from('drivers')
      .update(driver)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('drivers')
      .update({ status: 'Deleted' })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const vehiclesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(vehicle: Omit<Vehicle, 'id'>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .update({ status: 'Deleted' })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const schedulesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(schedule: Omit<Schedule, 'id'>) {
    const { data, error } = await supabase
      .from('schedules')
      .insert([schedule])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, schedule: Partial<Schedule>) {
    const { data, error } = await supabase
      .from('schedules')
      .update(schedule)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('schedules')
      .update({ status: 'Deleted' })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const tripsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('departure_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(trip: Omit<Trip, 'id'>) {
    const { data, error } = await supabase
      .from('trips')
      .insert([trip])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, trip: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update(trip)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const bookingsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, trip:trips(*), customer:customers(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, trip:trips(*), customer:customers(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(booking: Omit<Booking, 'id'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, booking: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(booking)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const customersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(customer: Omit<Customer, 'id'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, customer: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};