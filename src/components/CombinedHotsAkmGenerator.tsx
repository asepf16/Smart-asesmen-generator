import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Target,
  Layers,
  Edit2,
  Trash2,
  Copy,
  RefreshCw,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Sliders,
  BookOpen,
  Calculator,
  Compass,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { QuestionEditorModal } from './QuestionEditorModal';
import { ClearConfirmationModal } from './ClearConfirmationModal';

export const CombinedHotsAkmGenerator: React.FC = () => {
  const [showClearModal, setShowClearModal] = useState(false);
  const {
    blueprint,
    questions,
    generateQuestionsByMode,
    isLoading,
    loadingMessage,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    setActiveTab,
  } = useAssessment();

  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);

  // Configuration options for combined generation
  const [balancePreset, setBalancePreset] = useState<'hybrid' | 'balanced' | 'dominant-hots' | 'dominant-akm'>('hybrid');
  const [akmDomain, setAkmDomain] = useState<'both' | 'literasi' | 'numerasi'>('both');
  const [stimulusContext, setStimulusContext] = useState<'Saintifik' | 'Sosial-Budaya' | 'Personal' | 'Campuran'>('Campuran');

  const hotsCount = questions.filter((q) => q.cognitiveCategory === 'HOTS').length;
  const akmCount = questions.filter((q) => q.akmAspect && q.akmAspect.trim().length > 0).length;

  const handleGenerateCombined = async () => {
    await generateQuestionsByMode('hots-akm');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4" />
              </span>
              <span className="-ml-2 w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Target className="w-4 h-4" />
              </span>
            </div>
            <div className="ml-1">
              <h2 className="text-lg font-bold text-slate-900">
                Generator Terpadu Soal HOTS & AKM
              </h2>
              <p className="text-xs text-slate-500">
                Kombinasi integratif: daya nalar tingkat tinggi (C4–C6) dipadukan dengan stimulus wacana kontekstual Literasi & Numerasi Asesmen Nasional.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all active:scale-95 shrink-0"
              title="Kosongkan naskah butir soal terpadu saat ini"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Kosongkan Soal</span>
            </button>
          )}

          <button
            onClick={handleGenerateCombined}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{questions.length > 0 ? 'Generate Ulang Terpadu' : 'Generate Paket Terpadu HOTS & AKM (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 flex items-center gap-3 text-xs text-indigo-900 animate-pulse">
          <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Menyusun Paket Integratif HOTS & AKM</p>
            <p className="text-indigo-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Configuration & Composition Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Konfigurasi Perpaduan Karakteristik HOTS & AKM
          </h3>
          <span className="text-slate-400 text-[11px]">
            Model Integratif Kurikulum Merdeka BSKAP 046/2025 & BKPDM 020/2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Preset Composition */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Fokus Model Kombinasi
            </label>
            <select
              value={balancePreset}
              onChange={(e) => setBalancePreset(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="hybrid">Integratif Penuh (100% HOTS & AKM)</option>
              <option value="balanced">Seimbang (50% HOTS & 50% AKM)</option>
              <option value="dominant-hots">Dominan Penalaran HOTS (70% HOTS : 30% AKM)</option>
              <option value="dominant-akm">Dominan Stimulus AKM (30% HOTS : 70% AKM)</option>
            </select>
          </div>

          {/* AKM Domain */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Fokus Domain AKM
            </label>
            <select
              value={akmDomain}
              onChange={(e) => setAkmDomain(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="both">Literasi Membaca & Numerasi Terpadu</option>
              <option value="literasi">Fokus Literasi Membaca (Informasi & Sastra)</option>
              <option value="numerasi">Fokus Numerasi & Penalaran Data</option>
            </select>
          </div>

          {/* Context Realm */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Konteks Stimulus Autentik
            </label>
            <select
              value={stimulusContext}
              onChange={(e) => setStimulusContext(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="Campuran">Campuran (Saintifik, Sosial-Budaya, Personal)</option>
              <option value="Saintifik">Saintifik (Sains, Teknologi, Lingkungan Hidup)</option>
              <option value="Sosial-Budaya">Sosial-Budaya (Masyarakat, Etika, Tradisi)</option>
              <option value="Personal">Personal (Kehidupan Sehari-hari, Kesehatan)</option>
            </select>
          </div>
        </div>

        {/* Informative Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 block text-[11px]">Dimensi HOTS:</span>
              <p className="text-slate-600 leading-snug text-[11px]">
                Menuntut proses kognitif <strong>C4 (Menganalisis)</strong>, <strong>C5 (Mengevaluasi)</strong>, atau <strong>C6 (Mencipta)</strong> melalui penarikan kesimpulan logis, perbandingan data, dan penilaian solusi.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex items-start gap-2.5">
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-900 block text-[11px]">Karakteristik AKM:</span>
              <p className="text-slate-600 leading-snug text-[11px]">
                Berbasis <strong>stimulus kaya konteks</strong> (wacana riil, infografis, tabel data) dengan bentuk soal bervariasi: Pilihan Ganda Kompleks (PGK Benar-Salah), Menjodohkan, dan Isian Penalaran.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <div className="flex items-center justify-center gap-1 mb-3">
            <Flame className="w-8 h-8 text-amber-400" />
            <Target className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Belum ada paket soal terpadu HOTS & AKM
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>"Generate Paket Terpadu HOTS & AKM (AI)"</strong> di atas untuk menghasilkan kumpulan butir soal yang memenuhi kedua standar sekaligus.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Naskah Instrumen Terpadu HOTS & AKM ({questions.length} Butir)
              </h3>
              <p className="text-xs text-slate-500">
                Setiap butir dilengkapi stimulasi autentik, penalaran tingkat tinggi, kunci, dan pembahasan.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-bold border border-amber-200">
                HOTS: {hotsCount} Butir
              </span>
              <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                AKM: {akmCount || questions.length} Butir
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3.5"
              >
                {/* Top badges bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                      {q.number}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {q.tpCode}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      {q.questionType}
                    </span>

                    {/* Dual Badges: HOTS and AKM */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" />
                      HOTS ({q.bloomLevel})
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <Target className="w-3 h-3 text-emerald-600" />
                      AKM Kontekstual
                    </span>

                    <span className="text-xs text-slate-400">
                      Bobot: <strong>{q.weight}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveModalIdx(idx)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
                      title="Sunting Soal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sunting</span>
                    </button>
                    <button
                      onClick={() => duplicateQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
                      title="Duplikasi Butir"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Salin</span>
                    </button>
                    <button
                      onClick={() => deleteQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                      title="Hapus Butir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stimulus Box */}
                {q.stimulus && (
                  <div className="p-3.5 bg-gradient-to-r from-slate-50 via-blue-50/20 to-emerald-50/20 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-950 block">
                        Stimulus Kontekstual HOTS & AKM:
                      </span>
                      {q.akmAspect && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded font-medium">
                          {q.akmAspect}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed italic">{q.stimulus}</p>
                  </div>
                )}

                {/* Question */}
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {q.question}
                </p>

                {/* Options for Pilihan Ganda */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isCorrect = q.answerKey === opt.label;
                      return (
                        <div
                          key={opt.label}
                          className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 font-semibold text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="flex-1 leading-snug">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Complex items for PGK (Pilihan Ganda Kompleks Benar-Salah) */}
                {q.complexItems && q.complexItems.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-600">
                      Tentukan kesesuaian pernyataan dengan informasi stimulus:
                    </span>
                    {q.complexItems.map((ci, ciIdx) => (
                      <div
                        key={ciIdx}
                        className="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <span className="text-slate-800">{ci.statement}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ci.isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ci.isCorrect ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discussion & Dual Rationale */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-0.5">
                      Kunci Jawaban: {q.answerKey}
                    </span>
                    <p className="text-slate-600 leading-snug">{q.explanation}</p>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      Alasan Karakteristik HOTS:
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {q.hotsReason || 'Menuntut analisis kritis dan pemecahan masalah.'}
                    </p>
                  </div>

                  <div className="p-3 bg-teal-50/70 rounded-lg border border-teal-100">
                    <span className="font-bold text-teal-900 block mb-0.5">
                      Fokus Dimensi AKM:
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {q.akmAspect || 'Literasi Membaca - Interpretasi dan refleksi teks kontekstual.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Next Step Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">
              Paket soal terpadu dapat langsung ditelaah kualitas psikometrinya atau diekspor ke Word & PDF.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('validasi')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Validasi Mutu Soal
              </button>

              <button
                onClick={() => setActiveTab('dokumen')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Ekspor Dokumen Saya
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editor */}
      {activeModalIdx !== null && questions[activeModalIdx] && (
        <QuestionEditorModal
          question={questions[activeModalIdx]}
          index={activeModalIdx}
          isOpen={true}
          onClose={() => setActiveModalIdx(null)}
          onSave={(updated) => updateQuestion(activeModalIdx, updated)}
        />
      )}

      {/* Clear Confirmation Modal */}
      <ClearConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        defaultScope="questions"
      />
    </div>
  );
};
