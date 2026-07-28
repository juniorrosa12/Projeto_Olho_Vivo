import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useEffect, useRef, useState } from "react";

export default function ObjectAnnotator({
  image,
  boxes = [],
  width = 960,
}) {
  const [img] = useImage(image);

  const [items, setItems] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const transformerRef = useRef();

  useEffect(() => {
    const normalized = (boxes || []).map((box, index) => ({
      id: index,
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
  }, [selectedId]);

  if (!img) return null;

  const scale = width / img.width;

  const height = img.height * scale;

  return (
    <Stage width={width} height={height}>
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
          />

        ))}

        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
        />

      </Layer>
    </Stage>
  );
}
