import React from 'react';
import {
  Sparkles,
  Grid3X3,
  Flame,
  Target,
  FileText,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { SUBJECT_PRESETS } from '../data/presets';

export const Dashboard: React.FC = () => {
  const {
    schoolInfo,
    teacherInfo,
    blueprint,
    questions,
    tps,
    tpAnalyses,
    validation,
    setActiveTab,
    loadPreset,
    examConfig,
  } = useAssessment();

  const hotsCount = questions.filter((q) => q.cognitiveCategory === 'HOTS').length;
  const akmCount = questions.filter((q) => q.akmAspect && q.akmAspect.trim().length > 0).length;
  const lotsCount = questions.filter((q) => q.cognitiveCategory === 'LOTS').length;
  const motsCount = questions.filter((q) => q.cognitiveCategory === 'MOTS').length;

  const stats = [
    {
      title: 'Total Kisi-Kisi',
      value: blueprint.length,
      unit: 'Butir Indikator',
      desc: 'Terhubung langsung dengan TP',
      icon: Grid3X3,
      color: 'from-blue-600 to-cyan-600',
      actionTab: 'kisi-kisi',
    },
    {
      title: 'Total Soal Terbuat',
      value: questions.length,
      unit: 'Butir Soal',
      desc: 'Naskah lengkap dengan rubrik',
      icon: FileText,
      color: 'from-indigo-600 to-purple-600',
      actionTab: 'bank-soal',
    },
    {
      title: 'Soal HOTS (C4–C6)',
      value: hotsCount,
      unit: 'Butir Bernalar',
      desc: 'Kontekstual & stimulus autentik',
      icon: Flame,
      color: 'from-amber-500 to-rose-600',
      actionTab: 'soal-hots',
    },
    {
      title: 'Soal AKM',
      value: akmCount,
      unit: 'Literasi / Numerasi',
      desc: 'Sesuai format asesmen nasional',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      actionTab: 'soal-akm',
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Identitas Sekolah & Guru',
      desc: 'Isi jenjang, fase, kelas, dan data satuan pendidikan.',
      tab: 'identitas',
      done: Boolean(schoolInfo.schoolName && schoolInfo.phase),
    },
    {
      step: 2,
      title: 'Input TP / Upload ATP',
      desc: 'Masukkan Tujuan Pembelajaran atau unggah dokumen kurikulum.',
      tab: 'tp-input',
      done: tps.length > 0,
    },
    {
      step: 3,
      title: 'Analisis Taksonomi Bloom',
      desc: 'AI menganalisis KKO, level C1-C6, dan rekomendasi asesmen.',
      tab: 'tp-analisis',
      done: tpAnalyses.length > 0,
    },
    {
      step: 4,
      title: 'Generator Kisi-Kisi',
      desc: 'Susun kisi-kisi terstandar dengan bobot dan indikator.',
      tab: 'kisi-kisi',
      done: blueprint.length > 0,
    },
    {
      step: 5,
      title: 'Generate Terpadu HOTS & AKM',
      desc: 'Konstruksi stimulus mendalam, kunci, dan pembahasan terpadu.',
      tab: 'soal-hots-akm',
      done: questions.length > 0,
    },
    {
      step: 6,
      title: 'Validasi Mutu & Ekspor',
      desc: 'Telaah psikometri otomatis dan unduh berkas Word/PDF/Excel.',
      tab: 'dokumen',
      done: Boolean(validation && questions.length > 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Asesmen Pendidikan Kurikulum Merdeka
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SMART ASSESSMENT GENERATOR
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            "Solusi Cerdas Guru dalam Menyusun Asesmen Berkualitas, Terukur, dan Berbasis Tujuan Pembelajaran."
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('tp-input')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Mulai Input TP / Upload ATP
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('kisi-kisi')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition-all"
            >
              <Grid3X3 className="w-4 h-4 text-cyan-400" />
              Lihat Kisi-Kisi ({blueprint.length})
            </button>
            <button
              onClick={() => setActiveTab('soal-hots-akm')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-emerald-600 hover:opacity-95 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Generator Terpadu HOTS & AKM
            </button>
            <button
              onClick={() => setActiveTab('dokumen')}
              className="inline-flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-emerald-600/40 transition-all"
            >
              <Download className="w-4 h-4" />
              Ekspor Word & PDF
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveTab(stat.actionTab)}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">{stat.unit}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Cognitive Distribution Quick Insight (if questions exist) */}
      {questions.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Distribusi Kognitif Butir Soal Saat Ini
              </h2>
              <p className="text-xs text-slate-500">
                Komposisi berjenjang Taksonomi Bloom (LOTS C1-C2, MOTS C3, HOTS C4-C6)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> LOTS: {lotsCount} ({Math.round((lotsCount / questions.length) * 100)}%)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> MOTS: {motsCount} ({Math.round((motsCount / questions.length) * 100)}%)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> HOTS: {hotsCount} ({Math.round((hotsCount / questions.length) * 100)}%)
              </span>
            </div>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-slate-400 h-full"
              style={{ width: `${(lotsCount / questions.length) * 100}%` }}
              title={`LOTS: ${lotsCount}`}
            />
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${(motsCount / questions.length) * 100}%` }}
              title={`MOTS: ${motsCount}`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(hotsCount / questions.length) * 100}%` }}
              title={`HOTS: ${hotsCount}`}
            />
          </div>
        </div>
      )}

      {/* Workflow Steps Guide */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Alur Kerja Terpadu Guru (Workflow 6 Tahap)
            </h2>
            <p className="text-xs text-slate-500">
              Ikuti tahapan berurutan untuk menghasilkan dokumen asesmen terakreditasi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {workflowSteps.map((ws) => (
            <div
              key={ws.step}
              onClick={() => setActiveTab(ws.tab)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                ws.done
                  ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    ws.done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {ws.step}
                </span>
                {ws.done ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Belum</span>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-800 mt-2.5">
                {ws.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {ws.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Preset Selector for Teachers */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-blue-950">
            Contoh Capaian & Tujuan Pembelajaran Kurikulum Merdeka
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-2">
          Gunakan preset siap pakai untuk mencoba langsung fitur analisis, kisi-kisi, dan generator soal:
        </p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 text-[11px] font-semibold mb-4 border border-blue-200">
          <span>Acuan Standar: SK BSKAP No. 046/H/KR/2025 & Keputusan Kepala BKPDM No. 020 Tahun 2026 (Pendidikan Agama)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SUBJECT_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white p-3.5 rounded-lg border border-blue-200/80 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between text-[11px] text-blue-800 font-semibold mb-1">
                <span>{preset.level}</span>
                <span className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                  Fase {preset.phase}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {preset.subject} (Kelas {preset.grade})
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {preset.material}
              </p>
              <button
                onClick={() => {
                  loadPreset(preset.id);
                  setActiveTab('tp-input');
                }}
                className="mt-3 w-full text-center text-xs font-semibold py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
              >
                Gunakan Preset Ini
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
