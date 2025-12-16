import { PdfViewer } from './components/PdfViewer';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* Mesh Gradient Background Layer (Animation can be added here if desired) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Area (Z-0) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <PdfViewer />
      </div>

      {/* Floating Interface Layer (Z-10+) */}
      <div className="absolute inset-0 pointer-events-none z-10 p-4 flex justify-between">
        {/* Left Panel */}
        <div className="w-80 h-full pointer-events-auto flex flex-col">
           <Sidebar />
        </div>

        {/* Right Panel */}
        <div className="h-auto pointer-events-auto">
           <Toolbar />
        </div>
      </div>
    </div>
  );
}

export default App;