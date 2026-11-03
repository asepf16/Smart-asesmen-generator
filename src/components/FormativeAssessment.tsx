import React from 'react';
import {
  Sparkle,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export const FormativeAssessment: React.FC = () => {
  const {
    tps,
    selectedTpIds,
    questions,
    generateQuestionsByMode,
    isLoading,
    loadingMessage,
    setActiveTab,
  } = useAssessment();

  const targetTps = tps.filter((t) => selectedTpIds.includes(t.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Asesmen Formatif (Assessment for & as Learning)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dirancang khusus untuk memantau kemajuan belajar berkala, mendeteksi miskonsepsi, dan memberikan rekomendasi Remedial & Pengayaan konkret.
          </p>
        </div>

        <button
          onClick={() => generateQuestionsByMode('formatif')}
          disabled={isLoading || selectedTpIds.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Generate Asesmen Formatif (AI)</span>
        </button>
      </div>

      {/* Loading message */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-3 text-xs text-indigo-900">
          <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Menyusun Perangkat Asesmen Formatif</p>
            <p className="text-indigo-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Formative Characteristics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
          <span className="font-bold text-blue-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            1. Pemantauan Berkala
          </span>
          <p className="text-slate-600">
            Diberikan di tengah proses unit pembelajaran untuk mengukur penguasaan TP tanpa tekanan nilai raport akhir.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
          <span className="font-bold text-rose-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            2. Deteksi Kesulitan Belajar
          </span>
          <p className="text-slate-600">
            Mendeteksi miskonsepsi konsep lebih dini sehingga guru dapat melakukan intervensi sebelum ujian sumatif.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            3. Rekomendasi Tindak Lanjut
          </span>
          <p className="text-slate-600">
            Menyediakan rubrik kriteria ketercapaian, pedoman remedial bagi yang belum tuntas, dan pengayaan bagi yang mahir.
          </p>
        </div>
      </div>

      {/* Formative Items with Remedial & Enrichment Guidance */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            Daftar Instrumen Formatif & Rubrik Umpan Balik Guru
          </h3>

          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {q.number}
                    </span>
                    <span className="font-bold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                      {q.tpCode}
                    </span>
                    <span className="text-xs text-slate-500">
                      {q.questionType} ({q.bloomLevel})
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Kunci: {q.answerKey}
                  </span>
                </div>

                {q.stimulus && (
                  <p className="text-xs italic bg-slate-50 p-2.5 rounded text-slate-600">
                    "{q.stimulus}"
                  </p>
                )}

                <p className="text-xs font-bold text-slate-900">{q.question}</p>

                {/* Remedial & Enrichment Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                    <span className="font-bold text-rose-900 block mb-1">
                      Panduan Remedial (Bagi Siswa Belum Tuntas):
                    </span>
                    <p className="text-slate-700 leading-snug">
                      {q.remedialNote || 'Bimbing kembali siswa pada kata kunci materi pokok dan pemahaman stimulus.'}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <span className="font-bold text-emerald-900 block mb-1">
                      Panduan Pengayaan (Bagi Siswa Mahir):
                    </span>
                    <p className="text-slate-700 leading-snug">
                      {q.enrichmentNote || 'Berikan studi kasus pembanding kontekstual untuk memperdalam daya analisis kritis.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('dokumen')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Lihat Naskah Lengkap di Dokumen Saya
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
