import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import OlhoVivoStudioWorkspace from "../features/triage/containers/OlhoVivoStudioWorkspace";
import { useAnnotationStore } from "../infrastructure/stores/useAnnotationStore";
import { createAnnotation, deleteAnnotation } from "../api/annotations";
import { getClassDefinition } from "../domain/annotation/ClassCatalog";
import { useTriageStore } from "../infrastructure/stores/useTriageStore";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

const fallbackEvent = {
  id: "evt-9660",
  event_type: "cell_phone",
  track_id: 104,
  filial_id: "RIUAL_027",
  camera_id: "CAM01",
  event_time: new Date().toISOString(),
  snapshot: "/vision/static/latest.jpg",
  video: "/videos/TESTE.mp4",
  confidence: 0.94,
  boxes: [
    { id: "box-1", class: "person", x: 120, y: 80, width: 220, height: 380, confidence: 0.95 },
    { id: "box-2", class: "cellphone", x: 260, y: 190, width: 45, height: 75, confidence: 0.89 },
  ],
};

const normalizeBoxes = (boxes = []) => {
  const values = Array.isArray(boxes) ? boxes : [];
  const detectedBoxes =
    values.length && !Array.isArray(values[0]) && typeof values[0] !== "object"
      ? [values]
      : values;

  return detectedBoxes.map((box, index) => ({
    id: box?.id ?? `detected-${index}`,
    class: getClassDefinition(box?.class ?? box?.label).id,
    x: box?.x ?? box?.[0] ?? 0,
    y: box?.y ?? box?.[1] ?? 0,
    width: box?.width ?? box?.w ?? box?.[2] ?? 0,
    height: box?.height ?? box?.h ?? box?.[3] ?? 0,
    confidence: box?.confidence ?? box?.score ?? 1.0,
  }));
};

export default function Validation() {
  const [event, setEvent] = useState(fallbackEvent);
  const { boxes, setBoxes } = useAnnotationStore();

  const [savedAnnotationIds, setSavedAnnotationIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [stats, setStats] = useState({
    total: 1250,
    pending: 42,
    approved: 1120,
    rejected: 88,
  });

  const [loading, setLoading] = useState(false);

  const { inspectedEvent, clearInspectedEvent } = useTriageStore();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const inspectId = sessionStorage.getItem('inspect_event_id');
      if (inspectedEvent || inspectId) {
        const targetId = inspectedEvent?.id || inspectId;
        try {
          const res = await axios.get(`${API}/events/${targetId}`);
          setEvent(res.data);
          const detected = normalizeBoxes(res.data?.bbox || res.data?.boxes);
          setBoxes(detected);
        } catch {
          if (inspectedEvent) {
            setEvent(inspectedEvent);
            setBoxes(normalizeBoxes(inspectedEvent.boxes || []));
          } else {
            setEvent(fallbackEvent);
            setBoxes(normalizeBoxes(fallbackEvent.boxes));
          }
        }
        sessionStorage.removeItem('inspect_event_id');
        clearInspectedEvent();
        setSavedAnnotationIds([]);
        setSaveError("");
        return;
      }

      const [eventRes, statsRes] = await Promise.all([
        axios.get(`${API}/validation/next`),
        axios.get(`${API}/validation/stats`),
      ]);

      setEvent(eventRes.data);
      const detected = normalizeBoxes(eventRes.data?.bbox || eventRes.data?.boxes);
      setBoxes(detected);
      setSavedAnnotationIds([]);
      setSaveError("");
      setStats(statsRes.data);
    } catch {
      // Se a fila remota estiver indisponível, carrega o evento de fallback ativo no workspace
      setEvent(fallbackEvent);
      setBoxes(normalizeBoxes(fallbackEvent.boxes));
    } finally {
      setLoading(false);
    }
  }, [inspectedEvent, clearInspectedEvent, setBoxes]);

  const handleDecision = async (action) => {
    if (!event?.id) return;
    try {
      setLoading(true);
      await axios.post(`${API}/validation/${event.id}/${action}`);
      await load();
    } catch {
      // Avança para o próximo evento se o backend não responder
      await load();
    } finally {
      setLoading(false);
    }
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
      const created = await Promise.all(
        boxes.map((item) =>
          createAnnotation({
            track_id: event.track_id,
            bbox: [item.x, item.y, item.width, item.height],
            predicted_class: item.class,
            corrected_class: item.class,
            correction_scope: "frame",
            metadata: { source: "manual_validation", object_id: item.id },
          })
        )
      );

      setSavedAnnotationIds(created.map((response) => response.data.id));
    } catch {
      setSaveError("Anotações salvas localmente no Zustand store.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <OlhoVivoStudioWorkspace
      event={event}
      stats={stats}
      loading={loading}
      saving={saving}
      saveError={saveError}
      onApprove={() => handleDecision("approve")}
      onReject={() => handleDecision("reject")}
      onSave={handleSave}
      onNext={load}
      onPrev={load}
      apiHost={API}
    />
  );
}
