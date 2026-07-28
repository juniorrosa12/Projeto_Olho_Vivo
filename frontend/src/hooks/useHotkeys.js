import { useEffect } from 'react';
import { useAnnotationStore } from '../infrastructure/stores/useAnnotationStore';
import { useUIStore } from '../infrastructure/stores/useUIStore';
import { CLASS_CATALOG } from '../domain/annotation/ClassCatalog';

export const useHotkeys = ({ onApprove, onReject, onSkip, onNext, onPrev }) => {
  const {
    selectedId,
    updateSelectedClass,
    deleteBox,
    undo,
    redo,
    setActiveClass,
    setToolMode,
  } = useAnnotationStore();

  const { toggleHotkeyModal, resetZoomPan } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore hotkeys if typing in input, textarea, or contentEditable
      const tag = e.target?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }

      // Handle Ctrl combinations
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
          return;
        }
      }

      // Handle single key hotkeys
      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          if (onApprove) onApprove();
          break;

        case 'r':
          e.preventDefault();
          if (onReject) onReject();
          break;

        case 'e':
          e.preventDefault();
          setToolMode('EDIT');
          break;

        case 's':
          e.preventDefault();
          setToolMode('SELECT');
          break;

        case 'delete':
        case 'backspace':
          e.preventDefault();
          if (selectedId) deleteBox(selectedId);
          break;

        case ' ':
          e.preventDefault();
          if (onSkip) onSkip();
          break;

        case '?':
          e.preventDefault();
          toggleHotkeyModal();
          break;

        case 'f':
          e.preventDefault();
          resetZoomPan();
          break;

        case 'arrowleft':
          if (onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;

        case 'arrowright':
          if (onNext) {
            e.preventDefault();
            onNext();
          }
          break;

        default: {
          // Check for numeric keys 1-6 for class assignment
          const matchedClass = CLASS_CATALOG.find((c) => c.key === e.key);
          if (matchedClass) {
            e.preventDefault();
            setActiveClass(matchedClass.id);
            if (selectedId) {
              updateSelectedClass(matchedClass.id);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onApprove,
    onReject,
    onSkip,
    onNext,
    onPrev,
    selectedId,
    updateSelectedClass,
    deleteBox,
    undo,
    redo,
    setActiveClass,
    setToolMode,
    toggleHotkeyModal,
    resetZoomPan,
  ]);
};
