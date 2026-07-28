import { create } from 'zustand';

export const useAuditStore = create((set) => ({
  dateRange: 'today', // 'today' | 'week' | 'month'
  selectedFilial: 'ALL',
  selectedOperator: 'ALL',

  metrics: {
    totalValidatedToday: 1420,
    avgTimePerEventSeconds: 1.4,
    aiAccuracyPercentage: 88.5,
    approvedCount: 1256,
    rejectedCount: 164,
    discrepancyRate: 11.5,
  },

  operatorStats: [
    { id: 'op-1', name: 'Carlos Eduardo', validated: 540, approved: 490, rejected: 50, avgTime: '1.2s', qualityScore: '98.4%' },
    { id: 'op-2', name: 'Mariana Silva', validated: 480, approved: 425, rejected: 55, avgTime: '1.5s', qualityScore: '96.2%' },
    { id: 'op-3', name: 'João Pedro', validated: 400, approved: 341, rejected: 59, avgTime: '1.6s', qualityScore: '94.8%' },
  ],

  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setSelectedOperator: (selectedOperator) => set({ selectedOperator }),
}));
