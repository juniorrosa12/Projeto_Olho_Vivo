import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublishIcon from '@mui/icons-material/Publish';
import RestoreIcon from '@mui/icons-material/Restore';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ModelManagerService } from '../../../services/ai/ModelManagerService';

export default function TrainingCenterContainer() {
  const [models, setModels] = useState(ModelManagerService.getModels());
  const [candidateModel, setCandidateModel] = useState({
    id: 'yolo11s-v1.5-cand',
    name: 'YOLOv11 Small Varejo (Candidato v1.5)',
    version: 'v1.5-candidate',
    datasetCount: '2.480 imagens (1.250 validadas)',
    precision: '94.8%',
    recall: '92.1%',
    mAP50: '93.5%',
    mAP50_95: '78.2%',
    f1Score: '93.4%',
    status: 'CANDIDATE_TESTED',
  });

  const [deployedAlert, setDeployedAlert] = useState(false);

  const activeModel = models.find((m) => m.status === 'ACTIVE') || models[0];

  const handleDeployCandidate = () => {
    // Aprovação explícita do Administrador (Regra de Segurança Sprint 51)
    const newModels = models.map((m) => {
      if (m.id === candidateModel.id) return { ...m, status: 'ACTIVE' };
      return { ...m, status: 'STANDBY' };
    });
    setModels(newModels);
    setDeployedAlert('Novo modelo v1.5 aprovado pelo Administrador e implantado em produção com sucesso!');
    setTimeout(() => setDeployedAlert(false), 3000);
  };

  const handleRollback = (modelId) => {
    ModelManagerService.rollbackToVersion(modelId);
    setModels(ModelManagerService.getModels());
    setDeployedAlert(`Rollback imediato executado para a versão ${modelId}!`);
    setTimeout(() => setDeployedAlert(false), 3000);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', color: '#F8FAFC' }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Centro de Treinamento Supervisionado & Model Registry (Sprint 51)
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Pipeline de treinamento supervisionado com validação por administrador, comparação de mAP e rollback imediato
        </Typography>
      </Box>

      {deployedAlert && (
        <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: '1px solid #10B981' }}>
          {deployedAlert}
        </Alert>
      )}

      {/* Pipeline de Treinamento Supervisionado (Fluxo Obrigatório) */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#38BDF8', mb: 2 }}>
          PIPELINE DE TREINAMENTO SUPERVISIONADO
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center" justifyContent="space-between">
          {['1. Validação Operador', '2. Dataset Repositório', '3. Revisão Admin', '4. Treinamento GPU', '5. Validação Candidato', '6. Comparação mAP', '7. Publicação Admin'].map(
            (step, idx) => (
              <Chip
                key={idx}
                label={step}
                sx={{
                  bgcolor: idx === 5 ? 'rgba(56, 189, 248, 0.2)' : idx === 6 ? 'rgba(245, 158, 11, 0.2)' : '#1E293B',
                  color: idx === 5 ? '#38BDF8' : idx === 6 ? '#FCD34D' : '#CBD5E1',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  py: 0.5,
                }}
              />
            )
          )}
        </Stack>
      </Paper>

      {/* Comparação de Métricas: Modelo Ativo vs Modelo Candidato */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CompareArrowsIcon sx={{ color: '#F59E0B' }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Comparação Automática de Métricas de Desempenho
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="small"
            startIcon={<PublishIcon />}
            onClick={handleDeployCandidate}
            sx={{ bgcolor: '#10B981', color: '#FFFFFF', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
          >
            Aprovar & Implantar Modelo Candidato v1.5
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1E293B', border: '1px solid #334155', borderRadius: 2 }}>
              <Typography variant="caption" color="#94A3B8" fontWeight={700}>MODELO EM PRODUÇÃO ATUAL</Typography>
              <Typography variant="h6" fontWeight={700} color="#F8FAFC" my={0.5}>{activeModel.name}</Typography>
              <Typography variant="caption" color="#64748B" display="block" mb={2}>Versão: {activeModel.version} • Implantado em: {activeModel.deployedAt}</Typography>

              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">Precision:</Typography><Typography variant="caption" fontWeight={700}>92.4%</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">Recall:</Typography><Typography variant="caption" fontWeight={700}>88.9%</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">mAP@50:</Typography><Typography variant="caption" fontWeight={700} color="#38BDF8">{activeModel.mAP}</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">F1-Score:</Typography><Typography variant="caption" fontWeight={700}>90.6%</Typography></Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="#6EE7B7" fontWeight={700}>NOVO MODELO CANDIDATO (SUPERVISIONADO)</Typography>
                <Chip label="+4.1% mAP" size="small" sx={{ bgcolor: '#10B981', color: '#FFFFFF', fontWeight: 700, height: 20 }} />
              </Stack>
              <Typography variant="h6" fontWeight={700} color="#F8FAFC" my={0.5}>{candidateModel.name}</Typography>
              <Typography variant="caption" color="#94A3B8" display="block" mb={2}>Dataset: {candidateModel.datasetCount}</Typography>

              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">Precision:</Typography><Typography variant="caption" fontWeight={700} color="#6EE7B7">{candidateModel.precision} (↑ +2.4%)</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">Recall:</Typography><Typography variant="caption" fontWeight={700} color="#6EE7B7">{candidateModel.recall} (↑ +3.2%)</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">mAP@50:</Typography><Typography variant="caption" fontWeight={700} color="#6EE7B7">{candidateModel.mAP50} (↑ +4.1%)</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography variant="caption" color="#94A3B8">F1-Score:</Typography><Typography variant="caption" fontWeight={700} color="#6EE7B7">{candidateModel.f1Score} (↑ +2.8%)</Typography></Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Model Registry & Rollback Table */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC', mb: 2 }}>
        Model Registry (Histórico de Versões & Rollback Imediato)
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#0B1120' }}>
            <TableRow>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Nome do Modelo</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Versão</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>mAP Score</TableCell>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>Data Deploy</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#94A3B8', fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((model) => {
              const isActive = model.status === 'ACTIVE';
              return (
                <TableRow key={model.id} sx={{ '&:hover': { bgcolor: '#1E293B' } }}>
                  <TableCell sx={{ color: '#F8FAFC', fontWeight: 700, borderColor: '#1E293B' }}>{model.name}</TableCell>
                  <TableCell sx={{ color: '#38BDF8', fontFamily: 'monospace', borderColor: '#1E293B' }}>{model.version}</TableCell>
                  <TableCell sx={{ color: '#6EE7B7', fontWeight: 700, borderColor: '#1E293B' }}>{model.mAP}</TableCell>
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.8rem', borderColor: '#1E293B' }}>{model.deployedAt}</TableCell>
                  <TableCell align="center" sx={{ borderColor: '#1E293B' }}>
                    <Chip
                      label={model.status}
                      size="small"
                      sx={{
                        bgcolor: isActive ? 'rgba(16, 185, 129, 0.15)' : '#1E293B',
                        color: isActive ? '#6EE7B7' : '#94A3B8',
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderColor: '#1E293B' }}>
                    {!isActive && (
                      <Button
                        size="small"
                        startIcon={<RestoreIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleRollback(model.id)}
                        sx={{ color: '#F59E0B', textTransform: 'none' }}
                      >
                        Rollback Imediato
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
