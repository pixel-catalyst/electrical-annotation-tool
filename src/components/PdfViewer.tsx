import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAnnotationStore } from '../store/useAnnotationStore';
import { AnnotationCanvas } from './AnnotationCanvas';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Moon, Sun, Monitor, Maximize } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const PdfViewer: React.FC = () => {
  const { 
    currentFile, 
    currentPage, 
    scale, 
    setPage, 
    setTotalPages, 
    setScale 
  } = useAnnotationStore();

  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const isAutoFitted = useRef<boolean>(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Reset auto-fit flag when file or page changes
  useEffect(() => {
    isAutoFitted.current = false;
  }, [currentFile, currentPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setTotalPages(numPages);
  };

  const calculateFitScale = useCallback((pageWidth: number, containerWidth: number) => {
    if (!containerWidth || !pageWidth) return 1.0;
    const padding = 80;
    const availableWidth = Math.max(0, containerWidth - padding);
    const calculatedScale = Math.floor((availableWidth / pageWidth) * 100) / 100;
    return Math.max(0.1, calculatedScale);
  }, []);

  const onPageLoadSuccess = useCallback((page: { getViewport: (params: { scale: number }) => { width: number; height: number } }) => {
    const viewport = page.getViewport({ scale: 1 });
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;

    setPageDimensions(prev => {
        if (prev.width === pageWidth && prev.height === pageHeight) return prev;
        return { width: pageWidth, height: pageHeight };
    });

    if (!isAutoFitted.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const fitScale = calculateFitScale(pageWidth, containerWidth);
      if (Math.abs(fitScale - scale) > 0.05) {
         setScale(fitScale);
      }
      isAutoFitted.current = true;
    }
  }, [calculateFitScale, scale, setScale]);

  // Center scroll on load/scale
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Small timeout to ensure layout has updated with new padding/size
    const timer = setTimeout(() => {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }, 10);

    return () => clearTimeout(timer);
  }, [scale, pageDimensions, currentFile]);

  const handleFitWidth = () => {
     if (containerRef.current && pageDimensions.width > 0) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(calculateFitScale(pageDimensions.width, containerWidth));
     }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      
      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar text-center" ref={containerRef}>
        <div className="min-w-full min-h-full inline-flex justify-center items-center py-32 px-[35vw]">
          {currentFile ? (
            <div className="relative shadow-2xl transition-transform duration-200 ease-out origin-top rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10 text-left">
              <Document
              file={currentFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <div 
                className="relative bg-white" 
                style={{ 
                  width: pageDimensions.width * scale, 
                  height: pageDimensions.height * scale 
                }}
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={scale}
                  onLoadSuccess={onPageLoadSuccess}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="block"
                />
                
                {/* Overlay Canvas */}
                <div className="absolute top-0 left-0 z-20 pointer-events-auto">
                  <AnnotationCanvas 
                    width={pageDimensions.width * scale} 
                    height={pageDimensions.height * scale}
                    scale={scale}
                  />
                </div>
              </div>
            </Document>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-200 m-auto">
            <div className="w-24 h-24 bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
               <Monitor size={48} className="opacity-40 text-gray-800 dark:text-white" />
            </div>
            <p className="text-3xl mb-3 font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-400 dark:from-white dark:to-gray-200">Sonrai Annotator</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 font-medium tracking-wide">SELECT A DRAWING TO BEGIN</p>
          </div>
        )}
        </div>
      </div>

      {/* VisionOS Control Bar (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                  <div className="flex items-center gap-6 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] rounded-full px-6 py-3 transition-all hover:scale-105 hover:bg-white/70 dark:hover:bg-black/70">
                    {/* Page Nav */}
                    <div className="flex items-center gap-3 border-r border-gray-400/20 dark:border-white/10 pr-6">
                                  <button 
                                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 disabled:opacity-30 transition-colors"
                                    disabled={currentPage <= 1}
                                  >
                                    <ChevronLeft size={20} />
                                  </button>
                                  <span className="text-sm font-semibold w-12 text-center text-gray-600 dark:text-gray-200 font-mono">
                                    {currentPage} / {numPages || '-'}
                                  </span>
                                  <button 
                                    onClick={() => setPage(Math.min(numPages, currentPage + 1))}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 disabled:opacity-30 transition-colors"
                                    disabled={currentPage >= numPages}
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                </div>
                      
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-3 border-r border-gray-400/20 dark:border-white/10 pr-6">
                                  <button 
                                    onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 transition-colors"
                                  >
                                    <ZoomOut size={20} />
                                  </button>
                                  <span className="text-sm font-semibold w-12 text-center text-gray-600 dark:text-gray-200 font-mono">
                                    {Math.round(scale * 100)}%
                                  </span>
                                  <button 
                                    onClick={() => setScale(scale + 0.1)}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 transition-colors"
                                  >
                                    <ZoomIn size={20} />
                                  </button>
                                </div>
                      
                                {/* Tools */}
                                <div className="flex items-center gap-3 pl-1">
                                   <button
                                    onClick={handleFitWidth}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 transition-colors"
                                    title="Fit to width"
                                  >
                                    <Maximize size={20} />
                                  </button>
                                  <button 
                                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                    className="p-2 hover:bg-white/50 dark:hover:bg-white/20 rounded-full text-gray-700 dark:text-gray-100 transition-colors"
                                  >
                                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                  </button>          </div>

        </div>
      </div>
      
    </div>
  );
};