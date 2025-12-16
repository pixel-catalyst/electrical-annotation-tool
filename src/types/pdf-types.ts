export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  scale: number;
}

export interface PDFMetadata {
  fileName: string;
  fileSize: number;
  totalPages: number;
  fingerprint?: string; // For uniquely identifying the PDF file
}

export interface PDFLoadResult {
  metadata: PDFMetadata;
  pages: PDFPageInfo[];
}
