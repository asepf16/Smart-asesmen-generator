import React from 'react';
import {
  Sparkles,
  BookOpen,
  Download,
  Printer,
  School,
  User,
  Sliders,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { SUBJECT_PRESETS } from '../data/presets';
import { exportAssessmentToDocx, printAssessmentDocument } from '../utils/exportUtils';
import { ClearConfirmationModal } from './ClearConfirmationModal';

export const Navbar: React.FC = () => {
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const {
    schoolInfo,
    teacherInfo,
    loadPreset,
    questions,
    blueprint,
    examConfig,
    tps,
    setActiveTab,
  } = useAssessment();

  const handleQuickDownload = () => {
    if (questions.length === 0 && blueprint.length === 0) {
      alert('Belum ada kisi-kisi atau naskah soal yang dibuat untuk diunduh.');
      return;
    }
    exportAssessmentToDocx(
      {
        id: 'current',
        createdAt: new Date().toISOString(),
        title: `${schoolInfo.subject || teacherInfo.subject} - ${examConfig.assessmentType}`,
        schoolInfo,
        teacherInfo,
        examConfig,
        tps,
        blueprint,
        questions,
      },
      'all'
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                SMART ASSESSMENT
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                HOTS & AKM
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Generator Kisi-Kisi & Soal Terukur Kurikulum Merdeka
            </p>
          </div>
        </div>

        {/* Quick Presets & Context Info */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <School className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 font-medium truncate max-w-[140px]">
              {schoolInfo.schoolName || 'SMP/SMA'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded text-[11px] font-semibold">
              Fase {schoolInfo.phase} - Kelas {schoolInfo.grade}
            </span>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <select
              onChange={(e) => {
                if (e.target.value) loadPreset(e.target.value);
              }}
              defaultValue=""
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                Muat Contoh Kurikulum...
              </option>
              {SUBJECT_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dokumen')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-blue-600/30 active:scale-95"
            title="Lihat & Ekspor Dokumen Resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh Dokumen</span>
          </button>

          <button
            onClick={printAssessmentDocument}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            title="Cetak Naskah (PDF)"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Reset / Kosongkan Hasil Button */}
          {(blueprint.length > 0 || questions.length > 0) && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/60 rounded-lg text-xs font-semibold transition-all"
              title="Kosongkan kisi-kisi atau naskah soal sebelumnya"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Kosongkan Hasil</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('pengaturan')}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            title="Pengaturan Kop & Identitas"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ClearConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        defaultScope="draft"
      />
    </header>
  );
};
