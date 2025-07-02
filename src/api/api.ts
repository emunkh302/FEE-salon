import type { User, Category } from '../types/types';

const API_BASE_URL = 'http://localhost:8888/api';

const groupServicesByCategory = (services: any[]): Category[] => {
    const categoryMap: { [key: string]: Category } = {};
    services.forEach(service => {
        if (!categoryMap[service.category]) {
            categoryMap[service.category] = { name: service.category, services: [] };
        }
        categoryMap[service.category].services.push({
            _id: service._id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
        });
    });
    return Object.values(categoryMap);
};

export const api = {
  getServicesGroupedByCategory: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/artists`); 
    if (!response.ok) {
        throw new Error('Could not fetch data from server.');
    }
    const artistData = await response.json();
    const allServices = artistData.data.flatMap((artist: any) => artist.services || []);
    return groupServicesByCategory(allServices);
  },
  
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

  registerClient: async (formData: FormData): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/client`, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
        if (response.status === 409) {
            throw new Error(data.message || 'An account with this email already exists.');
        }
        throw new Error(data.message || 'Registration failed');
    }
    return data;
  }
};
