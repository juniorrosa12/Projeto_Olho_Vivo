import { useEffect, useRef, useState, useCallback } from 'react';

export const useQueuePrefetch = (initialQueue = [], bufferSize = 3) => {
  const [queue, setQueue] = useState(initialQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefetchedCache, setPrefetchedCache] = useState(new Map());
  const workerRef = useRef(null);

  // Inicialização do Web Worker com fallback Gracioso
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../services/workers/prefetchWorker.js', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (e) => {
        const { type, results } = e.data;
        if (type === 'PREFETCH_COMPLETE' && Array.isArray(results)) {
          setPrefetchedCache((prevCache) => {
            const nextCache = new Map(prevCache);
            results.forEach((res) => {
              if (res?.id && res?.bitmap) {
                nextCache.set(res.id, res.bitmap);
              }
            });
            return nextCache;
          });
        }
      };
    } catch (err) {
      console.warn('Web Worker não suportado ou bloqueado. Usando fallback HTTP direto.', err);
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Dispara prefetch dos próximos N itens da fila
  const triggerPrefetch = useCallback(
    (upcomingItems) => {
      if (workerRef.current && upcomingItems.length > 0) {
        workerRef.current.postMessage({
          type: 'PREFETCH_QUEUE',
          items: upcomingItems,
        });
      }
    },
    []
  );

  const advanceQueue = useCallback(() => {
    setCurrentIndex((prevIdx) => {
      const nextIdx = prevIdx + 1;
      // Prepara o prefetch dos próximos itens
      const nextBatch = queue.slice(nextIdx + 1, nextIdx + 1 + bufferSize);
      triggerPrefetch(nextBatch);
      return nextIdx;
    });
  }, [queue, bufferSize, triggerPrefetch]);

  const rewindQueue = useCallback(() => {
    setCurrentIndex((prevIdx) => Math.max(0, prevIdx - 1));
  }, []);

  return {
    currentItem: queue[currentIndex] || null,
    currentIndex,
    totalItems: queue.length,
    prefetchedBitmap: prefetchedCache.get(queue[currentIndex]?.id) || null,
    setQueue,
    advanceQueue,
    rewindQueue,
  };
};
