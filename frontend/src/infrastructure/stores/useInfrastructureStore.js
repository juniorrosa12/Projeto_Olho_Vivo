import { create } from 'zustand';
import { DeviceManager } from '../../services/device/DeviceManager';

export const useInfrastructureStore = create((set, get) => ({
  // Telemetria Global do Sistema
  telemetry: {
    tailscaleMesh: { status: 'ONLINE', latencyMs: 14, nodeCount: 12 },
    backendFastAPI: { status: 'ONLINE', latencyMs: 4, version: 'v2.4.0' },
    visionWorker: { status: 'ONLINE', fps: 30, gpuUsagePercent: 42, tempC: 54 },
    postgresDB: { status: 'ONLINE', connections: 18, latencyMs: 2 },
    redisCache: { status: 'ONLINE', memoryUsedMB: 124, latencyMs: 1 },
  },

  // Filiais cadastradas por padrão
  branches: [
    {
      id: 'br-28',
      name: 'Filial 28 (RIUAL_028)',
      code: 'RIUAL_028',
      city: 'Serra - ES',
      ip: '100.97.27.16',
      status: 'ONLINE',
      dvrCount: 1,
    },
  ],

  // DVRs cadastrados por padrão
  dvrs: [
    {
      id: 'dvr-fl28',
      name: 'DVR Intelbras Filial 28',
      manufacturer: 'INTELBRAS',
      model: 'MHDX 1016 / Intelbras',
      tailscaleIp: '192.168.1.3',
      httpPort: 80,
      rtspPort: 554,
      user: 'admin',
      password: 'filial28',
      channelsCount: 4,
      branchId: 'br-28',
      status: 'ONLINE',
    },
  ],

  // Câmeras IP por DVR provisionadas por padrão
  cameras: [
    {
      id: 'cam-fl28-01',
      dvrId: 'dvr-fl28',
      branchId: 'br-28',
      name: 'Câmera Intelbras Canal #1 (Stream Ao Vivo RTSP)',
      channel: 1,
      status: 'ONLINE',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=1&subtype=1',
      snapshot: '/static/output/latest.jpg',
    },
    {
      id: 'cam-fl28-02',
      dvrId: 'dvr-fl28',
      branchId: 'br-28',
      name: 'Câmera Intelbras Canal #2 (Stream Ao Vivo RTSP)',
      channel: 2,
      status: 'ONLINE',
      rtspUrl: 'rtsp://admin:filial28@192.168.1.3:554/cam/realmonitor?channel=2&subtype=1',
      snapshot: '/static/output/latest.jpg',
    },
  ],

  addDvr: (newDvr) => set((state) => ({ dvrs: [...state.dvrs, { ...newDvr, id: newDvr.id || `dvr-${Date.now()}` }] })),

  updateDvr: (updatedDvr) =>
    set((state) => ({
      dvrs: state.dvrs.map((d) => (d.id === updatedDvr.id ? { ...d, ...updatedDvr } : d)),
    })),

  deleteDvr: (dvrId) =>
    set((state) => ({
      dvrs: state.dvrs.filter((d) => d.id !== dvrId),
      cameras: state.cameras.filter((c) => c.dvrId !== dvrId),
    })),

  addCamera: (newCamera) => {
    const dvr = get().dvrs.find((d) => d.id === newCamera.dvrId);
    const autoRtsp = DeviceManager.getStreamUrl(dvr || newCamera, newCamera.channel || 1);

    set((state) => ({
      cameras: [...state.cameras, { ...newCamera, id: `cam-${Date.now()}`, rtspUrl: autoRtsp, status: 'ONLINE' }],
    }));
  },

  testDvrConnection: async (dvrId, rawDvr) => {
    // Se rawDvr for passado (formulário ainda não salvo), testa diretamente com os dados do form
    const dvr = rawDvr || get().dvrs.find((d) => d.id === dvrId);
    if (!dvr) return { success: false, message: 'DVR não encontrado.' };
    return await DeviceManager.testDeviceConnection(dvr);
  },
}));
