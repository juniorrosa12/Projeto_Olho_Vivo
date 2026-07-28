import { Group, Image as KonvaImage, Layer, Rect, Stage, Transformer } from "react-konva";
import useImage from "use-image";
import { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, Paper, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { getObjectClass } from "./classConfig";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export default function ObjectAnnotator({ image, boxes = [], selectedId, onChange, onCommit, onSelect, onUndo, onRedo }) {
  const [img] = useImage(image);
  const [viewport, setViewport] = useState({ width: 960, height: 620 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const containerRef = useRef();
  const stageRef = useRef();
  const transformerRef = useRef();
  const boxesRef = useRef(boxes);
  const startRef = useRef(null);

  useEffect(() => { boxesRef.current = boxes; }, [boxes]);
  useEffect(() => {
    const resize = () => {
      const width = containerRef.current?.clientWidth || 960;
      setViewport({ width, height: Math.min(700, Math.max(420, width * 0.65)) });
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  const fit = () => {
    if (!img) return;
    const next = Math.min(viewport.width / img.width, viewport.height / img.height);
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next)));
    setPosition({ x: (viewport.width - img.width * next) / 2, y: (viewport.height - img.height * next) / 2 });
  };
  const constrainPosition = (next, scale = zoom) => {
    if (!img) return next;
    const limit = (value, imageSize, viewportSize) => {
      const scaledSize = imageSize * scale;
      if (scaledSize <= viewportSize) return (viewportSize - scaledSize) / 2;
      return Math.min(80, Math.max(viewportSize - scaledSize - 80, value));
    };
    return { x: limit(next.x, img.width, viewport.width), y: limit(next.y, img.height, viewport.height) };
  };
  useEffect(fit, [img, viewport.width, viewport.height]);
  useEffect(() => {
    const keys = (event) => {
      if (event.code === "Space") { setSpacePressed(event.type === "keydown"); event.preventDefault(); }
      if (event.type !== "keydown") return;
      if (event.key === "Escape") onSelect?.(null);
      if (event.key === "Delete" && selectedId) { const next = boxesRef.current.filter((box) => box.id !== selectedId); onChange?.(next); onCommit?.(next); onSelect?.(null); }
      if (event.ctrlKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo?.();
        else onUndo?.();
      }
    };
    window.addEventListener("keydown", keys); window.addEventListener("keyup", keys);
    return () => { window.removeEventListener("keydown", keys); window.removeEventListener("keyup", keys); };
  }, [onChange, onCommit, onRedo, onSelect, onUndo, selectedId]);
  useEffect(() => {
    const node = transformerRef.current?.getStage().findOne(`#box-${selectedId}`);
    if (transformerRef.current) {
      transformerRef.current.nodes(node ? [node] : []);
      transformerRef.current.getLayer().batchDraw();
    }
    const box = boxes.find((item) => item.id === selectedId);
    if (!box || !img) return;
    const left = position.x + box.x * zoom;
    const top = position.y + box.y * zoom;
    const right = left + box.width * zoom;
    const bottom = top + box.height * zoom;
    if (left >= 0 && top >= 0 && right <= viewport.width && bottom <= viewport.height) return;
    setPosition({ x: viewport.width / 2 - (box.x + box.width / 2) * zoom, y: viewport.height / 2 - (box.y + box.height / 2) * zoom });
  }, [boxes, img, position, selectedId, viewport.height, viewport.width, zoom]);
  const update = (next, commit = false) => { boxesRef.current = next; onChange?.(next); if (commit) onCommit?.(next); };
  const zoomAt = (next, point = { x: viewport.width / 2, y: viewport.height / 2 }) => {
    const value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    const world = { x: (point.x - position.x) / zoom, y: (point.y - position.y) / zoom };
    setZoom(value); setPosition(constrainPosition({ x: point.x - world.x * value, y: point.y - world.y * value }, value));
  };
  const pointer = () => stageRef.current.getPointerPosition();
  const mouseDown = (event) => {
    if (spacePressed || event.target !== event.target.getStage()) return;
    const point = pointer(); const world = { x: (point.x - position.x) / zoom, y: (point.y - position.y) / zoom };
    const box = { id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, class: "person", x: world.x, y: world.y, width: 1, height: 1 };
    startRef.current = world; setDrawing(true); update([...boxesRef.current, box]); onSelect?.(box.id);
  };
  const mouseMove = () => {
    if (!drawing || !startRef.current || !selectedId) return;
    const point = pointer(); const world = { x: (point.x - position.x) / zoom, y: (point.y - position.y) / zoom };
    update(boxesRef.current.map((box) => box.id === selectedId ? { ...box, x: Math.min(startRef.current.x, world.x), y: Math.min(startRef.current.y, world.y), width: Math.abs(world.x - startRef.current.x), height: Math.abs(world.y - startRef.current.y) } : box));
  };
  const endDrawing = () => { if (drawing) update(boxesRef.current, true); setDrawing(false); startRef.current = null; };
  return <Paper ref={containerRef} elevation={0} sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
    <Box sx={{ p: 1, display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap" }}>
      <ButtonGroup size="small">
        <Tooltip title="Diminuir zoom (roda do mouse)"><Button onClick={() => zoomAt(zoom / 1.2)}><RemoveIcon /></Button></Tooltip>
        <Tooltip title="Aumentar zoom (Ctrl + roda)"><Button onClick={() => zoomAt(zoom * 1.2)}><AddIcon /></Button></Tooltip>
        <Tooltip title="Zoom em 100%"><Button onClick={() => zoomAt(1)}>100%</Button></Tooltip>
        <Tooltip title="Ajustar à tela"><Button onClick={fit}><FitScreenIcon /></Button></Tooltip>
        <Tooltip title="Centralizar imagem"><Button onClick={() => setPosition({ x: (viewport.width - (img?.width || 0) * zoom) / 2, y: (viewport.height - (img?.height || 0) * zoom) / 2 })}><CenterFocusStrongIcon /></Button></Tooltip>
      </ButtonGroup>
      <Box sx={{ display: "flex", gap: 2 }}><Typography variant="caption">Zoom: {Math.round(zoom * 100)}%</Typography><Typography variant="caption">Objetos: {boxes.length}</Typography><Typography variant="caption">Espaço + arrastar para mover</Typography></Box>
    </Box>
    {img && <Stage ref={stageRef} width={viewport.width} height={viewport.height} draggable={spacePressed} x={position.x} y={position.y} onDragMove={(e) => setPosition(constrainPosition({ x: e.target.x(), y: e.target.y() }))} onWheel={(event) => { event.evt.preventDefault(); zoomAt(zoom * (event.evt.deltaY > 0 ? 0.9 : 1.1), pointer()); }} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={endDrawing}>
      <Layer><Group scaleX={zoom} scaleY={zoom}><KonvaImage image={img} width={img.width} height={img.height} /></Group></Layer>
      <Layer><Group scaleX={zoom} scaleY={zoom}>{boxes.map((box) => { const info = getObjectClass(box.class); return <Rect key={box.id} id={`box-${box.id}`} x={box.x} y={box.y} width={box.width} height={box.height} stroke={info.color} strokeWidth={box.id === selectedId ? 4 / zoom : 2 / zoom} shadowColor={box.id === selectedId ? "#fff" : undefined} shadowBlur={box.id === selectedId ? 8 / zoom : 0} draggable={!spacePressed} onClick={() => onSelect?.(box.id)} onDragEnd={(e) => update(boxesRef.current.map((item) => item.id === box.id ? { ...item, x: e.target.x(), y: e.target.y() } : item), true)} onTransformEnd={(e) => { const node = e.target; const sx = node.scaleX(); const sy = node.scaleY(); node.scaleX(1); node.scaleY(1); update(boxesRef.current.map((item) => item.id === box.id ? { ...item, x: node.x(), y: node.y(), width: node.width() * sx, height: node.height() * sy } : item), true); }} />; })}<Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} /></Group></Layer>
    </Stage>}
  </Paper>;
}
