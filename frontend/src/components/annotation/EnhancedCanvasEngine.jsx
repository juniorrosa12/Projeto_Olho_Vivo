import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Group,
  Transformer,
  Text,
  Circle,
  Line,
} from 'react-konva';
import useImage from 'use-image';
import {
  Box,
  Paper,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CreateIcon from '@mui/icons-material/Create';
import { getClassDefinition } from '../../domain/annotation/ClassCatalog';
import { useAnnotationStore } from '../../infrastructure/stores/useAnnotationStore';
import { BoundingBox } from '../../domain/annotation/BoundingBox';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;

export default function EnhancedCanvasEngine({
  image,
  boxes = [],
  selectedId,
  onSelect,
  onChange,
  onCommit,
}) {
  const [img] = useImage(image);
  const [viewport, setViewport] = useState({ width: 960, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [draftBox, setDraftBox] = useState(null);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const startPosRef = useRef(null);

  const { activeClass, toolMode, setToolMode } = useAnnotationStore();

  // Responsive Container Resize Observer
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth || 960;
        const height = Math.max(500, Math.min(800, window.innerHeight - 180));
        setViewport({ width, height });
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto Fit Screen when image loads
  const fitToScreen = useCallback(() => {
    if (!img || !viewport.width || !viewport.height) return;
    const scale = Math.min(viewport.width / img.width, viewport.height / img.height) * 0.95;
    const clampedScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
    setZoom(clampedScale);
    setPosition({
      x: (viewport.width - img.width * clampedScale) / 2,
      y: (viewport.height - img.height * clampedScale) / 2,
    });
  }, [img, viewport.width, viewport.height]);

  useEffect(() => {
    fitToScreen();
  }, [img, fitToScreen]);

  // Transformer Selection Sync
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#box-${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
      } else {
        transformerRef.current.nodes([]);
      }
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, boxes, zoom]);

  // Zoom Math
  const handleZoomAt = (targetZoom, point) => {
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom));
    const center = point || { x: viewport.width / 2, y: viewport.height / 2 };
    const worldPoint = {
      x: (center.x - position.x) / zoom,
      y: (center.y - position.y) / zoom,
    };
    setZoom(nextZoom);
    setPosition({
      x: center.x - worldPoint.x * nextZoom,
      y: center.y - worldPoint.y * nextZoom,
    });
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    const delta = e.evt.deltaY > 0 ? 0.9 : 1.1;
    handleZoomAt(zoom * delta, pointer);
  };

  // Pointer & Drag-to-Create Box Logic
  const getStagePointerWorld = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pointer = stage.getPointerPosition();
    return {
      x: (pointer.x - position.x) / zoom,
      y: (pointer.y - position.y) / zoom,
    };
  };

  const handleMouseDown = (e) => {
    // If clicking on transformer or existing box, don't start drawing
    const clickedOnStage = e.target === e.target.getStage();
    const clickedOnImage = e.target.name?.() === 'bg-image';

    if (isPanMode || (!clickedOnStage && !clickedOnImage)) return;

    if (toolMode === 'DRAW' || clickedOnStage || clickedOnImage) {
      const worldPos = getStagePointerWorld();
      startPosRef.current = worldPos;
      const newBox = new BoundingBox({
        id: `box-${Date.now()}`,
        className: activeClass,
        x: worldPos.x,
        y: worldPos.y,
        width: 1,
        height: 1,
      });
      setDraftBox(newBox);
    }
  };

  const handleMouseMove = () => {
    if (!startPosRef.current || !draftBox) return;
    const worldPos = getStagePointerWorld();
    const x = Math.min(startPosRef.current.x, worldPos.x);
    const y = Math.min(startPosRef.current.y, worldPos.y);
    const w = Math.abs(worldPos.x - startPosRef.current.x);
    const h = Math.abs(worldPos.y - startPosRef.current.y);

    setDraftBox(
      new BoundingBox({
        ...draftBox,
        x,
        y,
        width: w,
        height: h,
      })
    );
  };

  const handleMouseUp = () => {
    if (draftBox && draftBox.width > 5 && draftBox.height > 5) {
      const newBoxes = [...boxes, draftBox];
      onChange?.(newBoxes);
      onCommit?.(newBoxes);
      onSelect?.(draftBox.id);
    }
    setDraftBox(null);
    startPosRef.current = null;
  };

  // Box Transformations (Drag / Resize End)
  const handleBoxTransformEnd = (boxId, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const updatedBoxes = boxes.map((b) => {
      if (b.id === boxId) {
        return new BoundingBox({
          ...b,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        });
      }
      return b;
    });

    onChange?.(updatedBoxes);
    onCommit?.(updatedBoxes);
  };

  const handleBoxDragEnd = (boxId, e) => {
    const node = e.target;
    const updatedBoxes = boxes.map((b) => {
      if (b.id === boxId) {
        return new BoundingBox({
          ...b,
          x: node.x(),
          y: node.y(),
        });
      }
      return b;
    });

    onChange?.(updatedBoxes);
    onCommit?.(updatedBoxes);
  };

  const handleRemoveBox = (boxId, e) => {
    e.cancelBubble = true;
    const nextBoxes = boxes.filter((b) => b.id !== boxId);
    onChange?.(nextBoxes);
    onCommit?.(nextBoxes);
    if (selectedId === boxId) onSelect?.(null);
  };

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#020617',
        border: '1px solid #1E293B',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* 1. Toolbar Superior de Controles da Canvas HUD */}
      <Box
        sx={{
          height: 40,
          px: 2,
          bgcolor: '#0F172A',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Diminuir Zoom">
            <Button onClick={() => handleZoomAt(zoom / 1.2)} sx={{ color: '#94A3B8', borderColor: '#334155' }}>
              <RemoveIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Aumentar Zoom">
            <Button onClick={() => handleZoomAt(zoom * 1.2)} sx={{ color: '#94A3B8', borderColor: '#334155' }}>
              <AddIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Resetar Zoom (100%)">
            <Button onClick={() => handleZoomAt(1)} sx={{ color: '#94A3B8', borderColor: '#334155', fontWeight: 600 }}>
              100%
            </Button>
          </Tooltip>
          <Tooltip title="Ajustar à Tela">
            <Button onClick={fitToScreen} sx={{ color: '#38BDF8', borderColor: '#334155' }}>
              <FitScreenIcon fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        {/* Seleção de Modo de Ferramenta */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Modo Seleção (S)">
            <Button
              onClick={() => { setToolMode('SELECT'); setIsPanMode(false); }}
              variant={toolMode === 'SELECT' && !isPanMode ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              Seleção
            </Button>
          </Tooltip>
          <Tooltip title="Modo Desenhar Bounding Box (D)">
            <Button
              onClick={() => { setToolMode('DRAW'); setIsPanMode(false); }}
              variant={toolMode === 'DRAW' ? 'contained' : 'outlined'}
              startIcon={<CreateIcon sx={{ fontSize: 14 }} />}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              Desenhar Caixa
            </Button>
          </Tooltip>
          <Tooltip title="Modo Pan (Espaço + Arraste)">
            <Button
              onClick={() => setIsPanMode(!isPanMode)}
              variant={isPanMode ? 'contained' : 'outlined'}
              startIcon={<TouchAppIcon sx={{ fontSize: 14 }} />}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              Mover Tela (Pan)
            </Button>
          </Tooltip>
        </ButtonGroup>

        {/* Telemetria HUD */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
            Zoom: {Math.round(zoom * 100)}%
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
            Objetos em Cena: {boxes.length}
          </Typography>
        </Stack>
      </Box>

      {/* 2. Viewport Principal do Canvas Konva */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#020617',
          backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          cursor: isPanMode ? 'grab' : toolMode === 'DRAW' ? 'crosshair' : 'default',
          position: 'relative',
        }}
      >
        {img && (
          <Stage
            ref={stageRef}
            width={viewport.width}
            height={viewport.height}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              <Group
                x={position.x}
                y={position.y}
                scaleX={zoom}
                scaleY={zoom}
                draggable={isPanMode}
                onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
              >
                {/* Imagem de Fundo de Alta Definição */}
                <KonvaImage name="bg-image" image={img} width={img.width} height={img.height} />

                {/* Renderização das Bounding Boxes Existentes */}
                {boxes.map((box) => {
                  if (box.isHidden) return null;
                  const classDef = getClassDefinition(box.class);
                  const isSelected = box.id === selectedId;
                  const isHovered = box.id === hoveredId;

                  return (
                    <Group key={box.id}>
                      <Rect
                        id={`box-${box.id}`}
                        x={box.x}
                        y={box.y}
                        width={box.width}
                        height={box.height}
                        stroke={classDef.color}
                        strokeWidth={(isSelected ? 3 : 2) / zoom}
                        fill={isSelected ? `${classDef.color}22` : 'transparent'}
                        draggable={!box.isLocked && !isPanMode}
                        onMouseEnter={() => setHoveredId(box.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => onSelect?.(box.id)}
                        onDragEnd={(e) => handleBoxDragEnd(box.id, e)}
                        onTransformEnd={(e) => handleBoxTransformEnd(box.id, e)}
                      />

                      {/* Tag de Nome da Classe e Dimensões acima da caixa */}
                      {(isSelected || isHovered) && (
                        <Group x={box.x} y={Math.max(0, box.y - 20 / zoom)}>
                          <Rect
                            fill={classDef.color}
                            width={(classDef.label.length * 8 + 12) / zoom}
                            height={18 / zoom}
                            cornerRadius={3 / zoom}
                          />
                          <Text
                            text={classDef.label}
                            fontSize={11 / zoom}
                            fill="#FFFFFF"
                            fontStyle="bold"
                            x={4 / zoom}
                            y={3 / zoom}
                          />
                        </Group>
                      )}

                      {/* Botão de Exclusão Rápida no Canto Superior Direito */}
                      {(isSelected || isHovered) && !box.isLocked && (
                        <Group x={box.x + box.width} y={box.y} onClick={(e) => handleRemoveBox(box.id, e)}>
                          <Circle radius={10 / zoom} fill="#EF4444" />
                          <Text
                            text="×"
                            fontSize={18 / zoom}
                            fill="#FFFFFF"
                            fontStyle="bold"
                            align="center"
                            offsetX={4 / zoom}
                            offsetY={10 / zoom}
                          />
                        </Group>
                      )}
                    </Group>
                  );
                })}

                {/* Caixa rascunho em tempo real durante o arraste (Draft Box) */}
                {draftBox && (
                  <Rect
                    x={draftBox.x}
                    y={draftBox.y}
                    width={draftBox.width}
                    height={draftBox.height}
                    stroke="#38BDF8"
                    strokeWidth={2 / zoom}
                    dash={[6 / zoom, 4 / zoom]}
                    fill="rgba(56, 189, 248, 0.15)"
                  />
                )}

                {/* Transformer para Redimensionamento em 8 Pontos */}
                <Transformer
                  ref={transformerRef}
                  rotateEnabled={false}
                  keepRatio={false}
                  borderStroke="#38BDF8"
                  borderStrokeWidth={2 / zoom}
                  anchorSize={8 / zoom}
                  anchorCornerRadius={2 / zoom}
                  anchorFill="#38BDF8"
                  anchorStroke="#FFFFFF"
                />
              </Group>
            </Layer>
          </Stage>
        )}
      </Box>
    </Paper>
  );
}
