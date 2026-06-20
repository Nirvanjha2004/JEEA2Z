import { create } from 'zustand';
import api from '../api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('jee-sheet-token') || null,
  loading: true,

  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('jee-sheet-token', token);
    set({ token, user, loading: false });
    return res.data;
  },

  loginWithGoogle: async (idToken) => {
    const res = await api.post('/api/auth/google', { idToken });
    const { token, user } = res.data.data;
    localStorage.setItem('jee-sheet-token', token);
    set({ token, user, loading: false });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('jee-sheet-token', token);
    set({ token, user, loading: false });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('jee-sheet-token');
    set({ user: null, token: null, loading: false });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data.data, loading: false });
    } catch (err) {
      localStorage.removeItem('jee-sheet-token');
      set({ user: null, token: null, loading: false });
    }
  },
}));

export default useAuthStore;
