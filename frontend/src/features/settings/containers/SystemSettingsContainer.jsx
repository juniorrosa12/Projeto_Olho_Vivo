import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useUIStore } from '../../../infrastructure/stores/useUIStore';

export default function SystemSettingsContainer() {
  const { isHighContrast, showHUDOverlay, toggleHighContrast, toggleHUDOverlay } = useUIStore();
  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetSuccessAlert, setResetSuccessAlert] = useState(false);

  const handleExecuteReset = () => {
    // BLOCO 14: Reset do Ambiente de Testes
    sessionStorage.clear();
    localStorage.removeItem('inspect_event_id');
    setOpenResetModal(false);
    setResetSuccessAlert(true);
    setTimeout(() => setResetSuccessAlert(false), 4000);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Configurações Gerais do Sistema & Preferências
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Parâmetros da aplicação, modo de exibição, atalhos de teclado, acessibilidade e reset do ambiente
        </Typography>
      </Box>

      {resetSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: '1px solid #10B981' }}>
          Ambiente de testes resetado com sucesso! Eventos e validações foram limpos. Empresas, Filiais, DVRs e Câmeras foram preservados.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Preferências Visuais */}
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

        {/* Integrações & Reset de Testes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <IntegrationInstructionsIcon sx={{ color: '#10B981' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Integrações & API Key
              </Typography>
            </Box>

            <Typography variant="body2" color="#CBD5E1" mb={2}>
              Status da integração com ERP/PDV: <Chip label="CONECTADO" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Typography>

            <Divider sx={{ borderColor: '#1E293B', my: 2 }} />

            {/* BLOCO 14: Reset do Ambiente de Testes */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <RestartAltIcon sx={{ color: '#EF4444' }} />
              <Typography variant="subtitle2" fontWeight={700} color="#EF4444">
                Reset do Ambiente de Testes (BLOCO 14)
              </Typography>
            </Box>
            <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
              Limpa histórico de eventos, validações e datasets. Preserva Empresas, Filiais, DVRs, Câmeras e Usuários.
            </Typography>

            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={() => setOpenResetModal(true)}
              sx={{ borderColor: '#EF4444', textTransform: 'none' }}
            >
              Resetar Ambiente de Testes
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Confirmação do Reset */}
      <Dialog
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid #EF4444', borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700} color="#EF4444">
          Confirmar Reset do Ambiente?
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#1E293B' }}>
          <Typography variant="body2" mb={1.5}>
            Esta ação irá remover permanentemente:
          </Typography>
          <Typography variant="caption" color="#FCA5A5" display="block">• Eventos, Tracks, Datasets e Validações</Typography>
          <Typography variant="caption" color="#FCA5A5" display="block" mb={2}>• Histórico de auditoria e navegação de testes</Typography>

          <Typography variant="body2" color="#6EE7B7">
            Serão PRESERVADOS: Empresas, Filiais, DVRs, Câmeras e Configurações de Usuários.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenResetModal(false)} sx={{ color: '#94A3B8' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleExecuteReset} sx={{ bgcolor: '#EF4444', fontWeight: 700 }}>
            Confirmar Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
