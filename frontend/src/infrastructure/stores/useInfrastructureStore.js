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

  // Filiais cadastradas
  branches: [],

  // DVRs por Filial
  dvrs: [],

  // Câmeras IP por DVR
  cameras: [],

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
