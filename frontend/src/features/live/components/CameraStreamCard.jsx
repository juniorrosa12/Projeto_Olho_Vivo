import React, { useEffect, useState, useRef } from 'react';
import { Paper, Box, Typography, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function CameraStreamCard({ camera, onFocus, isExpanded = false }) {
  const isOnline = camera.status === 'ONLINE';
  const [frameUrl, setFrameUrl] = useState('');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const getVideoSrc = () => {
    if (!camera.video) return null;
    if (camera.video.startsWith('http')) return camera.video;
    if (camera.video.startsWith('/videos/') || camera.video.startsWith('videos/')) {
      return camera.video.startsWith('/') ? camera.video : `/${camera.video}`;
    }
    if (camera.video.startsWith('/static/')) {
      return `${API}${camera.video}`;
    }
    return `${API}/static/${camera.video}`;
  };

  const videoSrc = getVideoSrc();

  // Polling do frame estático com endpoint dedicado no-cache
  useEffect(() => {
    if (videoSrc && !videoError) return;

    const updateFrame = () => {
      const timestamp = Date.now();
      const rawUrl = camera.snapshot && !camera.snapshot.includes('latest.jpg')
        ? camera.snapshot
        : '/live/frame';
      const fullUrl = rawUrl.startsWith('http')
        ? `${rawUrl}?t=${timestamp}`
        : `${API}${rawUrl}?t=${timestamp}`;
      setFrameUrl(fullUrl);
    };

    updateFrame();
    const interval = setInterval(updateFrame, 1000);
    return () => clearInterval(interval);
  }, [camera.snapshot, videoSrc, videoError]);

  // Garante autoPlay mudo no carregamento
  useEffect(() => {
    if (videoRef.current && videoSrc && !videoError) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => setVideoError(true));
        }
      });
    }
  }, [videoSrc, videoError]);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#0F172A',
        border: `1px solid ${camera.hasAlert ? (camera.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B') : '#1E293B'}`,
        borderRadius: isExpanded ? 3 : 2.5,
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
          px: 2,
          py: 1.2,
          bgcolor: '#0B1120',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
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
              height: 22,
              border: `1px solid ${isOnline ? '#10B981' : '#64748B'}`,
            }}
          />
          {!isExpanded && (
            <Tooltip title="Focar Câmera em Tela Cheia">
              <IconButton size="small" onClick={() => onFocus(camera.id)} sx={{ color: '#94A3B8' }}>
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Container de Vídeo */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#000000',
          height: isExpanded ? 480 : 220,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {videoSrc && !videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : frameUrl ? (
          <img
            src={frameUrl}
            alt={camera.name}
            onError={(e) => {
              // Tenta endpoint do stream estatico do backend
              e.target.src = `${API}/live/frame?t=${Date.now()}`;
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

      {/* Footer com Detecções Ativas e Estado da IA */}
      <Box sx={{ p: 1.5, bgcolor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
        </Stack>

        <Chip
          label="IA PROCESSANDO (30 FPS)"
          size="small"
          sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', fontWeight: 700, fontSize: '0.62rem' }}
        />
      </Box>
    </Paper>
  );
}
