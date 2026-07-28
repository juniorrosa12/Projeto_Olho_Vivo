import { useCallback, useRef, useState } from 'react';

export const useCanvasInteraction = ({ initialZoom = 1, minZoom = 0.2, maxZoom = 5.0 }) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef(null);

  const zoomAt = useCallback(
    (nextZoom, centerPoint) => {
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, nextZoom));
      setZoom((prevZoom) => {
        if (!centerPoint) return clampedZoom;
        const scaleChange = clampedZoom / prevZoom;
        setPosition((prevPos) => ({
          x: centerPoint.x - (centerPoint.x - prevPos.x) * scaleChange,
          y: centerPoint.y - (centerPoint.y - prevPos.y) * scaleChange,
        }));
        return clampedZoom;
      });
    },
    [minZoom, maxZoom]
  );

  const fitToViewport = useCallback((imageWidth, imageHeight, containerWidth, containerHeight) => {
    if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return;
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const bestFitScale = Math.min(scaleX, scaleY) * 0.95;
    
    setZoom(bestFitScale);
    setPosition({
      x: (containerWidth - imageWidth * bestFitScale) / 2,
      y: (containerHeight - imageHeight * bestFitScale) / 2,
    });
  }, []);

  const resetPan = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    zoom,
    position,
    isDrawing,
    setIsDrawing,
    startPointRef,
    setZoom,
    setPosition,
    zoomAt,
    fitToViewport,
    resetPan,
  };
};
