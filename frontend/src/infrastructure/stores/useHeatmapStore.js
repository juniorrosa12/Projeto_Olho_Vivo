import { create } from 'zustand';

export const useHeatmapStore = create((set) => ({
  selectedCameraId: 'cam-01',
  timeRange: 'today',
  heatmapOpacity: 0.6,
  heatmapBlur: 15,
  showDensityPoints: true,

  peopleStats: {
    totalEntries: 0,
    totalExits: 0,
    currentOccupancy: 0,
    peakHour: 'N/A',
    avgDwellTimeMinutes: '0 min',
  },

  densityPoints: [],

  setSelectedCameraId: (selectedCameraId) => set({ selectedCameraId }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setHeatmapOpacity: (heatmapOpacity) => set({ heatmapOpacity }),
  setHeatmapBlur: (heatmapBlur) => set({ heatmapBlur }),
  toggleDensityPoints: () => set((state) => ({ showDensityPoints: !state.showDensityPoints })),
  setPeopleStats: (peopleStats) => set({ peopleStats }),
  setDensityPoints: (densityPoints) => set({ densityPoints }),
}));
