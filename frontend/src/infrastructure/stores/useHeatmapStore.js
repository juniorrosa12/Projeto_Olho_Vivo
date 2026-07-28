import { create } from 'zustand';

export const useHeatmapStore = create((set) => ({
  selectedCameraId: 'cam-01',
  timeRange: 'today',
  heatmapOpacity: 0.6,
  heatmapBlur: 15,
  showDensityPoints: true,

  peopleStats: {
    totalEntries: 2480,
    totalExits: 2310,
    currentOccupancy: 170,
    peakHour: '17:00 - 18:00',
    avgDwellTimeMinutes: '12.4 min',
  },

  densityPoints: [
    { x: 250, y: 180, val: 0.9 }, // Área dos Caixas
    { x: 280, y: 200, val: 0.95 },
    { x: 300, y: 190, val: 0.85 },
    { x: 120, y: 340, val: 0.7 },  // Corredor Central
    { x: 140, y: 350, val: 0.75 },
    { x: 450, y: 220, val: 0.4 },  // Seção Lateral
    { x: 480, y: 240, val: 0.45 },
  ],

  setSelectedCameraId: (selectedCameraId) => set({ selectedCameraId }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setHeatmapOpacity: (heatmapOpacity) => set({ heatmapOpacity }),
  setHeatmapBlur: (heatmapBlur) => set({ heatmapBlur }),
  toggleDensityPoints: () => set((state) => ({ showDensityPoints: !state.showDensityPoints })),
}));
