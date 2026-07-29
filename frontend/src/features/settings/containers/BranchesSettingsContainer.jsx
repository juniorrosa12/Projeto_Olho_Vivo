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
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StoreIcon from '@mui/icons-material/Store';
import RouterIcon from '@mui/icons-material/Router';
import VideocamIcon from '@mui/icons-material/Videocam';
import SpeedIcon from '@mui/icons-material/Speed';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AddIcon from '@mui/icons-material/Add';
import ComputerIcon from '@mui/icons-material/Computer';
import { useInfrastructureStore } from '../../../infrastructure/stores/useInfrastructureStore';
import { DvrProvisioner } from '../../../services/device/DvrProvisioner';
import OperationalTelemetryDashboard from '../../infrastructure/containers/OperationalTelemetryDashboard';
import InteractiveOperationalMap from '../../infrastructure/containers/InteractiveOperationalMap';
import ConnectorManagementContainer from '../../infrastructure/containers/ConnectorManagementContainer';

export default function BranchesSettingsContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const { branches, dvrs, cameras, testDvrConnection, addDvr, updateDvr, deleteDvr, addCamera } = useInfrastructureStore();

  const [testResult, setTestResult] = useState(null);
  const [testingDvrId, setTestingDvrId] = useState(null);

  // Form de Novo/Editar DVR
  const [openAddDvrModal, setOpenAddDvrModal] = useState(false);
  const [editingDvrId, setEditingDvrId] = useState(null);
  const [provisioning, setProvisioning] = useState(false);

  const initialDvrState = {
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
  };

  const [newDvrData, setNewDvrData] = useState(initialDvrState);

  const handleOpenCreateModal = () => {
    setEditingDvrId(null);
    setNewDvrData(initialDvrState);
    setOpenAddDvrModal(true);
  };

  const handleOpenEditModal = (dvr) => {
    setEditingDvrId(dvr.id);
    setNewDvrData({ ...dvr });
    setOpenAddDvrModal(true);
  };

  const handleTestConnection = async (dvrId) => {
    setTestingDvrId(dvrId);
    setTestResult(null);
    const result = await testDvrConnection(dvrId);
    setTestingDvrId(null);
    setTestResult(result);
  };

  const handleSaveDvr = async () => {
    if (!newDvrData.name) {
      alert('Por favor, informe o nome do DVR.');
      return;
    }

    if (editingDvrId) {
      updateDvr({ ...newDvrData, id: editingDvrId });
      setOpenAddDvrModal(false);
      setEditingDvrId(null);
    } else {
      setProvisioning(true);
      const dvrObj = { ...newDvrData, id: `dvr-${Date.now()}` };
      addDvr(dvrObj);

      try {
        await DvrProvisioner.provisionDvr(dvrObj, (newCam) => addCamera(newCam));
      } catch {
        // Fallback
      } finally {
        setProvisioning(false);
        setOpenAddDvrModal(false);
      }
    }
  };

  const handleDeleteDvr = (dvrId) => {
    if (window.confirm('Tem certeza que deseja excluir este DVR?')) {
      deleteDvr(dvrId);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Header Principal */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Infraestrutura Multi-Filial, Connectors & DVRs de Loja
          </Typography>

          <Typography variant="body2" sx={{ color: '#E2E8F0', mt: 0.5, fontWeight: 500 }}>
            Gerenciamento centralizado de filiais, serviços residentes Olho Vivo Connectors, conectividade e auto-descoberta
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 800, textTransform: 'none', px: 2.5, py: 1 }}
        >
          Cadastrar DVR
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{
          mb: 3,
          borderBottom: '1px solid #334155',
          '& .MuiTab-root': { color: '#CBD5E1', textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' },
          '& .Mui-selected': { color: '#38BDF8' },
          '& .MuiTabs-indicator': { backgroundColor: '#38BDF8', height: 3 },
        }}
      >
        <Tab icon={<ComputerIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Olho Vivo Connectors (Edge)" />
        <Tab icon={<StoreIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Filiais & Redes" />
        <Tab icon={<RouterIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Gestão de DVRs" />
        <Tab icon={<VideocamIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Câmeras & URLs RTSP" />
        <Tab icon={<SpeedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Telemetria" />
        <Tab icon={<MapIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Mapa Operacional" />
      </Tabs>

      {/* ABA 0: Olho Vivo Connectors Edge Management */}
      {activeTab === 0 && <ConnectorManagementContainer />}

      {/* ABA 1: Filiais Tailscale */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {branches.map((branch) => (
            <Grid item xs={12} md={6} key={branch.id}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #334155', borderRadius: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', p: 1, borderRadius: 2 }}>
                      <StoreIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#FFFFFF' }}>
                        {branch.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                        {branch.city} • Código: <span style={{ color: '#38BDF8' }}>{branch.code}</span>
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip label={branch.status} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#4ADE80', fontWeight: 800 }} />
                </Box>

                <Stack spacing={1.5} mb={1} sx={{ bgcolor: '#1E293B', p: 2, borderRadius: 2, border: '1px solid #334155' }}>
                  <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                    IP Tailscale Mesh: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{branch.tailscaleIp}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                    Hostname: <code style={{ color: '#38BDF8', backgroundColor: '#0F172A', padding: '2px 6px', borderRadius: '4px' }}>{branch.tailscaleHostname}</code>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                    Latência Mesh: <strong style={{ color: '#4ADE80' }}>{branch.latencyMs} ms</strong> • Último Heartbeat: <span style={{ color: '#E2E8F0' }}>{branch.lastHeartbeat}</span>
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ABA 2: Gestão de DVRs */}
      {activeTab === 2 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#FFFFFF' }}>
              DVRs Cadastrados
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 800, textTransform: 'none' }}
            >
              Cadastrar DVR
            </Button>
          </Box>

          <Grid container spacing={3}>
            {dvrs.map((dvr) => (
              <Grid item xs={12} md={6} key={dvr.id}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #334155', borderRadius: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', p: 1, borderRadius: 2 }}>
                        <RouterIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#FFFFFF' }}>
                          {dvr.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                          {dvr.manufacturer} {dvr.model} • <span style={{ color: '#38BDF8' }}>{dvr.channelsCount} Canais</span>
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton size="small" onClick={() => handleOpenEditModal(dvr)} sx={{ color: '#38BDF8' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteDvr(dvr.id)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Stack spacing={1.5} mb={2} sx={{ bgcolor: '#1E293B', p: 2, borderRadius: 2, border: '1px solid #334155' }}>
                    <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                      IP Tailscale: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{dvr.tailscaleIp}</strong> (HTTP: {dvr.httpPort} | RTSP: {dvr.rtspPort})
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                      Usuário de Acesso: <code style={{ color: '#38BDF8', backgroundColor: '#0F172A', padding: '2px 6px', borderRadius: '4px' }}>{dvr.user}</code>
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={testingDvrId === dvr.id ? <CircularProgress size={14} color="inherit" /> : <NetworkCheckIcon />}
                    onClick={() => handleTestConnection(dvr.id)}
                    sx={{ color: '#38BDF8', borderColor: '#334155', textTransform: 'none', fontWeight: 700 }}
                  >
                    {testingDvrId === dvr.id ? 'Testando Conexão...' : 'Testar Conexão (Ping / HTTP / RTSP)'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ABA 3: Câmeras IP & RTSP Auto */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {cameras.map((cam) => (
            <Grid item xs={12} md={6} key={cam.id}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #334155', borderRadius: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#FFFFFF' }} mb={0.5}>
                  {cam.name} (Canal #{cam.channel})
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }} mb={2}>
                  {cam.location} • Resolução: <span style={{ color: '#38BDF8' }}>{cam.resolution}</span> • {cam.fps} FPS
                </Typography>

                <Box sx={{ bgcolor: '#1E293B', p: 1.5, borderRadius: 2, mb: 2, border: '1px solid #334155' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, display: 'block' }} mb={0.5}>
                    URL RTSP Gerada Automatizada (Device Manager):
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#38BDF8', fontFamily: 'monospace', wordBreak: 'break-all', fontWeight: 700 }}>
                    {cam.rtspUrl}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {cam.monitoredClasses.map((cls, idx) => (
                    <Chip key={idx} label={cls} size="small" sx={{ bgcolor: '#0B1120', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 700 }} />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ABA 4: Telemetria */}
      {activeTab === 4 && <OperationalTelemetryDashboard />}

      {/* ABA 5: Mapa Operacional */}
      {activeTab === 5 && <InteractiveOperationalMap />}

      {/* MODAL: Cadastrar / Editar DVR */}
      <Dialog
        open={openAddDvrModal}
        onClose={() => setOpenAddDvrModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid #334155', borderRadius: 3 },
        }}
      >
        <DialogTitle display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #334155">
          <Typography variant="h6" fontWeight={800} sx={{ color: '#FFFFFF' }}>
            {editingDvrId ? 'Editar DVR de Loja' : 'Cadastrar Novo DVR de Loja'}
          </Typography>
          <IconButton size="small" onClick={() => setOpenAddDvrModal(false)} sx={{ color: '#94A3B8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={2.5} mt={1}>
            <TextField
              label="Nome do DVR"
              size="small"
              fullWidth
              value={newDvrData.name}
              onChange={(e) => setNewDvrData({ ...newDvrData, name: e.target.value })}
              placeholder="Ex: DVR Principal Caixas"
              sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="#94A3B8" fontWeight={700} display="block" mb={0.5}>
                  Fabricante
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={newDvrData.manufacturer}
                  onChange={(e) => setNewDvrData({ ...newDvrData, manufacturer: e.target.value })}
                  sx={{ bgcolor: '#1E293B', color: '#F8FAFC', fontWeight: 600, fieldset: { borderColor: '#334155' } }}
                >
                  <MenuItem value="HIKVISION">Hikvision</MenuItem>
                  <MenuItem value="DAHUA">Dahua</MenuItem>
                  <MenuItem value="INTELBRAS">Intelbras</MenuItem>
                  <MenuItem value="UNIVIEW">Uniview</MenuItem>
                  <MenuItem value="GENERIC">Genérico RTSP</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="#94A3B8" fontWeight={700} display="block" mb={0.5}>
                  Filial Associada
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={newDvrData.branchId}
                  onChange={(e) => setNewDvrData({ ...newDvrData, branchId: e.target.value })}
                  sx={{ bgcolor: '#1E293B', color: '#F8FAFC', fontWeight: 600, fieldset: { borderColor: '#334155' } }}
                >
                  {Array.from({ length: 50 }, (_, i) => {
                    const numStr = String(i + 1).padStart(2, '0');
                    const codeStr = String(i + 1).padStart(3, '0');
                    return (
                      <MenuItem key={i + 1} value={`br-${i + 1}`}>
                        Filial {numStr} (RIUAL_{codeStr})
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Modelo do Equipamento"
                  size="small"
                  fullWidth
                  value={newDvrData.model}
                  onChange={(e) => setNewDvrData({ ...newDvrData, model: e.target.value })}
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="IP VPN Tailscale"
                  size="small"
                  fullWidth
                  value={newDvrData.tailscaleIp}
                  onChange={(e) => setNewDvrData({ ...newDvrData, tailscaleIp: e.target.value })}
                  placeholder="100.64.10.X"
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Porta HTTP"
                  type="number"
                  size="small"
                  fullWidth
                  value={newDvrData.httpPort}
                  onChange={(e) => setNewDvrData({ ...newDvrData, httpPort: Number(e.target.value) })}
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Porta RTSP"
                  type="number"
                  size="small"
                  fullWidth
                  value={newDvrData.rtspPort}
                  onChange={(e) => setNewDvrData({ ...newDvrData, rtspPort: Number(e.target.value) })}
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="#94A3B8" fontWeight={700} display="block" mb={0.5}>
                  Canais
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={newDvrData.channelsCount}
                  onChange={(e) => setNewDvrData({ ...newDvrData, channelsCount: Number(e.target.value) })}
                  sx={{ bgcolor: '#1E293B', color: '#F8FAFC', fontWeight: 600, fieldset: { borderColor: '#334155' } }}
                >
                  <MenuItem value={4}>4 Canais</MenuItem>
                  <MenuItem value={8}>8 Canais</MenuItem>
                  <MenuItem value={16}>16 Canais</MenuItem>
                  <MenuItem value={32}>32 Canais</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Usuário DVR"
                  size="small"
                  fullWidth
                  value={newDvrData.user}
                  onChange={(e) => setNewDvrData({ ...newDvrData, user: e.target.value })}
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Senha DVR"
                  type="password"
                  size="small"
                  fullWidth
                  value={newDvrData.password}
                  onChange={(e) => setNewDvrData({ ...newDvrData, password: e.target.value })}
                  sx={{ input: { color: '#F8FAFC', fontWeight: 600 }, label: { color: '#94A3B8' }, fieldset: { borderColor: '#334155' } }}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #334155', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<NetworkCheckIcon />}
            onClick={() => handleTestConnection('preview')}
            sx={{ color: '#38BDF8', borderColor: '#334155', textTransform: 'none', fontWeight: 700 }}
          >
            Testar Conexão
          </Button>

          <Stack direction="row" spacing={1}>
            <Button onClick={() => setOpenAddDvrModal(false)} sx={{ color: '#94A3B8', textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveDvr}
              disabled={provisioning}
              startIcon={provisioning ? <CircularProgress size={14} color="inherit" /> : null}
              sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 800, textTransform: 'none' }}
            >
              {provisioning ? 'Provisionando Canais...' : editingDvrId ? 'Atualizar DVR' : 'Salvar DVR'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
