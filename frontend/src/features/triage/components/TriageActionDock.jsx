import React from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAnnotationStore } from '../../../infrastructure/stores/useAnnotationStore';

const HotkeyBadge = ({ label }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'rgba(0, 0, 0, 0.25)',
      color: '#FFFFFF',
      px: 0.8,
      py: 0.2,
      borderRadius: 1,
      fontSize: '0.7rem',
      fontWeight: 700,
      ml: 1,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
  >
    {label}
  </Box>
);

export default function TriageActionDock({ onApprove, onReject, onSave, onNext, onPrev, loading, saving }) {
  const { toolMode, setToolMode } = useAnnotationStore();

  return (
    <Box
      sx={{
        height: 56,
        bgcolor: '#0F172A',
        borderTop: '1px solid #1E293B',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Esquerda: Navegação manual */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Evento Anterior (Seta Esquerda)">
          <span>
            <Button
              size="small"
              variant="outlined"
              onClick={onPrev}
              disabled={loading}
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{ color: '#94A3B8', borderColor: '#334155', textTransform: 'none' }}
            >
              Anterior <HotkeyBadge label="←" />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Próximo Evento (Seta Direita)">
          <span>
            <Button
              size="small"
              variant="outlined"
              onClick={onNext}
              disabled={loading}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{ color: '#94A3B8', borderColor: '#334155', textTransform: 'none' }}
            >
              Próximo <HotkeyBadge label="→" />
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* Centro: Ações Principais de Validação (Fitts's Law Optimized) */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="Aprovar detecções da IA e carregar próximo evento instantaneamente">
          <span>
            <Button
              variant="contained"
              onClick={onApprove}
              disabled={loading}
              startIcon={<CheckCircleIcon />}
              sx={{
                bgcolor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              Aprovar Evento <HotkeyBadge label="A" />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Rejeitar detecção como Falso Positivo e carregar próximo evento">
          <span>
            <Button
              variant="contained"
              onClick={onReject}
              disabled={loading}
              startIcon={<CancelIcon />}
              sx={{
                bgcolor: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                '&:hover': { bgcolor: '#DC2626' },
              }}
            >
              Rejeitar Evento <HotkeyBadge label="R" />
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* Direita: Modos de Ferramenta & Salvar */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant={toolMode === 'EDIT' ? 'contained' : 'outlined'}
          onClick={() => setToolMode(toolMode === 'EDIT' ? 'SELECT' : 'EDIT')}
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: toolMode === 'EDIT' ? '#3B82F6' : 'transparent',
            color: toolMode === 'EDIT' ? '#FFFFFF' : '#94A3B8',
            borderColor: '#334155',
            textTransform: 'none',
            '&:hover': { bgcolor: toolMode === 'EDIT' ? '#2563EB' : '#1E293B' },
          }}
        >
          {toolMode === 'EDIT' ? 'Modo Edição Ativo' : 'Editar Caixas'} <HotkeyBadge label="E" />
        </Button>

        <Tooltip title="Salvar modificações de caixas e classes no banco de dados">
          <span>
            <Button
              variant="outlined"
              onClick={onSave}
              disabled={saving || loading}
              startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: '#38BDF8',
                borderColor: '#0284C7',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)', borderColor: '#38BDF8' },
              }}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}
