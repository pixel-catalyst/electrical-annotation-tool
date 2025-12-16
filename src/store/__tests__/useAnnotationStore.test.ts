import { describe, it, expect, beforeEach } from 'vitest';
import { useAnnotationStore } from '../useAnnotationStore';
import type { Annotation } from '../../types/annotation';

describe('useAnnotationStore', () => {
  const initialState = useAnnotationStore.getState();

  beforeEach(() => {
    useAnnotationStore.setState(initialState, true);
  });

  it('should have correct initial state', () => {
    const state = useAnnotationStore.getState();
    expect(state.currentFile).toBeNull();
    expect(state.currentPage).toBe(1);
    expect(state.annotations).toEqual([]);
    expect(state.activeTool).toBe('select');
  });

  it('should set file correctly', () => {
    useAnnotationStore.getState().setFile('test.pdf');
    const state = useAnnotationStore.getState();
    expect(state.currentFile).toBe('test.pdf');
    expect(state.currentPage).toBe(1);
    expect(state.annotations).toEqual([]);
  });

  it('should add an annotation', () => {
    const annotation: Annotation = {
      id: '1',
      page: 1,
      label: 'downlight',
      bbox: { x: 10, y: 10, width: 20, height: 20 },
      created_at: new Date().toISOString(),
    };

    useAnnotationStore.getState().addAnnotation(annotation);
    
    const state = useAnnotationStore.getState();
    expect(state.annotations).toHaveLength(1);
    expect(state.annotations[0]).toEqual(annotation);
  });

  it('should update an annotation', () => {
    const annotation: Annotation = {
      id: '1',
      page: 1,
      label: 'downlight',
      bbox: { x: 10, y: 10, width: 20, height: 20 },
      created_at: new Date().toISOString(),
    };

    useAnnotationStore.getState().addAnnotation(annotation);
    useAnnotationStore.getState().updateAnnotation('1', { label: 'switch_single' });

    const state = useAnnotationStore.getState();
    expect(state.annotations[0].label).toBe('switch_single');
    // Ensure other properties remain
    expect(state.annotations[0].id).toBe('1');
  });

  it('should delete an annotation', () => {
    const annotation: Annotation = {
      id: '1',
      page: 1,
      label: 'downlight',
      bbox: { x: 10, y: 10, width: 20, height: 20 },
      created_at: new Date().toISOString(),
    };

    useAnnotationStore.getState().addAnnotation(annotation);
    useAnnotationStore.getState().deleteAnnotation('1');

    const state = useAnnotationStore.getState();
    expect(state.annotations).toHaveLength(0);
  });

  it('should select an annotation', () => {
    useAnnotationStore.getState().selectAnnotation('1');
    expect(useAnnotationStore.getState().selectedAnnotationId).toBe('1');

    useAnnotationStore.getState().selectAnnotation(null);
    expect(useAnnotationStore.getState().selectedAnnotationId).toBeNull();
  });

  it('should change active tool', () => {
    useAnnotationStore.getState().setTool('draw');
    expect(useAnnotationStore.getState().activeTool).toBe('draw');
  });

  it('should change active label', () => {
    useAnnotationStore.getState().setLabel('gpo');
    expect(useAnnotationStore.getState().activeLabel).toBe('gpo');
  });
});
