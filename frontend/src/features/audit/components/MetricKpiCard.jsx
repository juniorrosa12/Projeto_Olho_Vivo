import React from 'react';
import { Paper, Box, Typography, Chip, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function MetricKpiCard({ title, value, subtitle, trend, isPositiveTrend = true, icon: Icon, color = '#38BDF8' }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        bgcolor: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: 2.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Typography variant="body2" fontWeight={600} sx={{ color: '#94A3B8' }}>
          {title}
        </Typography>
        {Icon && (
          <Box
            sx={{
              bgcolor: `${color}18`,
              color: color,
              p: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="small" />
          </Box>
        )}
      </Box>

      <Typography variant="h4" fontWeight={700} sx={{ color: '#F8FAFC', mb: 1, letterSpacing: -0.5 }}>
        {value}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        {trend && (
          <Chip
            size="small"
            icon={isPositiveTrend ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
            label={trend}
            sx={{
              bgcolor: isPositiveTrend ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isPositiveTrend ? '#6EE7B7' : '#FCA5A5',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 20,
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        )}
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          {subtitle}
        </Typography>
      </Stack>
    </Paper>
  );
}
