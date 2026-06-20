import { create } from 'zustand';
import api from '../api';

const useStreakStore = create((set) => ({
  streak: null,
  loading: false,

  fetchStreak: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/streak');
      set({ streak: res.data.data, loading: false });
    } catch (err) {
      console.error('Failed to fetch streak:', err);
      set({ loading: false });
    }
  },

  updateGoal: async (n) => {
    try {
      const res = await api.patch('/api/streak/goal', { dailyGoal: n });
      if (res.data.success) {
        set((state) => ({
          streak: state.streak ? { ...state.streak, dailyGoal: n } : null,
        }));
      }
      return res.data;
    } catch (err) {
      console.error('Failed to update streak goal:', err);
      throw err;
    }
  },
}));

export default useStreakStore;
