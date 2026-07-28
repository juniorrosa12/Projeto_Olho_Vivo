import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Button,
  Chip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { useUIStore } from '../../../infrastructure/stores/useUIStore';

export default function SystemSettingsContainer() {
  const { isHighContrast, showHUDOverlay, showCrosshair, toggleHighContrast, toggleHUDOverlay } = useUIStore();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Configurações Gerais do Sistema & Preferências
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Parâmetros da aplicação, modo de exibição, atalhos de teclado, acessibilidade e integrações
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Preferências Visuais e Acessibilidade */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SettingsIcon sx={{ color: '#38BDF8' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Interface & Acessibilidade
              </Typography>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={isHighContrast} onChange={toggleHighContrast} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Modo de Alto Contraste para Monitores
                    </Typography>
                    <Typography variant="caption" color="#94A3B8">
                      Aumenta espessura e saturação das bounding boxes no canvas
                    </Typography>
                  </Box>
                }
              />

              <Divider sx={{ borderColor: '#1E293B' }} />

              <FormControlLabel
                control={<Switch checked={showHUDOverlay} onChange={toggleHUDOverlay} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Exibir Painel Flutuante (HUD) no Canvas
                    </Typography>
                    <Typography variant="caption" color="#94A3B8">
                      Exibe estatísticas de zoom e objetos sobre a imagem
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Integrações & Permissões */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <IntegrationInstructionsIcon sx={{ color: '#10B981' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Integrações & API Key
              </Typography>
            </Box>

            <Typography variant="body2" color="#CBD5E1" mb={2}>
              Status da integração com ERP/PDV da loja: <Chip label="CONECTADO" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Typography>

            <Divider sx={{ borderColor: '#1E293B', my: 2 }} />

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SecurityIcon sx={{ color: '#F59E0B' }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Perfil e Controle de Acesso (RBAC)
              </Typography>
            </Box>
            <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
              Perfil Atual: <strong>Administrador / Supervisor de Varejo</strong>
            </Typography>

            <Button variant="outlined" size="small" sx={{ color: '#38BDF8', borderColor: '#334155', textTransform: 'none' }}>
              Gerenciar Chaves de API
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
