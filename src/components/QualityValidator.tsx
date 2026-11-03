import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Info,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export const QualityValidator: React.FC = () => {
  const {
    questions,
    validation,
    runQualityValidation,
    isLoading,
    loadingMessage,
    setActiveTab,
  } = useAssessment();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sangat Baik':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Baik':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Perlu Revisi':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Validasi & Kontrol Kualitas Soal (Telaah Psikometri)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pemeriksaan otomatis konstruksi butir, keberfungsian stimulus, homogenitas distraktor, dan keselarasan dengan TP.
          </p>
        </div>

        <button
          onClick={runQualityValidation}
          disabled={isLoading || questions.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{validation ? 'Uji Ulang Telaah Mutu' : 'Jalankan Telaah Kualitas (AI)'}</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Psikometri Sedang Melakukan Telaah Butir Soal</p>
            <p className="text-emerald-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Standard Psychometric Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            Catatan Pakar Psikometri & Pengukuran Pendidikan:
          </p>
          <p className="leading-relaxed">
            Telaah kualitatif ini memastikan validitas isi (content validity) dan konstruksi pedagogis sesuai kaidah Kurikulum Merdeka. <strong>Validitas dan reliabilitas empiris</strong> yang sebenarnya tetap memerlukan pengujian lapangan kepada sampel peserta didik serta analisis daya pembeda dan indeks kesukaran berbasis data respons.
          </p>
        </div>
      </div>

      {/* Validation Results Table */}
      {!validation && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Belum ada hasil telaah butir
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>"Jalankan Telaah Kualitas (AI)"</strong> untuk memeriksa 10 aspek pedagogis dan psikometri pada seluruh naskah soal.
          </p>
        </div>
      ) : validation ? (
        <div className="space-y-5">
          {/* Overall Verdict Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Kesimpulan Telaah Keseluruhan:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-emerald-800">
                  {validation.overallVerdict}
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                  Layak Digunakan
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {validation.summary}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('dokumen')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shrink-0"
            >
              Lanjut ke Ekspor Dokumen
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Details per Question */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Rincian Telaah Kualitatif Tiap Butir Soal ({validation.validationResults?.length || 0} Butir)
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {validation.validationResults?.map((item) => (
                <div key={item.number} className="p-4 hover:bg-slate-50/60 transition-colors text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Soal No. {item.number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status} (Skor Mutu: {item.score}/100)
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('soal-hots')}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Tinjau di Editor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Kognitif:</span>
                      <span className="text-slate-800">{item.cognitiveCheck}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Stimulus:</span>
                      <span className="text-slate-800">{item.stimulusCheck}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Kunci & Distraktor:</span>
                      <span className="text-slate-800">{item.distractorCheck}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Kebahasaan:</span>
                      <span className="text-slate-800">{item.languageCheck}</span>
                    </div>
                  </div>

                  {item.recommendations && (
                    <div className="p-2.5 bg-blue-50/50 rounded-lg text-slate-700">
                      <span className="font-bold text-blue-900">Rekomendasi Penyempurnaan: </span>
                      {item.recommendations}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
