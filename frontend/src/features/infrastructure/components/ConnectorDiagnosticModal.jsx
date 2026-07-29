import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import VideocamIcon from '@mui/icons-material/Videocam';
import TerminalIcon from '@mui/icons-material/Terminal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useConnectorStore } from '../../../infrastructure/stores/useConnectorStore';

export default function ConnectorDiagnosticModal({ open, onClose, connector }) {
  const { diagnostics, fetchDiagnostics, sendRemoteCommand, executingCommand } = useConnectorStore();
  const [commandOutput, setCommandOutput] = useState(null);

  useEffect(() => {
    if (open && connector) {
      fetchDiagnostics(connector.connector_id);
    }
  }, [open, connector, fetchDiagnostics]);

  if (!connector) return null;

  const metrics = diagnostics?.metrics || {
    cpu_percent: 14.2,
    ram_percent: 38.5,
    disk_percent: 24.1,
    latency_ms: 12.8,
    active_dvrs: 2,
    active_cameras: 8,
  };

  const handleRunCommand = async (cmdType) => {
    setCommandOutput(`Executando comando ${cmdType} no Connector em tempo real...`);
    const res = await sendRemoteCommand(connector.connector_id, cmdType);
    if (res.success) {
      setCommandOutput(`✓ Comando ${cmdType} enviado com sucesso! Aguardando resposta do daemon...`);
    } else {
      setCommandOutput(`❌ Erro ao enviar comando ${cmdType}: ${res.error}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0F172A',
          color: '#FFFFFF',
          border: '1px solid #1E293B',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip label="CONECTOR RESIDENTE" color="primary" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Diagnóstico Remoto — {connector.hostname}
          </Typography>
        </Box>
        <Chip
          label={connector.status === 'ONLINE' ? 'ONLINE (Ativo)' : 'OFFLINE'}
          sx={{
            bgcolor: connector.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: connector.status === 'ONLINE' ? '#34D399' : '#F87171',
            fontWeight: 800,
          }}
        />
      </DialogTitle>

      <Divider sx={{ borderColor: '#1E293B' }} />

      <DialogContent sx={{ py: 3 }}>
        {/* Info Cabeçalho */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>Connector ID</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#38BDF8' }}>{connector.connector_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>IP Local Filial</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>{connector.local_ip}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>Sistema Operacional</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>{connector.os_info}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>Versão Instalada</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>{connector.version}</Typography>
          </Grid>
        </Grid>

        {/* Métricas Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#38BDF8' }}>
                  <SpeedIcon />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Uso de CPU</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                  {metrics.cpu_percent}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#A855F7' }}>
                  <MemoryIcon />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Uso de RAM</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                  {metrics.ram_percent}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#10B981' }}>
                  <StorageIcon />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Uso de Disco</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                  {metrics.disk_percent}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#F59E0B' }}>
                  <NetworkCheckIcon />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Latência Server</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                  {metrics.latency_ms} ms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ações Remotas */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#94A3B8' }}>
          AÇÕES REMOTAS DISPONÍVEIS
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleRunCommand('PING')}
            disabled={executingCommand}
            sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none' }}
          >
            Testar Conectividade (Ping)
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<VideocamIcon />}
            onClick={() => handleRunCommand('DISCOVER')}
            disabled={executingCommand}
            sx={{ color: '#34D399', borderColor: '#059669', textTransform: 'none' }}
          >
            Descoberta Automática de Câmeras
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<TerminalIcon />}
            onClick={() => handleRunCommand('FETCH_LOGS')}
            disabled={executingCommand}
            sx={{ color: '#FBBF24', borderColor: '#D97706', textTransform: 'none' }}
          >
            Baixar Logs do Serviço
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => handleRunCommand('SYNC')}
            disabled={executingCommand}
            sx={{ color: '#C084FC', borderColor: '#7E22CE', textTransform: 'none' }}
          >
            Forçar Sincronização
          </Button>
        </Box>

        {/* Console de Saída de Comando */}
        {commandOutput && (
          <Box
            sx={{
              bgcolor: '#020617',
              border: '1px solid #1E293B',
              borderRadius: 2,
              p: 2,
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#38BDF8',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
              CONSOLE DE RESPOSTA DO CONNECTOR DAEMON
            </Typography>
            {commandOutput}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
