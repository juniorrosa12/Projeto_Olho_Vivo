import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function OperatorPerformanceTable({ operators = [] }) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: 2.5,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: '1px solid #1E293B' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC' }}>
          Métricas de Produtividade dos Operadores
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
          Desempenho individual em tempo real, velocidade de triagem e alinhamento de auditoria (IoU Score)
        </Typography>
      </Box>

      <TableContainer>
        <Table size="medium">
          <TableHead sx={{ bgcolor: '#0B1120' }}>
            <TableRow>
              <TableCell sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Operador</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Eventos Validados</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Aprovações</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Rejeições</TableCell>
              <TableCell align="center" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Tempo Médio / Evento</TableCell>
              <TableCell align="right" sx={{ color: '#94A3B8', fontWeight: 700, borderColor: '#1E293B' }}>Quality Score (IoU)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operators.map((op) => (
              <TableRow key={op.id} sx={{ '&:hover': { bgcolor: '#1E293B' }, transition: 'background-color 0.15s ease' }}>
                <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, borderColor: '#1E293B' }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#38BDF8', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {op.name.charAt(0)}
                    </Avatar>
                    <span>{op.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#F8FAFC', fontWeight: 700, borderColor: '#1E293B' }}>
                  {op.validated}
                </TableCell>
                <TableCell align="center" sx={{ color: '#10B981', fontWeight: 600, borderColor: '#1E293B' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <span>{op.approved}</span>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#EF4444', fontWeight: 600, borderColor: '#1E293B' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <CancelIcon sx={{ fontSize: 16 }} />
                    <span>{op.rejected}</span>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#38BDF8', fontWeight: 600, fontFamily: 'monospace', borderColor: '#1E293B' }}>
                  {op.avgTime}
                </TableCell>
                <TableCell align="right" sx={{ borderColor: '#1E293B' }}>
                  <Chip
                    label={op.qualityScore}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      color: '#6EE7B7',
                      fontWeight: 700,
                      border: '1px solid #10B981',
                      height: 22,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
