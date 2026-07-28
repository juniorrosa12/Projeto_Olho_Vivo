import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Slider,
  Stack,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import HeatmapOverlayCanvas from '../components/HeatmapOverlayCanvas';
import PeopleCountingCardGroup from '../components/PeopleCountingCardGroup';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useHeatmapStore } from '../../../infrastructure/stores/useHeatmapStore';

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function HeatmapAnalyticsContainer() {
  const {
    selectedCameraId,
    timeRange,
    heatmapOpacity,
    heatmapBlur,
    peopleStats,
    densityPoints,
    setSelectedCameraId,
    setTimeRange,
    setHeatmapOpacity,
    setHeatmapBlur,
  } = useHeatmapStore();

  const [cameraUrl, setCameraUrl] = useState('');
  const [heatmapOverlayUrl, setHeatmapOverlayUrl] = useState('');

  // Live Refresh for Heatmap & Camera Stream
  useEffect(() => {
    const refresh = () => {
      const timestamp = Date.now();
      setCameraUrl(`${API}/static/output/latest.jpg?t=${timestamp}`);
      setHeatmapOverlayUrl(`${API}/static/output/heatmap/latest.png?t=${timestamp}`);
    };

    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: '#020617',
        minHeight: '100vh',
        color: '#F8FAFC',
      }}
    >
      {/* 1. Header do Módulo de Heatmap Operacional */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Mapa de Calor Operacional & Análise de Permanência
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Monitoramento de áreas de alta intensidade, regiões críticas no caixa e fluxo de clientes por período
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            sx={{
              bgcolor: '#0F172A',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: '#1E293B' },
            }}
          >
            <MenuItem value="cam-01">Câmera Caixa 01 (RIUAL_027)</MenuItem>
            <MenuItem value="cam-02">Câmera Caixa 02 (RIUAL_027)</MenuItem>
            <MenuItem value="cam-03">Entrada Principal</MenuItem>
          </Select>

          <Select
            size="small"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{
              bgcolor: '#0F172A',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: '#1E293B' },
            }}
          >
            <MenuItem value="today">Hoje</MenuItem>
            <MenuItem value="week">Últimos 7 Dias</MenuItem>
            <MenuItem value="month">Este Mês</MenuItem>
          </Select>

          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setCameraUrl(`${API}/static/output/latest.jpg?t=${Date.now()}`);
              setHeatmapOverlayUrl(`${API}/static/output/heatmap/latest.png?t=${Date.now()}`);
            }}
            sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none' }}
          >
            Atualizar
          </Button>
        </Stack>
      </Box>

      {/* 2. Cards de Contagem e Ocupação da Loja */}
      <Box mb={3}>
        <PeopleCountingCardGroup stats={peopleStats} />
      </Box>

      {/* 3. Área Principal: Visualizador de Heatmap Híbrido (Server PNG + Interactive Canvas) */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              width: '100%',
              height: 520,
              bgcolor: '#000000',
              borderRadius: 2.5,
              overflow: 'hidden',
              border: '1px solid #1E293B',
            }}
          >
            {/* Feed Real da Câmera */}
            {cameraUrl && (
              <img
                src={cameraUrl}
                alt="Feed da Câmera"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/vision/static/latest.jpg';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Overlay PNG do Servidor com Mix Blend Mode */}
            {heatmapOverlayUrl && (
              <img
                src={heatmapOverlayUrl}
                alt="Heatmap IA Server"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: heatmapOpacity,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Overlay Vetorial Dinâmico */}
            <HeatmapOverlayCanvas
              imageSrc=""
              densityPoints={densityPoints}
              opacity={heatmapOpacity * 0.5}
              blur={heatmapBlur}
            />

            {/* Badge de Região Crítica Detectada */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                px: 2,
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Typography variant="caption" fontWeight={700} display="block" color="#EF4444">
                ZONA CRÍTICA DE ALTA PERMANÊNCIA DETECTADA
              </Typography>
              <Typography variant="caption" color="#CBD5E1">
                Fila no Caixa 01 • Tempo médio de permanência: 8.5 min
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: 2.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#F8FAFC', mb: 2 }}>
                Controles e Intensidade
              </Typography>

              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                Intensidade da Sobreposição: {Math.round(heatmapOpacity * 100)}%
              </Typography>
              <Slider
                size="small"
                value={heatmapOpacity}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(_, val) => setHeatmapOpacity(val)}
                sx={{ color: '#38BDF8', mb: 3 }}
              />

              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                Suavização do Gradiente: {heatmapBlur}px
              </Typography>
              <Slider
                size="small"
                value={heatmapBlur}
                min={5}
                max={30}
                onChange={(_, val) => setHeatmapBlur(val)}
                sx={{ color: '#38BDF8', mb: 3 }}
              />
            </Box>

            {/* Legenda Operacional */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                LEGENDA DE INTENSIDADE DE FLUXO
              </Typography>
              <Box
                sx={{
                  height: 12,
                  borderRadius: 1,
                  background: 'linear-gradient(to right, #38BDF8, #F59E0B, #EF4444)',
                  mb: 1,
                }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="#64748B">
                  Tráfego Livre
                </Typography>
                <Typography variant="caption" color="#EF4444" fontWeight={700}>
                  Congestionamento
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
