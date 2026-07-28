import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TuneIcon from '@mui/icons-material/Tune';
import { useSettingsStore } from '../../../infrastructure/stores/useSettingsStore';

export default function AISettingsContainer() {
  const {
    activeModelVersion,
    confidenceThreshold,
    iouThreshold,
    enableAutoRetrain,
    models,
    setActiveModelVersion,
    setConfidenceThreshold,
    setIouThreshold,
    toggleAutoRetrain,
  } = useSettingsStore();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#020617', minHeight: '100vh', color: '#F8FAFC' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
          Configurações de Inteligência Artificial & Modelos YOLO
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Gerenciamento de versões ativas da rede neural, parâmetros de incerteza do Active Learning e thresholds de detecção
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Lado Esquerdo: Versões dos Modelos */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PsychologyIcon sx={{ color: '#38BDF8' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Modelos de IA Cadastrados
              </Typography>
            </Box>

            <Stack spacing={2}>
              {models.map((model) => {
                const isActive = model.id === activeModelVersion;
                return (
                  <Paper
                    key={model.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: isActive ? 'rgba(56, 189, 248, 0.1)' : '#1E293B',
                      border: `1px solid ${isActive ? '#38BDF8' : '#334155'}`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {model.name}
                        </Typography>
                        <Chip
                          label={model.status}
                          size="small"
                          sx={{
                            bgcolor: isActive ? 'rgba(16, 185, 129, 0.15)' : '#334155',
                            color: isActive ? '#6EE7B7' : '#94A3B8',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            height: 20,
                          }}
                        />
                      </Stack>
                      <Typography variant="caption" color="#94A3B8">
                        mAP Score: {model.mAP} • Atualizado em {model.updated}
                      </Typography>
                    </Box>

                    {!isActive && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setActiveModelVersion(model.id)}
                        sx={{ color: '#38BDF8', borderColor: '#0284C7', textTransform: 'none' }}
                      >
                        Ativar Modelo
                      </Button>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Lado Direito: Parâmetros de Inferência */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid #1E293B', borderRadius: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TuneIcon sx={{ color: '#F59E0B' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Parâmetros de Inferência
              </Typography>
            </Box>

            <Box mb={3}>
              <Typography variant="caption" color="#94A3B8" display="block" mb={1}>
                Threshold de Confiança da IA: {Math.round(confidenceThreshold * 100)}%
              </Typography>
              <Slider
                value={confidenceThreshold}
                min={0.3}
                max={0.95}
                step={0.05}
                onChange={(_, val) => setConfidenceThreshold(val)}
                sx={{ color: '#38BDF8' }}
              />
            </Box>

            <Box mb={3}>
              <Typography variant="caption" color="#94A3B8" display="block" mb={1}>
                Threshold de Sobreposição (IoU): {Math.round(iouThreshold * 100)}%
              </Typography>
              <Slider
                value={iouThreshold}
                min={0.2}
                max={0.8}
                step={0.05}
                onChange={(_, val) => setIouThreshold(val)}
                sx={{ color: '#F59E0B' }}
              />
            </Box>

            <Divider sx={{ borderColor: '#1E293B', my: 2 }} />

            <FormControlLabel
              control={<Switch checked={enableAutoRetrain} onChange={toggleAutoRetrain} color="primary" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Re-treinamento Automático (Active Learning)
                  </Typography>
                  <Typography variant="caption" color="#94A3B8">
                    Agendar treino noturno quando houver mais de 1.000 amostras validadas
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
