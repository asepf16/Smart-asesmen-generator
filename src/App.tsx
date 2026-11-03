import React from 'react';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SchoolIdentityForm } from './components/SchoolIdentityForm';
import { TPManager } from './components/TPManager';
import { TPAnalysis } from './components/TPAnalysis';
import { BlueprintGenerator } from './components/BlueprintGenerator';
import { HOTSGenerator } from './components/HOTSGenerator';
import { AKMGenerator } from './components/AKMGenerator';
import { CombinedHotsAkmGenerator } from './components/CombinedHotsAkmGenerator';
import { FormativeAssessment } from './components/FormativeAssessment';
import { SummativeAssessment } from './components/SummativeAssessment';
import { QualityValidator } from './components/QualityValidator';
import { QuestionBank } from './components/QuestionBank';
import { DocumentExporter } from './components/DocumentExporter';
import { SettingsModal } from './components/SettingsModal';
import { AlertCircle, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, errorMessage, setErrorMessage } = useAssessment();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'identitas':
        return <SchoolIdentityForm />;
      case 'tp-input':
        return <TPManager />;
      case 'tp-analisis':
        return <TPAnalysis />;
      case 'kisi-kisi':
        return <BlueprintGenerator />;
      case 'soal-hots':
        return <HOTSGenerator />;
      case 'soal-akm':
        return <AKMGenerator />;
      case 'soal-hots-akm':
        return <CombinedHotsAkmGenerator />;
      case 'formatif':
        return <FormativeAssessment />;
      case 'sumatif':
        return <SummativeAssessment />;
      case 'validasi':
        return <QualityValidator />;
      case 'bank-soal':
        return <QuestionBank />;
      case 'dokumen':
        return <DocumentExporter />;
      case 'pengaturan':
        return <SettingsModal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Global Notification/Notice Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-amber-700 hover:text-amber-950 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AssessmentProvider>
      <MainContent />
    </AssessmentProvider>
  );
}
