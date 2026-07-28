import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useUIStore } from '../../../infrastructure/stores/useUIStore';

const HotkeyRow = ({ keyLabel, description }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" py={0.8} borderBottom="1px solid #1E293B">
    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
      {description}
    </Typography>
    <Box
      sx={{
        bgcolor: '#334155',
        color: '#38BDF8',
        px: 1.2,
        py: 0.3,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 700,
        fontFamily: 'monospace',
        border: '1px solid #475569',
      }}
    >
      {keyLabel}
    </Box>
  </Box>
);

export default function HotkeyGuideModal() {
  const { isHotkeyModalOpen, setHotkeyModal } = useUIStore();

  return (
    <Dialog
      open={isHotkeyModalOpen}
      onClose={() => setHotkeyModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid #1E293B',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #1E293B">
        <Box display="flex" alignItems="center" gap={1}>
          <KeyboardIcon sx={{ color: '#38BDF8' }} />
          <Typography variant="h6" fontWeight={700}>
            Guia de Atalhos de Teclado (Hands-on-Keyboard)
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setHotkeyModal(false)} sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="#38BDF8" fontWeight={700} mb={1}>
              TRIAGEM RÁPIDA DE EVENTOS
            </Typography>
            <HotkeyRow keyLabel="A" description="Aprovar evento e carregar próximo" />
            <HotkeyRow keyLabel="R" description="Rejeitar evento (Falso Positivo)" />
            <HotkeyRow keyLabel="Espaço" description="Pular evento sem alterar estado" />
            <HotkeyRow keyLabel="← / →" description="Navegação manual na fila" />

            <Typography variant="subtitle2" color="#38BDF8" fontWeight={700} mt={3} mb={1}>
              NAVEGAÇÃO E VISUALIZAÇÃO
            </Typography>
            <HotkeyRow keyLabel="Scroll Rato" description="Zoom centrado no ponteiro" />
            <HotkeyRow keyLabel="Botão Meio" description="Arraste Panorâmico (Pan)" />
            <HotkeyRow keyLabel="F" description="Fit Screen (Resetar Zoom e Pan)" />
            <HotkeyRow keyLabel="?" description="Abrir/Fechar este guia de atalhos" />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="#38BDF8" fontWeight={700} mb={1}>
              EDIÇÃO E MANIPULAÇÃO DE CAIXAS
            </Typography>
            <HotkeyRow keyLabel="E" description="Ativar/Desativar Modo de Edição" />
            <HotkeyRow keyLabel="1 - 6" description="Atribuir classe ao objeto selecionado" />
            <HotkeyRow keyLabel="Delete" description="Excluir caixa delimitadora selecionada" />
            <HotkeyRow keyLabel="Ctrl + Z" description="Desfazer última alteração (Undo)" />
            <HotkeyRow keyLabel="Ctrl + Y" description="Refazer alteração (Redo)" />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
