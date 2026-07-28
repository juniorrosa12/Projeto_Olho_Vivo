import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

function formatElapsed(value) {
  if (!value) return 'agora';
  const date = new Date(value);
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

export default function AuditMetricsDashboardContainer() {
  const [dashboardData, setDashboardData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Poll Real-Time API Data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await axios.get(`${API}/events/dashboard`);
        setDashboardData(res.data);
      } catch (err) {
        // Fallback for offline dev
        setDashboardData({
          people_now: 12,
          entries: 2480,
          exits: 2310,
          phones: 3,
          pending: 9660,
          approved: 1256,
          rejected: 135,
        });
      }
    };

    const loadHourly = async () => {
      try {
        const res = await axios.get(`${API}/statistics/hour`);
        setHourlyData(
          res.data.map((item) => ({
            hora: String(item.hour).padStart(2, '0'),
            entradas: item.entries,
            saidas: item.exits,
          }))
        );
      } catch (err) {
        setHourlyData([
          { hora: '08', entradas: 120, saidas: 80 },
          { hora: '10', entradas: 340, saidas: 290 },
          { hora: '12', entradas: 520, saidas: 480 },
          { hora: '14', entradas: 410, saidas: 390 },
          { hora: '16', entradas: 680, saidas: 610 },
          { hora: '18', entradas: 410, saidas: 460 },
        ]);
      }
    };

    const loadRecentEvents = async () => {
      try {
        const res = await axios.get(`${API}/events?limit=10`);
        setRecentEvents(res.data);
      } catch (err) {
        setRecentEvents([
          {
            id: 'evt-1',
            event_type: 'cell_phone',
            event_time: new Date().toISOString(),
            track_id: 1,
            filial_id: 'RIUAL_027',
            camera_id: 'CAM01',
            snapshot: '/static/output/latest.jpg',
          },
        ]);
      }
    };

    loadDashboard();
    loadHourly();
    loadRecentEvents();

    const timer = setInterval(() => {
      loadDashboard();
      loadHourly();
      loadRecentEvents();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const kpiCards = useMemo(() => {
    if (!dashboardData) return [];
    return [
      { key: 'people_now', label: 'Pessoas Agora', value: dashboardData.people_now ?? 0, color: '#38BDF8', badge: 'LIVE' },
      { key: 'entries', label: 'Entradas Hoje', value: dashboardData.entries ?? 0, color: '#10B981', badge: 'HOJE' },
      { key: 'exits', label: 'Saídas Hoje', value: dashboardData.exits ?? 0, color: '#F59E0B', badge: 'HOJE' },
      { key: 'phones', label: 'Celulares no Caixa', value: dashboardData.phones ?? 0, color: '#EF4444', badge: 'ALERTA' },
      { key: 'pending', label: 'Pendentes Fila', value: dashboardData.pending ?? 0, color: '#F59E0B', badge: 'FILA' },
      { key: 'approved', label: 'Validados Aprovados', value: dashboardData.approved ?? 0, color: '#10B981', badge: 'ACTIVE LEARNING' },
      { key: 'rejected', label: 'Rejeitados (Falso Positivo)', value: dashboardData.rejected ?? 0, color: '#EF4444', badge: 'FALSO POSITIVO' },
    ];
  }, [dashboardData]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* 1. Cabeçalho Executivo do Dashboard */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Painel de Inteligência Operacional & Monitoramento de Varejo
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Métricas em tempo real de ocupação da loja, fluxo de pessoas, alertas comportamentais e validação de IA
        </Typography>
      </Box>

      {/* 2. Grid de Cards de Estatísticas Integrados (StatsGrid) */}
      <Grid container spacing={2.5} mb={4}>
        {kpiCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.key}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: 2.5,
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                '&:hover': { transform: 'translateY(-2px)', borderColor: card.color },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8' }}>
                  {card.label}
                </Typography>
                <Chip
                  label={card.badge}
                  size="small"
                  sx={{
                    bgcolor: `${card.color}18`,
                    color: card.color,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                    border: `1px solid ${card.color}`,
                  }}
                />
              </Stack>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#F8FAFC', mt: 1.5 }}>
                {card.value.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 3. Gráfico de Fluxo Por Hora (Timeline Recharts com Dark Theme) */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC' }}>
              Fluxo de Pessoas por Hora (Entradas vs. Saídas)
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Dados acumulados das câmeras de entrada e saída com atualização em tempo real
            </Typography>
          </Box>
          <Chip label="ATUALIZAÇÃO AO VIVO (5s)" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
        </Stack>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
            <XAxis dataKey="hora" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }} />
            <Line type="monotone" dataKey="entradas" stroke="#10B981" strokeWidth={3} name="Entradas" />
            <Line type="monotone" dataKey="saidas" stroke="#EF4444" strokeWidth={3} name="Saídas" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* 4. Lista de Últimos Eventos em Tempo Real (LiveEvents) */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC', mb: 2 }}>
          Últimos Eventos Detectados em Tempo Real
        </Typography>

        <Grid container spacing={2}>
          {recentEvents.map((evt) => (
            <Grid item xs={12} md={6} key={evt.id}>
              <Paper
                elevation={0}
                onClick={() => setSelectedEvent(evt)}
                sx={{
                  p: 2,
                  bgcolor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: '#38BDF8', bgcolor: '#243044' },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: evt.event_type === 'cell_phone' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)', color: evt.event_type === 'cell_phone' ? '#EF4444' : '#38BDF8' }}>
                    {evt.event_type === 'cell_phone' ? '📱' : '👤'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Typography fontWeight={700} sx={{ color: '#F8FAFC' }}>
                        {evt.event_type === 'cell_phone' ? 'Uso de Celular no Caixa' : evt.event_type}
                      </Typography>
                      <Chip label={formatElapsed(evt.event_time)} size="small" sx={{ bgcolor: '#0F172A', color: '#38BDF8', fontSize: '0.68rem' }} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Track #{evt.track_id} • {evt.filial_id || 'RIUAL_027'} • {evt.camera_id || 'CAM01'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal de Inspeção Rápida de Evento */}
      <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid #1E293B', borderRadius: 3 } }}>
        {selectedEvent && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #1E293B">
              <Typography variant="h6" fontWeight={700}>
                Inspeção de Evento: {selectedEvent.event_type}
              </Typography>
              <IconButton size="small" onClick={() => setSelectedEvent(null)} sx={{ color: '#94A3B8' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent dividers sx={{ borderColor: '#1E293B' }}>
              {selectedEvent.snapshot && (
                <Box mb={2}>
                  <Typography variant="subtitle2" sx={{ color: '#38BDF8', mb: 1 }}>
                    Snapshot Capturado
                  </Typography>
                  <img src={`${API}${selectedEvent.snapshot}?t=${Date.now()}`} alt="Snapshot" style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'cover' }} />
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
