import React from 'react';
import { useAnnotationStore } from '../store/useAnnotationStore';
import { MousePointer, Pen, Upload, Save } from 'lucide-react';
import clsx from 'clsx';
import { LABEL_CATEGORIES, getCategoryColor } from '../types/annotation';

export const Toolbar: React.FC = () => {
  const { 
    activeTool, 
    setTool, 
    activeLabel, 
    setLabel, 
    annotations,
    currentFile 
  } = useAnnotationStore();

  const handleSave = () => {
    if (!currentFile) return;
    const data = {
      file: currentFile,
      annotations,
      metadata: {
        total_pages: 0, 
        annotated_pages: [...new Set(annotations.map(a => a.page))],
        last_modified: new Date().toISOString()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-${currentFile.split('.pdf')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.annotations && Array.isArray(json.annotations)) {
          useAnnotationStore.getState().setAnnotations(json.annotations);
        }
      } catch (err) {
        console.error("Failed to parse JSON", err);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tools Capsule */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full p-2 w-16 flex flex-col items-center gap-3">
        
        <button
          onClick={() => setTool('select')}
          className={clsx(
            "p-3 rounded-full transition-all relative group",
            activeTool === 'select'
              ? "bg-white dark:bg-gray-700 text-primary shadow-md"
              : "text-gray-500 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-white/10"
          )}
          title="Select Mode"
        >
          <MousePointer size={20} />
        </button>

        <button
          onClick={() => setTool('draw')}
          className={clsx(
            "p-3 rounded-full transition-all relative group",
            activeTool === 'draw'
              ? "bg-white dark:bg-gray-700 text-primary shadow-md"
              : "text-gray-500 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-white/10"
          )}
          title="Draw Mode"
        >
          <Pen size={20} />
        </button>

        <div className="w-8 h-[1px] bg-white/20 dark:bg-white/10"></div>

        <div className="relative group">
          <div 
            className="w-10 h-10 rounded-full border border-white/40 dark:border-white/20 shadow-sm cursor-pointer transition-transform hover:scale-110 flex items-center justify-center bg-white/20 dark:bg-white/5"
          >
             <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: getCategoryColor(activeLabel) }}></div>
          </div>
          
          {/* Glass Pop-out Menu */}
          <div className="absolute right-full top-0 mr-6 w-64 bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40 dark:border-white/10 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-right scale-95 group-hover:scale-100 max-h-[80vh] overflow-y-auto custom-scrollbar z-50">
             <div className="text-[10px] font-bold text-gray-400 dark:text-gray-200 px-3 py-2 uppercase tracking-widest mb-1">Annotation Type</div>
             {Object.entries(LABEL_CATEGORIES).map(([category, labels]) => (
                <div key={category} className="mb-3">
                  <div className="text-[10px] font-bold text-gray-400/80 dark:text-gray-300 px-3 py-1 uppercase">{category}</div>
                  {labels.map(label => (
                    <button
                      key={label}
                      onClick={() => setLabel(label)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-3 transition-colors border border-transparent",
                        activeLabel === label 
                           ? "bg-white/80 dark:bg-white/10 shadow-sm border-white/20 dark:border-white/5" 
                           : "hover:bg-white/40 dark:hover:bg-white/5 text-gray-500 dark:text-gray-300"
                      )}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(label) }}></div>
                      <span className={clsx("truncate", activeLabel === label ? "text-gray-800 dark:text-white font-medium" : "")}>
                        {label.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Actions Capsule */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full p-2 w-16 flex flex-col items-center gap-2">
        <label className="p-3 rounded-full text-gray-500 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-white/10 cursor-pointer transition-colors" title="Load JSON">
          <Upload size={20} />
          <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
        </label>
        
        <button 
          onClick={handleSave}
          disabled={!currentFile}
          className="p-3 rounded-full text-gray-500 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
          title="Save JSON"
        >
          <Save size={20} />
        </button>
      </div>

    </div>
  );
};
