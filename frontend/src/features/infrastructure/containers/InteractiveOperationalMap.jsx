import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import RouterIcon from '@mui/icons-material/Router';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useInfrastructureStore } from '../../../infrastructure/stores/useInfrastructureStore';

export default function InteractiveOperationalMap() {
  const { branches, dvrs, cameras } = useInfrastructureStore();
  const [selectedCam, setSelectedCam] = useState(null);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Mapa Operacional de Hierarquia & Vídeo (Sprint 28)
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Visualização em árvore hierárquica (Empresa → Filial → DVR → Câmeras IP) com acionamento de streaming direto
        </Typography>
      </Box>

      {/* Nível 1: Empresa Matriz */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#0F172A', border: '1px solid #38BDF8', borderRadius: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <BusinessIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Rede Riual Supermercados Ltda
            </Typography>
            <Typography variant="caption" color="#94A3B8">
              Orquestração de Inteligência Artificial em 2 Filiais Conectadas via Tailscale Mesh
            </Typography>
          </Box>
        </Stack>

        {/* Nível 2: Filiais */}
        <Grid container spacing={3} mt={1}>
          {branches.map((branch) => {
            const branchDvrs = dvrs.filter((d) => d.branchId === branch.id);
            return (
              <Grid item xs={12} key={branch.id}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1E293B', border: '1px solid #334155', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StoreIcon sx={{ color: '#10B981' }} />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {branch.name} ({branch.code})
                      </Typography>
                      <Chip label={branch.status} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
                    </Stack>
                    <Typography variant="caption" color="#94A3B8">
                      IP Tailscale: {branch.tailscaleIp}
                    </Typography>
                  </Stack>

                  {/* Nível 3: DVRs da Filial */}
                  <Grid container spacing={2}>
                    {branchDvrs.map((dvr) => {
                      const dvrCameras = cameras.filter((c) => c.dvrId === dvr.id);
                      return (
                        <Grid item xs={12} md={6} key={dvr.id}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: '#0F172A', border: '1px solid #334155', borderRadius: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                              <RouterIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                              <Typography variant="subtitle2" fontWeight={700}>
                                {dvr.name} ({dvr.manufacturer})
                              </Typography>
                            </Stack>

                            {/* Nível 4: Câmeras do DVR */}
                            <Stack spacing={1}>
                              {dvrCameras.map((cam) => (
                                <Paper
                                  key={cam.id}
                                  elevation={0}
                                  sx={{
                                    p: 1.2,
                                    bgcolor: '#1E293B',
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <VideocamIcon sx={{ color: '#38BDF8', fontSize: 16 }} />
                                    <Typography variant="caption" fontWeight={700}>
                                      {cam.name}
                                    </Typography>
                                  </Stack>

                                  <Button
                                    size="small"
                                    startIcon={<PlayCircleIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => setSelectedCam(cam)}
                                    sx={{ color: '#38BDF8', fontSize: '0.72rem', textTransform: 'none' }}
                                  >
                                    Ver Streaming
                                  </Button>
                                </Paper>
                              ))}
                            </Stack>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Modal Preview de Vídeo */}
      <Dialog open={Boolean(selectedCam)} onClose={() => setSelectedCam(null)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0F172A', color: '#F8FAFC', borderRadius: 3 } }}>
        {selectedCam && (
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography variant="h6" fontWeight={700}>
                {selectedCam.name}
              </Typography>
              <IconButton size="small" onClick={() => setSelectedCam(null)} sx={{ color: '#94A3B8' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ width: '100%', height: 420, bgcolor: '#000000', borderRadius: 2, overflow: 'hidden' }}>
              <video src="/videos/TESTE.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
