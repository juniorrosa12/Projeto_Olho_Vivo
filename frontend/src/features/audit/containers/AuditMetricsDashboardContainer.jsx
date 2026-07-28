import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Stack,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SpeedIcon from '@mui/icons-material/Speed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';
import MetricKpiCard from '../components/MetricKpiCard';
import OperatorPerformanceTable from '../components/OperatorPerformanceTable';
import { useAuditStore } from '../../../infrastructure/stores/useAuditStore';

export default function AuditMetricsDashboardContainer() {
  const {
    dateRange,
    selectedFilial,
    metrics,
    operatorStats,
    setDateRange,
    setSelectedFilial,
  } = useAuditStore();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: '#020617',
        minHeight: '100vh',
        color: '#F8FAFC',
      }}
    >
      {/* 1. Header do Dashboard com Filtros Globais */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', letterSpacing: -0.5 }}>
            Painel de Auditoria e Inteligência Operacional
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Monitoramento de vazão de validação, acurácia de IA e métricas de desempenho por loja e operador
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={selectedFilial}
            onChange={(e) => setSelectedFilial(e.target.value)}
            sx={{
              bgcolor: '#0F172A',
              color: '#F8FAFC',
              borderColor: '#1E293B',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: '#1E293B' },
            }}
          >
            <MenuItem value="ALL">Todas as Filiais</MenuItem>
            <MenuItem value="RIUAL_027">Filial RIUAL_027</MenuItem>
            <MenuItem value="RIUAL_084">Filial RIUAL_084</MenuItem>
          </Select>

          <Select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{
              bgcolor: '#0F172A',
              color: '#F8FAFC',
              borderColor: '#1E293B',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: '#1E293B' },
            }}
          >
            <MenuItem value="today">Hoje</MenuItem>
            <MenuItem value="week">Últimos 7 Dias</MenuItem>
            <MenuItem value="month">Este Mês</MenuItem>
          </Select>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            sx={{
              color: '#38BDF8',
              borderColor: '#0284C7',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)' },
            }}
          >
            Atualizar
          </Button>
        </Stack>
      </Box>

      {/* 2. Grid de Cards KPI Primários */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricKpiCard
            title="Total Validados Hoje"
            value={metrics.totalValidatedToday.toLocaleString()}
            subtitle="vs. 1.240 ontem"
            trend="+14.5%"
            isPositiveTrend={true}
            icon={TaskAltIcon}
            color="#10B981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricKpiCard
            title="Tempo Médio por Evento"
            value={`${metrics.avgTimePerEventSeconds}s`}
            subtitle="vs. 1.7s semana passada"
            trend="-0.3s mais rápido"
            isPositiveTrend={true}
            icon={SpeedIcon}
            color="#38BDF8"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricKpiCard
            title="Acurácia Global da IA"
            value={`${metrics.aiAccuracyPercentage}%`}
            subtitle="Concordância Operador/IA"
            trend="+2.1%"
            isPositiveTrend={true}
            icon={PsychologyIcon}
            color="#8B5CF6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricKpiCard
            title="Taxa de Falsos Positivos"
            value={`${metrics.discrepancyRate}%`}
            subtitle="Eventos Rejeitados"
            trend="-1.2%"
            isPositiveTrend={true}
            icon={WarningAmberIcon}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* 3. Tabela de Desempenho dos Operadores */}
      <Box mb={4}>
        <OperatorPerformanceTable operators={operatorStats} />
      </Box>

      {/* 4. Resumo de Saúde do Active Learning */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 2.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC', mb: 1 }}>
          Status da Pipeline de Active Learning & Re-treinamento Contínuo
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
          Todas as aprovações e rejeições validadas pelos operadores nesta sessão estão pré-agrupadas para o próximo ciclo de treino automático do YOLOv11.
        </Typography>
        <Divider sx={{ borderColor: '#1E293B', mb: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between">
          <Box display="flex" gap={1.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
            <Typography variant="body2" color="#CBD5E1">
              Amostras Qualificadas para Treino: <strong>1.256 objetos</strong>
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#38BDF8' }} />
            <Typography variant="body2" color="#CBD5E1">
              Última Atualização dos Pesos da IA: <strong>Ontem às 22:00 (v1.4.2)</strong>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
