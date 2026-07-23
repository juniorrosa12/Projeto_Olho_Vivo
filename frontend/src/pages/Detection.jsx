import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Stack,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";

import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function Detection() {
  const [frame, setFrame] = useState("");

  const [stats, setStats] = useState({
    people: 0,
    phones: 0,
    fps: 0,
  });

  const [showROI, setShowROI] = useState(true);
  const [showIds, setShowIds] = useState(true);
  const [showTracks, setShowTracks] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      const t = Date.now();

      setFrame(`${API}/static/output/latest.jpg?t=${t}`);

      try {
        const r = await fetch(`${API}/events/dashboard`);
        const j = await r.json();

        setStats({
          people: j.people_now ?? 0,
          phones: j.cellphones ?? 0,
          fps: j.fps ?? 0,
        });
      } catch {}
    };

    refresh();

    const timer = setInterval(refresh, 1000);

    return () => clearInterval(timer);
  }, []);

  const fullscreen = () => {
    document.getElementById("camera-live")?.requestFullscreen();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Detecção ao Vivo
      </Typography>

      <Paper sx={{ p: 2 }}>
        <img
          id="camera-live"
          src={frame}
          alt=""
          style={{
            width: "100%",
            display: "block",
            borderRadius: 10,
          }}
        />
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          justifyContent="space-between"
        >
          <Chip color="primary" label={`👥 ${stats.people} Pessoas`} />
          <Chip color="secondary" label={`📱 ${stats.phones} Celulares`} />
          <Chip color="success" label={`⚡ ${stats.fps} FPS`} />
          <Chip color="info" label="YOLO11n" />
          <Chip color="warning" label="ByteTrack" />
          <Chip color="success" label="🟢 Online" />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PhotoCameraIcon />}
          >
            Snapshot
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<FullscreenIcon />}
            onClick={fullscreen}
          >
            Fullscreen
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<CameraswitchIcon />}
          >
            CAM01
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={4} flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={showROI}
                onChange={(e) => setShowROI(e.target.checked)}
              />
            }
            label="ROI"
          />

          <FormControlLabel
            control={
              <Switch
                checked={showIds}
                onChange={(e) => setShowIds(e.target.checked)}
              />
            }
            label="IDs"
          />

          <FormControlLabel
            control={
              <Switch
                checked={showTracks}
                onChange={(e) => setShowTracks(e.target.checked)}
              />
            }
            label="Trilhas"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
