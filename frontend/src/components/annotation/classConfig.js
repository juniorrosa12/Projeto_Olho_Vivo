export const OBJECT_CLASSES = [
  { value: "person", label: "Pessoa", color: "#22c55e" },
  { value: "cellphone", label: "Celular", color: "#ef4444" },
  { value: "box", label: "Caixa", color: "#3b82f6" },
  { value: "money", label: "Dinheiro", color: "#eab308" },
  { value: "drawer", label: "Gaveta", color: "#a855f7" },
  { value: "product", label: "Produto", color: "#06b6d4" },
];

const DEFAULT_CLASS = OBJECT_CLASSES[0];

export function getObjectClass(value) {
  return OBJECT_CLASSES.find((item) => item.value === value) ?? DEFAULT_CLASS;
}
