import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Stack,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEventLogStore } from '../../../infrastructure/stores/useEventLogStore';

export default function GlobalEventsContainer() {
  const {
    searchQuery,
    selectedSeverity,
    selectedFilial,
    eventLogs,
    setSearchQuery,
    setSelectedSeverity,
    setSelectedFilial,
  } = useEventLogStore();

  const filteredLogs = eventLogs.filter((log) => {
    const matchesSearch =
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesFilial = selectedFilial === 'ALL' || log.filial === selectedFilial;
    return matchesSearch && matchesSeverity && matchesFilial;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Central de Eventos e Histórico de Ocorrências
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Registro global de eventos detectados por IA e validados por operadores em todas as lojas
        </Typography>
      </Box>

      {/* Barra de Filtros e Busca */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <TextField
            size="small"
            placeholder="Buscar evento por ID ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 320 },
              bgcolor: '#1E293B',
              borderRadius: 1.5,
              '& fieldset': { border: 'none' },
              input: { color: '#F8FAFC', fontSize: '0.85rem' },
            }}
          />

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Select
              size="small"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              sx={{
                bgcolor: '#1E293B',
                color: '#F8FAFC',
                fontSize: '0.85rem',
                '& fieldset': { borderColor: '#334155' },
              }}
            >
              <MenuItem value="ALL">Todas as Severidades</MenuItem>
              <MenuItem value="CRITICAL">Crítico</MenuItem>
              <MenuItem value="WARNING">Aviso</MenuItem>
              <MenuItem value="INFO">Informativo</MenuItem>
            </Select>

            <Select
              size="small"
              value={selectedFilial}
              onChange={(e) => setSelectedFilial(e.target.value)}
              sx={{
                bgcolor: '#1E293B',
                color: '#F8FAFC',
                fontSize: '0.85rem',
                '& fieldset': { borderColor: '#334155' },
              }}
            >
              <MenuItem value="ALL">Todas as Filiais</MenuItem>
              <MenuItem value="RIUAL_027">Filial RIUAL_027</MenuItem>
              <MenuItem value="RIUAL_084">Filial RIUAL_084</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </Paper>

      {/* Tabela de Eventos */}
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#0B1120' }}>
            <TableRow>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>ID do Evento</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Tipo de Ocorrência</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Filial / Câmera</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Horário</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Confiança IA</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} sx={{ '&:hover': { bgcolor: '#1E293B' } }}>
                <TableCell sx={{ color: '#38BDF8', fontWeight: 700, fontFamily: 'monospace', borderColor: '#1E293B' }}>
                  {log.id}
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, borderColor: '#1E293B' }}>
                  {log.type}
                </TableCell>
                <TableCell sx={{ color: '#CBD5E1', borderColor: '#1E293B' }}>
                  {log.filial} • {log.camera}
                </TableCell>
                <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem', borderColor: '#1E293B' }}>
                  {log.timestamp}
                </TableCell>
                <TableCell align="center" sx={{ color: '#38BDF8', fontWeight: 600, borderColor: '#1E293B' }}>
                  {log.confidence}
                </TableCell>
                <TableCell align="center" sx={{ borderColor: '#1E293B' }}>
                  <Chip
                    label={log.status}
                    size="small"
                    sx={{
                      bgcolor: log.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : log.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: log.status === 'APPROVED' ? '#6EE7B7' : log.status === 'REJECTED' ? '#FCA5A5' : '#FCD34D',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ borderColor: '#1E293B' }}>
                  <Button size="small" startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />} sx={{ color: '#38BDF8', textTransform: 'none' }}>
                    Inspecionar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
