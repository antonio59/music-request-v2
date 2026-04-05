import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  sessionId: localStorage.getItem('sessionId'),
  isAuthenticated: !!localStorage.getItem('sessionId'),
  
  // Toast notifications
  toast: null,
  
  // UI state
  currentPage: 'home',
  
  // Toast actions
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  
  hideToast: () => set({ toast: null }),
  
  // Actions
  login: async (username, pin) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, pin });
      const { user, sessionId } = response.data;
      localStorage.setItem('sessionId', sessionId);
      set({ user, sessionId, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },
  
  logout: async () => {
    const { sessionId } = get();
    if (sessionId) {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { 'X-Session-Id': sessionId },
      });
    }
    localStorage.removeItem('sessionId');
    set({ user: null, sessionId: null, isAuthenticated: false });
  },
  
  search: async (query, type) => {
    const { sessionId } = get();
    if (!sessionId) return [];
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: query, type },
        headers: { 'X-Session-Id': sessionId },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
  
  createRequest: async (data) => {
    const { sessionId } = get();
    if (!sessionId) throw new Error('Not authenticated');
    const response = await axios.post(`${API_URL}/requests`, data, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
  
  getRequests: async () => {
    const { sessionId } = get();
    if (!sessionId) return [];
    const response = await axios.get(`${API_URL}/requests`, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
  
  getPendingRequests: async () => {
    const { sessionId } = get();
    if (!sessionId) return [];
    const response = await axios.get(`${API_URL}/requests/pending`, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
  
  approveRequest: async (id) => {
    const { sessionId } = get();
    const response = await axios.post(`${API_URL}/requests/${id}/approve`, {}, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
  
  rejectRequest: async (id) => {
    const { sessionId } = get();
    const response = await axios.post(`${API_URL}/requests/${id}/reject`, {}, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
  
  deleteRequest: async (id) => {
    const { sessionId } = get();
    await axios.delete(`${API_URL}/requests/${id}`, {
      headers: { 'X-Session-Id': sessionId },
    });
  },
  
  getRequestStatus: async (id) => {
    const { sessionId } = get();
    if (!sessionId) return null;
    try {
      const response = await axios.get(`${API_URL}/requests/${id}/status`, {
        headers: { 'X-Session-Id': sessionId },
      });
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      return null;
    }
  },
  
  getAnalytics: async () => {
    const { sessionId } = get();
    if (!sessionId) return null;
    const response = await axios.get(`${API_URL}/analytics`, {
      headers: { 'X-Session-Id': sessionId },
    });
    return response.data;
  },
}));

export default useStore;
