import type { Annotation } from './annotation';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface AnnotationState {
  annotations: Annotation[];
  selectedIds: string[];
  clipboard: Annotation[] | null;
}

export type AnnotationHistory = HistoryState<Annotation[]>;

export interface AnnotationStore extends AnnotationState {
  // Actions
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string, multi?: boolean) => void;
  copySelected: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;
  setAnnotations: (annotations: Annotation[]) => void;
}