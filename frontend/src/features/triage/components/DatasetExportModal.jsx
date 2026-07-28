import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Stack,
  Alert,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CodeIcon from '@mui/icons-material/Code';
import { convertToYOLO, generateYOLOClassesFile } from '../../../services/formatters/yoloExporter';
import { convertToCOCO } from '../../../services/formatters/cocoExporter';
import { useAnnotationStore } from '../../../infrastructure/stores/useAnnotationStore';

export default function DatasetExportModal({ open, onClose, event }) {
  const { boxes } = useAnnotationStore();
  const [format, setFormat] = useState('YOLO');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const downloadFile = (filename, content, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (format === 'YOLO') {
      const yoloContent = convertToYOLO(boxes);
      const classesContent = generateYOLOClassesFile();
      
      const fileName = event?.id ? `event_${event.id}_annotation.txt` : 'yolo_annotations.txt';
      downloadFile(fileName, yoloContent);
      downloadFile('classes.txt', classesContent);
    } else {
      const cocoData = convertToCOCO([{ ...event, boxes }]);
      const cocoContent = JSON.stringify(cocoData, null, 2);
      const fileName = event?.id ? `coco_dataset_event_${event.id}.json` : 'coco_dataset.json';
      downloadFile(fileName, cocoContent, 'application/json');
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid #1E293B',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #1E293B">
        <Box display="flex" alignItems="center" gap={1}>
          <FileDownloadIcon sx={{ color: '#38BDF8' }} />
          <Typography variant="h6" fontWeight={700}>
            Exportar Dataset Validador
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body2" color="#94A3B8" mb={2}>
          Selecione o formato de exportação das anotações validadas para alimentá-las no ciclo de Active Learning:
        </Typography>

        <RadioGroup value={format} onChange={(e) => setFormat(e.target.value)}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 1.5,
              bgcolor: format === 'YOLO' ? 'rgba(56, 189, 248, 0.1)' : '#1E293B',
              border: `1px solid ${format === 'YOLO' ? '#38BDF8' : '#334155'}`,
              borderRadius: 2,
              cursor: 'pointer',
            }}
            onClick={() => setFormat('YOLO')}
          >
            <FormControlLabel
              value="YOLO"
              control={<Radio sx={{ color: '#38BDF8', '&.Mui-checked': { color: '#38BDF8' } }} />}
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Formato YOLO (.txt + classes.txt)
                  </Typography>
                  <Typography variant="caption" color="#94A3B8">
                    Coordenadas normalizadas [class_id x_center y_center w h]
                  </Typography>
                </Box>
              }
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: format === 'COCO' ? 'rgba(56, 189, 248, 0.1)' : '#1E293B',
              border: `1px solid ${format === 'COCO' ? '#38BDF8' : '#334155'}`,
              borderRadius: 2,
              cursor: 'pointer',
            }}
            onClick={() => setFormat('COCO')}
          >
            <FormControlLabel
              value="COCO"
              control={<Radio sx={{ color: '#38BDF8', '&.Mui-checked': { color: '#38BDF8' } }} />}
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Formato COCO JSON (.json)
                  </Typography>
                  <Typography variant="caption" color="#94A3B8">
                    Especificação padrão COCO com categorias e imagens
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </RadioGroup>

        {downloadSuccess && (
          <Alert severity="success" sx={{ mt: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: '1px solid #10B981' }}>
            Arquivo de dataset gerado com sucesso!
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8', textTransform: 'none' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          startIcon={<FileDownloadIcon />}
          sx={{
            bgcolor: '#38BDF8',
            color: '#0F172A',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#0284C7' },
          }}
        >
          Baixar Dataset ({boxes.length} objetos)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
