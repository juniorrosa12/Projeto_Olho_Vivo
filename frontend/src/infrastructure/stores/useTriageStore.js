import { create } from 'zustand';

export const useTriageStore = create((set) => ({
  inspectedEvent: null,
  setInspectedEvent: (inspectedEvent) => set({ inspectedEvent }),
  clearInspectedEvent: () => set({ inspectedEvent: null }),
}));
