import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  ButtonGroup,
  Button,
  Stack,
  Dialog,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import CameraStreamCard from '../components/CameraStreamCard';
import LiveAlertSidebar from '../components/LiveAlertSidebar';
import { useLiveStreamStore } from '../../../infrastructure/stores/useLiveStreamStore';

export default function MultiCameraLiveGridContainer() {
  const {
    cameras,
    realtimeAlerts,
    gridLayout,
    selectedFilial,
    focusedCameraId,
    setGridLayout,
    setSelectedFilial,
    setFocusedCameraId,
  } = useLiveStreamStore();

  const focusedCamera = cameras.find((c) => c.id === focusedCameraId);

  const getGridCols = () => {
    if (gridLayout === '3x3') return { xs: 12, sm: 6, md: 4 };
    return { xs: 12, sm: 6 }; // 2x2
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        bgcolor: '#020617',
        color: '#F8FAFC',
        overflow: 'hidden',
      }}
    >
      {/* Área Central Principal: Header + Grid de Câmeras */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar Superior do Mosaico */}
        <Box
          sx={{
            height: 52,
            px: 3,
            bgcolor: '#0F172A',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#38BDF8', letterSpacing: -0.3 }}>
              MONITORAMENTO MULTI-CÂMERA AO VIVO
            </Typography>

            <Select
              size="small"
              value={selectedFilial}
              onChange={(e) => setSelectedFilial(e.target.value)}
              sx={{
                height: 28,
                bgcolor: '#1E293B',
                color: '#F8FAFC',
                fontSize: '0.75rem',
                '& fieldset': { borderColor: '#334155' },
              }}
            >
              <MenuItem value="ALL">Todas as Filiais</MenuItem>
              <MenuItem value="RIUAL_027">Filial RIUAL_027</MenuItem>
              <MenuItem value="RIUAL_084">Filial RIUAL_084</MenuItem>
            </Select>
          </Stack>

          {/* Seletor de Mosaico (2x2 / 3x3) */}
          <Stack direction="row" spacing={1} alignItems="center">
            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={gridLayout === '2x2' ? 'contained' : 'outlined'}
                onClick={() => setGridLayout('2x2')}
                startIcon={<GridViewIcon sx={{ fontSize: 14 }} />}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Mosaico 2x2
              </Button>
              <Button
                variant={gridLayout === '3x3' ? 'contained' : 'outlined'}
                onClick={() => setGridLayout('3x3')}
                startIcon={<GridViewIcon sx={{ fontSize: 14 }} />}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Mosaico 3x3
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>

        {/* Grid de Câmeras IP */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <Grid container spacing={2.5}>
            {cameras.map((camera) => (
              <Grid item key={camera.id} {...getGridCols()}>
                <CameraStreamCard camera={camera} onFocus={setFocusedCameraId} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Painel Lateral de Alertas em Tempo Real */}
      <LiveAlertSidebar alerts={realtimeAlerts} onSelectAlert={setFocusedCameraId} />

      {/* Modal de Câmera Focada em Tela Cheia (Reutilizando CameraStreamCard com ROI e BBoxes) */}
      <Dialog
        open={Boolean(focusedCameraId)}
        onClose={() => setFocusedCameraId(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid #1E293B', borderRadius: 3 },
        }}
      >
        {focusedCamera && (
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography variant="h6" fontWeight={700}>
                Monitoramento Expandido em Alta Definição: {focusedCamera.name}
              </Typography>
              <IconButton size="small" onClick={() => setFocusedCameraId(null)} sx={{ color: '#94A3B8' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Reutilização Exata do Componente CameraStreamCard com Suporte a ROI e Bounding Boxes */}
            <CameraStreamCard camera={focusedCamera} isExpanded onFocus={() => {}} />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
