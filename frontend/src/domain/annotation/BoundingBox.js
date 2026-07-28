import { getClassDefinition } from './ClassCatalog';

export class BoundingBox {
  constructor({ id, className, x, y, width, height, confidence = 1.0, isLocked = false, isHidden = false }) {
    this.id = id || `box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    this.class = getClassDefinition(className).id;
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.width = Number(width) || 0;
    this.height = Number(height) || 0;
    this.confidence = Number(confidence) || 1.0;
    this.isLocked = Boolean(isLocked);
    this.isHidden = Boolean(isHidden);
  }

  static fromRaw(rawBox, index = 0) {
    if (!rawBox) return null;
    let className = 'pessoa';
    let x = 0, y = 0, w = 0, h = 0;

    if (Array.isArray(rawBox)) {
      [x, y, w, h] = rawBox;
    } else if (typeof rawBox === 'object') {
      className = rawBox.class || rawBox.label || rawBox.predicted_class || 'pessoa';
      x = rawBox.x ?? rawBox.xmin ?? rawBox[0] ?? 0;
      y = rawBox.y ?? rawBox.ymin ?? rawBox[1] ?? 0;
      w = rawBox.width ?? rawBox.w ?? rawBox[2] ?? 0;
      h = rawBox.height ?? rawBox.h ?? rawBox[3] ?? 0;
    }

    return new BoundingBox({
      id: rawBox.id || `raw-${index}-${Date.now()}`,
      className,
      x,
      y,
      width: w,
      height: h,
      confidence: rawBox.confidence ?? rawBox.score ?? 1.0,
    });
  }

  toRawPayload() {
    return {
      id: this.id,
      class: this.class,
      bbox: [this.x, this.y, this.width, this.height],
      confidence: this.confidence,
    };
  }

  calculateIoU(otherBox) {
    const xA = Math.max(this.x, otherBox.x);
    const yA = Math.max(this.y, otherBox.y);
    const xB = Math.min(this.x + this.width, otherBox.x + otherBox.width);
    const yB = Math.min(this.y + this.height, otherBox.y + otherBox.height);

    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const boxAArea = this.width * this.height;
    const boxBArea = otherBox.width * otherBox.height;

    const unionArea = boxAArea + boxBArea - interArea;
    if (unionArea === 0) return 0;
    return interArea / unionArea;
  }
}
