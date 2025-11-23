import React, { useState } from 'react';
import { ProcessingStatus, StampConfig, PdfPageImage, LayoutMode } from './types';
import UploadZone from './components/UploadZone';
import StampControls from './components/StampControls';
import LayoutControls from './components/LayoutControls';
import GroupControls from './components/GroupControls';
import PreviewArea from './components/PreviewArea';
import { convertPdfToImages } from './services/pdfService';
import { FileText, ScrollText, Github, User } from 'lucide-react';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_STAMP: StampConfig = {
  text: 'APPROVED',
  subText: getTodayDate(),
  size: 200,
  color: '#D32F2F',
  opacity: 1,
  shape: 'square',
  paddingX: 50,
  paddingY: 50,
};

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [pdfPages, setPdfPages] = useState<PdfPageImage[]>([]);
  const [stampConfig, setStampConfig] = useState<StampConfig>(DEFAULT_STAMP);
  const [fileName, setFileName] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vertical');
  const [pagesPerGroup, setPagesPerGroup] = useState<number>(1);
  const [showStampDesigner, setShowStampDesigner] = useState<boolean>(true);

  const handleFileSelect = async (file: File) => {
    try {
      setStatus(ProcessingStatus.PROCESSING_PDF);
      setFileName(file.name);
      const images = await convertPdfToImages(file);
      setPdfPages(images);
      setStatus(ProcessingStatus.READY);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      alert("Failed to process PDF. Please try a simpler file.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf7f1] font-['DM Sans'] selection:bg-[#da7756] selection:text-[#ffffff]">

      {/* Header */}
      <header className="bg-[#ffffff] border-b border-[#e0e0e0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#d97757] p-2 rounded-lg">
               <ScrollText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#383838] tracking-tight font-['Merriweather']">PDF Stitcher <span className="text-[#9e9e9e] font-light">&</span> Seal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <a
                href="https://github.com/cclank/NLM2Img"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b6b6b] hover:text-[#383838] transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-[#383838] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                GitHub Repository
              </div>
            </div>
            <div className="relative group">
              <a
                href="https://x.com/LufzzLiz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b6b6b] hover:text-[#383838] transition-colors"
                aria-label="Author Profile"
              >
                <User className="w-5 h-5" />
              </a>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-[#383838] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Author Profile
              </div>
            </div>
            <div className="text-sm font-medium text-[#6b6b6b] hidden sm:block">
               Privacy First: Processing happens in your browser
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Section (Visible if no file) */}
        {status === ProcessingStatus.IDLE && (
           <div className="max-w-2xl mx-auto mt-12">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Combine Pages & Add Your Official Seal</h2>
                 <p className="text-lg text-slate-600">Turn multi-page PDFs into a single continuous image and apply a custom digital stamp in seconds.</p>
              </div>
              <UploadZone onFileSelect={handleFileSelect} />
           </div>
        )}

        {/* Workspace (Visible if file loaded or processing) */}
        {(status !== ProcessingStatus.IDLE) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e0e0e0] flex items-center justify-between shadow-sm">
                 <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-[#d97757] shrink-0" />
                    <span className="text-sm font-medium text-[#383838] truncate" title={fileName}>{fileName}</span>
                 </div>
                 <button
                   onClick={() => {
                     setStatus(ProcessingStatus.IDLE);
                     setPdfPages([]);
                   }}
                   className="text-xs text-[#d15648] hover:text-[#d15648] font-medium px-2 py-1 rounded hover:bg-[#fcf7f1] transition-colors"
                 >
                   Change
                 </button>
              </div>

              {/* Stamp Designer Toggle */}
              <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e0e0e0] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#383838]">Stamp Designer</span>
                  <button
                    onClick={() => setShowStampDesigner(!showStampDesigner)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      showStampDesigner ? 'bg-[#d97757]' : 'bg-[#e0e0e0]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showStampDesigner ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#6b6b6b] mt-2">
                  {showStampDesigner ? 'Enabled - Add custom stamps to your documents' : 'Disabled - Process PDFs without stamps'}
                </p>
              </div>

              <LayoutControls
                currentMode={layoutMode}
                onChange={setLayoutMode}
              />

              {/* Show Group Controls only when grouped layout is selected */}
              {layoutMode === 'grouped' && (
                <GroupControls
                  totalPages={pdfPages.length}
                  onPageGroupChange={setPagesPerGroup}
                />
              )}

              {showStampDesigner && (
                <StampControls
                  config={stampConfig}
                  onChange={setStampConfig}
                />
              )}
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8">
              <PreviewArea
                pages={pdfPages}
                stampConfig={stampConfig}
                layoutMode={layoutMode}
                pagesPerGroup={pagesPerGroup}
                isProcessing={status === ProcessingStatus.PROCESSING_PDF}
                showStampDesigner={showStampDesigner}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;