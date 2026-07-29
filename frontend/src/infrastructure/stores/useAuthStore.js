import { create } from 'zustand';
import api from '../../api/api';

export const ROLES = {
  GLOBAL_ADMIN: 'GLOBAL_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERATOR: 'OPERATOR',
  AUDITOR: 'AUDITOR',
  GUEST: 'GUEST',
};

const savedToken = localStorage.getItem('olhovivo_token');
const savedUser = localStorage.getItem('olhovivo_user');

export const useAuthStore = create((set, get) => ({
  isAuthenticated: Boolean(savedToken),
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('olhovivo_token', access_token);
      localStorage.setItem('olhovivo_user', JSON.stringify(user));

      set({
        isAuthenticated: true,
        token: access_token,
        user: user,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('olhovivo_token');
    localStorage.removeItem('olhovivo_user');
    set({ isAuthenticated: false, token: null, user: null, error: null });
  },

  hasPermission: (requiredRole) => {
    const roleHierarchy = [
      ROLES.GUEST,
      ROLES.AUDITOR,
      ROLES.OPERATOR,
      ROLES.SUPERVISOR,
      ROLES.BRANCH_ADMIN,
      ROLES.COMPANY_ADMIN,
      ROLES.GLOBAL_ADMIN,
    ];
    const userRole = get().user?.role || ROLES.GUEST;
    return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole);
  },
}));
