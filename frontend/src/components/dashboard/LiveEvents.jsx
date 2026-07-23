import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

function formatElapsed(value) {
  if (!value) {
    return "agora";
  }

  const date = new Date(value);
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diff < 60) {
    return `${diff}s atrás`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m atrás`;
  }

  return `${Math.floor(diff / 3600)}h atrás`;
}

export default function LiveEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  async function load() {
    const r = await axios.get(`${API}/events?limit=10`);
    setEvents(r.data);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Últimos eventos em tempo real
        </Typography>
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, cursor: "pointer", bgcolor: "background.paper" }}
                onClick={() => setSelectedEvent(event)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: event.event_type === "cell_phone" ? "error.main" : "info.main" }}>
                    {event.event_type === "cell_phone" ? "📱" : "👤"}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Typography fontWeight={700}>{event.event_type}</Typography>
                      <Chip label={formatElapsed(event.event_time)} size="small" color="primary" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Track {event.track_id} • {event.filial_id} • {event.camera_id}
                    </Typography>
                  </Box>
                </Stack>
                {event.snapshot ? (
                  <Box mt={2} sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "grey.900" }}>
                    <Box
                      component="img"
                      src={`${API}${event.snapshot}?t=${Date.now()}`}
                      alt="snapshot do evento"
                      sx={{ width: "100%", height: 150, objectFit: "cover" }}
                    />
                  </Box>
                ) : null}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedEvent?.event_type}</DialogTitle>
        <DialogContent dividers>
          {selectedEvent?.snapshot ? (
            <Box mb={2}>
              <Typography variant="subtitle2" mb={1}>
                Snapshot
              </Typography>
              <Box component="img" src={`${API}${selectedEvent.snapshot}?t=${Date.now()}`} sx={{ width: "100%", borderRadius: 2 }} />
            </Box>
          ) : null}
          {selectedEvent?.video ? (
            <Box>
              <Typography variant="subtitle2" mb={1}>
                Vídeo
              </Typography>
              <Box component="video" src={`${API}${selectedEvent.video}?t=${Date.now()}`} controls sx={{ width: "100%", borderRadius: 2 }} />
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

