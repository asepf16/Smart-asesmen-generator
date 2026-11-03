import React from 'react';
import {
  LayoutDashboard,
  School,
  FileSpreadsheet,
  BrainCircuit,
  Grid3X3,
  Flame,
  Target,
  Sparkle,
  Sparkles,
  Layers,
  Database,
  FileText,
  Settings,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  stageNumber?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    tps,
    tpAnalyses,
    blueprint,
    questions,
    savedPackages,
    validation,
  } = useAssessment();

  const hotsCount = questions.filter((q) => q.cognitiveCategory === 'HOTS').length;
  const akmCount = questions.filter((q) => q.akmAspect && q.akmAspect.trim().length > 0).length;

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'identitas', label: 'Identitas Sekolah & Guru', icon: School, stageNumber: 1 },
    { id: 'tp-input', label: 'Input TP & Upload ATP', icon: FileSpreadsheet, badge: tps.length, stageNumber: 2 },
    { id: 'tp-analisis', label: 'Analisis Tujuan (Bloom)', icon: BrainCircuit, badge: tpAnalyses.length || undefined, stageNumber: 3 },
    { id: 'kisi-kisi', label: 'Generator Kisi-Kisi', icon: Grid3X3, badge: blueprint.length || undefined, stageNumber: 4 },
    { id: 'soal-hots', label: 'Generator Soal HOTS', icon: Flame, badge: hotsCount || undefined, badgeColor: 'bg-amber-500/20 text-amber-600', stageNumber: 5 },
    { id: 'soal-akm', label: 'Generator Soal AKM', icon: Target, badge: akmCount || undefined, badgeColor: 'bg-emerald-500/20 text-emerald-600', stageNumber: 6 },
    { id: 'soal-hots-akm', label: 'Terpadu HOTS & AKM', icon: Sparkles, badge: questions.length || undefined, badgeColor: 'bg-indigo-100 text-indigo-800 font-bold', stageNumber: 7 },
    { id: 'formatif', label: 'Asesmen Formatif', icon: Sparkle, stageNumber: 8 },
    { id: 'sumatif', label: 'Asesmen Sumatif', icon: Layers, stageNumber: 9 },
    { id: 'validasi', label: 'Validasi Mutu & Psikometri', icon: CheckCircle2, badge: validation ? validation.overallVerdict : undefined, stageNumber: 10 },
    { id: 'bank-soal', label: 'Bank Soal', icon: Database, badge: questions.length || undefined, stageNumber: 11 },
    { id: 'dokumen', label: 'Dokumen Saya & Ekspor', icon: FileText, stageNumber: 12 },
    { id: 'pengaturan', label: 'Pengaturan & Kop', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] print:hidden shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Alur Penyusunan Asesmen
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
          SK BSKAP 046/2025 & BKPDM 020/2026
        </p>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-blue-800 text-blue-200'
                        : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-300" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
          <span>Progres Asesmen</span>
          <span className="text-blue-600">
            {blueprint.length > 0 && questions.length > 0
              ? '100% Siap'
              : blueprint.length > 0
              ? '50% Kisi-kisi'
              : tps.length > 0
              ? '25% TP Siap'
              : 'Baru'}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{
              width:
                blueprint.length > 0 && questions.length > 0
                  ? '100%'
                  : blueprint.length > 0
                  ? '60%'
                  : tps.length > 0
                  ? '30%'
                  : '5%',
            }}
          />
        </div>
        <p className="mt-2 text-[10px] text-slate-400 leading-tight">
          HOTS (C4-C6) & AKM Literasi / Numerasi terverifikasi.
        </p>
      </div>
    </aside>
  );
};
