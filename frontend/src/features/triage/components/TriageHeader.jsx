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
    : 'N/A';

  const isLowConfidence = event?.confidence ? Number(event.confidence) < 0.6 : false;

  return (
    <Box
      sx={{
        height: 48,
        px: 2,
        bgcolor: '#0F172A',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#F8FAFC',
      }}
    >
      {/* Esquerda: Barra de Navegação ← → e Identificação do Evento */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* Barra de Voltar / Avancar estilo Navegador */}
        <ButtonGroup size="small" variant="outlined" sx={{ mr: 1 }}>
          <Tooltip title="Voltar para a Aba / Página Anterior">
            <IconButton
              size="small"
              onClick={() => window.history.back()}
              sx={{ color: '#94A3B8', border: '1px solid #334155', borderRadius: '4px 0 0 4px', p: 0.5 }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Avançar para a Próxima Aba / Página">
            <IconButton
              size="small"
              onClick={() => window.history.forward()}
              sx={{ color: '#94A3B8', border: '1px solid #334155', borderRadius: '0 4px 4px 0', p: 0.5 }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#38BDF8', letterSpacing: 0.5 }}>
          OLHO VIVO STUDIO
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          |
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
          Evento #{event?.id ?? '---'}
        </Typography>
        {event?.filial && (
          <Chip
            label={`${event.filial} • ${event.camera || 'CAM01'}`}
            size="small"
            sx={{
              bgcolor: '#1E293B',
              color: '#CBD5E1',
              fontSize: '0.75rem',
              height: 22,
              fontWeight: 500,
            }}
          />
        )}
      </Stack>

      {/* Centro: Status de Saúde da IA / Confiança */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="Score de Confiança da Inteligência Artificial neste Evento">
          <Chip
            icon={<SignalCellularAltIcon style={{ color: isLowConfidence ? '#EF4444' : '#10B981', fontSize: 16 }} />}
            label={`IA Confidence: ${confidenceScore}%`}
            size="small"
            sx={{
              bgcolor: isLowConfidence ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isLowConfidence ? '#FCA5A5' : '#6EE7B7',
              border: `1px solid ${isLowConfidence ? '#EF4444' : '#10B981'}`,
              fontWeight: 600,
              height: 24,
            }}
          />
        </Tooltip>
      </Stack>

      {/* Direita: Métricas Compactas Expansíveis & Guia de Atalhos */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="small"
          startIcon={<AnalyticsIcon sx={{ fontSize: 16 }} />}
          onClick={handlePopoverOpen}
          sx={{
            color: '#94A3B8',
            fontSize: '0.75rem',
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
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total Processado:</Typography>
              <Typography variant="body2" fontWeight={700} color="#38BDF8">
                {stats?.total ?? 0}
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
  );
}
