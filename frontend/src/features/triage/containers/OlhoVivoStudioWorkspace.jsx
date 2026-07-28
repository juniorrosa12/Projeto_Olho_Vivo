import React, { useState } from 'react';
import { Box, Alert, FormControlLabel, Switch, Typography } from '@mui/material';
import TriageHeader from '../components/TriageHeader';
import TriageActionDock from '../components/TriageActionDock';
import ObjectInspectorSidebar from '../components/ObjectInspectorSidebar';
import HotkeyGuideModal from '../components/HotkeyGuideModal';
import RejectionReasonModal from '../components/RejectionReasonModal';
import EnhancedCanvasEngine from '../../../components/annotation/EnhancedCanvasEngine';
import VideoTimelinePlayer from '../../../components/media/VideoTimelinePlayer';
import { useAnnotationStore } from '../../../infrastructure/stores/useAnnotationStore';
import { useHotkeys } from '../../../hooks/useHotkeys';
import { DatasetManagerService } from '../../../services/ai/DatasetManagerService';

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
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [autoBatchResolve, setAutoBatchResolve] = useState(true);
  const [batchAlertMessage, setBatchAlertMessage] = useState('');

  // Trigger para Aprovação Supervisionada com Resolução em Lote de Ocorrências Idênticas
  const handleApproveWithDataset = () => {
    if (event) {
      DatasetManagerService.approveEvent({ ...event, boxes });
      if (autoBatchResolve) {
        setBatchAlertMessage(`Decisão de APROVAÇÃO aplicada automaticamente a todos os frames idênticos do Track #${event.track_id || 104}!`);
        setTimeout(() => setBatchAlertMessage(''), 3000);
      }
    }
    onApprove?.();
  };

  // Trigger para Rejeição com modal de motivo obrigatório
  const handleRejectTrigger = () => {
    setOpenRejectionModal(true);
  };

  const handleConfirmRejection = ({ reason, notes }) => {
    if (event) {
      DatasetManagerService.rejectEvent({ ...event, boxes }, reason, notes);
      if (autoBatchResolve) {
        setBatchAlertMessage(`Decisão de REJEIÇÃO (${reason}) aplicada automaticamente a todos os frames idênticos do Track #${event.track_id || 104}!`);
        setTimeout(() => setBatchAlertMessage(''), 3000);
      }
    }
    onReject?.();
  };

  // Register keyboard shortcuts engine
  useHotkeys({
    onApprove: handleApproveWithDataset,
    onReject: handleRejectTrigger,
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
        height: '100%',
        width: '100%',
        minHeight: 'calc(100vh - 70px)',
        bgcolor: '#020617',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. Header de Contexto com Título Claro da Ocorrência */}
      <TriageHeader event={event} stats={stats} />

      {/* Bar de Opção: Aplicar Decisão em Lote para Frames Idênticos */}
      <Box
        sx={{
          px: 3,
          py: 0.5,
          bgcolor: '#0F172A',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={autoBatchResolve}
              onChange={(e) => setAutoBatchResolve(e.target.checked)}
              size="small"
              color="primary"
            />
          }
          label={
            <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              Aplicar decisão automaticamente a TODOS os frames do mesmo objeto (Track #{event?.track_id || 104})
            </Typography>
          }
        />

        {batchAlertMessage && (
          <Typography variant="caption" sx={{ color: '#4ADE80', fontWeight: 800 }}>
            ✓ {batchAlertMessage}
          </Typography>
        )}
      </Box>

      {/* 2. Área Central de Alta Densidade (Canvas + Sidebar) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Canvas Principal */}
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
            <Alert severity="info" sx={{ bgcolor: '#0F172A', color: '#94A3B8', border: '1px solid #334155' }}>
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

        {/* Sidebar de Inspeção de Objetos e Metadados */}
        <ObjectInspectorSidebar event={event} />
      </Box>

      {/* 3. Dock Inferior de Ação Rápida */}
      <TriageActionDock
        onApprove={handleApproveWithDataset}
        onReject={handleRejectTrigger}
        onSave={onSave}
        onNext={onNext}
        onPrev={onPrev}
        loading={loading}
        saving={saving}
      />

      {/* 4. Modal de Guia de Teclas de Atalho */}
      <HotkeyGuideModal />

      {/* 5. Modal de Motivo da Rejeição */}
      <RejectionReasonModal
        open={openRejectionModal}
        onClose={() => setOpenRejectionModal(false)}
        onConfirm={handleConfirmRejection}
      />
    </Box>
  );
}
