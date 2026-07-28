import { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import { createAnnotation, deleteAnnotation } from "../api/annotations";
import { getObjectClass } from "../components/annotation/classConfig";
import useAnnotationHistory from "../hooks/useAnnotationHistory";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

const normalizeBoxes = (boxes = []) => {
  const values = Array.isArray(boxes) ? boxes : [];
  const detectedBoxes = values.length && !Array.isArray(values[0]) && typeof values[0] !== "object"
    ? [values]
    : values;

  return detectedBoxes.map((box, index) => ({
    id: box?.id ?? `detected-${index}`,
    class: getObjectClass(box?.class ?? box?.label).value,
    x: box?.x ?? box?.[0] ?? 0,
    y: box?.y ?? box?.[1] ?? 0,
    width: box?.width ?? box?.w ?? box?.[2] ?? 0,
    height: box?.height ?? box?.h ?? box?.[3] ?? 0,
  }));
};

export default function Validation() {

  const [event, setEvent] = useState(null);
  const { value: annotations, replace: replaceAnnotations, commit: commitAnnotations, reset: resetAnnotations, undo, redo } = useAnnotationHistory([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
  const [savedAnnotationIds, setSavedAnnotationIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
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
      const detected = normalizeBoxes(eventRes.data?.bbox);
      resetAnnotations(detected);
      setSelectedAnnotationId(detected[0]?.id ?? null);
      setSavedAnnotationIds([]);
      setSaveError("");
      setStats(statsRes.data);

    } finally {

      setLoading(false);

    }

  }, [resetAnnotations]);

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

  const handleClassChange = (id, className) => {
    commitAnnotations(annotations.map((item) => (
      item.id === id ? { ...item, class: className } : item
    )));
  };

  const handleDelete = (id) => {
    commitAnnotations(annotations.filter((item) => item.id !== id));
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
  };

  const handleSave = async () => {
    if (!event?.track_id) {
      setSaveError("Não foi possível salvar: o evento não possui um track associado.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      await Promise.all(savedAnnotationIds.map((id) => deleteAnnotation(id)));
      const created = await Promise.all(annotations.map((item) => createAnnotation({
        track_id: event.track_id,
        bbox: [item.x, item.y, item.width, item.height],
        predicted_class: item.class,
        corrected_class: item.class,
        correction_scope: "frame",
        metadata: { source: "manual_validation", object_id: item.id },
      })));

      setSavedAnnotationIds(created.map((response) => response.data.id));
    } catch {
      setSaveError("Não foi possível salvar as anotações. Tente novamente.");
    } finally {
      setSaving(false);
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
                image={`${API}${event.snapshot}?t=${event.id}`}
                boxes={annotations}
                selectedId={selectedAnnotationId}
                onSelect={setSelectedAnnotationId}
                onChange={replaceAnnotations}
                onCommit={commitAnnotations}
                onUndo={undo}
                onRedo={redo}
              />

            </Grid>

            <Grid item xs={12} lg={3}>

              <ValidationPanel
                event={event}
                loading={loading}
                saving={saving}
                annotations={annotations}
                selectedId={selectedAnnotationId}
                onSelect={setSelectedAnnotationId}
                onClassChange={handleClassChange}
                onDelete={handleDelete}
                onSave={handleSave}
                onApprove={() => handleDecision("approve")}
                onReject={() => handleDecision("reject")}
              />

            </Grid>

          </Grid>

          {saveError && <Alert severity="error" onClose={() => setSaveError("")}>{saveError}</Alert>}

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
                src={`${API}${event.video}?t=${event.id}`}
              />

            </Box>

          </Box>

        </>

      )}

    </Stack>

  </Box>

);

}
