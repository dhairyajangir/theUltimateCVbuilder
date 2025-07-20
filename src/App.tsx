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
import AIAssistant from './components/AIAssistant';
import ImageUpload from './components/ImageUpload';
import ErrorBoundary from './components/ErrorBoundary';

export interface CVFormProps {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  onProfessionChange: (profession: string) => Promise<void>;
}

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

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const filename = `${data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-') || 'resume'}.pdf`;
      await exportToPDF('cv-preview', filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">theUltimateCV</h1>
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100 rounded-full font-medium shadow-sm">Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setView(view === 'form' ? 'preview' : 'form')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
            >
              {view === 'form' ? <><Eye className="w-4 h-4" /> Preview</> : <><Edit3 className="w-4 h-4" /> Edit</>}
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting || !data.personalInfo.fullName}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition shadow"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <CVForm
                  data={data}
                  setData={setData}
                  onProfessionChange={handleProfessionChange}
                />
              </ErrorBoundary>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <ErrorBoundary>
                <ImageUpload
                  profilePicture={data.personalInfo.profilePicture}
                  setProfilePicture={(url) =>
                    setData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, profilePicture: url }
                    }))
                  }
                />
              </ErrorBoundary>
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
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div
              id="cv-preview"
              ref={previewRef}
              className="rounded-xl overflow-hidden shadow-2xl bg-white print:shadow-none print:rounded-none"
            >
              <ErrorBoundary>
                {renderTemplate()}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </main>

      {/* Floating Footer */}
      <div className="fixed bottom-5 right-5 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300">
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
