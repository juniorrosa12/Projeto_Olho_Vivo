import React from 'react';
import { Grid, Paper, Box, Typography, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function PeopleCountingCardGroup({ stats }) {
  const cards = [
    { title: 'Total de Entradas', value: stats.totalEntries.toLocaleString(), icon: LoginIcon, color: '#10B981', subtitle: 'Registradas hoje' },
    { title: 'Total de Saídas', value: stats.totalExits.toLocaleString(), icon: LogoutIcon, color: '#F59E0B', subtitle: 'Registradas hoje' },
    { title: 'Ocupação Atual', value: stats.currentOccupancy.toLocaleString(), icon: GroupsIcon, color: '#38BDF8', subtitle: 'Pessoas na loja agora' },
    { title: 'Horário de Pico', value: stats.peakHour, icon: AccessTimeIcon, color: '#8B5CF6', subtitle: 'Maior densidade de fluxo' },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: 2.5,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8' }}>
                  {card.title}
                </Typography>
                <Box sx={{ bgcolor: `${card.color}18`, color: card.color, p: 0.8, borderRadius: 1.5 }}>
                  <Icon fontSize="small" />
                </Box>
              </Box>

              <Typography variant="h5" fontWeight={700} sx={{ color: '#F8FAFC', mb: 0.5 }}>
                {card.value}
              </Typography>

              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {card.subtitle}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
