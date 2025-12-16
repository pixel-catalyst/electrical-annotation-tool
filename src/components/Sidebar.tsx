import React, { useState } from 'react';
import { useAnnotationStore } from '../store/useAnnotationStore';
import { FileText, Trash2, FolderOpen, Layers, Box } from 'lucide-react';
import clsx from 'clsx';
import { getCategoryColor } from '../types/annotation';

const FILES = [
  "22075 - Bettys Burgers Eastlands - Electrical Services-E01.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E02.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E03.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E04.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E05.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E06.pdf",
  "22075 - Bettys Burgers Eastlands - Electrical Services-E07.pdf",
];

export const Sidebar: React.FC = () => {
  const { 
    currentFile, 
    setFile, 
    annotations, 
    currentPage, 
    deleteAnnotation, 
    selectAnnotation, 
    selectedAnnotationId 
  } = useAnnotationStore();

  const [activeTab, setActiveTab] = useState<'files' | 'layers'>('files');
  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl overflow-hidden transition-all duration-300">
      
      {/* Glass Header */}
      <div className="p-4 border-b border-white/20 dark:border-white/5">
        <h1 className="font-serif font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Sonrai Annotator
        </h1>
      </div>

      {/* Tabs - Mac Segmented Control Style */}
      <div className="px-4 py-3">
                    <div className="flex p-1 bg-gray-200/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                      <button
                        onClick={() => setActiveTab('files')}
                        className={clsx(
                          "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                          activeTab === 'files' 
                            ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                            : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                        )}
                      >
                        <FolderOpen size={14} />
                        Files
                      </button>
                      <button
                        onClick={() => setActiveTab('layers')}
                        className={clsx(
                          "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                          activeTab === 'layers' 
                            ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                            : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                        )}
                      >
                        <Layers size={14} />
                        Layers
                      </button>
                    </div>
                  </div>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
        
        {activeTab === 'files' && (
          <div className="space-y-1">
            {FILES.map((file) => {
               const displayName = file.replace('22075 - Bettys Burgers Eastlands - ', '').replace('.pdf', '');
               return (
                <button
                  key={file}
                  onClick={() => setFile(file)}
                  className={clsx(
                    "w-full text-left p-3 rounded-2xl text-sm flex items-start gap-3 transition-all border group",
                    currentFile === file 
                      ? "bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/10 shadow-sm" 
                      : "border-transparent hover:bg-white/30 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
                  )}
                >
                  <div className={clsx(
                    "p-2 rounded-lg shrink-0 transition-colors",
                    currentFile === file ? "bg-primary/20 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-100"
                  )}>
                    <FileText size={16} />
                  </div>
                  <span className={clsx(
                    "mt-1.5 line-clamp-2 leading-tight font-medium",
                    currentFile === file ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-200"
                  )}>
                    {displayName}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-300">Page {currentPage}</span>
              <span className="text-[10px] font-bold bg-gray-200/50 dark:bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-300">{pageAnnotations.length}</span>
            </div>
            
            {pageAnnotations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                <Box size={40} className="mb-3 text-gray-500 dark:text-gray-300 stroke-1" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No annotations</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Draw a box to start</p>
              </div>
            ) : (
              pageAnnotations.map(a => (
                <div 
                  key={a.id}
                  onClick={() => selectAnnotation(a.id)}
                  className={clsx(
                    "group relative p-2 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm",
                    selectedAnnotationId === a.id 
                      ? "bg-white/80 dark:bg-white/10 border-primary/50 shadow-sm" 
                      : "bg-white/30 dark:bg-white/5 border-transparent hover:bg-white/50 dark:hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1.5 h-8 rounded-full shadow-sm" 
                      style={{ backgroundColor: getCategoryColor(a.label) }}
                    ></div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs capitalize truncate">
                        {a.label.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate opacity-70">
                        ID: {a.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnotation(a.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
