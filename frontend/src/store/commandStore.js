import { create } from 'zustand';

const useCommandStore = create((set) => ({
  isOpen: false,
  openPalette: () => set({ isOpen: true }),
  closePalette: () => set({ isOpen: false }),
  togglePalette: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useCommandStore;
