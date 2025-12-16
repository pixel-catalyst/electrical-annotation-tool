import { Group, Rect, Text, FabricObject } from 'fabric';
import type { Annotation } from '../types/annotation';
import { getCategoryColor } from '../types/annotation';

export const createAnnotationObject = (annotation: Annotation, scale: number): FabricObject => {
  const { label, bbox, id } = annotation;
  const color = getCategoryColor(label);
  
  // Target dimensions in canvas pixels (Visual Bounds)
  const targetLeft = bbox.x * scale;
  const targetTop = bbox.y * scale;
  const targetWidth = bbox.width * scale;
  const targetHeight = bbox.height * scale;
  
  const strokeWidth = 2;

  // 1. Background Rectangle
  // Size it so that with stroke, it equals target dimension
  const rectWidth = Math.max(0, targetWidth - strokeWidth);
  const rectHeight = Math.max(0, targetHeight - strokeWidth);

  const rect = new Rect({
    width: rectWidth,
    height: rectHeight,
    fill: color + '33', // 20% opacity
    stroke: color,
    strokeWidth: strokeWidth,
    originX: 'center',
    originY: 'center',
    left: 0,
    top: 0
  });

  // 2. Label Text
  // Position at the top edge
  const padding = 4;
  
  // Calculate top offset relative to center
  // Group height is targetHeight. Top edge is -targetHeight/2.
  const textTop = (-targetHeight / 2) + padding;

  const text = new Text(label.replace(/_/g, ' '), {
    fontFamily: 'sans-serif',
    fontSize: 14,
    fill: color,
    originX: 'center',
    originY: 'top', // Align by top edge of text
    left: 0,
    top: textTop,
    textAlign: 'center'
  });

  // Scale text to fit inside the rectangle with padding
  const maxWidth = Math.max(0, targetWidth - padding * 2);
  const maxHeight = Math.max(0, targetHeight - padding * 2);

  // Apply scaling if text is too big
  if (maxWidth > 0 && maxHeight > 0) {
      if (text.width && text.width > maxWidth) {
        text.scaleToWidth(maxWidth);
      }
      
      // Check height after width scale
      if (text.height && (text.height * (text.scaleY || 1)) > maxHeight) {
        text.scaleToHeight(maxHeight);
      }
  } else {
      text.set({ scaleX: 0, scaleY: 0 });
  }

  // 3. Group
  const group = new Group([rect, text], {
    left: targetLeft,
    top: targetTop,
    originX: 'left',
    originY: 'top',
    transparentCorners: false,
    cornerColor: color,
    cornerStrokeColor: '#fff',
    borderColor: color,
    cornerStyle: 'circle',
    id: id, 
    objectCaching: false,
    // Explicitly set width/height to avoid Fabric recalculating bounds that might drift
    width: targetWidth,
    height: targetHeight
  } as any);

  return group;
};