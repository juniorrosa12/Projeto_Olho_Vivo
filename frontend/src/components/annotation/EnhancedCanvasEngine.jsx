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
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CreateIcon from '@mui/icons-material/Create';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { getClassDefinition } from '../../domain/annotation/ClassCatalog';
import { useAnnotationStore } from '../../infrastructure/stores/useAnnotationStore';
import { BoundingBox } from '../../domain/annotation/BoundingBox';

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
  const [zoom, setZoom] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [draftBox, setDraftBox] = useState(null);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const startPosRef = useRef(null);

  const { activeClass, toolMode, setToolMode } = useAnnotationStore();

  // Resize Observer
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth || 960;
        const height = Math.max(450, Math.min(750, window.innerHeight - 200));
        setViewport({ width, height });
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calcula a escala perfeita para 100% Enquadramento Total da Imagem
  const getFitScale = useCallback(() => {
    if (!img || !viewport.width || !viewport.height) return 1.0;
    const scaleX = (viewport.width - 20) / img.width;
    const scaleY = (viewport.height - 20) / img.height;
    return Math.min(scaleX, scaleY);
  }, [img, viewport.width, viewport.height]);

  // Fit to screen (100% Enquadramento Total sem cortes)
  const fitToScreen = useCallback(() => {
    if (!img || !viewport.width || !viewport.height) return;
    const fitScale = getFitScale();
    setZoom(fitScale);
    setPosition({
      x: (viewport.width - img.width * fitScale) / 2,
      y: (viewport.height - img.height * fitScale) / 2,
    });
  }, [img, viewport.width, viewport.height, getFitScale]);

  useEffect(() => {
    fitToScreen();
  }, [img, fitToScreen]);

  // Foco Automático no Objeto Detectado
  const autoFocusOnBox = useCallback(
    (targetBox) => {
      if (!targetBox || !img) return;
      const fitScale = getFitScale();
      const targetZoom = fitScale * 1.5;
      const boxCenterX = targetBox.x + targetBox.width / 2;
      const boxCenterY = targetBox.y + targetBox.height / 2;

      setZoom(targetZoom);
      setPosition({
        x: viewport.width / 2 - boxCenterX * targetZoom,
        y: viewport.height / 2 - boxCenterY * targetZoom,
      });
    },
    [img, viewport.width, viewport.height, getFitScale]
  );

  useEffect(() => {
    if (boxes.length > 0 && img) {
      const firstBox = boxes.find((b) => b.id === selectedId) || boxes[0];
      autoFocusOnBox(firstBox);
    }
  }, [selectedId, img, autoFocusOnBox]);

  // Transformer Sync
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

  const handleZoomAt = (targetZoom, point) => {
    const minScale = getFitScale() * 0.8;
    const maxScale = getFitScale() * 6.0;
    const nextZoom = Math.max(minScale, Math.min(maxScale, targetZoom));
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

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    const delta = e.evt.deltaY > 0 ? 0.9 : 1.1;
    handleZoomAt(zoom * delta, pointer);
  };

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
      {/* 1. HUD Toolbar */}
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
          <Tooltip title="Resetar Enquadramento (100% = Enquadrar Imagem)">
            <Button onClick={fitToScreen} sx={{ color: '#38BDF8', borderColor: '#334155', fontWeight: 700 }}>
              100%
            </Button>
          </Tooltip>
          <Tooltip title="Focar Automático no Objeto">
            <Button onClick={() => autoFocusOnBox(boxes[0])} sx={{ color: '#38BDF8', borderColor: '#334155' }}>
              <CenterFocusStrongIcon fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

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
          <Tooltip title="Modo Pan (Mover Tela)">
            <Button
              onClick={() => setIsPanMode(!isPanMode)}
              variant={isPanMode ? 'contained' : 'outlined'}
              startIcon={<TouchAppIcon sx={{ fontSize: 14 }} />}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              Mover Tela
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
            Zoom: {Math.round((zoom / (getFitScale() || 1)) * 100)}%
          </Typography>
          <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600 }}>
            Objetos: {boxes.length}
          </Typography>
        </Stack>
      </Box>

      {/* 2. Viewport Canvas */}
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
                {/* Imagem de Fundo Completa Enquadrada Perfeitamente */}
                <KonvaImage name="bg-image" image={img} width={img.width} height={img.height} opacity={0.92} />

                {/* Overlays de Bounding Boxes */}
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
                        strokeWidth={(isSelected ? 3.5 : 2) / zoom}
                        fill={isSelected ? `${classDef.color}33` : 'transparent'}
                        draggable={!box.isLocked && !isPanMode}
                        onMouseEnter={() => setHoveredId(box.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => onSelect?.(box.id)}
                        onDragEnd={(e) => handleBoxDragEnd(box.id, e)}
                        onTransformEnd={(e) => handleBoxTransformEnd(box.id, e)}
                      />

                      {(isSelected || isHovered) && (
                        <Group x={box.x} y={Math.max(0, box.y - 20 / zoom)}>
                          <Rect
                            fill={classDef.color}
                            width={(classDef.label.length * 8 + 14) / zoom}
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
