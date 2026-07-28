import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Button, Stack } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useSettingsStore } from '../../../infrastructure/stores/useSettingsStore';

export default function BranchesSettingsContainer() {
  const { branches } = useSettingsStore();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Gestão de Filiais e Câmeras IP
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Cadastro e monitoramento de conectividade de lojas e canais RTSP/WebRTC
        </Typography>
      </Box>

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
                      Código: {branch.code}
                    </Typography>
                  </Box>
                </Stack>
                <Chip
                  label={branch.status}
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700, height: 22 }}
                />
              </Box>

              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <VideocamIcon sx={{ color: '#38BDF8', fontSize: 18 }} />
                  <Typography variant="body2" color="#CBD5E1">
                    {branch.camerasCount} Câmeras Conectadas
                  </Typography>
                </Box>
              </Stack>

              <Button fullWidth variant="outlined" size="small" sx={{ color: '#38BDF8', borderColor: '#334155', textTransform: 'none' }}>
                Gerenciar Câmeras da Filial
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
