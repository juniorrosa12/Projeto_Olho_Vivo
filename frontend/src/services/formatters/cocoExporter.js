import { CLASS_CATALOG } from '../../domain/annotation/ClassCatalog';

/**
 * Converte um conjunto de eventos e anotações para o formato de especificação COCO (.json)
 */
export const convertToCOCO = (events = [], imageWidth = 1920, imageHeight = 1080) => {
  const categories = CLASS_CATALOG.map((c, index) => ({
    id: index + 1,
    name: c.label,
    supercategory: 'object',
  }));

  const images = [];
  const annotations = [];
  let annotationIdCounter = 1;

  events.forEach((eventItem, imgIndex) => {
    const imageId = imgIndex + 1;
    images.push({
      id: imageId,
      width: imageWidth,
      height: imageHeight,
      file_name: eventItem.snapshot ? eventItem.snapshot.split('/').pop() : `snapshot_${eventId}.jpg`,
      date_captured: eventItem.created_at || new Date().toISOString(),
    });

    const boxes = Array.isArray(eventItem.boxes) ? eventItem.boxes : [];
    boxes.forEach((box) => {
      if (box.isHidden) return;

      const catObj = categories.find((c) => c.name.toLowerCase() === (box.class || '').toLowerCase());
      const categoryId = catObj ? catObj.id : 1;

      const x = Number(box.x) || 0;
      const y = Number(box.y) || 0;
      const w = Number(box.width) || 0;
      const h = Number(box.height) || 0;
      const area = w * h;

      annotations.push({
        id: annotationIdCounter++,
        image_id: imageId,
        category_id: categoryId,
        bbox: [x, y, w, h], // COCO bbox: [xmin, ymin, width, height]
        area: Number(area.toFixed(2)),
        iscrowd: 0,
        segmentation: [],
      });
    });
  });

  return {
    info: {
      description: 'Dataset Olho Vivo - Active Learning Validated Export',
      url: 'https://olhovivo.ai',
      version: '1.0',
      year: new Date().getFullYear(),
      contributor: 'Olho Vivo Platform',
      date_created: new Date().toISOString(),
    },
    licenses: [],
    images,
    annotations,
    categories,
  };
};
