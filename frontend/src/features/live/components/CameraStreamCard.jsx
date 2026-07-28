import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function CameraStreamCard({ camera, onFocus }) {
  const isOnline = camera.status === 'ONLINE';
  const [frameUrl, setFrameUrl] = useState('');

  const videoSrc = camera.video
    ? (camera.video.startsWith('http') || camera.video.startsWith('/')
        ? (camera.video.startsWith('http') ? camera.video : `${API}${camera.video}`)
        : `${API}/static/${camera.video}`)
    : null;

  // Atualização em Tempo Real do Frame de Imagem (Caso não seja vídeo MP4)
  useEffect(() => {
    if (videoSrc) return;

    const updateFrame = () => {
      const timestamp = Date.now();
      const rawUrl = camera.snapshot || '/static/output/latest.jpg';
      const fullUrl = rawUrl.startsWith('http')
        ? `${rawUrl}?t=${timestamp}`
        : `${API}${rawUrl}?t=${timestamp}`;
      setFrameUrl(fullUrl);
    };

    updateFrame();
    const interval = setInterval(updateFrame, 1000);
    return () => clearInterval(interval);
  }, [camera.snapshot, videoSrc]);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#0F172A',
        border: `1px solid ${camera.hasAlert ? (camera.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B') : '#1E293B'}`,
        borderRadius: 2.5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: camera.hasAlert ? `0 0 16px ${camera.severity === 'CRITICAL' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}` : 'none',
      }}
    >
      {/* Header da Câmera */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: '#0B1120',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <VideocamIcon sx={{ color: isOnline ? '#10B981' : '#64748B', fontSize: 18 }} />
          <Typography variant="body2" fontWeight={700} sx={{ color: '#F8FAFC' }}>
            {camera.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            ({camera.filial})
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={isOnline ? `LIVE ${camera.fps} FPS` : 'OFFLINE'}
            size="small"
            sx={{
              bgcolor: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
              color: isOnline ? '#6EE7B7' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 20,
              border: `1px solid ${isOnline ? '#10B981' : '#64748B'}`,
            }}
          />
          <Tooltip title="Focar Câmera em Tela Cheia">
            <IconButton size="small" onClick={() => onFocus(camera.id)} sx={{ color: '#94A3B8' }}>
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Container de Vídeo MP4 ou Stream de Imagens */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#000000',
          height: 220,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : frameUrl ? (
          <img
            src={frameUrl}
            alt={camera.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/vision/static/latest.jpg';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="caption" color="#64748B">
            Aguardando sinal RTSP...
          </Typography>
        )}

        {/* Banner de Alerta de Incidente */}
        {camera.hasAlert && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              bgcolor: camera.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.9)',
              color: '#FFFFFF',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backdropFilter: 'blur(4px)',
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={700}>
              {camera.alertMessage}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Detecções Ativas */}
      <Box sx={{ p: 1.2, bgcolor: '#0F172A', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Detecções:
        </Typography>
        {camera.activeDetections.map((det, idx) => (
          <Chip
            key={idx}
            label={det}
            size="small"
            sx={{
              bgcolor: '#1E293B',
              color: '#38BDF8',
              fontSize: '0.68rem',
              fontWeight: 600,
              height: 20,
              border: '1px solid #334155',
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}
