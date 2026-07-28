import { create } from 'zustand';

export const useEventLogStore = create((set) => ({
  searchQuery: '',
  selectedSeverity: 'ALL',
  selectedFilial: 'ALL',
  selectedEventType: 'ALL',

  eventLogs: [
    { id: 'evt-9660', type: 'Uso de Celular no Caixa', filial: 'RIUAL_027', camera: 'CAM01', timestamp: '28/07/2026 12:43:05', confidence: '84.7%', status: 'PENDING', severity: 'WARNING' },
    { id: 'evt-9659', type: 'Abertura de Gaveta Sem Venda', filial: 'RIUAL_027', camera: 'CAM02', timestamp: '28/07/2026 12:41:20', confidence: '92.1%', status: 'APPROVED', severity: 'CRITICAL' },
    { id: 'evt-9658', type: 'Fila Prolongada no Caixa', filial: 'RIUAL_084', camera: 'CAM01', timestamp: '28/07/2026 12:38:10', confidence: '88.0%', status: 'APPROVED', severity: 'INFO' },
    { id: 'evt-9657', type: 'Uso de Celular no Caixa', filial: 'RIUAL_084', camera: 'CAM03', timestamp: '28/07/2026 12:30:45', confidence: '79.5%', status: 'REJECTED', severity: 'WARNING' },
  ],

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSeverity: (selectedSeverity) => set({ selectedSeverity }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setSelectedEventType: (selectedEventType) => set({ selectedEventType }),
}));
