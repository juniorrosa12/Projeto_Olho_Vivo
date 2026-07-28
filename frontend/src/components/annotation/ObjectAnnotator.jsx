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
  onChange,
}) {
  const [img] = useImage(image);

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  const transformerRef = useRef();
  const stageRef = useRef();

  useEffect(() => {
    const normalized = (boxes || []).map((box, index) => ({
      id: `${Date.now()}-${Math.random()}`,
      class: box.class ?? "person",
      x: box.x ?? box[0] ?? 0,
      y: box.y ?? box[1] ?? 0,
      width: box.width ?? box.w ?? box[2] ?? 0,
      height: box.height ?? box.h ?? box[3] ?? 0,
    }));

    setItems(normalized);
  }, [boxes]);

  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = transformerRef.current.getStage();
    const node = stage.findOne(`#box-${selectedId}`);

    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedId, items]);

  useEffect(() => {
    const keyDown = (e) => {
      if (e.key !== "Delete") return;
      if (!selectedId) return;

      const next = items.filter((i) => i.id !== selectedId);

      setItems(next);
      setSelectedId(null);

      onChange?.(next);
    };

    window.addEventListener("keydown", keyDown);

    return () => window.removeEventListener("keydown", keyDown);
  }, [selectedId, items, onChange]);

  if (!img) return null;

  const scale = width / img.width;
  const height = img.height * scale;

  const pointer = () => stageRef.current.getPointerPosition();

  const mouseDown = (e) => {
    if (e.target !== e.target.getStage()) return;

    setSelectedId(null);

    const p = pointer();

    setDrawing(true);

    setStartPoint({
      x: p.x / scale,
      y: p.y / scale,
    });

    const newBox = {
      id: `${Date.now()}-${Math.random()}`,
      class: "person",
      x: p.x / scale,
      y: p.y / scale,
      width: 1,
      height: 1,
    };

    setItems((old) => [...old, newBox]);
    setSelectedId(newBox.id);
  };

  const mouseMove = () => {
    if (!drawing) return;

    const p = pointer();

    setItems((old) =>
      old.map((box) => {
        if (box.id !== selectedId) return box;

        return {
          ...box,
          x: Math.min(startPoint.x, p.x / scale),
          y: Math.min(startPoint.y, p.y / scale),
          width: Math.abs(p.x / scale - startPoint.x),
          height: Math.abs(p.y / scale - startPoint.y),
        };
      })
    );
  };

  const mouseUp = () => {
    if (!drawing) return;

    setDrawing(false);

    onChange?.(items);
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
    >
      <Layer>
        <KonvaImage
          image={img}
          width={width}
          height={height}
        />
      </Layer>

      <Layer>
        {items.map((box) => (
          <Rect
            key={box.id}
            id={`box-${box.id}`}
            x={box.x * scale}
            y={box.y * scale}
            width={box.width * scale}
            height={box.height * scale}
            stroke="#00ff55"
            strokeWidth={2}
            draggable
            onClick={() => setSelectedId(box.id)}
            onTap={() => setSelectedId(box.id)}
            onDragEnd={(e) => {
              const next = items.map((b) =>
                b.id === box.id
                  ? {
                      ...b,
                      x: e.target.x() / scale,
                      y: e.target.y() / scale,
                    }
                  : b
              );

              setItems(next);
              onChange?.(next);
            }}
            onTransformEnd={(e) => {
              const node = e.target;

              const sx = node.scaleX();
              const sy = node.scaleY();

              node.scaleX(1);
              node.scaleY(1);

              const next = items.map((b) =>
                b.id === box.id
                  ? {
                      ...b,
                      x: node.x() / scale,
                      y: node.y() / scale,
                      width: (node.width() * sx) / scale,
                      height: (node.height() * sy) / scale,
                    }
                  : b
              );

              setItems(next);
              onChange?.(next);
            }}
          />
        ))}

        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          keepRatio={false}
        />
      </Layer>
    </Stage>
  );
}
