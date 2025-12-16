import React, { useEffect, useRef } from 'react';
import { Canvas, Rect, FabricObject } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { useAnnotationStore } from '../store/useAnnotationStore';
import { getCategoryColor } from '../types/annotation';
import { createAnnotationObject } from '../utils/fabric-utils';
import type { Annotation } from '../types/annotation';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  scale: number;
}

interface FabricObjectWithId extends FabricObject {
  id: string;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ width, height, scale }) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const isDragging = useRef<boolean>(false);
  
  const {
    annotations,
    activeTool,
    activeLabel,
    currentPage,
    addAnnotation,
    updateAnnotation,
    selectAnnotation,
    selectedAnnotationId
  } = useAnnotationStore();

  const activeLabelRef = useRef(activeLabel);
  const activeToolRef = useRef(activeTool);

  // Update refs when props change
  useEffect(() => {
    activeLabelRef.current = activeLabel;
    activeToolRef.current = activeTool;
    
    // Update canvas selection mode dynamically
    if (fabricCanvas.current) {
      fabricCanvas.current.selection = activeTool === 'select';
      // Also update existing objects' selectability
      fabricCanvas.current.getObjects().forEach((obj) => {
        obj.set({
          selectable: activeTool === 'select',
          evented: activeTool === 'select',
          hoverCursor: activeTool === 'select' ? 'move' : 'default'
        });
      });
      fabricCanvas.current.requestRenderAll();
    }
  }, [activeLabel, activeTool]);

  // 1. Initialize Canvas
  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new Canvas(canvasEl.current, {
      height,
      width,
      selection: activeToolRef.current === 'select',
      renderOnAddRemove: false,
    });

    fabricCanvas.current = canvas;

    // --- Event Handlers ---

    const handleSelection = () => {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length === 1) {
        const id = (activeObjects[0] as FabricObjectWithId).id;
        if (id) selectAnnotation(id);
      } else {
        selectAnnotation(null);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelection);

    // Handle Modification (Drag/Resize)
    canvas.on('object:modified', (e) => {
      const target = e.target;
      if (!target || !(target as FabricObjectWithId).id) return;
      
      const id = (target as FabricObjectWithId).id;
      const invScale = 1 / scale;

      updateAnnotation(id, {
        bbox: {
          x: (target.left || 0) * invScale,
          y: (target.top || 0) * invScale,
          width: (target.getScaledWidth() || 0) * invScale,
          height: (target.getScaledHeight() || 0) * invScale,
        }
      });
      
      isDragging.current = false;
    });

    canvas.on('object:moving', () => { isDragging.current = true; });
    canvas.on('object:scaling', () => { isDragging.current = true; });

    // Drawing Logic
    let isDown = false;
    let origX = 0;
    let origY = 0;
    let rect: Rect | null = null;

    canvas.on('mouse:down', (o) => {
      if (activeToolRef.current !== 'draw') return;
      
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      isDown = true;
      const pointer = canvas.getScenePoint(o.e);
      origX = pointer.x;
      origY = pointer.y;
      
      const color = getCategoryColor(activeLabelRef.current);

      rect = new Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: 0,
        height: 0,
        fill: color + '33',
        stroke: color,
        strokeWidth: 2 / scale,
        transparentCorners: false,
        selectable: false,
        evented: false,
      });
      
      canvas.add(rect);
      canvas.requestRenderAll();
    });

    canvas.on('mouse:move', (o) => {
      if (!isDown || !rect) return;
      const pointer = canvas.getScenePoint(o.e);

      if (origX > pointer.x) {
        rect.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        rect.set({ top: Math.abs(pointer.y) });
      }

      rect.set({ width: Math.abs(origX - pointer.x) });
      rect.set({ height: Math.abs(origY - pointer.y) });

      canvas.requestRenderAll();
    });

    canvas.on('mouse:up', () => {
      if (activeToolRef.current !== 'draw' || !isDown || !rect) return;
      isDown = false;

      if (rect.width === 0 || rect.height === 0) {
        canvas.remove(rect);
        canvas.requestRenderAll();
        return;
      }

      const id = uuidv4();
      const invScale = 1 / scale;
      
      const newAnnotation: Annotation = {
        id,
        page: currentPage,
        label: activeLabelRef.current,
        bbox: {
          x: (rect.left || 0) * invScale,
          y: (rect.top || 0) * invScale,
          width: ((rect.width || 0) + (rect.strokeWidth || 0)) * invScale,
          height: ((rect.height || 0) + (rect.strokeWidth || 0)) * invScale,
        },
        created_at: new Date().toISOString(),
      };
      
      canvas.remove(rect);
      addAnnotation(newAnnotation);
      selectAnnotation(id);
    });

    return () => {
      canvas.dispose();
    };
  }, [width, height, scale, currentPage, addAnnotation, selectAnnotation, updateAnnotation]);


  // 2. Sync State -> Canvas
  useEffect(() => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    if (isDragging.current) return;

    const pageAnnotations = annotations.filter(a => a.page === currentPage);
    const existingObjects = canvas.getObjects();
    const newIds = new Set(pageAnnotations.map(a => a.id));

    // A. Remove deleted objects
    existingObjects.forEach((obj) => {
      if ((obj as FabricObjectWithId).id && !newIds.has((obj as FabricObjectWithId).id)) {
        canvas.remove(obj);
      }
    });

    // B. Add or Update objects
    pageAnnotations.forEach(a => {
      let obj = existingObjects.find((o) => (o as FabricObjectWithId).id === a.id);
      
      const left = a.bbox.x * scale;
      const top = a.bbox.y * scale;
      const width = a.bbox.width * scale;
      const height = a.bbox.height * scale;
      const color = getCategoryColor(a.label);

      if (obj) {
        // Update geometry if needed
        const currentScaledWidth = obj.getScaledWidth();
        const currentScaledHeight = obj.getScaledHeight();

        if (Math.abs(obj.left - left) > 1 || Math.abs(obj.top - top) > 1 || 
            Math.abs(currentScaledWidth - width) > 1 || Math.abs(currentScaledHeight - height) > 1) {
             
             if (obj.type === 'rect') {
                obj.set({
                  left,
                  top,
                  width,
                  height,
                  scaleX: 1,
                  scaleY: 1
                });
             } else {
                // For Groups/Shapes, we scale them to fit
                // Avoid division by zero
                const baseWidth = obj.width || 1;
                const baseHeight = obj.height || 1;
                
                obj.set({
                    left,
                    top,
                    scaleX: width / baseWidth,
                    scaleY: height / baseHeight
                });
             }
             obj.setCoords();
        }
        
        // Update Styling (Selection State)
        const isSelected = a.id === selectedAnnotationId;
        
        obj.set({
          cornerColor: isSelected ? '#2563EB' : color,
          borderColor: isSelected ? '#2563EB' : color,
          cornerStrokeColor: '#fff',
        });

        // For Rects, we can update stroke/fill dynamically easily.
        // For Groups created by our utility, the color is baked in. 
        // We could traverse the group to update color if needed, but for now we assume label (and color) doesn't change often.
        if (obj.type === 'rect') {
           obj.set({
             stroke: isSelected ? '#2563EB' : color,
             strokeWidth: isSelected ? 3 : 2,
           });
        }

      } else {
        // Create new object using our utility
        obj = createAnnotationObject(a, scale);
        canvas.add(obj);
      }

      // Lock/Unlock based on tool
      obj.set({
        selectable: activeTool === 'select',
        evented: activeTool === 'select',
        hoverCursor: activeTool === 'select' ? 'move' : 'default'
      });
    });

    // C. Sync Selection State (Store -> Canvas)
    // Ensure Fabric's active object matches the store's selectedAnnotationId
    const activeObjects = canvas.getActiveObjects();
    const activeId = activeObjects.length === 1 ? (activeObjects[0] as FabricObjectWithId).id : null;

    if (selectedAnnotationId && activeId !== selectedAnnotationId) {
      // Store has a selection, but Canvas doesn't match
      const objToSelect = existingObjects.find((o) => (o as FabricObjectWithId).id === selectedAnnotationId);
      if (objToSelect) {
        canvas.setActiveObject(objToSelect);
      }
    } else if (!selectedAnnotationId && activeObjects.length > 0) {
      // Store has no selection, but Canvas does
      canvas.discardActiveObject();
    }

    canvas.requestRenderAll();

  }, [annotations, currentPage, scale, activeTool, selectedAnnotationId]);

  return <canvas ref={canvasEl} />;
};