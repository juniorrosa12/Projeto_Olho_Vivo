import { Box, Button, Chip, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

export default function ValidationPanel({
  event,
  onApprove,
  onReject,
  loading,
}) {
  if (!event) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6">
          Nenhum evento pendente.
        </Typography>
      </Paper>
    );
  }

  const confidence = Number((event.confidence * 100).toFixed(1));

  const details = [
    { label: "Tipo", value: event.event_type },
    { label: "Filial", value: event.filial_id },
    { label: "Câmera", value: event.camera_id },
    { label: "Track", value: event.track_id },
    { label: "Horário", value: formatDate(event.event_time) },
  ];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Stack spacing={3}>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Evento
        </Typography>

        <Chip
          label={event.event_type}
          color="info"
          sx={{ alignSelf: "flex-start" }}
        />

        <Stack spacing={2}>

          {details.map((item) => (
            <Box key={item.label}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {item.label}
              </Typography>

              <Typography fontWeight={600}>
                {item.value}
              </Typography>
            </Box>
          ))}

        </Stack>

        <Box>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Confiança
          </Typography>

          <LinearProgress
            variant="determinate"
            value={confidence}
            sx={{
              mt: 1,
              mb: 1,
              height: 10,
              borderRadius: 5,
            }}
          />

          <Typography
            fontWeight={700}
          >
            {confidence}%
          </Typography>

        </Box>

        <Button
          fullWidth
          size="large"
          variant="contained"
          color="success"
          startIcon={<CheckCircleRoundedIcon />}
          onClick={onApprove}
          disabled={loading}
        >
          Aprovar
        </Button>

        <Button
          fullWidth
          size="large"
          variant="contained"
          color="error"
          startIcon={<CancelRoundedIcon />}
          onClick={onReject}
          disabled={loading}
        >
          Rejeitar
        </Button>

      </Stack>
    </Paper>
  );
}
