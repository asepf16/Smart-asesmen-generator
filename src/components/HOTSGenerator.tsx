import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Edit2,
  Trash2,
  Copy,
  RefreshCw,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Download,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { QuestionEditorModal } from './QuestionEditorModal';
import { ClearConfirmationModal } from './ClearConfirmationModal';
import { QuestionItem } from '../types';

export const HOTSGenerator: React.FC = () => {
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

  const hotsQuestions = questions.filter((q) => q.cognitiveCategory === 'HOTS');
  const hotsCount = hotsQuestions.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Generator Soal HOTS (Higher Order Thinking Skills)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menghasilkan butir soal bernalar tingkat tinggi (C4–C6) berbasis stimulus autentik permasalahan dunia nyata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all active:scale-95"
              title="Kosongkan naskah soal HOTS saat ini"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Kosongkan Soal</span>
            </button>
          )}

          <button
            onClick={() => generateQuestionsByMode('hots')}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Soal HOTS (AI)</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
          <RefreshCw className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Menyusun Soal HOTS & Stimulus Autentik</p>
            <p className="text-amber-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* HOTS Standard Guidance Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-xs text-slate-700 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            Kaidah Penulisan Soal HOTS Terstandar:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li><strong>Stimulus Kontekstual:</strong> Menggunakan kasus riil, narasi ilmiah, infografik, atau fenomena sosial.</li>
            <li><strong>Bukan Hafalan:</strong> Pertanyaan tidak dapat dijawab langsung dari teks tanpa melalui penalaran kritis.</li>
            <li><strong>Pengecoh Homogen:</strong> Pilihan jawaban salah (distraktor) dirancang logis berdasarkan kesalahan umum siswa.</li>
          </ul>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <Flame className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Belum ada naskah soal HOTS
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>"Generate Soal HOTS (AI)"</strong> di atas untuk memproses butir-butir kisi-kisi menjadi stimulus autentik dan pertanyaan mendalam.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Naskah Butir Soal ({questions.length} Butir)
            </h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {hotsCount} Butir Terverifikasi HOTS (C4–C6)
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
                    <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                      {q.number}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {q.tpCode}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {q.questionType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        q.cognitiveCategory === 'HOTS'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-blue-100 text-blue-900 border-blue-300'
                      }`}
                    >
                      {q.bloomLevel} ({q.cognitiveCategory})
                    </span>
                    <span className="text-xs text-slate-400">
                      Bobot: <strong>{q.weight}</strong>
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
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
                  <div className="p-3.5 bg-slate-50 rounded-lg border-l-4 border-blue-600 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                      Stimulus Kontekstual:
                    </span>
                    <p className="leading-relaxed italic">{q.stimulus}</p>
                  </div>
                )}

                {/* Question Text */}
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {q.question}
                </p>

                {/* Options (Pilihan Ganda) */}
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

                {/* Complex statements for PGK */}
                {q.complexItems && q.complexItems.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-500">
                      Pernyataan Sikap / Fakta:
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

                {/* Answer Key, Explanation & HOTS Reason */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-0.5">
                      Kunci Jawaban: {q.answerKey}
                    </span>
                    <p className="text-slate-600 leading-snug">{q.explanation}</p>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      Alasan Karakteristik HOTS:
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {q.hotsReason || 'Menuntut penalaran inferensial dan sintesis solusi.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">
              Langkah selanjutnya: uji telaah butir soal otomatis dengan modul validasi.
            </span>
            <button
              onClick={() => setActiveTab('validasi')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Validasi Mutu & Psikometri Soal
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
