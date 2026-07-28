import { create } from 'zustand';
import { generateRtspUrl } from '../../services/network/rtspGenerator';

export const useInfrastructureStore = create((set, get) => ({
  // Telemetria Global do Sistema
  telemetry: {
    tailscaleMesh: { status: 'ONLINE', latencyMs: 14, nodeCount: 12 },
    backendFastAPI: { status: 'ONLINE', latencyMs: 4, version: 'v2.4.0' },
    visionWorker: { status: 'ONLINE', fps: 30, gpuUsagePercent: 42, tempC: 54 },
    postgresDB: { status: 'ONLINE', connections: 18, latencyMs: 2 },
    redisCache: { status: 'ONLINE', memoryUsedMB: 124, latencyMs: 1 },
  },

  // Filiais com Conectividade Tailscale Mesh
  branches: [
    {
      id: 'br-1',
      code: 'RIUAL_027',
      name: 'Loja Matriz Centro',
      city: 'São Paulo - SP',
      tailscaleIp: '100.64.10.27',
      tailscaleHostname: 'node-riual027.tailscale.net',
      status: 'ONLINE',
      latencyMs: 12,
      lastHeartbeat: 'Há 4 seg',
      dvrsCount: 2,
    },
    {
      id: 'br-2',
      code: 'RIUAL_084',
      name: 'Filial Shopping Sul',
      city: 'Campinas - SP',
      tailscaleIp: '100.64.10.84',
      tailscaleHostname: 'node-riual084.tailscale.net',
      status: 'ONLINE',
      latencyMs: 24,
      lastHeartbeat: 'Há 8 seg',
      dvrsCount: 1,
    },
  ],

  // DVRs por Filial
  dvrs: [
    {
      id: 'dvr-1',
      branchId: 'br-1',
      name: 'DVR Principal Caixas',
      manufacturer: 'HIKVISION',
      model: 'DS-7608NI-K2',
      tailscaleIp: '100.64.10.27',
      httpPort: 80,
      rtspPort: 554,
      user: 'admin',
      channelsCount: 8,
      status: 'ONLINE',
    },
    {
      id: 'dvr-2',
      branchId: 'br-1',
      name: 'DVR Corredores & Entrada',
      manufacturer: 'INTELBRAS',
      model: 'MVD 5216',
      tailscaleIp: '100.64.10.28',
      httpPort: 80,
      rtspPort: 554,
      user: 'admin',
      channelsCount: 16,
      status: 'ONLINE',
    },
  ],

  // Câmeras IP por DVR
  cameras: [
    {
      id: 'cam-1',
      dvrId: 'dvr-1',
      name: 'Câmera Caixa 01',
      channel: 1,
      location: 'Frente de Caixas - Posição 01',
      resolution: '1920x1080 (FHD)',
      fps: 30,
      aiEnabled: true,
      monitoredClasses: ['Pessoa', 'Celular', 'Dinheiro'],
      rtspUrl: 'rtsp://admin:***@100.64.10.27:554/Streaming/Channels/101',
      status: 'ONLINE',
    },
    {
      id: 'cam-2',
      dvrId: 'dvr-1',
      name: 'Câmera Caixa 02',
      channel: 2,
      location: 'Frente de Caixas - Posição 02',
      resolution: '1920x1080 (FHD)',
      fps: 30,
      aiEnabled: true,
      monitoredClasses: ['Pessoa', 'Caixa Registradora'],
      rtspUrl: 'rtsp://admin:***@100.64.10.27:554/Streaming/Channels/201',
      status: 'ONLINE',
    },
  ],

  // Ações de Cadastro e Teste
  addDvr: (newDvr) => set((state) => ({ dvrs: [...state.dvrs, { ...newDvr, id: `dvr-${Date.now()}` }] })),

  addCamera: (newCamera) => {
    const dvr = get().dvrs.find((d) => d.id === newCamera.dvrId);
    const autoRtsp = generateRtspUrl({
      manufacturer: dvr?.manufacturer || 'HIKVISION',
      ip: dvr?.tailscaleIp || '100.64.10.27',
      port: dvr?.rtspPort || 554,
      user: dvr?.user || 'admin',
      password: dvr?.password || '',
      channel: newCamera.channel || 1,
    });

    set((state) => ({
      cameras: [...state.cameras, { ...newCamera, id: `cam-${Date.now()}`, rtspUrl: autoRtsp, status: 'ONLINE' }],
    }));
  },

  testDvrConnection: async (dvrId) => {
    const dvr = get().dvrs.find((d) => d.id === dvrId);
    if (!dvr) return { success: false, message: 'DVR não encontrado' };
    // Simula teste de socket Ping, HTTP (port 80) e RTSP (port 554) sobre a malha Tailscale
    return {
      success: true,
      pingMs: Math.floor(Math.random() * 15) + 5,
      httpStatus: 200,
      rtspStatus: 'CONNECTED (H.264 / 1080p)',
    };
  },
}));
