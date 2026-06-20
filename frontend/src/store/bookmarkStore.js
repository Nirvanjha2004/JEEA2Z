import { create } from 'zustand';
import api from '../api';

const useBookmarkStore = create((set, get) => ({
  bookmarks: new Set(),
  loading: false,

  fetchBookmarks: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/bookmarks');
      const ids = res.data.data.map((q) => q.id);
      set({ bookmarks: new Set(ids), loading: false });
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      set({ loading: false });
    }
  },

  toggleBookmark: async (questionId) => {
    try {
      const res = await api.post('/api/bookmarks', { questionId });
      const { bookmarked } = res.data.data;

      set((state) => {
        const nextBookmarks = new Set(state.bookmarks);
        if (bookmarked) {
          nextBookmarks.add(questionId);
        } else {
          nextBookmarks.delete(questionId);
        }
        return { bookmarks: nextBookmarks };
      });
      return bookmarked;
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      throw err;
    }
  },
}));

export default useBookmarkStore;
