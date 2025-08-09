import React, { useState, useRef, useCallback } from 'react';
import { CVData, ProfessionRequirements } from './types';
import CVForm from './components/CVForm';
import { FileDown, Moon, Sun, Loader2, Eye, Edit3 } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getProfessionRequirements } from './utils/ai';
import { exportToPDF } from './utils/pdfExport';
import { ModernTemplate } from './components/templates/ModernTemplate';
import { ClassicTemplate } from './components/templates/ClassicTemplate';
import { MinimalTemplate } from './components/templates/MinimalTemplate';
// import AIAssistant from './components/AIAssistant';
import ErrorBoundary from './components/ErrorBoundary';

const initialData: CVData = {
  customProfession: '',
  template: 'modern',
  profession: '',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    title: '',
    socialLinks: [],
    profilePicture: ''
  },
  contact: {
    email: '',
    phone: ''
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  awards: [],
  certifications: [],
  volunteer: [],
  publications: [],
  references: []
};

function AppContent() {
  const [data, setData] = useState<CVData>(initialData);
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [aiRequirements, setAiRequirements] = useState<ProfessionRequirements | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleProfessionChange = useCallback(async (profession: string) => {
    setData(prev => ({ ...prev, profession }));
    if (profession && profession !== 'other') {
      setIsLoadingAI(true);
      try {
        const requirements = await getProfessionRequirements(profession);
        setAiRequirements(requirements);
        setShowAI(true);
      } catch (error) {
        console.error('Error fetching AI requirements:', error);
      } finally {
        setIsLoadingAI(false);
      }
    } else {
      setAiRequirements(null);
      setShowAI(false);
    }
  }, []);

  // If exportToPDF expects an element id (string)
  const handleExportPDF = async () => {
    if (!document.getElementById('cv-preview')) return;
    setIsExporting(true);
    try {
      const fullName = data.personalInfo.fullName?.trim() || '';
      const filename = `${fullName ? fullName.toLowerCase().replace(/\s+/g, '-') : 'resume'}.pdf`;
      await exportToPDF('cv-preview', filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // If your exportToPDF expects an HTMLElement instead, use this version and update the util signature:
  // const handleExportPDF = async () => {
  //   if (!previewRef.current) return;
  //   setIsExporting(true);
  //   try {
  //     const fullName = data.personalInfo.fullName?.trim() || '';
  //     const filename = `${fullName ? fullName.toLowerCase().replace(/\s+/g, '-') : 'resume'}.pdf`;
  //     await exportToPDF(previewRef.current, filename);
  //   } catch (error) {
  //     console.error('Error exporting PDF:', error);
  //     alert('Failed to export PDF. Please try again.');
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const renderTemplate = () => {
    const templateProps = { data };
    switch (data.template) {
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'modern':
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  return (
    <div className="min-h-screen min-w-full w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-700">
        <div className="w-full px-2 sm:px-6 lg:px-12 py-4 flex items-center justify-between bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">theUltimateCV</h1>
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100 rounded-full font-medium shadow-sm">Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 transition-all shadow-sm border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {view === 'form' && (
              <button
                onClick={() => setView('preview')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm border border-primary-700"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            )}

            {view === 'preview' && (
              <>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting || !data.personalInfo.fullName}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all shadow-sm border border-green-700"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  Export
                </button>
                <button
                  onClick={() => setView('form')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm border border-primary-700"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-2 sm:px-6 lg:px-12 py-6 sm:py-10 flex flex-col">
        {view === 'form' ? (
          <div className="flex flex-col lg:flex-row gap-8 w-full h-full">
            <div className="w-full lg:w-2/3 flex-shrink-0 flex-grow">
              <ErrorBoundary>
                <CVForm
                  data={data}
                  setData={setData}
                  onProfessionChange={handleProfessionChange}
                />
              </ErrorBoundary>
            </div>
            {/* <div className="w-full lg:w-1/3 flex flex-col gap-6">
              {showAI && (
                <ErrorBoundary>
                  <AIAssistant
                    requirements={aiRequirements}
                    isLoading={isLoadingAI}
                    data={data}
                    setData={setData}
                  />
                </ErrorBoundary>
              )}
            </div> */}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full h-full">
            <div
              id="cv-preview"
              ref={previewRef}
              className="w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl bg-white print:shadow-none print:rounded-none"
            >
              <ErrorBoundary>
                {renderTemplate()}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </main>

      {/* Floating Footer */}
      <div className="fixed bottom-5 right-5 backdrop-blur-sm bg-white/70 dark:bg-neutral-800/70 text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
        <strong>© Dhairya Jangir</strong>
      </div>
    </div>
  );
}



function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
