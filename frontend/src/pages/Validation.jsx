import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import OlhoVivoStudioWorkspace from "../features/triage/containers/OlhoVivoStudioWorkspace";
import { useAnnotationStore } from "../infrastructure/stores/useAnnotationStore";
import { createAnnotation, deleteAnnotation } from "../api/annotations";
import { getClassDefinition } from "../domain/annotation/ClassCatalog";

import { useTriageStore } from "../infrastructure/stores/useTriageStore";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

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
  const [event, setEvent] = useState(null);
  const { boxes, setBoxes, selectBox } = useAnnotationStore();

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
          // Se não encontrar o id exato via API, carrega o objeto do estado
          if (inspectedEvent) {
            setEvent(inspectedEvent);
            setBoxes(normalizeBoxes(inspectedEvent.boxes || []));
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
      const detected = normalizeBoxes(eventRes.data?.bbox);
      setBoxes(detected);
      setSavedAnnotationIds([]);
      setSaveError("");
      setStats(statsRes.data);
    } catch {
      setSaveError("Erro ao carregar dados da fila.");
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
      setSaveError("Não foi possível salvar as anotações. Tente novamente.");
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
