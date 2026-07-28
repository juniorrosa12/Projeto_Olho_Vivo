import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
}

export default function ValidationPanel({
  event,
  annotations = [],
  selectedId,
  loading,
  saving,
  onSelect,
  onClassChange,
  onDelete,
  onSave,
  onApprove,
  onReject,
}) {
  if (!event) return <Paper sx={{ p: 4, borderRadius: 3 }}><Typography variant="h6">Nenhum evento pendente.</Typography></Paper>;

  const confidence = Number(((event.confidence || 0) * 100).toFixed(1));
  const details = [
    { label: "Tipo", value: event.event_type },
    { label: "Filial", value: event.filial_id },
    { label: "Câmera", value: event.camera_id },
    { label: "Track", value: event.track_id },
    { label: "Horário", value: formatDate(event.event_time) },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Stack spacing={2.5}>
        <Typography variant="h5" fontWeight={700}>Evento</Typography>
        <Chip label={event.event_type} color="info" sx={{ alignSelf: "flex-start" }} />

        <Stack spacing={1.5}>
          {details.map((item) => (
            <Box key={item.label}>
              <Typography variant="caption" color="text.secondary">{item.label}</Typography>
              <Typography fontWeight={600}>{item.value ?? "—"}</Typography>
            </Box>
          ))}
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary">Confiança</Typography>
          <LinearProgress variant="determinate" value={confidence} sx={{ mt: 1, mb: 1, height: 10, borderRadius: 5 }} />
          <Typography fontWeight={700}>{confidence}%</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={700}>Objetos detectados ({annotations.length})</Typography>
          <List dense disablePadding sx={{ mt: 1, maxHeight: 300, overflowY: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            {annotations.map((annotation, index) => (
              <ListItemButton
                key={annotation.id}
                selected={annotation.id === selectedId}
                onClick={() => onSelect?.(annotation.id)}
                sx={{ alignItems: "center", gap: 1, py: 1 }}
              >
                <Box sx={{ minWidth: 66, maxWidth: 100 }}>
                  <Typography variant="caption" color="text.secondary">ID</Typography>
                  <Typography variant="body2" fontWeight={700} noWrap title={String(annotation.id)}>{annotation.id}</Typography>
                </Box>
                <Select
                  size="small"
                  value={annotation.class}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => onClassChange?.(annotation.id, event.target.value)}
                  sx={{ flex: 1, minWidth: 0 }}
                  inputProps={{ "aria-label": `Classe do objeto ${index + 1}` }}
                >
                  <MenuItem value="person">Pessoa</MenuItem>
                  <MenuItem value="car">Carro</MenuItem>
                  <MenuItem value="motorcycle">Moto</MenuItem>
                  <MenuItem value="bicycle">Bicicleta</MenuItem>
                  <MenuItem value="bus">Ônibus</MenuItem>
                  <MenuItem value="truck">Caminhão</MenuItem>
                </Select>
                <Tooltip title="Excluir objeto">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(event) => { event.stopPropagation(); onDelete?.(annotation.id); }}
                    aria-label={`Excluir objeto ${index + 1}`}
                  ><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
            {!annotations.length && <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Nenhum objeto detectado.</Typography>}
          </List>
          <Button fullWidth sx={{ mt: 1.5 }} variant="outlined" startIcon={<SaveRoundedIcon />} onClick={onSave} disabled={loading || saving}>
            {saving ? "Salvando..." : "Salvar anotações"}
          </Button>
        </Box>

        <Button fullWidth size="large" variant="contained" color="success" startIcon={<CheckCircleRoundedIcon />} onClick={onApprove} disabled={loading || saving}>Aprovar</Button>
        <Button fullWidth size="large" variant="contained" color="error" startIcon={<CancelRoundedIcon />} onClick={onReject} disabled={loading || saving}>Rejeitar</Button>
      </Stack>
    </Paper>
  );
}
