// Web Worker isolado para pré-carregamento e decodificação assíncrona de imagens/vídeos
self.onmessage = async (event) => {
  const { type, items } = event.data;

  if (type === 'PREFETCH_QUEUE') {
    const prefetchedResults = [];

    for (const item of items) {
      try {
        if (!item.snapshotUrl) continue;
        const response = await fetch(item.snapshotUrl);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);

        prefetchedResults.push({
          id: item.id,
          bitmap: imageBitmap,
          snapshotUrl: item.snapshotUrl,
        });
      } catch (err) {
        // Em caso de falha no prefetch, prossegue para o próximo item
        console.warn(`Worker Prefetch Failed for event ${item.id}:`, err);
      }
    }

    self.postMessage({
      type: 'PREFETCH_COMPLETE',
      results: prefetchedResults,
    });
  }
};
