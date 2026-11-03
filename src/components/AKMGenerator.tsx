import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
  Edit2,
  Trash2,
  Copy,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { QuestionEditorModal } from './QuestionEditorModal';
import { ClearConfirmationModal } from './ClearConfirmationModal';

export const AKMGenerator: React.FC = () => {
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
  const [akmCategory, setAkmCategory] = useState<'literasi' | 'numerasi' | 'all'>('all');
  const [akmContext, setAkmContext] = useState<'Personal' | 'Sosial-Budaya' | 'Saintifik'>('Saintifik');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Generator Soal AKM (Asesmen Kompetensi Minimum)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mengukur kompetensi mendasar Literasi Membaca dan Numerasi melalui konteks Personal, Sosial-Budaya, dan Saintifik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all active:scale-95"
              title="Kosongkan naskah soal AKM saat ini"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Kosongkan Soal</span>
            </button>
          )}

          <button
            onClick={() => generateQuestionsByMode('akm')}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Soal AKM (AI)</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Menyusun Soal Literasi & Numerasi AKM</p>
            <p className="text-emerald-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* AKM Dimension Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            AKM Literasi Membaca
          </div>
          <p className="text-xs text-slate-600">
            <strong>Sub-kompetensi:</strong> Menemukan Informasi (Retrieve), Memahami Teks (Interpret & Integrate), serta Mengevaluasi & Merefleksi Gagasan (Evaluate & Reflect).
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">Teks Informasi Ilmiah</span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">Teks Narasi Sastra</span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">Teks Multimodal</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Calculator className="w-4 h-4 text-teal-600" />
            AKM Numerasi & Pemecahan Masalah
          </div>
          <p className="text-xs text-slate-600">
            <strong>Domain:</strong> Bilangan, Aljabar, Geometri & Pengukuran, Data & Ketidakpastian. Konteks aplikatif dalam isu sains, ekonomi, dan sosial masyarakat.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
            <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200">Konteks Personal</span>
            <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200">Konteks Sosial-Budaya</span>
            <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200">Konteks Saintifik</span>
          </div>
        </div>
      </div>

      {/* Question List */}
      {questions.length === 0 && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <Target className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Belum ada soal dengan spesifikasi AKM
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>"Generate Soal AKM (AI)"</strong> untuk menyusun naskah soal berbasis teks wacana kaya informasi atau pemodelan numerasi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Instrumen Soal Berbasis Karakteristik AKM ({questions.length} Butir)
            </h3>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Format Asesmen Nasional Kemendikbudristek
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3.5"
              >
                {/* Item Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      {q.number}
                    </span>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {q.tpCode}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {q.questionType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {q.bloomLevel} ({q.cognitiveCategory})
                    </span>
                    <span className="text-xs text-slate-400">
                      Bobot: <strong>{q.weight}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveModalIdx(idx)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium"
                      title="Sunting Soal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sunting</span>
                    </button>
                    <button
                      onClick={() => duplicateQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium"
                      title="Duplikasi Butir"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Salin</span>
                    </button>
                    <button
                      onClick={() => deleteQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg text-xs"
                      title="Hapus Butir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stimulus Box */}
                {q.stimulus && (
                  <div className="p-3.5 bg-slate-50 rounded-lg border-l-4 border-emerald-600 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                      Wacana Stimulus AKM:
                    </span>
                    <p className="leading-relaxed italic">{q.stimulus}</p>
                  </div>
                )}

                {/* Question */}
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {q.question}
                </p>

                {/* Options / Complex Items */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.label}
                        className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                          q.answerKey === opt.label
                            ? 'bg-emerald-50/80 border-emerald-300 font-semibold text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            q.answerKey === opt.label
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Complex items for PGK */}
                {q.complexItems && q.complexItems.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-500">
                      Tentukan Benar / Salah untuk setiap pernyataan:
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

                {/* Discussion & AKM Aspect */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-0.5">
                      Kunci & Penalaran:
                    </span>
                    <p className="text-slate-600 leading-snug">{q.explanation}</p>
                  </div>

                  <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100">
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

          {/* Footer CTA */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">
              Periksa instrumen melalui telaah psikometri otomatis.
            </span>
            <button
              onClick={() => setActiveTab('validasi')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Validasi Kualitas Soal
              <ArrowRight className="w-4 h-4" />
            </button>
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
