import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useInfrastructureStore } from '../../../infrastructure/stores/useInfrastructureStore';

export default function OperationalTelemetryDashboard() {
  const { telemetry, branches, dvrs, cameras } = useInfrastructureStore();

  const metrics = [
    { title: 'Empresas & Redes', count: 1, label: 'Rede Riual Supermercados', color: '#38BDF8' },
    { title: 'Filiais Conectadas', count: branches.length, label: `${branches.filter(b => b.status === 'ONLINE').length} Online em Tailscale Mesh`, color: '#10B981' },
    { title: 'DVRs / NVRs Activos', count: dvrs.length, label: 'Hikvision, Intelbras, Dahua', color: '#F59E0B' },
    { title: 'Câmeras IP Monitoradas', count: cameras.length, label: `${cameras.filter(c => c.aiEnabled).length} com IA ativa`, color: '#8B5CF6' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Painel Operacional de Telemetria & Infraestrutura (Sprint 27)
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Monitoramento em tempo real de hardware, nós Tailscale Mesh, framerates de IA, uso de GPU e banco de dados
        </Typography>
      </Box>

      {/* Grid de Contagem de Ativos */}
      <Grid container spacing={2.5} mb={4}>
        {metrics.map((m, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
              <Typography variant="caption" fontWeight={700} color="#94A3B8">
                {m.title}
              </Typography>
              <Typography variant="h3" fontWeight={700} color={m.color} my={1}>
                {m.count}
              </Typography>
              <Typography variant="caption" color="#64748B">
                {m.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Telemetria Detalhada dos Componentes da Pipeline */}
      <Grid container spacing={3}>
        {/* Visão Computacional (GPU Worker) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MemoryIcon sx={{ color: '#38BDF8' }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Pipeline Vision (NVIDIA GPU Worker)
                </Typography>
              </Stack>
              <Chip label="🟢 30 FPS" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Box>

            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="#94A3B8">Uso da GPU: {telemetry.visionWorker.gpuUsagePercent}%</Typography>
                <Typography variant="caption" color="#38BDF8">Temperatura: {telemetry.visionWorker.tempC}°C</Typography>
              </Box>
              <LinearProgress variant="determinate" value={telemetry.visionWorker.gpuUsagePercent} sx={{ height: 8, borderRadius: 1, bgcolor: '#1E293B', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }} />
            </Box>

            <Typography variant="caption" color="#64748B">
              Modelo Ativo: YOLOv11 Small • Inferência Média: 11.4 ms/frame
            </Typography>
          </Paper>
        </Grid>

        {/* Rede Mesh Tailscale */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <NetworkCheckIcon sx={{ color: '#10B981' }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Rede VPN Tailscale Mesh
                </Typography>
              </Stack>
              <Chip label="🟢 ONLINE" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Box>

            <Typography variant="body2" color="#CBD5E1" mb={1}>
              Latência Média: <strong>{telemetry.tailscaleMesh.latencyMs} ms</strong> • {telemetry.tailscaleMesh.nodeCount} Nós Interconectados
            </Typography>
            <Typography variant="caption" color="#64748B">
              Carrier-Grade NAT VPN • Criptografia WireGuard Nativa
            </Typography>
          </Paper>
        </Grid>

        {/* Banco PostgreSQL & Cache Redis */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <StorageIcon sx={{ color: '#F59E0B' }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  PostgreSQL & Redis Cache
                </Typography>
              </Stack>
              <Chip label="🟢 ONLINE" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Box>

            <Typography variant="body2" color="#CBD5E1" mb={1}>
              PostgreSQL: {telemetry.postgresDB.connections} Conexões ({telemetry.postgresDB.latencyMs} ms)
            </Typography>
            <Typography variant="body2" color="#CBD5E1">
              Redis RAM: {telemetry.redisCache.memoryUsedMB} MB ({telemetry.redisCache.latencyMs} ms)
            </Typography>
          </Paper>
        </Grid>

        {/* FastAPI Backend */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SpeedIcon sx={{ color: '#8B5CF6' }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  FastAPI REST Engine
                </Typography>
              </Stack>
              <Chip label="🟢 4 ms" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
            </Box>

            <Typography variant="body2" color="#CBD5E1" mb={1}>
              Versão Core: {telemetry.backendFastAPI.version} • Uvicorn Worker Pool
            </Typography>
            <Typography variant="caption" color="#64748B">
              WebSocket Event Bus Ativo
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
