// API base URL — set VITE_API_URL in .env for production
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authenticated fetch helper (uses JWT from localStorage)
export const authFetch = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper functions
export const apiClient = {
  // Chat endpoints
  sendMessage: async (message, token) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  },

  getChatHistory: async (token, limit = 50) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_URL}/chat/history?limit=${limit}`, {
      headers,
    });

    if (!response.ok) throw new Error('Failed to fetch chat history');
    return await response.json();
  },

  // User endpoints
  syncUser: async (userData, token) => {
    const response = await fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to sync user');
    return await response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  },

  updateProfile: async (userData, token) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  },

  getCounselors: async (token) => {
    const response = await fetch(`${API_URL}/users/counselors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch counselors');
    return await response.json();
  },

  // Appointment endpoints
  createAppointment: async (appointmentData, token) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) throw new Error('Failed to create appointment');
    return await response.json();
  },

  getAppointments: async (token, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/appointments?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch appointments');
    return await response.json();
  },

  updateAppointmentStatus: async (appointmentId, statusData, token) => {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) throw new Error('Failed to update appointment');
    return await response.json();
  },

  cancelAppointment: async (appointmentId, reason, token) => {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cancelReason: reason }),
    });

    if (!response.ok) throw new Error('Failed to cancel appointment');
    return await response.json();
  },
};

export default apiClient;
