import type { User, ArtistProfile, Service, Booking } from '../types/types';

const API_BASE_URL = 'http://localhost:8888/api';

export const api = {
  loginUser: async (email: string, password: string): Promise<{ token:string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (role: 'client' | 'artist', formData: FormData): Promise<any> => {
    const endpoint = role === 'client' ? '/auth/register/client' : '/auth/register/artist';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getArtists: async (category?: string): Promise<ArtistProfile[]> => {
    const url = category ? `${API_BASE_URL}/artists?category=${category}` : `${API_BASE_URL}/artists`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch artists');
    return data.data;
  },

  getAllCategories: async (): Promise<string[]> => {
    const artists = await api.getArtists();
    const categorySet = new Set<string>();
    for (const artist of artists) {
        if (artist.services && Array.isArray(artist.services)) {
            artist.services.forEach((service: any) => {
                categorySet.add(service.category);
            });
        }
    }
    if (categorySet.size === 0) {
        return ['Nails', 'Lashes', 'Hair', 'Makeup', 'Facials', 'Massage'];
    }
    return Array.from(categorySet);
  },

  getMyServices: async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/my-services`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch services');
    return data.data;
  },

  createService: async (token: string, serviceData: Partial<Service> & { artistId: string }): Promise<Service> => {
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

  getServicesByArtist: async (token: string, artistId: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/artist/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch artist services');
    return data.data;
  },

  createBooking: async (token: string, bookingData: any): Promise<{ booking: Booking, paymentIntentClientSecret: string }> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not create booking');
    return data;
  },
  
  getPendingArtists: async (token: string): Promise<ArtistProfile[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/artists/pending`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not fetch pending artists');
    return data.data;
  },

  updateArtistStatus: async (token: string, artistId: string, status: 'approved' | 'rejected'): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/admin/artists/${artistId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not update artist status');
    return data;
  },
};