import { describe, it, expect, vi } from 'vitest';
import { createAnnotationObject } from '../fabric-utils';
import { Annotation } from '../../types/annotation';
import { FabricObject, Group as FabricGroup } from 'fabric';

// Mock fabric classes
vi.mock('fabric', () => {
  return {
    Rect: class {
      type: string = 'rect';
      width?: number;
      height?: number;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      originX?: string;
      originY?: string;
      left?: number;
      top?: number;
      constructor(options: object) { Object.assign(this, options); }
    },
    Text: class {
      text: string;
      type: string = 'text';
      scaleToWidth = vi.fn();
      scaleToHeight = vi.fn();
      set = vi.fn();
      width?: number;
      height?: number;
      scaleX?: number;
      scaleY?: number;
      fontFamily?: string;
      fontSize?: number;
      fill?: string;
      originX?: string;
      originY?: string;
      left?: number;
      top?: number;
      textAlign?: string;

      constructor(text: string, options: object) { 
        this.text = text;
        Object.assign(this, options); 
      }
    },
    Group: class {
      objects: FabricObject[];
      type: string = 'group';
      left?: number;
      top?: number;
      originX?: string;
      originY?: string;
      transparentCorners?: boolean;
      cornerColor?: string;
      cornerStrokeColor?: string;
      borderColor?: string;
      cornerStyle?: string;
      id?: string;
      objectCaching?: boolean;
      width?: number;
      height?: number;

      constructor(objects: FabricObject[], options: object) { 
        this.objects = objects;
        Object.assign(this, options); 
      }
    },
  };
});

describe('fabric-utils', () => {
  describe('createAnnotationObject', () => {
    it('should create a group with rect and text', () => {
      const annotation: Annotation = {
        id: '123',
        page: 1,
        label: 'downlight',
        bbox: { x: 10, y: 20, width: 100, height: 50 },
        created_at: '2023-01-01',
      };
      const scale = 1.5;

      const group = createAnnotationObject(annotation, scale) as FabricGroup;

      // Check Group properties
      expect(group.type).toBe('group');
      expect(group.left).toBe(10 * scale);
      expect(group.top).toBe(20 * scale);
      expect(group.width).toBe(100 * scale);
      expect(group.height).toBe(50 * scale);
      expect(group.id).toBe('123');

      // Check objects inside group
      expect(group.objects).toHaveLength(2);
      
      const rect = group.objects[0];
      const text = group.objects[1];

      // Check Rect
      expect(rect.type).toBe('rect');
      // width/height logic involves subtracting strokeWidth (2)
      // width = 100 * 1.5 = 150. rectWidth = 150 - 2 = 148
      expect(rect.width).toBe(148);
      
      // Check Text
      // @ts-expect-error - 'text' property is added by mock
      expect(text.type).toBe('text');
      // @ts-expect-error: 'text' property is added by mock
      expect(text.text).toBe('downlight');
    });

    it('should handle text spacing replacement in label', () => {
      const annotation: Annotation = {
        id: '124',
        page: 1,
        label: 'switch_single',
        bbox: { x: 0, y: 0, width: 50, height: 50 },
        created_at: '2023-01-01',
      };
      const scale = 1;

      const group = createAnnotationObject(annotation, scale) as FabricGroup;
      const text = group.objects[1];

      // @ts-expect-error: 'text' property is added by mock
      expect(text.text).toBe('switch single');
    });
  });
});
