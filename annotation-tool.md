# Electrical Symbol Annotation Tool

## Overview

A web-based annotation tool for labeling electrical symbols in construction plan drawings (PDFs). The labeled data will be used to train machine learning models for automated electrical takeoffs.

---

## Objective

Create a React application that allows users to:
1. Load PDF drawings
2. Draw bounding boxes around electrical symbols
3. Assign labels to each bounding box
4. Save/load annotations as JSON files

—

## Requirements

### Functional Requirements

#### PDF Viewing
- [ ] Load and display PDF files
- [ ] Navigate between pages (next/previous)
- [ ] Zoom in/out
- [ ] Pan around the document

#### Annotation Features
- [ ] Draw rectangular bounding boxes on the PDF
- [ ] Select existing boxes to edit or delete
- [ ] Assign a label (symbol type) to each box
- [ ] Support predefined label categories (see below)
- [ ] Allow custom labels for unknown symbols

#### Data Management
- [ ] Save annotations to JSON file
- [ ] Load existing annotations for a PDF
- [ ] Export annotations in standard format (COCO or YOLO)

#### UI/UX
- [ ] Toolbar with annotation tools (select, draw, delete)
- [ ] Label dropdown/autocomplete
- [ ] List view of all annotations on current page
- [ ] Keyboard shortcuts for common actions

### Non-Functional Requirements
- Use React + TypeScript
- Clean, testable code with unit tests
- Responsive design
- Works in modern browsers (Chrome, Firefox, Safari)

---

## Predefined Label Categories

### Lighting
- `downlight`
- `downlight_dimmable`
- `pendant_light`
- `wall_light`
- `emergency_light`
- `exit_sign`
- `batten_light`

### Power
- `gpo` (general power outlet)
- `gpo_double`
- `gpo_weatherproof`
- `usb_outlet`

### Switches
- `switch_single`
- `switch_double`
- `switch_dimmer`
- `switch_sensor`

### Data/Communications
- `data_outlet`
- `phone_outlet`
- `tv_outlet`

### Safety
- `smoke_detector`
- `heat_detector`
- `speaker`

### Distribution
- `switchboard`
- `distribution_board`

### Other
- `exhaust_fan`
- `range_hood`
- `unknown`

---

## Annotation JSON Format

```json
{
  "file": "floor-plan-electrical.pdf",
  "annotations": [
    {
      "id": "uuid-1",
      "page": 1,
      "label": "downlight",
      "bbox": {
        "x": 150.5,
        "y": 200.3,
        "width": 25.0,
        "height": 25.0
      },
      "created_at": "2025-01-15T10:30:00Z",
      "created_by": "annotator1"
    }
  ],
  "metadata": {
    "total_pages": 5,
    "annotated_pages": [1, 2, 3],
    "last_modified": "2025-01-15T12:00:00Z"
  }
}
```

### Coordinate System
- Origin (0,0) is top-left of the PDF page
- Coordinates are in PDF points (1 point = 1/72 inch)
- Must handle zoom/scale transformations correctly

---

## Technical Guidelines

### Recommended Libraries
- **PDF rendering**: `pdfjs-dist` or `react-pdf`
- **Canvas drawing**: HTML5 Canvas or `fabric.js`
- **State management**: React Context or Zustand
- **UUID generation**: `uuid` package

### Project Structure
```
src/
├── components/
│   ├── PdfViewer.tsx
│   ├── AnnotationCanvas.tsx
│   ├── Toolbar.tsx
│   ├── LabelSelector.tsx
│   └── AnnotationList.tsx
├── hooks/
│   ├── useAnnotations.ts
│   └── usePdfDocument.ts
├── types/
│   └── annotation.ts
├── utils/
│   ├── export.ts
│   └── coordinates.ts
└── App.tsx
```

### Key Challenges
1. **Coordinate transformation** - PDF coordinates vs screen coordinates at different zoom levels
2. **Canvas overlay** - Keeping annotation canvas aligned with PDF canvas
3. **Performance** - Handling PDFs with many pages/annotations

---

## Deliverables

1. **Source code** in a Git repository
2. **README** with setup instructions
3. **Unit tests** for core functionality
4. **Demo video** (2-3 minutes) showing the tool in action

---

## Evaluation Criteria

| Criteria | Weight |
|----------|--------|
| Functionality (all requirements met) | 40% |
| Code quality (clean, readable, testable) | 25% |
| UI/UX (intuitive, responsive) | 20% |
| Tests (coverage, meaningful tests) | 15% |

---

## Timeline

- **Week 1**: PDF viewing + basic box drawing
- **Week 2**: Labels, save/load, annotation list
- **Week 3**: Polish, export formats, keyboard shortcuts
- **Week 4**: Testing, documentation, demo

---

## Stretch Goals (Optional)

- [ ] Polygon annotations (for irregular symbols)
- [ ] Copy annotations between pages
- [ ] Annotation statistics dashboard
- [ ] Dark mode
- [ ] Multi-user support (track annotator)
- [ ] COCO format export for ML training
- [ ] Undo/redo functionality

---

## Resources

### Example Annotation Tools
- [LabelImg](https://github.com/heartexlabs/labelImg) - Classic bounding box tool
- [CVAT](https://github.com/opencv/cvat) - Computer Vision Annotation Tool
- [Label Studio](https://labelstud.io/) - Multi-format annotation

### PDF.js Documentation
- https://mozilla.github.io/pdf.js/

### COCO Format Reference
- https://cocodataset.org/#format-data

---
