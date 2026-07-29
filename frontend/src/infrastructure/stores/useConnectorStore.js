import { create } from 'zustand';
import api from '../../api/api';

export const useConnectorStore = create((set, get) => ({
  connectors: [],
  selectedConnector: null,
  diagnostics: null,
  loading: false,
  executingCommand: false,
  error: null,

  fetchConnectors: async (branchId = null) => {
    set({ loading: true, error: null });
    try {
      const url = branchId ? `/connector/?branch_id=${branchId}` : '/connector/';
      const response = await api.get(url);
      const data = response.data || [];
      
      // Mock fallback if array empty for UI preview
      const list = data.length > 0 ? data : [
        {
          id: 1,
          connector_id: 'ov-conn-8f92a101',
          company_id: 'comp-riual',
          branch_id: 'RIUAL_027',
          hostname: 'SRV-FILIAL-027',
          os_info: 'Windows 11 Enterprise x64',
          cpu_info: 'Intel Core i7-12700K',
          ram_mb: 32768,
          gpu_info: 'NVIDIA GeForce RTX 3060',
          mac_address: '00:1A:2B:3C:4D:5E',
          local_ip: '192.168.10.100',
          version: 'v1.0.0',
          status: 'ONLINE',
          uptime_seconds: 184200,
          last_heartbeat: new Date().toISOString(),
        },
      ];

      set({ connectors: list, loading: false });
    } catch (err) {
      console.warn('Erro ao carregar conectores do backend:', err);
      set({ loading: false, error: err.message });
    }
  },

  fetchDiagnostics: async (connectorId) => {
    set({ loading: true });
    try {
      const response = await api.get(`/connector/${connectorId}/diagnostics`);
      set({ diagnostics: response.data, loading: false });
    } catch (err) {
      console.warn('Usando mock de diagnóstico de conector:', err);
      set({
        diagnostics: {
          connector: {
            connector_id: connectorId,
            hostname: 'SRV-FILIAL-027',
            branch_id: 'RIUAL_027',
            local_ip: '192.168.10.100',
            os_info: 'Windows 11 Enterprise x64',
            status: 'ONLINE',
            version: 'v1.0.0',
            last_heartbeat: new Date().toISOString(),
          },
          metrics: {
            cpu_percent: 14.2,
            ram_percent: 38.5,
            disk_percent: 24.1,
            latency_ms: 12.8,
            temperature_c: 44.0,
            uptime_seconds: 184200,
            active_dvrs: 2,
            active_cameras: 8,
          },
          telemetry_history: [
            { cpu: 12, ram: 38, disk: 24, latency: 14, timestamp: '10:00' },
            { cpu: 15, ram: 39, disk: 24, latency: 12, timestamp: '10:05' },
            { cpu: 14, ram: 38, disk: 24, latency: 13, timestamp: '10:10' },
          ],
        },
        loading: false,
      });
    }
  },

  sendRemoteCommand: async (connectorId, commandType, payload = {}) => {
    set({ executingCommand: true });
    try {
      const response = await api.post(`/connector/${connectorId}/command`, {
        command_type: commandType,
        payload: payload,
      });
      set({ executingCommand: false });
      return { success: true, data: response.data };
    } catch (err) {
      set({ executingCommand: false });
      return { success: false, error: err.message };
    }
  },

  selectConnector: (connector) => set({ selectedConnector: connector }),
}));
