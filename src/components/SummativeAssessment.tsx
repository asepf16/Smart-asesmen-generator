import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  Sliders,
  RefreshCw,
  ArrowRight,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { ClearConfirmationModal } from './ClearConfirmationModal';

export const SummativeAssessment: React.FC = () => {
  const [showClearModal, setShowClearModal] = useState(false);
  const {
    examConfig,
    setExamConfig,
    schoolInfo,
    teacherInfo,
    selectedTpIds,
    tps,
    questions,
    blueprint,
    generateBlueprint,
    generateQuestionsByMode,
    isLoading,
    loadingMessage,
    setActiveTab,
  } = useAssessment();

  const [totalQuestions, setTotalQuestions] = useState(examConfig.totalQuestions || 10);
  const [durationMinutes, setDurationMinutes] = useState(examConfig.durationMinutes || 90);
  const [lots, setLots] = useState(examConfig.distribution?.lots || 20);
  const [mots, setMots] = useState(examConfig.distribution?.mots || 30);
  const [hots, setHots] = useState(examConfig.distribution?.hots || 50);

  const handleGenerateSummative = async () => {
    // 1. Update config
    setExamConfig((prev) => ({
      ...prev,
      totalQuestions,
      durationMinutes,
      distribution: { lots, mots, hots },
    }));

    // 2. Generate blueprint & questions
    await generateBlueprint();
    await generateQuestionsByMode('sumatif');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Asesmen Sumatif Terstandar
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menyusun instrumen evaluasi akhir capaian (STS, SAS, SAT, atau Asesmen Akhir Jenjang) dengan alokasi waktu dan distribusi kognitif terukur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(blueprint.length > 0 || questions.length > 0) && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all active:scale-95"
              title="Kosongkan kisi-kisi atau naskah soal sumatif saat ini"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Kosongkan Hasil</span>
            </button>
          )}

          <button
            onClick={handleGenerateSummative}
            disabled={isLoading || selectedTpIds.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Konstruksi Asesmen Sumatif (AI)</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Mengonstruksi Paket Asesmen Sumatif</p>
            <p className="text-blue-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Configuration Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Parameter & Karakteristik Ujian Sumatif
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Jumlah Soal (Butir)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Durasi Ujian (Menit)
            </label>
            <div className="relative">
              <input
                type="number"
                min={15}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value) || 90)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Skor Maksimal Ideal
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value="100 Poin (Terstandar)"
                className="w-full pl-8 pr-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg"
              />
              <Award className="w-4 h-4 text-amber-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jenis Sumatif Terpilih
            </label>
            <select
              value={examConfig.assessmentType}
              onChange={(e) =>
                setExamConfig((prev) => ({
                  ...prev,
                  assessmentType: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-800"
            >
              <option value="Asesmen Sumatif Harian/Lingkup Materi">Sumatif Harian / Lingkup Materi</option>
              <option value="Asesmen Sumatif Tengah Semester">Sumatif Tengah Semester (STS)</option>
              <option value="Asesmen Sumatif Akhir Semester">Sumatif Akhir Semester (SAS)</option>
              <option value="Asesmen Sumatif Akhir Tahun">Sumatif Akhir Tahun (SAT)</option>
              <option value="Asesmen Sumatif Akhir Jenjang">Sumatif Akhir Jenjang</option>
            </select>
          </div>
        </div>

        {/* Cognitive Sliders */}
        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              Distribusi Kognitif Taksonomi Bloom (Total: {lots + mots + hots}%)
            </span>
            <span className="text-slate-500">
              Rekomendasi BSKAP: Minimal 40-50% Berpikir Tingkat Tinggi (HOTS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>LOTS (C1-C2): {lots}%</span>
                <span>{Math.round((lots / 100) * totalQuestions)} Butir</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={lots}
                onChange={(e) => setLots(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between font-semibold text-blue-900 mb-1">
                <span>MOTS (C3): {mots}%</span>
                <span>{Math.round((mots / 100) * totalQuestions)} Butir</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={mots}
                onChange={(e) => setMots(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex justify-between font-semibold text-amber-900 mb-1">
                <span>HOTS (C4-C6): {hots}%</span>
                <span>{Math.round((hots / 100) * totalQuestions)} Butir</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={hots}
                onChange={(e) => setHots(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summative Preview if ready */}
      {questions.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Naskah Asesmen Sumatif Siap Digunakan ({questions.length} Butir)
              </h3>
              <p className="text-xs text-slate-500">
                Lengkap dengan Kunci Jawaban, Pembahasan, dan Pedoman Penskoran Resmi
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dokumen')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Cetak / Ekspor Naskah
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">No. {q.number}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {q.bloomLevel} - {q.cognitiveCategory}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 line-clamp-2">
                  {q.question}
                </p>
                <p className="text-[11px] text-slate-500">
                  Bentuk: {q.questionType} | Kunci: <strong className="text-emerald-700">{q.answerKey}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <ClearConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        defaultScope="draft"
      />
    </div>
  );
};
