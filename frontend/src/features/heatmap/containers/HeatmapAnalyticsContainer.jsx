import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Slider,
  Stack,
  Paper,
} from '@mui/material';
import HeatmapOverlayCanvas from '../components/HeatmapOverlayCanvas';
import PeopleCountingCardGroup from '../components/PeopleCountingCardGroup';
import { useHeatmapStore } from '../../../infrastructure/stores/useHeatmapStore';

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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: '#020617',
        minHeight: '100vh',
        color: '#F8FAFC',
      }}
    >
      {/* 1. Header do Módulo de Heatmap & Flow Analytics */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Mapas de Calor de Permanência & Contagem de Pessoas
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Análise de densidade de fluxo de clientes, zonas quentes no caixa e ocupação da loja em tempo real
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
        </Stack>
      </Box>

      {/* 2. Cards de Contagem de Pessoas (People Counting) */}
      <Box mb={3}>
        <PeopleCountingCardGroup stats={peopleStats} />
      </Box>

      {/* 3. Área Principal: Canvas de Heatmap + Painel de Ajuste de Opacidade */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <HeatmapOverlayCanvas
            imageSrc="/vision/static/latest.jpg"
            densityPoints={densityPoints}
            opacity={heatmapOpacity}
            blur={heatmapBlur}
          />
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
                Controles do Mapa de Calor
              </Typography>

              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                Opacidade da Mancha de Calor: {Math.round(heatmapOpacity * 100)}%
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
                Suavização do Gradiente (Blur): {heatmapBlur}px
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

            {/* Legenda de Densidade de Cor */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                ESCALA DE DENSIDADE DE PERMANÊNCIA
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
                  Baixa (Passagem)
                </Typography>
                <Typography variant="caption" color="#EF4444" fontWeight={700}>
                  Alta (Fila/Espera)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
