import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BugReportIcon from '@mui/icons-material/BugReport';
import SearchIcon from '@mui/icons-material/Search';

export default function NotificationCenterContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');

  const notifications = [
    { id: 'not-1', type: 'ALERT', title: 'Uso de Celular no Caixa', filial: 'RIUAL_027', camera: 'CAM01', time: 'Há 2 min', severity: 'WARNING' },
    { id: 'not-2', type: 'FAIL', title: 'Perda de Conexão com NVR #02', filial: 'RIUAL_084', camera: 'NVR-02', time: 'Há 15 min', severity: 'CRITICAL' },
    { id: 'not-3', type: 'AUDIT', title: 'Treinamento de Modelo YOLO Deploy v1.4', filial: 'GERAL', camera: 'SYSTEM', time: 'Há 1 hora', severity: 'INFO' },
  ];

  const filtered = notifications.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.filial.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Central Única de Notificações, Alertas e Auditoria (Sprint 40)
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Registro unificado de alertas, ocorrências de visão, falhas de infraestrutura e logs de auditoria
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
        <Tab icon={<NotificationsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Todos os Alertas" />
        <Tab icon={<WarningAmberIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Ocorrências da IA" />
        <Tab icon={<BugReportIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Falhas de Infraestrutura" />
      </Tabs>

      {/* Busca */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <TextField
          size="small"
          placeholder="Pesquisar por alerta, filial ou câmera..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 340, bgcolor: '#1E293B', borderRadius: 1.5, fieldset: { border: 'none' }, input: { color: '#F8FAFC' } }}
        />
      </Paper>

      {/* Tabela de Notificações */}
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#0B1120' }}>
            <TableRow>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Tipo</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Descrição da Notificação</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Filial / Origem</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Horário</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700 }}>Severidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((n) => (
              <TableRow key={n.id} sx={{ '&:hover': { bgcolor: '#1E293B' } }}>
                <TableCell sx={{ borderColor: '#1E293B' }}>
                  <Chip label={n.type} size="small" sx={{ bgcolor: '#1E293B', color: '#38BDF8', fontWeight: 700, fontSize: '0.65rem' }} />
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, borderColor: '#1E293B' }}>{n.title}</TableCell>
                <TableCell sx={{ color: '#CBD5E1', borderColor: '#1E293B' }}>{n.filial} • {n.camera}</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem', borderColor: '#1E293B' }}>{n.time}</TableCell>
                <TableCell align="center" sx={{ borderColor: '#1E293B' }}>
                  <Chip
                    label={n.severity}
                    size="small"
                    sx={{
                      bgcolor: n.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: n.severity === 'CRITICAL' ? '#FCA5A5' : '#FCD34D',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
