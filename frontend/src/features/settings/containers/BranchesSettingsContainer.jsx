import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import RouterIcon from '@mui/icons-material/Router';
import VideocamIcon from '@mui/icons-material/Videocam';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AddIcon from '@mui/icons-material/Add';
import { useInfrastructureStore } from '../../../infrastructure/stores/useInfrastructureStore';

export default function BranchesSettingsContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const { branches, dvrs, cameras, telemetry, testDvrConnection, addDvr } = useInfrastructureStore();

  const [testResult, setTestResult] = useState(null);
  const [testingDvrId, setTestingDvrId] = useState(null);

  // Form de Novo DVR
  const [openAddDvrModal, setOpenAddDvrModal] = useState(false);
  const [newDvrData, setNewDvrData] = useState({
    name: '',
    manufacturer: 'HIKVISION',
    model: 'DS-7608NI-K2',
    tailscaleIp: '100.64.10.30',
    httpPort: 80,
    rtspPort: 554,
    user: 'admin',
    password: '',
    channelsCount: 8,
    branchId: 'br-1',
  });

  const handleTestConnection = async (dvrId) => {
    setTestingDvrId(dvrId);
    setTestResult(null);
    const result = await testDvrConnection(dvrId);
    setTestingDvrId(null);
    setTestResult(result);
  };

  const handleCreateDvr = () => {
    addDvr(newDvrData);
    setOpenAddDvrModal(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Infraestrutura Multi-Filial, DVRs & Rede Tailscale Mesh
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Gerenciamento centralizado de filiais, conectividade VPN Tailscale, cadastro de DVRs e auto-geração de URLs RTSP
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{
          mb: 3,
          borderBottom: '1px solid #1E293B',
          '& .MuiTab-root': { color: '#94A3B8', textTransform: 'none', fontWeight: 600 },
          '& .Mui-selected': { color: '#38BDF8' },
          '& .MuiTabs-indicator': { backgroundColor: '#38BDF8' },
        }}
      >
        <Tab icon={<StoreIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Filiais & Redes Tailscale" />
        <Tab icon={<RouterIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Gestão de DVRs" />
        <Tab icon={<VideocamIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Câmeras & URLs RTSP" />
        <Tab icon={<SpeedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Telemetria da Infraestrutura" />
      </Tabs>

      {/* ABA 0: Filiais Tailscale */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {branches.map((branch) => (
            <Grid item xs={12} md={6} key={branch.id}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', p: 1, borderRadius: 2 }}>
                      <StoreIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {branch.name}
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        {branch.city} • Código: {branch.code}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip label={branch.status} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
                </Box>

                <Stack spacing={1} mb={2} sx={{ bgcolor: '#1E293B', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="#CBD5E1">
                    IP Tailscale Mesh: <strong>{branch.tailscaleIp}</strong>
                  </Typography>
                  <Typography variant="caption" color="#CBD5E1">
                    Hostname: <code>{branch.tailscaleHostname}</code>
                  </Typography>
                  <Typography variant="caption" color="#CBD5E1">
                    Latência Mesh: <strong>{branch.latencyMs} ms</strong> • Último Heartbeat: {branch.lastHeartbeat}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ABA 1: Gestão de DVRs & Teste */}
      {activeTab === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              DVRs Cadastrados
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDvrModal(true)}
              sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 700, textTransform: 'none' }}
            >
              Cadastrar DVR
            </Button>
          </Box>

          <Grid container spacing={3}>
            {dvrs.map((dvr) => (
              <Grid item xs={12} md={6} key={dvr.id}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', p: 1, borderRadius: 2 }}>
                        <RouterIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {dvr.name}
                        </Typography>
                        <Typography variant="caption" color="#94A3B8">
                          {dvr.manufacturer} {dvr.model} • {dvr.channelsCount} Canais
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip label={dvr.status} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
                  </Box>

                  <Stack spacing={1} mb={2} sx={{ bgcolor: '#1E293B', p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="#CBD5E1">
                      IP Tailscale: <strong>{dvr.tailscaleIp}</strong> (HTTP: {dvr.httpPort} | RTSP: {dvr.rtspPort})
                    </Typography>
                    <Typography variant="caption" color="#CBD5E1">
                      Usuário de Acesso: <code>{dvr.user}</code>
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={testingDvrId === dvr.id ? <CircularProgress size={14} color="inherit" /> : <NetworkCheckIcon />}
                    onClick={() => handleTestConnection(dvr.id)}
                    sx={{ color: '#38BDF8', borderColor: '#334155', textTransform: 'none' }}
                  >
                    {testingDvrId === dvr.id ? 'Testando Conexão...' : 'Testar Conexão (Ping / HTTP / RTSP)'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ABA 2: Câmeras IP & RTSP Auto */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {cameras.map((cam) => (
            <Grid item xs={12} md={6} key={cam.id}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>
                  {cam.name} (Canal #{cam.channel})
                </Typography>
                <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
                  {cam.location} • Resolução: {cam.resolution} • {cam.fps} FPS
                </Typography>

                <Box sx={{ bgcolor: '#1E293B', p: 1.5, borderRadius: 2, mb: 2 }}>
                  <Typography variant="caption" color="#94A3B8" display="block" mb={0.5}>
                    URL RTSP Gerada Automatizada:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {cam.rtspUrl}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {cam.monitoredClasses.map((cls, idx) => (
                    <Chip key={idx} label={cls} size="small" sx={{ bgcolor: '#0B1120', color: '#6EE7B7', fontSize: '0.68rem' }} />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ABA 3: Telemetria da Infraestrutura */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {[
            { name: 'Rede Mesh Tailscale', val: `${telemetry.tailscaleMesh.latencyMs} ms`, status: telemetry.tailscaleMesh.status, detail: `${telemetry.tailscaleMesh.nodeCount} nós ativos` },
            { name: 'Backend FastAPI', val: `${telemetry.backendFastAPI.latencyMs} ms`, status: telemetry.backendFastAPI.status, detail: telemetry.backendFastAPI.version },
            { name: 'Vision Worker IA', val: `${telemetry.visionWorker.fps} FPS`, status: telemetry.visionWorker.status, detail: `GPU: ${telemetry.visionWorker.gpuUsagePercent}% (${telemetry.visionWorker.tempC}°C)` },
            { name: 'PostgreSQL Database', val: `${telemetry.postgresDB.latencyMs} ms`, status: telemetry.postgresDB.status, detail: `${telemetry.postgresDB.connections} conexões` },
            { name: 'Redis Cache', val: `${telemetry.redisCache.latencyMs} ms`, status: telemetry.redisCache.status, detail: `${telemetry.redisCache.memoryUsedMB} MB RAM` },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {item.name}
                  </Typography>
                  <Chip label={item.status} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#6EE7B7', fontWeight: 700 }} />
                </Box>
                <Typography variant="h4" fontWeight={700} color="#38BDF8" my={1}>
                  {item.val}
                </Typography>
                <Typography variant="caption" color="#94A3B8">
                  {item.detail}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Resultado do Teste de DVR */}
      <Dialog open={Boolean(testResult)} onClose={() => setTestResult(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: '#0F172A', color: '#F8FAFC', borderRadius: 3 } }}>
        <DialogTitle display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon sx={{ color: '#10B981' }} />
          Resultado do Teste de Conexão
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#1E293B' }}>
          <Stack spacing={1}>
            <Typography variant="body2">Ping Tailscale: <strong>{testResult?.pingMs} ms</strong></Typography>
            <Typography variant="body2">Serviço HTTP (Porta 80): <strong>Status 200 OK</strong></Typography>
            <Typography variant="body2">Stream RTSP (Porta 554): <strong>{testResult?.rtspStatus}</strong></Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestResult(null)} sx={{ color: '#38BDF8' }}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
