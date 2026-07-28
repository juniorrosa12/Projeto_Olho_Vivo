import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Popover,
  Stack,
  ButtonGroup,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useUIStore } from '../../../infrastructure/stores/useUIStore';
import DatasetExportModal from './DatasetExportModal';

export default function TriageHeader({ event, stats }) {
  const { toggleHotkeyModal } = useUIStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const handlePopoverOpen = (e) => setAnchorEl(e.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const isPopoverOpen = Boolean(anchorEl);

  const confidenceScore = event?.confidence
    ? (Number(event.confidence) > 1 ? Number(event.confidence) : Number(event.confidence) * 100).toFixed(1)
    : '89.4';

  const isLowConfidence = event?.confidence ? Number(event.confidence) < 0.6 : false;

  const eventTitle = event?.event_type === 'cell_phone' || !event?.event_type
    ? 'DETECÇÃO DE USO DE CELULAR NO CAIXA'
    : event.event_type.toUpperCase().replace('_', ' ');

  const eventGuidance = 'Verifique se o objeto destacado é realmente um CELULAR ou se é FALSO POSITIVO (ex: Impressora / Periférico no Balcão)';

  return (
    <Box
      sx={{
        bgcolor: '#0F172A',
        borderBottom: '1px solid #334155',
        color: '#F8FAFC',
      }}
    >
      {/* 1. Header Fino de Navegação e Contexto */}
      <Box
        sx={{
          height: 44,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B',
        }}
      >
        {/* Esquerda: Barra de Navegação ← → */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ButtonGroup size="small" variant="outlined" sx={{ mr: 1 }}>
            <Tooltip title="Voltar para a Aba / Página Anterior">
              <IconButton
                size="small"
                onClick={() => window.history.back()}
                sx={{ color: '#F8FAFC', border: '1px solid #475569', borderRadius: '4px 0 0 4px', p: 0.5 }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Avançar para a Próxima Aba / Página">
              <IconButton
                size="small"
                onClick={() => window.history.forward()}
                sx={{ color: '#F8FAFC', border: '1px solid #475569', borderRadius: '0 4px 4px 0', p: 0.5 }}
              >
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#38BDF8', letterSpacing: 0.5 }}>
            OLHO VIVO STUDIO
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            |
          </Typography>
          <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 700 }}>
            Evento #{event?.id ?? '10503'}
          </Typography>
          {event?.filial && (
            <Chip
              label={`${event.filial} • ${event.camera || 'CAM01'}`}
              size="small"
              sx={{
                bgcolor: '#1E293B',
                color: '#F8FAFC',
                fontSize: '0.75rem',
                height: 22,
                fontWeight: 700,
              }}
            />
          )}
        </Stack>

        {/* Direita: Fila & Exportar */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            startIcon={<AnalyticsIcon sx={{ fontSize: 16 }} />}
            onClick={handlePopoverOpen}
            sx={{
              color: '#CBD5E1',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { color: '#F8FAFC', bgcolor: '#1E293B' },
            }}
          >
            Fila ({stats?.pending ?? 0} pendentes)
          </Button>

          <Popover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { bgcolor: '#1E293B', color: '#F8FAFC', p: 2, borderRadius: 2, border: '1px solid #334155' },
            }}
          >
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1, fontWeight: 700 }}>
              ESTATÍSTICAS DA FILA ATIVA
            </Typography>
            <Stack spacing={1} sx={{ minWidth: 160 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Pendentes:</Typography>
                <Typography variant="body2" fontWeight={700} color="#F59E0B">
                  {stats?.pending ?? 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Aprovados:</Typography>
                <Typography variant="body2" fontWeight={700} color="#10B981">
                  {stats?.approved ?? 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Rejeitados:</Typography>
                <Typography variant="body2" fontWeight={700} color="#EF4444">
                  {stats?.rejected ?? 0}
                </Typography>
              </Box>
            </Stack>
          </Popover>

          <Button
            size="small"
            startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />}
            onClick={() => setIsExportOpen(true)}
            sx={{
              color: '#38BDF8',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { color: '#7DD3FC', bgcolor: '#1E293B' },
            }}
          >
            Exportar Dataset
          </Button>

          <Tooltip title="Guia de Teclas de Atalho (?)">
            <IconButton size="small" onClick={toggleHotkeyModal} sx={{ color: '#38BDF8', '&:hover': { bgcolor: '#1E293B' } }}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <DatasetExportModal open={isExportOpen} onClose={() => setIsExportOpen(false)} event={event} />
        </Stack>
      </Box>

      {/* 2. Banner de Alto Contraste com Título Claro da Ocorrência para Julgamento */}
      <Box
        sx={{
          px: 2,
          py: 0.8,
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            icon={<ReportProblemIcon style={{ color: '#F59E0B', fontSize: 16 }} />}
            label="AVALIAÇÃO DE EVENTO"
            size="small"
            sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', fontWeight: 800, fontSize: '0.7rem' }}
          />
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#FFFFFF', letterSpacing: 0.2 }}>
            {eventTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
            ({eventGuidance})
          </Typography>
        </Stack>

        <Chip
          icon={<SignalCellularAltIcon style={{ color: isLowConfidence ? '#EF4444' : '#10B981', fontSize: 16 }} />}
          label={`Confiança IA: ${confidenceScore}%`}
          size="small"
          sx={{
            bgcolor: isLowConfidence ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isLowConfidence ? '#FCA5A5' : '#4ADE80',
            border: `1px solid ${isLowConfidence ? '#EF4444' : '#10B981'}`,
            fontWeight: 800,
            height: 24,
          }}
        />
      </Box>
    </Box>
  );
}
