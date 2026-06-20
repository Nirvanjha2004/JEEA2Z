import { create } from 'zustand';
import api from '../api';

const useConceptStore = create((set, get) => ({
  mastery: [],
  chapterConcepts: {},
  loading: false,

  fetchMastery: async () => {
    try {
      set({ loading: true });
      const res = await api.get('/api/concepts/mastery');
      set({ mastery: res.data.data, loading: false });
    } catch (err) {
      console.error('Failed to fetch concept mastery:', err);
      set({ loading: false });
    }
  },

  fetchChapterConcepts: async (chapterId) => {
    try {
      set({ loading: true });
      const res = await api.get(`/api/concepts/chapters/${chapterId}`);
      set((state) => ({
        chapterConcepts: {
          ...state.chapterConcepts,
          [chapterId]: res.data.data,
        },
        loading: false,
      }));
    } catch (err) {
      console.error('Failed to fetch chapter concepts:', err);
      set({ loading: false });
    }
  },

  fetchConceptPracticeSet: async (conceptId) => {
    try {
      const res = await api.post(`/api/concepts/${conceptId}/practice`);
      return res.data.data;
    } catch (err) {
      console.error('Failed to fetch concept practice set:', err);
      return null;
    }
  },
}));

export default useConceptStore;
