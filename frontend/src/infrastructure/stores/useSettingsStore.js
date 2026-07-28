import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  activeModelVersion: 'yolo11s-v1.4',
  confidenceThreshold: 0.65,
  iouThreshold: 0.45,
  enableAutoRetrain: true,

  models: [
    { id: 'yolo11s-v1.4', name: 'YOLOv11 Small (Produção)', mAP: '89.4%', status: 'ACTIVE', updated: '27/07/2026' },
    { id: 'yolo11n-v1.3', name: 'YOLOv11 Nano (Fast Edge)', mAP: '84.2%', status: 'STANDBY', updated: '20/07/2026' },
    { id: 'yolo-pose-v1.0', name: 'YOLO Pose Behavior (Beta)', mAP: '86.7%', status: 'TESTING', updated: '25/07/2026' },
  ],

  branches: [
    { id: 'br-1', code: 'RIUAL_027', name: 'Loja Matriz Centro', camerasCount: 6, status: 'ONLINE' },
    { id: 'br-2', code: 'RIUAL_084', name: 'Filial Shopping Sul', camerasCount: 4, status: 'ONLINE' },
  ],

  setActiveModelVersion: (activeModelVersion) => set({ activeModelVersion }),
  setConfidenceThreshold: (confidenceThreshold) => set({ confidenceThreshold }),
  setIouThreshold: (iouThreshold) => set({ iouThreshold }),
  toggleAutoRetrain: () => set((state) => ({ enableAutoRetrain: !state.enableAutoRetrain })),
}));
