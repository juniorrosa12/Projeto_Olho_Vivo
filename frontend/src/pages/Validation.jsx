import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

import ObjectAnnotator from "../components/annotation/ObjectAnnotator";
import VideoPlayer from "../components/validation/VideoPlayer";
import ValidationPanel from "../components/validation/ValidationPanel";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function Validation() {

  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {

    try {

      setLoading(true);

      const [eventRes, statsRes] = await Promise.all([
        axios.get(`${API}/validation/next`),
        axios.get(`${API}/validation/stats`),
      ]);

      setEvent(eventRes.data);
      setStats(statsRes.data);

    } finally {

      setLoading(false);

    }

  }, []);

  const handleDecision = async (action) => {

    if (!event?.id) return;

    try {

      setLoading(true);

      await axios.post(`${API}/validation/${event.id}/${action}`);

      await load();

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    load();

  }, [load]);

  const StatCard = ({ title, value }) => (

    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={700}
      >
        {value}
      </Typography>
    </Paper>

  );

  return (

  <Box sx={{ p: { xs: 2, md: 4 } }}>

    <Stack spacing={3}>

      <Grid container spacing={2}>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Pendentes"
            value={stats.pending}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Aprovados"
            value={stats.approved}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Rejeitados"
            value={stats.rejected}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Total"
            value={stats.total}
          />
        </Grid>

      </Grid>

      {event && (

        <>

          <Grid container spacing={3}>

            <Grid item xs={12} lg={9}>

              <ObjectAnnotator
                 image={`${API}${event.snapshot}?t=${Date.now()}`}
                 boxes={event.bbox || []}
                 onChange={setAnnotations}
              />

            </Grid>

            <Grid item xs={12} lg={3}>

              <ValidationPanel
                event={event}
                loading={loading}
                onApprove={() => handleDecision("approve")}
                onReject={() => handleDecision("reject")}
              />

            </Grid>

          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >

            <Box
              sx={{
                width: "100%",
                maxWidth: 900,
              }}
            >

              <VideoPlayer
                src={`${API}${event.video}?t=${Date.now()}`}
              />

            </Box>

          </Box>

        </>

      )}

    </Stack>

  </Box>

);

}
