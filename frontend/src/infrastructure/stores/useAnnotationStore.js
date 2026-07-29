import { create } from 'zustand';
import { BoundingBox } from '../../domain/annotation/BoundingBox';
import { CLASS_CATALOG } from '../../domain/annotation/ClassCatalog';

const MAX_HISTORY = 50;

export const useAnnotationStore = create((set, get) => ({
  boxes: [],
  selectedId: null,
  activeClass: CLASS_CATALOG[0].id,
  toolMode: 'SELECT', // 'SELECT' | 'DRAW' | 'EDIT' | 'PAN'
  undoStack: [],
  redoStack: [],

  commitSnapshot: () => {
    const { boxes, undoStack } = get();
    const newSnapshot = JSON.stringify(boxes);
    const lastSnapshotObj = undoStack[undoStack.length - 1];
    const lastSnapshot = lastSnapshotObj ? JSON.stringify(lastSnapshotObj) : null;
    
    if (newSnapshot !== lastSnapshot) {
      set({
        undoStack: [...undoStack.slice(-MAX_HISTORY), boxes],
        redoStack: [],
      });
    }
  },

  setBoxes: (rawBoxes) => {
    const normalized = (Array.isArray(rawBoxes) ? rawBoxes : []).map((b, idx) =>
      b instanceof BoundingBox ? b : BoundingBox.fromRaw(b, idx)
    );
    set({
      boxes: normalized,
      selectedId: normalized[0]?.id || null,
      undoStack: [],
      redoStack: [],
    });
  },

  selectBox: (id) => set({ selectedId: id }),

  setActiveClass: (classId) => set({ activeClass: classId }),

  setToolMode: (mode) => set({ toolMode: mode }),

  updateSelectedClass: (newClassId) => {
    const { selectedId, boxes, commitSnapshot } = get();
    if (!selectedId) return;

    commitSnapshot();
    set({
      boxes: boxes.map((box) =>
        box.id === selectedId ? new BoundingBox({ ...box, className: newClassId }) : box
      ),
    });
  },

  deleteBox: (id) => {
    const targetId = id || get().selectedId;
    if (!targetId) return;

    get().commitSnapshot();
    const newBoxes = get().boxes.filter((b) => b.id !== targetId);
    set({
      boxes: newBoxes,
      selectedId: get().selectedId === targetId ? newBoxes[0]?.id || null : get().selectedId,
    });
  },

  updateBoxCoords: (id, coords) => {
    const { boxes } = get();
    set({
      boxes: boxes.map((box) =>
        box.id === id ? new BoundingBox({ ...box, ...coords }) : box
      ),
    });
  },

  toggleLock: (id) => {
    const { boxes } = get();
    set({
      boxes: boxes.map((box) =>
        box.id === id ? new BoundingBox({ ...box, isLocked: !box.isLocked }) : box
      ),
    });
  },

  toggleVisibility: (id) => {
    const { boxes } = get();
    set({
      boxes: boxes.map((box) =>
        box.id === id ? new BoundingBox({ ...box, isHidden: !box.isHidden }) : box
      ),
    });
  },

  undo: () => {
    const { undoStack, boxes, redoStack } = get();
    if (undoStack.length === 0) return;

    const previousBoxes = undoStack[undoStack.length - 1];
    set({
      boxes: previousBoxes,
      undoStack: undoStack.slice(0, -1),
      redoStack: [boxes, ...redoStack],
      selectedId: previousBoxes[0]?.id || null,
    });
  },

  redo: () => {
    const { redoStack, boxes, undoStack } = get();
    if (redoStack.length === 0) return;

    const nextBoxes = redoStack[0];
    set({
      boxes: nextBoxes,
      redoStack: redoStack.slice(1),
      undoStack: [...undoStack, boxes],
      selectedId: nextBoxes[0]?.id || null,
    });
  },

  reset: () => set({ boxes: [], selectedId: null, undoStack: [], redoStack: [] }),
}));
