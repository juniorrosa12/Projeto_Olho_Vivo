import { create } from 'zustand';

export const ROLES = {
  GLOBAL_ADMIN: 'GLOBAL_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERATOR: 'OPERATOR',
  AUDITOR: 'AUDITOR',
  GUEST: 'GUEST',
};

export const useAuthStore = create((set) => ({
  isAuthenticated: true,
  token: 'jwt-bearer-token-enterprise-v1',
  refreshToken: 'jwt-refresh-token-v1',
  user: {
    id: 'usr-1',
    name: 'Engenheiro Chefe (CTO)',
    email: 'admin@olhovivo.ai',
    role: ROLES.GLOBAL_ADMIN,
    companyId: 'comp-riual',
    branchId: 'br-1',
    ldapEnabled: true,
  },

  sessions: [
    { id: 'sess-1', device: 'Chrome / Windows 11', ip: '192.168.3.12', active: true, lastActive: 'Agora' },
  ],

  login: (email, password) => {
    set({
      isAuthenticated: true,
      token: `jwt-${Date.now()}`,
      user: {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: ROLES.GLOBAL_ADMIN,
        companyId: 'comp-riual',
        branchId: 'br-1',
        ldapEnabled: false,
      },
    });
  },

  logout: () => set({ isAuthenticated: false, token: null, user: null }),

  hasPermission: (requiredRole) => {
    // Hierarquia RBAC
    const roleHierarchy = [
      ROLES.GUEST,
      ROLES.AUDITOR,
      ROLES.OPERATOR,
      ROLES.SUPERVISOR,
      ROLES.BRANCH_ADMIN,
      ROLES.COMPANY_ADMIN,
      ROLES.GLOBAL_ADMIN,
    ];
    const userRole = useAuthStore.getState().user?.role || ROLES.GUEST;
    return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole);
  },
}));
