import { create } from 'zustand';
import api from '../api';

const useProgressStore = create((set) => ({
  summary: null,
  chapterProgress: {},

  fetchSummary: async () => {
    try {
      const res = await api.get('/api/progress/summary');
      set({ summary: res.data.data });
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  },

  fetchChapterProgress: async (chapterId) => {
    try {
      const res = await api.get(`/api/progress/chapter/${chapterId}`);
      set((state) => ({
        chapterProgress: {
          ...state.chapterProgress,
          [chapterId]: res.data.data,
        },
      }));
    } catch (err) {
      console.error('Failed to fetch chapter progress:', err);
    }
  },

  updateQuestionStatus: async (questionId, status) => {
    try {
      await api.post('/api/progress', { questionId, status });
      return true;
    } catch (err) {
      console.error('Failed to update progress:', err);
      return false;
    }
  },
}));

export default useProgressStore;
