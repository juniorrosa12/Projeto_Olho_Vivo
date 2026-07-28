import {
  Box,
  Button,
  Chip,
  Divider,
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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { getObjectClass, OBJECT_CLASSES } from "../annotation/classConfig";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
}

function ObjectRow({ annotation, index, selected, onSelect, onClassChange, onDelete }) {
  const classInfo = getObjectClass(annotation.class);

  return (
    <ListItemButton
      selected={selected}
      onClick={onSelect}
      sx={{
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: selected ? classInfo.color : "divider",
        bgcolor: selected ? `${classInfo.color}18` : "background.paper",
        "&.Mui-selected": { bgcolor: `${classInfo.color}18` },
        "&.Mui-selected:hover, &:hover": { bgcolor: `${classInfo.color}26` },
      }}
    >
      <Box
        aria-label={`Cor da classe ${classInfo.label}`}
        sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: classInfo.color, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 42 }}>
        <Typography variant="caption" color="text.secondary" display="block">ID</Typography>
        <Typography variant="body2" fontWeight={700}>#{index + 1}</Typography>
      </Box>

      <Select
        size="small"
        value={classInfo.value}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onClassChange(event.target.value)}
        renderValue={(value) => getObjectClass(value).label}
        sx={{
          flex: 1,
          minWidth: 0,
          "& .MuiSelect-select": { py: 0.7, fontSize: "0.875rem", fontWeight: 600 },
        }}
        inputProps={{ "aria-label": `Classe do objeto ${index + 1}` }}
      >
        {OBJECT_CLASSES.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: item.color, mr: 1 }} />
            {item.label}
          </MenuItem>
        ))}
      </Select>

      <Tooltip title="Excluir objeto">
        <IconButton
          size="small"
          color="error"
          onClick={(event) => { event.stopPropagation(); onDelete(); }}
          aria-label={`Excluir objeto ${index + 1}`}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItemButton>
  );
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
  if (!event) {
    return <Paper sx={{ p: 4, borderRadius: 3 }}><Typography variant="h6">Nenhum evento pendente.</Typography></Paper>;
  }

  const confidence = Number(((event.confidence || 0) * 100).toFixed(1));
  const details = [
    { label: "Filial", value: event.filial_id },
    { label: "Câmera", value: event.camera_id },
    { label: "Track", value: event.track_id },
    { label: "Horário", value: formatDate(event.event_time) },
  ];

  return (
    <Paper sx={{ p: 2.5, borderRadius: 3, height: "100%", boxShadow: 2 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>Validação manual</Typography>
          <Typography variant="h5" fontWeight={800}>Revisar evento</Typography>
          <Chip label={event.event_type} color="info" size="small" sx={{ mt: 1 }} />
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary">Confiança da detecção</Typography>
            <Typography variant="body2" fontWeight={800}>{confidence}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={confidence} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Objetos detectados ({annotations.length})</Typography>
          <Typography variant="caption" color="text.secondary">Selecione um item para localizar sua caixa na imagem.</Typography>

          <List disablePadding sx={{ mt: 1.5, display: "grid", gap: 0.75, maxHeight: 340, overflowY: "auto" }}>
            {annotations.map((annotation, index) => (
              <ObjectRow
                key={annotation.id}
                annotation={annotation}
                index={index}
                selected={annotation.id === selectedId}
                onSelect={() => onSelect?.(annotation.id)}
                onClassChange={(className) => onClassChange?.(annotation.id, className)}
                onDelete={() => onDelete?.(annotation.id)}
              />
            ))}
            {!annotations.length && (
              <Box sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Nenhum objeto detectado.</Typography>
              </Box>
            )}
          </List>
        </Box>

        <Button fullWidth variant="contained" startIcon={<SaveRoundedIcon />} onClick={onSave} disabled={loading || saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>

        <Divider />

        <Stack spacing={1}>
          {details.map((item) => (
            <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">{item.label}</Typography>
              <Typography variant="caption" fontWeight={700} textAlign="right">{item.value ?? "—"}</Typography>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={1.25}>
          <Button fullWidth variant="contained" color="success" startIcon={<CheckCircleRoundedIcon />} onClick={onApprove} disabled={loading || saving}>Aprovar</Button>
          <Button fullWidth variant="outlined" color="error" startIcon={<CancelRoundedIcon />} onClick={onReject} disabled={loading || saving}>Rejeitar</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
