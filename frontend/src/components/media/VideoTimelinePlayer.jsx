import React, { useEffect, useRef, useMemo } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Stack,
  Tooltip,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useVideoStore } from '../../infrastructure/stores/useVideoStore';
import { FrameStepperEngine } from '../../engine/video/FrameStepperEngine';

export default function VideoTimelinePlayer({ src }) {
  const videoRef = useRef(null);
  const {
    isPlaying,
    currentTime,
    duration,
    fps,
    playbackRate,
    isMuted,
    setPlaying,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    togglePlay,
    toggleMute,
  } = useVideoStore();

  const stepper = useMemo(() => new FrameStepperEngine(fps), [fps]);

  // Sincronização do HTML5 Video com o Zustand Store
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (_, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleStepFrame = (direction) => {
    if (!videoRef.current) return;
    setPlaying(false);
    const newTime =
      direction === 'next'
        ? stepper.getNextFrameTime(videoRef.current.currentTime)
        : stepper.getPrevFrameTime(videoRef.current.currentTime);

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const currentFrame = stepper.timeToFrame(currentTime);
  const totalFrames = stepper.timeToFrame(duration);

  if (!src) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: 2,
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Container de Vídeo com Aspect Ratio Mantido */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#000000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: 280,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlaying(false)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>

      {/* Linha do Tempo Scrubber */}
      <Box sx={{ px: 2, pt: 1, pb: 0 }}>
        <Slider
          size="small"
          value={currentTime}
          min={0}
          max={duration || 100}
          step={1 / fps}
          onChange={handleSeek}
          sx={{
            color: '#38BDF8',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(56, 189, 248, 0.16)',
              },
            },
            '& .MuiSlider-rail': {
              bgcolor: '#334155',
            },
          }}
        />
      </Box>

      {/* Barra de Controles de Playback & Stepping */}
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          pt: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Esquerda: Play/Pause, Step Back/Next, Rewind/Forward */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Recuar 1 Frame (Teclado: ,)">
            <IconButton size="small" onClick={() => handleStepFrame('prev')} sx={{ color: '#94A3B8' }}>
              <SkipPreviousIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}>
            <IconButton
              size="small"
              onClick={togglePlay}
              sx={{ bgcolor: '#38BDF8', color: '#0F172A', '&:hover': { bgcolor: '#0284C7' } }}
            >
              {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Avançar 1 Frame (Teclado: .)">
            <IconButton size="small" onClick={() => handleStepFrame('next')} sx={{ color: '#94A3B8' }}>
              <SkipNextIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Recuar 10s">
            <IconButton size="small" onClick={() => handleSeek(null, Math.max(0, currentTime - 10))} sx={{ color: '#64748B' }}>
              <Replay10Icon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Avançar 10s">
            <IconButton size="small" onClick={() => handleSeek(null, Math.min(duration, currentTime + 10))} sx={{ color: '#64748B' }}>
              <Forward10Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Centro: Contador de Frames e Timecode */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: '#38BDF8', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem' }}>
            {stepper.formatTimecode(currentTime)} / {stepper.formatTimecode(duration)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
            Frame: {currentFrame} / {totalFrames}
          </Typography>
        </Stack>

        {/* Direita: Velocidade de Reprodução, Som e Fullscreen */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Select
            size="small"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            sx={{
              height: 24,
              color: '#94A3B8',
              fontSize: '0.75rem',
              bgcolor: '#1E293B',
              '& .MuiSelect-select': { py: 0.2, px: 1 },
              '& fieldset': { borderColor: '#334155' },
            }}
          >
            <MenuItem value={0.25}>0.25x</MenuItem>
            <MenuItem value={0.5}>0.5x</MenuItem>
            <MenuItem value={1.0}>1.0x</MenuItem>
            <MenuItem value={2.0}>2.0x</MenuItem>
          </Select>

          <IconButton size="small" onClick={toggleMute} sx={{ color: '#94A3B8' }}>
            {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
          </IconButton>

          <IconButton
            size="small"
            onClick={() => videoRef.current?.requestFullscreen?.()}
            sx={{ color: '#94A3B8' }}
          >
            <FullscreenIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
}
