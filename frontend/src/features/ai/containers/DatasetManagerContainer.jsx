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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StorageIcon from '@mui/icons-material/Storage';
import { DatasetManagerService } from '../../../services/ai/DatasetManagerService';

export default function DatasetManagerContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const [exportFormat, setExportFormat] = useState('YOLO');
  const stats = DatasetManagerService.getDatasetStats();

  const handleExport = () => {
    const exported = DatasetManagerService.exportDataset(exportFormat);
    const blob = new Blob([exported.content], { type: exported.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exported.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', color: '#F8FAFC' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Dataset Manager (Aprendizado Supervisionado)
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Repositório de eventos validados para treinamento supervisionado da rede neural
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            sx={{ bgcolor: '#0F172A', color: '#F8FAFC', fieldset: { borderColor: '#1E293B' }, fontSize: '0.85rem' }}
          >
            <MenuItem value="YOLO">Formato YOLO (.txt)</MenuItem>
            <MenuItem value="COCO">Formato COCO (.json)</MenuItem>
            <MenuItem value="VOC">Formato Pascal VOC (.xml)</MenuItem>
            <MenuItem value="CSV">Formato CSV (.csv)</MenuItem>
          </Select>

          <Button
            variant="contained"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 700, textTransform: 'none' }}
          >
            Exportar Dataset
          </Button>
        </Stack>
      </Box>

      {/* Cards de Métricas do Dataset */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Typography variant="caption" color="#94A3B8" fontWeight={700}>
              Aprovados no Dataset
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#10B981" my={1}>
              {stats.totalApproved}
            </Typography>
            <Typography variant="caption" color="#64748B">Prontos para treino</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Typography variant="caption" color="#94A3B8" fontWeight={700}>
              Rejeitados (Falsos Positivos)
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#EF4444" my={1}>
              {stats.totalRejected}
            </Typography>
            <Typography variant="caption" color="#64748B">Amostras negativas</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Typography variant="caption" color="#94A3B8" fontWeight={700}>
              Total de Bounding Boxes
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#38BDF8" my={1}>
              {Object.values(stats.classCounts).reduce((a, b) => a + b, 0)}
            </Typography>
            <Typography variant="caption" color="#64748B">Anotações rotuladas</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Typography variant="caption" color="#94A3B8" fontWeight={700}>
              Score de Balanceamento
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#F59E0B" my={1}>
              {stats.balanceScore}
            </Typography>
            <Typography variant="caption" color="#64748B">Distribuição equilibrada</Typography>
          </Paper>
        </Grid>
      </Grid>

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
        <Tab icon={<CheckCircleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Eventos Aprovados (dataset/aprovados)" />
        <Tab icon={<CancelIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Eventos Rejeitados (dataset/rejeitados)" />
      </Tabs>

      {/* Tabela de Aprovados */}
      {activeTab === 0 && (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#0B1120' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Hash do Evento</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Filial / Câmera</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Operador Responsável</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Classes Rotuladas</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Modelo / Versão</TableCell>
                <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DatasetManagerService.approvedDataset.map((item) => (
                <TableRow key={item.hash} sx={{ '&:hover': { bgcolor: '#1E293B' } }}>
                  <TableCell sx={{ color: '#38BDF8', fontFamily: 'monospace', fontWeight: 700, borderColor: '#1E293B' }}>{item.hash}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1', borderColor: '#1E293B' }}>{item.filial} • {item.camera}</TableCell>
                  <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, borderColor: '#1E293B' }}>{item.operator}</TableCell>
                  <TableCell sx={{ borderColor: '#1E293B' }}>
                    <Stack direction="row" spacing={0.5}>
                      {item.boxes?.map((b, idx) => (
                        <Chip key={idx} label={b.class} size="small" sx={{ bgcolor: '#1E293B', color: '#6EE7B7', fontSize: '0.65rem' }} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem', borderColor: '#1E293B' }}>{item.modelName} ({item.modelVersion})</TableCell>
                  <TableCell align="center" sx={{ borderColor: '#1E293B' }}>
                    <Chip label="APROVADO" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tabela de Rejeitados */}
      {activeTab === 1 && (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#0B1120' }}>
              <TableRow>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Hash do Evento</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Filial / Câmera</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Motivo da Rejeição</TableCell>
                <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Observações do Operador</TableCell>
                <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DatasetManagerService.rejectedDataset.map((item) => (
                <TableRow key={item.hash} sx={{ '&:hover': { bgcolor: '#1E293B' } }}>
                  <TableCell sx={{ color: '#EF4444', fontFamily: 'monospace', fontWeight: 700, borderColor: '#1E293B' }}>{item.hash}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1', borderColor: '#1E293B' }}>{item.filial} • {item.camera}</TableCell>
                  <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, borderColor: '#1E293B' }}>
                    <Chip label={item.rejectionReason} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#FCA5A5', fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem', borderColor: '#1E293B' }}>{item.rejectionNotes || 'Sem observações'}</TableCell>
                  <TableCell align="center" sx={{ borderColor: '#1E293B' }}>
                    <Chip label="REJEITADO" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
