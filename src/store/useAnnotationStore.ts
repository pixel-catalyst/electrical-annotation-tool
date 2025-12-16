import { create } from 'zustand';
import type { Annotation, AnnotationType } from '../types/annotation';

interface AnnotationState {
  // Document State
  currentFile: string | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  
  // Annotation State
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  activeTool: 'select' | 'draw' | 'pan';
  activeLabel: AnnotationType;

  // Actions
  setFile: (file: string) => void;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setScale: (scale: number) => void;
  
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  
  selectAnnotation: (id: string | null) => void;
  setTool: (tool: 'select' | 'draw' | 'pan') => void;
  setLabel: (label: AnnotationType) => void;
}

export const useAnnotationStore = create<AnnotationState>((set) => ({
  currentFile: null,
  currentPage: 1,
  totalPages: 1,
  scale: 1.0,
  
  annotations: [],
  selectedAnnotationId: null,
  activeTool: 'select',
  activeLabel: 'downlight',

  setFile: (file) => set({ currentFile: file, currentPage: 1, annotations: [] }),
  setPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setScale: (scale) => set({ scale }),

  addAnnotation: (annotation) => set((state) => ({ 
    annotations: [...state.annotations, annotation] 
  })),
  
  updateAnnotation: (id, updates) => set((state) => ({
    annotations: state.annotations.map((a) => 
      a.id === id ? { ...a, ...updates } : a
    )
  })),

  deleteAnnotation: (id) => set((state) => ({
    annotations: state.annotations.filter((a) => a.id !== id),
    selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId
  })),

  setAnnotations: (annotations) => set({ annotations }),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  setTool: (tool) => set({ activeTool: tool }),
  setLabel: (label) => set({ activeLabel: label }),
}));
