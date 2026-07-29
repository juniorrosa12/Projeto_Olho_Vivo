import { create } from 'zustand';

export const useLiveStreamStore = create((set) => ({
  gridLayout: '2x2', // '2x2' | '3x3' | '1+5'
  selectedFilial: 'ALL',
  focusedCameraId: null,
  isRecording: false,

  cameras: [
    {
      id: 'cam-01',
      name: 'Câmera Intelbras Canal #1 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_028',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/output/latest.jpg',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=1&subtype=1',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-02',
      name: 'Câmera Intelbras Canal #2 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_028',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/output/latest.jpg',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=2&subtype=1',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-03',
      name: 'Câmera Intelbras Canal #3 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_028',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/output/latest.jpg',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=3&subtype=1',
      activeDetections: [],
      hasAlert: false,
      alertMessage: null,
      severity: 'INFO',
    },
    {
      id: 'cam-04',
      name: 'Câmera Intelbras Canal #4 (Stream Ao Vivo RTSP)',
      filial: 'RIUAL_028',
      status: 'ONLINE',
      fps: 30,
      snapshot: '/static/output/latest.jpg',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=4&subtype=1',
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
