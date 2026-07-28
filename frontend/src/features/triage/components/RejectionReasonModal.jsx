import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { DatasetManagerService } from '../../../services/ai/DatasetManagerService';

export default function RejectionReasonModal({ open, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('Falso positivo');
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm?.({ reason: selectedReason, notes });
    setSelectedReason('Falso positivo');
    setNotes('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid #1E293B', borderRadius: 3 },
      }}
    >
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #1E293B">
        <Box display="flex" alignItems="center" gap={1}>
          <ReportProblemIcon sx={{ color: '#EF4444' }} />
          <Typography variant="h6" fontWeight={700}>
            Motivo da Rejeição do Evento
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2.5 }}>
        <Typography variant="caption" color="#94A3B8" display="block" mb={2}>
          Selecione obrigatoriamente a justificativa para alimentar o repositório de rejeitados no Active Learning:
        </Typography>

        <RadioGroup value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
          {DatasetManagerService.rejectionReasons.map((reason) => (
            <FormControlLabel
              key={reason}
              value={reason}
              control={<Radio size="small" sx={{ color: '#38BDF8', '&.Mui-checked': { color: '#EF4444' } }} />}
              label={<Typography variant="body2">{reason}</Typography>}
            />
          ))}
        </RadioGroup>

        <TextField
          multiline
          rows={2}
          fullWidth
          size="small"
          placeholder="Observações adicionais para a equipe de IA..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2, bgcolor: '#1E293B', borderRadius: 1.5, fieldset: { borderColor: '#334155' }, input: { color: '#F8FAFC' } }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8', textTransform: 'none' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ bgcolor: '#EF4444', color: '#FFFFFF', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#DC2626' } }}
        >
          Confirmar Rejeição
        </Button>
      </DialogActions>
    </Dialog>
  );
}
