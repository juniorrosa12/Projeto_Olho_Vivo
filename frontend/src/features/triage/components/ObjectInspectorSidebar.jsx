import React from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useAnnotationStore } from '../../../infrastructure/stores/useAnnotationStore';
import { CLASS_CATALOG, getClassDefinition } from '../../../domain/annotation/ClassCatalog';

export default function ObjectInspectorSidebar({ event }) {
  const {
    boxes,
    selectedId,
    activeClass,
    selectBox,
    setActiveClass,
    updateSelectedClass,
    deleteBox,
    toggleLock,
    toggleVisibility,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useAnnotationStore();

  const handleClassClick = (classId) => {
    setActiveClass(classId);
    if (selectedId) {
      updateSelectedClass(classId);
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        bgcolor: '#0F172A',
        borderLeft: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#F8FAFC',
        overflow: 'hidden',
      }}
    >
      {/* Topo: Ações de Histórico (Undo / Redo) */}
      <Box sx={{ p: 1.5, borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8', letterSpacing: 0.5 }}>
          INSPEÇÃO DE OBJETOS ({boxes.length})
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Desfazer alteração (Ctrl + Z)">
            <span>
              <IconButton
                size="small"
                onClick={undo}
                disabled={undoStack.length === 0}
                sx={{ color: '#94A3B8', '&:hover': { color: '#F8FAFC', bgcolor: '#1E293B' } }}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Refazer alteração (Ctrl + Y)">
            <span>
              <IconButton
                size="small"
                onClick={redo}
                disabled={redoStack.length === 0}
                sx={{ color: '#94A3B8', '&:hover': { color: '#F8FAFC', bgcolor: '#1E293B' } }}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Meio Superior: Lista Hierárquica de Objetos (Camadas) */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
        {boxes.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
            Nenhum objeto detectado nesta cena.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {boxes.map((box, index) => {
              const classDef = getClassDefinition(box.class);
              const isSelected = box.id === selectedId;

              return (
                <Paper
                  key={box.id || index}
                  onClick={() => selectBox(box.id)}
                  elevation={0}
                  sx={{
                    p: 1.2,
                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#1E293B',
                    border: `1px solid ${isSelected ? '#38BDF8' : '#334155'}`,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { borderColor: '#38BDF8' },
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: classDef.color,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#F8FAFC' }}>
                        {classDef.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        #{index + 1}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.2} onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => toggleVisibility(box.id)} sx={{ color: '#64748B' }}>
                        {box.isHidden ? <VisibilityOffIcon fontSize="inherit" /> : <VisibilityIcon fontSize="inherit" />}
                      </IconButton>
                      <IconButton size="small" onClick={() => toggleLock(box.id)} sx={{ color: '#64748B' }}>
                        {box.isLocked ? <LockIcon fontSize="inherit" color="warning" /> : <LockOpenIcon fontSize="inherit" />}
                      </IconButton>
                      <IconButton size="small" onClick={() => deleteBox(box.id)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </Box>

                  {box.confidence && (
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                      Confiança IA: {(Number(box.confidence) * 100).toFixed(0)}%
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider sx={{ borderColor: '#1E293B' }} />

      {/* Meio Inferior: Seleção Rápida de Classes por Teclas de Atalho [1]-[6] */}
      <Box sx={{ p: 1.5, bgcolor: '#0B1120' }}>
        <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8', display: 'block', mb: 1, letterSpacing: 0.5 }}>
          CLASSE DO OBJETO (ATALHOS 1-6)
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
          {CLASS_CATALOG.map((c) => {
            const isCurrentClass = (selectedId && boxes.find((b) => b.id === selectedId)?.class === c.id) || activeClass === c.id;

            return (
              <Button
                key={c.id}
                size="small"
                onClick={() => handleClassClick(c.id)}
                sx={{
                  bgcolor: isCurrentClass ? c.color : '#1E293B',
                  color: isCurrentClass ? '#FFFFFF' : '#CBD5E1',
                  border: `1px solid ${isCurrentClass ? c.color : '#334155'}`,
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  px: 1,
                  py: 0.8,
                  fontSize: '0.75rem',
                  fontWeight: isCurrentClass ? 700 : 500,
                  '&:hover': { bgcolor: c.color, color: '#FFFFFF' },
                }}
              >
                <span>{c.label}</span>
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.3)',
                    px: 0.6,
                    py: 0.1,
                    borderRadius: 0.8,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  {c.key}
                </Box>
              </Button>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1E293B' }} />

      {/* Rodapé: Contexto e Metadados do Evento */}
      <Box sx={{ p: 1.5, bgcolor: '#0B1120' }}>
        <Typography variant="caption" fontWeight={700} sx={{ color: '#94A3B8', display: 'block', mb: 0.8 }}>
          METADADOS DO EVENTO
        </Typography>
        <Stack spacing={0.5} sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          <Box display="flex" justifyContent="space-between">
            <span>Filial:</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{event?.filial || 'RIUAL_027'}</span>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <span>Câmera:</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{event?.camera || 'CAM01'}</span>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <span>Track ID:</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{event?.track_id || '1'}</span>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <span>Horário:</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{event?.created_at || '12:43:05'}</span>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
