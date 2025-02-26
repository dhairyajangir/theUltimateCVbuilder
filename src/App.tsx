import React, { useState, useRef } from 'react';
import { CVData, ProfessionRequirements } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import AIAssistant from './components/AIAssistant';
import { FileDown, Moon, Sun, Loader2 } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getProfessionRequirements } from './utils/ai';
import { exportToPDF } from './utils/pdfExport';

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
    socialLinks: []
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
  const { theme, toggleTheme } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleProfessionChange = async (profession: string) => {
    setData(prev => ({ ...prev, profession }));
    if (profession) {
      setIsLoadingAI(true);
      try {
        const requirements = await getProfessionRequirements(profession);
        setAiRequirements(requirements);
      } catch (error) {
        console.error('Error fetching AI requirements:', error);
      } finally {
        setIsLoadingAI(false);
      }
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      const filename = `${data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
      await exportToPDF('cv-preview', filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ultimate CV Builder</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setView(view === 'form' ? 'preview' : 'form')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {view === 'form' ? 'Preview CV' : 'Edit CV'}
              </button>
              {view === 'preview' && (
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <FileDown className="w-5 h-5 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Download PDF'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {view === 'form' ? (
              <CVForm 
                data={data} 
                setData={setData} 
                onProfessionChange={handleProfessionChange}
              />
            ) : (
              <div id="cv-preview" ref={previewRef}>
                <CVPreview data={data} />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <AIAssistant 
              requirements={aiRequirements} 
              isLoading={isLoadingAI} 
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 right-4 text-gray-600 dark:text-gray-300 text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 px-4 py-2 rounded-xl shadow-md border border-white/50 dark:border-gray-700">
        <strong>© Dhairya Jangir</strong>
      </div>

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;