import { create } from 'zustand';

export const useLiveStreamStore = create((set) => ({
  gridLayout: '2x2', // '2x2' | '3x3' | '1+5'
  selectedFilial: 'ALL',
  focusedCameraId: null,
  isRecording: false,

  cameras: [
    {
      id: 'cam-01',
      name: 'Caixa Registradora 01 (Vídeo TESTE)',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/output/latest.jpg',
      video: '/videos/TESTE.mp4',
      activeDetections: ['Pessoa', 'Celular'],
      hasAlert: true,
      alertMessage: 'Uso de celular detectado',
      severity: 'WARNING',
    },
    {
      id: 'cam-02',
      name: 'Caixa Registradora 02 (Vídeo WhatsApp)',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/vision/static/latest.jpg',
      video: '/videos/WhatsApp Video 2026-07-27 at 11.40.03.mp4',
      activeDetections: ['Pessoa', 'Caixa'],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-03',
      name: 'Entrada Principal Loja',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/vision/static/latest.jpg',
      video: '/videos/TESTE.mp4',
      activeDetections: ['Pessoa (4)'],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-04',
      name: 'Corredor de Eletrônicos',
      filial: 'RIUAL_084',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/vision/static/latest.jpg',
      video: '/videos/WhatsApp Video 2026-07-27 at 11.40.03.mp4',
      activeDetections: ['Pessoa'],
      hasAlert: true,
      alertMessage: 'Permanência prolongada na seção',
      severity: 'CRITICAL',
    },
  ],

  realtimeAlerts: [
    { id: 'alt-1', cameraId: 'cam-01', cameraName: 'Caixa 01', message: 'Uso de celular no caixa', time: 'Há 12 seg', severity: 'WARNING' },
    { id: 'alt-2', cameraId: 'cam-04', cameraName: 'Corredor Eletrônicos', message: 'Permanência > 5 min', time: 'Há 45 seg', severity: 'CRITICAL' },
  ],

  setGridLayout: (gridLayout) => set({ gridLayout }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setFocusedCameraId: (focusedCameraId) => set({ focusedCameraId }),
}));
