import React, { useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';

export default function HeatmapOverlayCanvas({
  imageSrc,
  densityPoints = [],
  opacity = 0.6,
  blur = 15,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redesenha os pontos de calor no Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    densityPoints.forEach((point) => {
      const radius = blur * 3;
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);

      gradient.addColorStop(0, `rgba(239, 68, 68, ${point.val * opacity})`); // Vermelho (Alta Densidade)
      gradient.addColorStop(0.4, `rgba(245, 158, 11, ${point.val * opacity * 0.8})`); // Amarelo (Média)
      gradient.addColorStop(0.8, `rgba(56, 189, 248, ${point.val * opacity * 0.4})`); // Azul (Baixa)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [densityPoints, opacity, blur]);

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        position: 'relative',
        width: '100%',
        height: 480,
        bgcolor: '#000000',
        borderRadius: 2.5,
        overflow: 'hidden',
        border: '1px solid #1E293B',
      }}
    >
      {/* Imagem de Fundo do Caixa/Corredor */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Heatmap Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Camada Canvas Vetorial do Mapa de Calor em Overlay */}
      <canvas
        ref={canvasRef}
        width={800}
        height={480}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Paper>
  );
}
