import { create } from 'zustand';

export const useEventLogStore = create((set) => ({
  searchQuery: '',
  selectedSeverity: 'ALL',
  selectedFilial: 'ALL',
  selectedEventType: 'ALL',

  eventLogs: [],

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSeverity: (selectedSeverity) => set({ selectedSeverity }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setSelectedEventType: (selectedEventType) => set({ selectedEventType }),
  setEventLogs: (eventLogs) => set({ eventLogs }),
}));
