export type AnnotationType = 
  | 'downlight' | 'downlight_dimmable' | 'pendant_light' | 'wall_light' | 'emergency_light' | 'exit_sign' | 'batten_light'
  | 'gpo' | 'gpo_double' | 'gpo_weatherproof' | 'usb_outlet'
  | 'switch_single' | 'switch_double' | 'switch_dimmer' | 'switch_sensor'
  | 'data_outlet' | 'phone_outlet' | 'tv_outlet'
  | 'smoke_detector' | 'heat_detector' | 'speaker'
  | 'switchboard' | 'distribution_board'
  | 'exhaust_fan' | 'range_hood' | 'unknown';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Annotation {
  id: string;
  page: number;
  label: AnnotationType;
  /** Custom text/name associated with the annotation */
  text?: string;
  bbox: BoundingBox;
  created_at: string;
  created_by?: string;
}

export interface AnnotationFile {
  version: string;
  file: string;
  annotations: Annotation[];
  metadata: {
    total_pages: number;
    annotated_pages: number[];
    last_modified: string;
  };
}

export const LABEL_CATEGORIES: Record<string, AnnotationType[]> = {
  Lighting: ['downlight', 'downlight_dimmable', 'pendant_light', 'wall_light', 'emergency_light', 'exit_sign', 'batten_light'],
  Power: ['gpo', 'gpo_double', 'gpo_weatherproof', 'usb_outlet'],
  Switches: ['switch_single', 'switch_double', 'switch_dimmer', 'switch_sensor'],
  Data: ['data_outlet', 'phone_outlet', 'tv_outlet'],
  Safety: ['smoke_detector', 'heat_detector', 'speaker'],
  Distribution: ['switchboard', 'distribution_board'],
  Other: ['exhaust_fan', 'range_hood', 'unknown'],
};

export const CATEGORY_COLORS: Record<string, string> = {
  Lighting: '#F59E0B', // Amber
  Power: '#EF4444',    // Red
  Switches: '#3B82F6', // Blue
  Data: '#10B981',     // Emerald
  Safety: '#8B5CF6',   // Violet
  Distribution: '#6B7280', // Gray
  Other: '#F472B6',    // Pink
};

export const getCategoryColor = (label: AnnotationType): string => {
  for (const [category, labels] of Object.entries(LABEL_CATEGORIES)) {
    if (labels.includes(label)) {
      return CATEGORY_COLORS[category];
    }
  }
  return '#9CA3AF'; // Default Gray
};
