import type { User, ArtistProfile, Service, Booking } from '../types/types';

const API_BASE_URL = 'http://localhost:8888/api';

export const api = {
  loginUser: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  registerClient: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getArtists: async (token: string): Promise<ArtistProfile[]> => {
    const response = await fetch(`${API_BASE_URL}/artists`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch artists');
    return data.data;
  },

  getMyServices: async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/my-services`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch services');
    return data.data;
  },

  createService: async (token: string, serviceData: Partial<Service>): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(serviceData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not create service');
    return data.data;
  },

  updateService: async (token: string, serviceId: string, serviceData: Partial<Service>): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(serviceData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not update service');
    return data.data;
  },

  deleteService: async (token: string, serviceId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Could not delete service');
    }
  },

  // --- NEW BOOKING FUNCTIONS ---
  getServicesByArtist: async (token: string, artistId: string): Promise<Service[]> => {
    // NOTE: This endpoint is an assumption based on REST best practices.
    // The API docs don't explicitly list it, but it's a standard pattern.
    const response = await fetch(`${API_BASE_URL}/services/artist/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch artist services');
    return data.data;
  },

  createBooking: async (token: string, bookingData: any): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not create booking');
    // The API returns { message, booking, paymentIntentClientSecret }
    // We'll just return the booking object for now.
    return data.booking;
  },
};