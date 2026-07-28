import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import TriageHeader from '../components/TriageHeader';
import TriageActionDock from '../components/TriageActionDock';
import ObjectInspectorSidebar from '../components/ObjectInspectorSidebar';
import HotkeyGuideModal from '../components/HotkeyGuideModal';
import EnhancedCanvasEngine from '../../../components/annotation/EnhancedCanvasEngine';
import VideoTimelinePlayer from '../../../components/media/VideoTimelinePlayer';
import { useAnnotationStore } from '../../../infrastructure/stores/useAnnotationStore';
import { useHotkeys } from '../../../hooks/useHotkeys';

export default function OlhoVivoStudioWorkspace({
  event,
  stats,
  loading,
  saving,
  saveError,
  onApprove,
  onReject,
  onSave,
  onNext,
  onPrev,
  apiHost = '',
}) {
  const { boxes, selectedId, selectBox, setBoxes } = useAnnotationStore();
  const [saveErrorMessage, setSaveErrorMessage] = useState(saveError || '');

  // Register keyboard shortcuts engine
  useHotkeys({
    onApprove,
    onReject,
    onNext,
    onPrev,
  });

  const imageUrl = event?.snapshot
    ? `${apiHost}${event.snapshot}?t=${event.id}`
    : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        bgcolor: '#020617',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. Header de Contexto Fino (Height: 48px) */}
      <TriageHeader event={event} stats={stats} />

      {/* 2. Área Central de Alta Densidade (Canvas + Sidebar) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Canvas Principal (80% da tela) */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 1.5,
            bgcolor: '#020617',
            position: 'relative',
          }}
        >
          {imageUrl ? (
            <EnhancedCanvasEngine
              image={imageUrl}
              boxes={boxes}
              selectedId={selectedId}
              onSelect={selectBox}
              onChange={setBoxes}
              onCommit={setBoxes}
            />
          ) : (
            <Alert severity="info" sx={{ bgcolor: '#0F172A', color: '#94A3B8', border: '1px solid #1E293B' }}>
              Carregando próximo evento da fila de triagem...
            </Alert>
          )}

          {/* Vídeo de Evidência com Linha do Tempo e Frame-a-Frame */}
          {event?.video && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <VideoTimelinePlayer src={`${apiHost}${event.video}?t=${event.id}`} />
            </Box>
          )}

          {saveErrorMessage && (
            <Alert
              severity="error"
              onClose={() => setSaveErrorMessage('')}
              sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}
            >
              {saveErrorMessage}
            </Alert>
          )}
        </Box>

        {/* Sidebar de Inspeção de Objetos e Metadados (Width: 320px) */}
        <ObjectInspectorSidebar event={event} />
      </Box>

      {/* 3. Dock Inferior de Ação Rápida (Height: 56px) */}
      <TriageActionDock
        onApprove={onApprove}
        onReject={onReject}
        onSave={onSave}
        onNext={onNext}
        onPrev={onPrev}
        loading={loading}
        saving={saving}
      />

      {/* 4. Modal de Guia de Teclas de Atalho */}
      <HotkeyGuideModal />
    </Box>
  );
}
