import { CLASS_CATALOG } from '../../domain/annotation/ClassCatalog';

/**
 * Converte bounding boxes para o formato padrão YOLO (.txt)
 * Formato por linha: <class_id> <x_center> <y_center> <width> <height> (valores normalizados 0.0 - 1.0)
 */
export const convertToYOLO = (boxes = [], imageWidth = 1, imageHeight = 1) => {
  if (!Array.isArray(boxes)) return '';

  const lines = boxes
    .filter((box) => !box.isHidden)
    .map((box) => {
      const classIdx = CLASS_CATALOG.findIndex((c) => c.id === box.class);
      const safeClassIdx = classIdx >= 0 ? classIdx : 0;

      // Se a coordenada já for relativa (0-1), calcula o centro direto.
      // Se for em pixels reais, normaliza dividindo pelas dimensões da imagem.
      const isPixel = box.width > 1 || box.height > 1;

      const normX = isPixel ? box.x / imageWidth : box.x;
      const normY = isPixel ? box.y / imageHeight : box.y;
      const normW = isPixel ? box.width / imageWidth : box.width;
      const normH = isPixel ? box.height / imageHeight : box.height;

      const xCenter = (normX + normW / 2).toFixed(6);
      const yCenter = (normY + normH / 2).toFixed(6);
      const width = normW.toFixed(6);
      const height = normH.toFixed(6);

      return `${safeClassIdx} ${xCenter} ${yCenter} ${width} ${height}`;
    });

  return lines.join('\n');
};

/**
 * Gera o conteúdo do arquivo `classes.txt` do YOLO com o nome de todas as classes
 */
export const generateYOLOClassesFile = () => {
  return CLASS_CATALOG.map((c) => c.label).join('\n');
};
