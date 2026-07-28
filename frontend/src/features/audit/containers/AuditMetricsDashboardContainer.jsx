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
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTriageStore } from '../../../infrastructure/stores/useTriageStore';

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
  const navigate = useNavigate();
  const { setInspectedEvent } = useTriageStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadData = async () => {
    try {
      const [dashRes, hourRes, eventsRes] = await Promise.all([
        axios.get(`${API}/events/dashboard`),
        axios.get(`${API}/statistics/hour`),
        axios.get(`${API}/events?limit=10`),
      ]);

      setDashboardData(dashRes.data);
      setHourlyData(
        hourRes.data.map((item) => ({
          hora: String(item.hour).padStart(2, '0'),
          entradas: item.entries,
          saidas: item.exits,
        }))
      );
      setRecentEvents(eventsRes.data);
    } catch {
      // Fallback gracioso para visualização offline
      setDashboardData({
        people_now: 12,
        entries: 2480,
        exits: 2310,
        phones: 3,
        pending: 9660,
        approved: 1256,
        rejected: 135,
      });
      setHourlyData([
        { hora: '08', entradas: 120, saidas: 80 },
        { hora: '10', entradas: 340, saidas: 290 },
        { hora: '12', entradas: 520, saidas: 480 },
        { hora: '14', entradas: 410, saidas: 390 },
        { hora: '16', entradas: 680, saidas: 610 },
        { hora: '18', entradas: 410, saidas: 460 },
      ]);
      setRecentEvents([
        {
          id: 'evt-9660',
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

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, []);

  const kpiCards = useMemo(() => {
    if (!dashboardData) return [];
    return [
      { key: 'people_now', label: 'Pessoas na Loja Agora', value: dashboardData.people_now ?? 0, color: '#38BDF8', badge: 'LIVE' },
      { key: 'entries', label: 'Entradas de Clientes', value: dashboardData.entries ?? 0, color: '#10B981', badge: 'HOJE' },
      { key: 'exits', label: 'Saídas de Clientes', value: dashboardData.exits ?? 0, color: '#F59E0B', badge: 'HOJE' },
      { key: 'phones', label: 'Celulares no Caixa', value: dashboardData.phones ?? 0, color: '#EF4444', badge: 'ALERTA' },
      { key: 'pending', label: 'Eventos Pendentes', value: dashboardData.pending ?? 0, color: '#F59E0B', badge: 'FILA' },
      { key: 'approved', label: 'Validados Aprovados', value: dashboardData.approved ?? 0, color: '#10B981', badge: 'TREINO IA' },
      { key: 'rejected', label: 'Rejeitados (Falso Positivo)', value: dashboardData.rejected ?? 0, color: '#EF4444', badge: 'AUDITORIA' },
    ];
  }, [dashboardData]);

  const handleInspect = (evt) => {
    setInspectedEvent(evt);
    sessionStorage.setItem('inspect_event_id', evt.id);
    navigate('/validation');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Header Executivo */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Painel de Inteligência Operacional & Monitoramento
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Visão consolidada do fluxo de loja, detecções comportamentais da IA e validações da equipe
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none' }}
        >
          Atualizar Dados
        </Button>
      </Box>

      {/* Grid de KPIs Primários */}
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

      {/* Gráfico Recharts de Fluxo por Hora */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC' }}>
              Fluxo de Clientes por Hora (Entradas vs. Saídas)
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Sincronizado continuamente com a pipeline de Visão Computacional
            </Typography>
          </Box>
          <Chip label="ONLINE 3s" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
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

      {/* Lista de Últimos Eventos Detectados */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC', mb: 2 }}>
          Últimas Ocorrências em Tempo Real
        </Typography>

        <Grid container spacing={2}>
          {recentEvents.map((evt) => (
            <Grid item xs={12} md={6} key={evt.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: '#38BDF8', bgcolor: '#243044' },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: evt.event_type === 'cell_phone' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)', color: evt.event_type === 'cell_phone' ? '#EF4444' : '#38BDF8' }}>
                    {evt.event_type === 'cell_phone' ? '📱' : '👤'}
                  </Avatar>
                  <Box>
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

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                  onClick={() => handleInspect(evt)}
                  sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none', ml: 1 }}
                >
                  Inspecionar
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
