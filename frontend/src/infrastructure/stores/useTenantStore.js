import { create } from 'zustand';

export const useTenantStore = create((set) => ({
  activeCompany: {
    id: 'comp-riual',
    name: 'Rede Riual Supermercados Ltda',
    cnpj: '12.345.678/0001-99',
    logo: '/icons.svg',
    plan: 'ENTERPRISE_UNLIMITED',
    expirationDate: '2028-12-31',
    status: 'ACTIVE',

    // Quotas e Limites de Licença (Sprint 34)
    licensing: {
      maxBranches: 50,
      maxDvrs: 200,
      maxCameras: 1000,
      maxUsers: 500,
      maxAiModels: 20,
      activeBranchesCount: 2,
      activeDvrsCount: 3,
      activeCamerasCount: 4,
    },
  },

  companies: [
    {
      id: 'comp-riual',
      name: 'Rede Riual Supermercados Ltda',
      plan: 'ENTERPRISE_UNLIMITED',
      status: 'ACTIVE',
    },
    {
      id: 'comp-express',
      name: 'Varejo Express Brasil',
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
    },
  ],

  setActiveCompany: (companyId) =>
    set((state) => ({
      activeCompany: state.companies.find((c) => c.id === companyId) || state.activeCompany,
    })),
}));
