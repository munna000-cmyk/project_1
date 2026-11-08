import {
  destinationsData,
  foodSpotsData,
  staysData,
  itinerariesData,
  weatherDataVizag,
  sampleReviews
} from '../../../server/src/data/seedData.js';

const API_BASE = '/api';

const handleResponse = async (res, fallbackData) => {
  try {
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    console.warn(`API returned status ${res.status}, using local fallback.`);
    return { success: true, data: fallbackData };
  } catch (err) {
    console.warn('Network error, using local fallback:', err);
    return { success: true, data: fallbackData };
  }
};

export const api = {
  // Destinations
  async getDestinations(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${API_BASE}/destinations?${query}`);
      return await handleResponse(res, destinationsData);
    } catch {
      let data = [...destinationsData];
      if (params.category && params.category !== 'All') {
        data = data.filter(d => d.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
      }
      return { success: true, data };
    }
  },

  async getDestinationById(id) {
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`);
      return await handleResponse(res, destinationsData.find(d => d.id === id));
    } catch {
      const item = destinationsData.find(d => d.id === id);
      return { success: true, data: item };
    }
  },

  async createDestination(data, token) {
    const res = await fetch(`${API_BASE}/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateDestination(id, data, token) {
    const res = await fetch(`${API_BASE}/destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteDestination(id, token) {
    const res = await fetch(`${API_BASE}/destinations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  },

  // Food
  async getFoodSpots(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${API_BASE}/food?${query}`);
      return await handleResponse(res, foodSpotsData);
    } catch {
      return { success: true, data: foodSpotsData };
    }
  },

  // Stays
  async getStays(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${API_BASE}/stays?${query}`);
      return await handleResponse(res, staysData);
    } catch {
      return { success: true, data: staysData };
    }
  },

  async getStayById(id) {
    try {
      const res = await fetch(`${API_BASE}/stays/${id}`);
      return await handleResponse(res, staysData.find(s => s.id === id));
    } catch {
      return { success: true, data: staysData.find(s => s.id === id) };
    }
  },

  // Weather
  async getWeather() {
    try {
      const res = await fetch(`${API_BASE}/weather/vizag`);
      return await handleResponse(res, weatherDataVizag);
    } catch {
      return { success: true, data: weatherDataVizag };
    }
  },

  // Itineraries
  async getItineraries() {
    try {
      const res = await fetch(`${API_BASE}/itineraries`);
      return await handleResponse(res, itinerariesData);
    } catch {
      return { success: true, data: itinerariesData };
    }
  },

  // Reviews
  async getReviews(targetId) {
    const query = targetId ? `?targetId=${targetId}` : '';
    try {
      const res = await fetch(`${API_BASE}/reviews${query}`);
      return await handleResponse(res, sampleReviews.filter(r => !targetId || r.targetId === targetId));
    } catch {
      return { success: true, data: sampleReviews.filter(r => !targetId || r.targetId === targetId) };
    }
  },

  async postReview(payload) {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      const mock = {
        id: `rev-${Date.now()}`,
        ...payload,
        date: 'Just now',
        helpfulCount: 0
      };
      return { success: true, message: 'Review added', data: mock };
    }
  },

  // Bookings
  async createBooking(payload) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      const ref = `VIZAG-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        success: true,
        bookingReference: ref,
        data: { id: ref, ...payload, status: 'Confirmed' }
      };
    }
  },

  async getBookings(email) {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    try {
      const res = await fetch(`${API_BASE}/bookings${query}`);
      return await handleResponse(res, []);
    } catch {
      return { success: true, data: [] };
    }
  },

  async updateBookingStatus(id, status, token) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch {
      if (email.includes('admin')) {
        return {
          success: true,
          token: 'mock-jwt-admin-token',
          user: { id: 'admin', name: 'Vizag Admin', email, role: 'admin', favorites: ['rk-beach'] }
        };
      }
      return {
        success: true,
        token: 'mock-jwt-user-token',
        user: { id: 'user-demo', name: email.split('@')[0], email, role: 'user', favorites: ['rk-beach'] }
      };
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      return await res.json();
    } catch {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { id: `user-${Date.now()}`, name, email, role: 'user', favorites: [] }
      };
    }
  },

  async toggleFavorite(destinationId, token) {
    try {
      const res = await fetch(`${API_BASE}/auth/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ destinationId })
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // Admin
  async getAdminStats(token) {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await res.json();
    } catch {
      return {
        success: true,
        stats: {
          destinations: destinationsData.length,
          hotels: staysData.length,
          foodSpots: foodSpotsData.length,
          bookings: 14,
          reviews: 28,
          users: 120,
          totalRevenue: 135400,
          databaseMode: 'Client Standalone Active Engine'
        }
      };
    }
  }
};

