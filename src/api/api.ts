import type { ArtistProfile, User } from '../types/types';

const API_BASE_URL = 'http://localhost:8888/api';

export const api = {
  getArtists: async (category?: string): Promise<ArtistProfile[]> => {
    const url = category ? `${API_BASE_URL}/artists?category=${category}` : `${API_BASE_URL}/artists`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Could not fetch artists.');
    }
    const data = await response.json();
    return data.data;
  },

  getAllCategories: async (): Promise<string[]> => {
    const artists = await api.getArtists();
    const categorySet = new Set<string>();
    
    artists.forEach(artist => {
        if (artist.services && Array.isArray(artist.services)) {
            artist.services.forEach(service => {
                categorySet.add(service.category);
            });
        }
    });
    
    if (categorySet.size === 0) {
        return ['Nails', 'Lashes', 'Hair', 'Makeup', 'Facials', 'Massage'];
    }
    return Array.from(categorySet);
  },

  // --- NEW ---
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
    }
    return data;
  },
};