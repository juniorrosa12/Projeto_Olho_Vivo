import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ComputerIcon from '@mui/icons-material/Computer';
import { useConnectorStore } from '../../../infrastructure/stores/useConnectorStore';
import ConnectorDiagnosticModal from '../components/ConnectorDiagnosticModal';

export default function ConnectorManagementContainer({ branchId }) {
  const { connectors, fetchConnectors, loading } = useConnectorStore();
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchConnectors(branchId);
  }, [branchId, fetchConnectors]);

  const handleOpenDiagnostics = (connector) => {
    setSelectedConnector(connector);
    setModalOpen(true);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Banner / Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#F8FAFC' }}>
            Olho Vivo Connectors (Edge Infrastructure)
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Serviços residentes de borda responsáveis por conectar DVRs, NVRs e Câmeras da filial ao servidor
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchConnectors(branchId)}
          disabled={loading}
          sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none' }}
        >
          Atualizar Connectors
        </Button>
      </Box>

      {/* Cards Resumo */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                }}
              >
                <ComputerIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                  CONNECTORS ATIVOS
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#F8FAFC' }}>
                  {connectors.filter((c) => c.status === 'ONLINE').length} / {connectors.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                }}
              >
                <NetworkCheckIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                  DISPOSITIVOS DESCOBERTOS
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#F8FAFC' }}>
                  2 DVRs | 8 Câmeras IP
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(168, 85, 247, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC',
                }}
              >
                <SpeedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                  MÉDIA DE LATÊNCIA (HEARTBEAT)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#F8FAFC' }}>
                  14.2 ms
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Connectors */}
      <TableContainer component={Paper} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1E293B' }}>
            <TableRow>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Connector ID / Hostname</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Filial / IP Local</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Sistema Operacional</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Versão</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Status / Heartbeat</TableCell>
              <TableCell align="right" sx={{ color: '#94A3B8', fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connectors.map((c) => (
              <TableRow key={c.id || c.connector_id} hover sx={{ '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.5)' } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#38BDF8' }}>
                    {c.hostname}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {c.connector_id}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                    {c.branch_id}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    {c.local_ip}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                    {c.os_info}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {c.cpu_info}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip label={c.version || 'v1.0.0'} size="small" variant="outlined" sx={{ color: '#94A3B8', borderColor: '#334155' }} />
                </TableCell>

                <TableCell>
                  <Chip
                    label={c.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                    size="small"
                    sx={{
                      bgcolor: c.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: c.status === 'ONLINE' ? '#34D399' : '#F87171',
                      fontWeight: 800,
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Há 12 seg
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Executar Diagnóstico Remoto e Comandos">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AssessmentIcon />}
                      onClick={() => handleOpenDiagnostics(c)}
                      sx={{
                        bgcolor: '#3B82F6',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#2563EB' },
                      }}
                    >
                      Diagnóstico Remoto
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Diagnóstico */}
      <ConnectorDiagnosticModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        connector={selectedConnector}
      />
    </Box>
  );
}
