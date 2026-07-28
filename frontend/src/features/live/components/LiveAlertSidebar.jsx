import React from 'react';
import { Paper, Box, Typography, Stack, Chip, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LiveAlertSidebar({ alerts = [], onSelectAlert }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 320,
        bgcolor: '#0F172A',
        borderLeft: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#F8FAFC',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsActiveIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#F8FAFC' }}>
          ALERTAS DA IA EM TEMPO REAL ({alerts.length})
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
        {alerts.length === 0 ? (
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'center', py: 4 }}>
            Nenhum alerta de alta severidade ativo no momento.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {alerts.map((alert) => (
              <Paper
                key={alert.id}
                onClick={() => onSelectAlert?.(alert.cameraId)}
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: '#1E293B',
                  border: `1px solid ${alert.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: '#334155' },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#38BDF8' }}>
                    {alert.cameraName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {alert.time}
                  </Typography>
                </Box>

                <Typography variant="body2" fontWeight={600} sx={{ color: '#F8FAFC', mb: 1 }}>
                  {alert.message}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={alert.severity}
                    size="small"
                    sx={{
                      bgcolor: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: alert.severity === 'CRITICAL' ? '#FCA5A5' : '#FCD34D',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      height: 18,
                    }}
                  />
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 12 }} />}
                    sx={{ color: '#38BDF8', fontSize: '0.7rem', p: 0, textTransform: 'none' }}
                  >
                    Focar Câmera
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
