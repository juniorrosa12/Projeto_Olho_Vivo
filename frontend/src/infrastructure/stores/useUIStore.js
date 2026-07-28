import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isHotkeyModalOpen: false,
  isMetricsPopoverOpen: false,
  isHighContrast: false,
  showHUDOverlay: true,
  showCrosshair: true,
  zoomScale: 1.0,
  panOffset: { x: 0, y: 0 },

  toggleHotkeyModal: () => set((state) => ({ isHotkeyModalOpen: !state.isHotkeyModalOpen })),
  setHotkeyModal: (isOpen) => set({ isHotkeyModalOpen: isOpen }),
  toggleMetricsPopover: () => set((state) => ({ isMetricsPopoverOpen: !state.isMetricsPopoverOpen })),
  toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
  toggleHUDOverlay: () => set((state) => ({ showHUDOverlay: !state.showHUDOverlay })),
  setZoomScale: (scale) => set({ zoomScale: Math.max(0.2, Math.min(5.0, scale)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  resetZoomPan: () => set({ zoomScale: 1.0, panOffset: { x: 0, y: 0 } }),
}));
