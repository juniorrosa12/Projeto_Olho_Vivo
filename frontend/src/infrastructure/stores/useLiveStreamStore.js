import { create } from 'zustand';

export const useLiveStreamStore = create((set) => ({
  gridLayout: '2x2', // '2x2' | '3x3' | '1+5'
  selectedFilial: 'ALL',
  focusedCameraId: null,
  isRecording: false,

  cameras: [
    {
      id: 'cam-01',
      name: 'Caixa Registradora 01 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/snapshots/latest.jpg',
      rtspUrl: 'rtsp://admin:admin@192.168.10.100:554/Streaming/Channels/101',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-02',
      name: 'Caixa Registradora 02 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/snapshots/latest.jpg',
      rtspUrl: 'rtsp://admin:admin@192.168.10.100:554/Streaming/Channels/201',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-03',
      name: 'Entrada Principal Loja (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_027',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/snapshots/latest.jpg',
      rtspUrl: 'rtsp://admin:admin@192.168.10.100:554/Streaming/Channels/301',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-04',
      name: 'Corredor de Eletrônicos (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_084',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/snapshots/latest.jpg',
      rtspUrl: 'rtsp://admin:admin@192.168.10.101:554/Streaming/Channels/401',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
  ],

  realtimeAlerts: [],

  setGridLayout: (gridLayout) => set({ gridLayout }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setFocusedCameraId: (focusedCameraId) => set({ focusedCameraId }),
}));
