import { create } from 'zustand';

export const useAuditStore = create((set) => ({
  dateRange: 'today', // 'today' | 'week' | 'month'
  selectedFilial: 'ALL',
  selectedOperator: 'ALL',

  metrics: {
    totalValidatedToday: 0,
    avgTimePerEventSeconds: 0,
    aiAccuracyPercentage: 0,
    approvedCount: 0,
    rejectedCount: 0,
    discrepancyRate: 0,
  },

  operatorStats: [],

  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedFilial: (selectedFilial) => set({ selectedFilial }),
  setSelectedOperator: (selectedOperator) => set({ selectedOperator }),
  setMetrics: (metrics) => set({ metrics }),
  setOperatorStats: (operatorStats) => set({ operatorStats }),
}));
