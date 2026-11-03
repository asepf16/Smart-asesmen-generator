import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  HelpCircle,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

interface ClearConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScope?: 'all' | 'blueprint' | 'questions' | 'draft';
}

export const ClearConfirmationModal: React.FC<ClearConfirmationModalProps> = ({
  isOpen,
  onClose,
  defaultScope = 'draft',
}) => {
  const {
    blueprint,
    questions,
    tpAnalyses,
    clearBlueprint,
    clearQuestions,
    clearAssessmentDraft,
    clearAllAnalysisAndAssessment,
  } = useAssessment();

  const [selectedScope, setSelectedScope] = useState<'all' | 'blueprint' | 'questions' | 'draft'>(defaultScope);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteClear = () => {
    if (selectedScope === 'blueprint') {
      clearBlueprint();
      setSuccessMessage('Kisi-kisi soal berhasil dikosongkan.');
    } else if (selectedScope === 'questions') {
      clearQuestions();
      setSuccessMessage('Naskah soal & laporan validasi berhasil dikosongkan.');
    } else if (selectedScope === 'draft') {
      clearAssessmentDraft();
      setSuccessMessage('Kisi-kisi dan naskah soal berhasil dikosongkan.');
    } else if (selectedScope === 'all') {
      clearAllAnalysisAndAssessment();
      setSuccessMessage('Seluruh analisis TP, kisi-kisi, dan naskah soal telah dikosongkan.');
    }

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const blueprintCount = blueprint.length;
  const questionsCount = questions.length;
  const analysisCount = tpAnalyses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Kosongkan Hasil Asesmen Sebelumnya
              </h3>
              <p className="text-xs text-slate-500">
                Pilih bagian data hasil generator yang ingin dikosongkan/dibersihkan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">{successMessage}</p>
              <p className="text-xs text-slate-500">Memperbarui tampilan draf kerja...</p>
            </div>
          ) : (
            <>
              {/* Alert Info */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-semibold mb-0.5">Perhatian Pengosongan Data:</p>
                  Tindakan ini akan mengosongkan hasil generator yang tersimpan di memori kerja dan penyimpanan peramban. Identitas Sekolah, Profil Guru, dan Rumusan Tujuan Pembelajaran (TP) <strong>tetap aman dan tidak dihapus</strong>.
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                <p className="text-xs font-bold text-slate-700">Pilih opsi pengosongan:</p>

                {/* Option 1: Naskah Soal Saja */}
                <label
                  onClick={() => setSelectedScope('questions')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedScope === 'questions'
                      ? 'border-red-400 bg-red-50/50 ring-2 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="clearScope"
                    checked={selectedScope === 'questions'}
                    onChange={() => setSelectedScope('questions')}
                    className="mt-0.5 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Kosongkan Naskah Soal Saja
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {questionsCount} Soal tersimpan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Menghapus seluruh butir naskah soal (HOTS/AKM/Formatif/Sumatif) beserta telaah validasi mutu. Kisi-kisi tetap dipertahankan.
                    </p>
                  </div>
                </label>

                {/* Option 2: Kisi-Kisi Saja */}
                <label
                  onClick={() => setSelectedScope('blueprint')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedScope === 'blueprint'
                      ? 'border-red-400 bg-red-50/50 ring-2 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="clearScope"
                    checked={selectedScope === 'blueprint'}
                    onChange={() => setSelectedScope('blueprint')}
                    className="mt-0.5 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Kosongkan Kisi-Kisi Saja
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {blueprintCount} Butir kisi-kisi
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Menghapus seluruh baris butir pada tabel kisi-kisi asesmen. Naskah soal tidak terpengaruh.
                    </p>
                  </div>
                </label>

                {/* Option 3: Draf Asesmen Lengkap (Kisi-kisi + Soal) */}
                <label
                  onClick={() => setSelectedScope('draft')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedScope === 'draft'
                      ? 'border-red-400 bg-red-50/50 ring-2 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="clearScope"
                    checked={selectedScope === 'draft'}
                    onChange={() => setSelectedScope('draft')}
                    className="mt-0.5 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Kosongkan Seluruh Kisi-Kisi & Naskah Soal (Rekomendasi)
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        Reset Total
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mengosongkan kisi-kisi sekaligus seluruh soal untuk menyusun paket asesmen baru dari awal.
                    </p>
                  </div>
                </label>

                {/* Option 4: Bersihkan Termasuk Analisis TP */}
                <label
                  onClick={() => setSelectedScope('all')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedScope === 'all'
                      ? 'border-red-400 bg-red-50/50 ring-2 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="clearScope"
                    checked={selectedScope === 'all'}
                    onChange={() => setSelectedScope('all')}
                    className="mt-0.5 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Kosongkan Termasuk Analisis TP
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {analysisCount} Analisis TP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Menghapus tabel analisis taksonomi Bloom TP, kisi-kisi, dan seluruh naskah soal.
                    </p>
                  </div>
                </label>
              </div>

              {/* Status summary */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Data tersimpan saat ini:</span>
                <span className="font-semibold text-slate-800">
                  {blueprintCount} Kisi-Kisi | {questionsCount} Soal | {analysisCount} Analisis TP
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!successMessage && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleExecuteClear}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Konfirmasi Kosongkan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
