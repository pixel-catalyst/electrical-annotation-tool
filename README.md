# Electrical Symbol Annotation Tool

A web-based annotation tool for labeling electrical symbols in construction plan drawings.

## Features
- **PDF Viewing:** Navigate pages, zoom, and pan.
- **Annotation:** Draw bounding boxes around electrical symbols.
- **Labeling:** Assign standard electrical labels (Lighting, Power, etc.).
- **Data Persistence:** Save and Load annotations as JSON files.
- **Custom UI:** Designed with a "Pinkish-Orange" theme.

## Setup

1.  Navigate to the project directory:
    ```bash
    cd electrical-annotation-tool
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

## Usage
1.  **Select a File:** Click on a PDF file from the sidebar list.
2.  **Navigate:** Use the page controls (Next/Prev) or Zoom controls in the top bar.
3.  **Annotate:**
    - Select **Draw** mode from the toolbar.
    - Click and drag on the PDF to draw a box.
    - The active label (selected in the toolbar) will be assigned.
4.  **Edit:**
    - Select **Select** mode.
    - Click an annotation to select it (highlighted).
    - Drag corners to resize or move.
    - Click the trash icon in the sidebar to delete.
5.  **Save/Load:**
    - Click **Save Annotations** to download a JSON file.
    - Click **Load JSON** to restore annotations from a file.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS v4
- React-PDF
- Fabric.js (v6)
- Zustand