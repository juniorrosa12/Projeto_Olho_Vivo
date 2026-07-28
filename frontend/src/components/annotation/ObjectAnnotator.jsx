import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";
import { useEffect, useRef, useState } from "react";

export default function ObjectAnnotator({
  image,
  boxes = [],
  width = 960,
  selectedId,
  onChange,
  onSelect,
}) {
  const [img] = useImage(image);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const transformerRef = useRef();
  const stageRef = useRef();

  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = transformerRef.current.getStage();
    const node = stage.findOne(`#box-${selectedId}`);

    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedId, boxes]);

  useEffect(() => {
    const keyDown = (event) => {
      if (event.key !== "Delete" || !selectedId) return;

      const next = boxes.filter((box) => box.id !== selectedId);
      onChange?.(next);
      onSelect?.(null);
    };

    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, [boxes, onChange, onSelect, selectedId]);

  if (!img) return null;

  const scale = width / img.width;
  const height = img.height * scale;
  const pointer = () => stageRef.current.getPointerPosition();

  const mouseDown = (event) => {
    if (event.target !== event.target.getStage()) return;

    const point = pointer();
    const newBox = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      class: "person",
      x: point.x / scale,
      y: point.y / scale,
      width: 1,
      height: 1,
    };

    setDrawing(true);
    setStartPoint({ x: newBox.x, y: newBox.y });
    onChange?.([...boxes, newBox]);
    onSelect?.(newBox.id);
  };

  const mouseMove = () => {
    if (!drawing || !startPoint || !selectedId) return;

    const point = pointer();
    onChange?.(
      boxes.map((box) =>
        box.id === selectedId
          ? {
              ...box,
              x: Math.min(startPoint.x, point.x / scale),
              y: Math.min(startPoint.y, point.y / scale),
              width: Math.abs(point.x / scale - startPoint.x),
              height: Math.abs(point.y / scale - startPoint.y),
            }
          : box
      )
    );
  };

  const updateBox = (id, changes) => {
    onChange?.(boxes.map((box) => (box.id === id ? { ...box, ...changes } : box)));
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={() => setDrawing(false)}
    >
      <Layer>
        <KonvaImage image={img} width={width} height={height} />
      </Layer>

      <Layer>
        {boxes.map((box) => (
          <Rect
            key={box.id}
            id={`box-${box.id}`}
            x={box.x * scale}
            y={box.y * scale}
            width={box.width * scale}
            height={box.height * scale}
            stroke={box.id === selectedId ? "#ffb300" : "#00ff55"}
            strokeWidth={box.id === selectedId ? 4 : 2}
            draggable
            onClick={() => onSelect?.(box.id)}
            onTap={() => onSelect?.(box.id)}
            onDragEnd={(event) =>
              updateBox(box.id, {
                x: event.target.x() / scale,
                y: event.target.y() / scale,
              })
            }
            onTransformEnd={(event) => {
              const node = event.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();

              node.scaleX(1);
              node.scaleY(1);
              updateBox(box.id, {
                x: node.x() / scale,
                y: node.y() / scale,
                width: (node.width() * scaleX) / scale,
                height: (node.height() * scaleY) / scale,
              });
            }}
          />
        ))}

        <Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} />
      </Layer>
    </Stage>
  );
}
