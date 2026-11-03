import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Copy,
  Edit2,
  FileSpreadsheet,
  Plus,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { exportAssessmentToExcel } from '../utils/exportUtils';
import { QuestionEditorModal } from './QuestionEditorModal';
import { AssessmentPackage } from '../types';

export const QuestionBank: React.FC = () => {
  const {
    questions,
    blueprint,
    schoolInfo,
    teacherInfo,
    examConfig,
    tps,
    savedPackages,
    saveCurrentPackage,
    loadSavedPackage,
    deleteSavedPackage,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    setActiveTab,
  } = useAssessment();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCognitive, setFilterCognitive] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTp, setFilterTp] = useState<string>('all');
  const [activeEditorIdx, setActiveEditorIdx] = useState<number | null>(null);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeBankTab, setActiveBankTab] = useState<'current' | 'saved'>('current');

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.stimulus && q.stimulus.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.tpCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCognitive =
      filterCognitive === 'all' || q.cognitiveCategory === filterCognitive;

    const matchesType = filterType === 'all' || q.questionType === filterType;

    const matchesTp = filterTp === 'all' || q.tpCode === filterTp;

    return matchesSearch && matchesCognitive && matchesType && matchesTp;
  });

  const handleSavePackage = () => {
    saveCurrentPackage(saveTitle);
    setShowSaveModal(false);
    setSaveTitle('');
    setActiveBankTab('saved');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Bank Soal & Manajemen Perangkat Asesmen
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simpan, kelola, filter, dan gunakan kembali butir soal terstandar untuk berbagai jenjang dan kurikulum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={questions.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            <Bookmark className="w-4 h-4" />
            Simpan Paket Ini ke Bank
          </button>

          <button
            onClick={() =>
              exportAssessmentToExcel({
                id: 'bank',
                createdAt: new Date().toISOString(),
                title: 'Bank_Soal',
                schoolInfo,
                teacherInfo,
                examConfig,
                tps,
                blueprint,
                questions,
              })
            }
            disabled={questions.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            title="Ekspor Seluruh Butir ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Switch Tab between Current Question Bank & Saved Packages Archive */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveBankTab('current')}
          className={`pb-3 transition-colors ${
            activeBankTab === 'current'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Butir Soal Sesi Aktif ({questions.length})
        </button>
        <button
          onClick={() => setActiveBankTab('saved')}
          className={`pb-3 transition-colors ${
            activeBankTab === 'saved'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Arsip Paket Asesmen Tersimpan ({savedPackages.length})
        </button>
      </div>

      {/* TAB 1: CURRENT ACTIVE QUESTIONS IN BANK */}
      {activeBankTab === 'current' && (
        <div className="space-y-4">
          {/* Search & Multi-Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kata kunci butir, TP, stimulus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Cognitive */}
            <div>
              <select
                value={filterCognitive}
                onChange={(e) => setFilterCognitive(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">Semua Kategori Kognitif</option>
                <option value="LOTS">LOTS (C1-C2)</option>
                <option value="MOTS">MOTS (C3)</option>
                <option value="HOTS">HOTS (C4-C6)</option>
              </select>
            </div>

            {/* Filter Question Type */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">Semua Bentuk Soal</option>
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Menjodohkan">Menjodohkan</option>
                <option value="Isian Singkat">Isian Singkat</option>
                <option value="Uraian">Uraian / Kasus</option>
              </select>
            </div>

            {/* Filter TP */}
            <div>
              <select
                value={filterTp}
                onChange={(e) => setFilterTp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">Semua Tujuan Pembelajaran</option>
                {tps.map((tp) => (
                  <option key={tp.id} value={tp.code}>
                    {tp.code} - {tp.material}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
              <Database className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Tidak ada butir soal yang sesuai kriteria pencarian
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Ganti kata kunci pencarian atau bersihkan filter di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {q.tpCode}
                      </span>
                      <span className="font-semibold text-slate-700">
                        No. {q.number} ({q.questionType})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.cognitiveCategory === 'HOTS'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {q.bloomLevel} - {q.cognitiveCategory}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Kunci: {q.answerKey}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveEditorIdx(idx)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="Sunting Soal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateQuestion(idx)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded"
                        title="Duplikasi Butir"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                        title="Hapus Butir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-800 leading-snug">
                    {q.question}
                  </p>

                  {q.stimulus && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-1">
                      Stimulus: "{q.stimulus}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED ASSESSMENT PACKAGES ARCHIVE */}
      {activeBankTab === 'saved' && (
        <div className="space-y-4">
          {savedPackages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Belum ada arsip paket asesmen yang disimpan
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Anda dapat menyimpan paket asesmen saat ini ke dalam Bank Soal untuk dipakai kembali di semester atau kelas lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 line-clamp-1">
                      {pkg.title}
                    </span>
                    <button
                      onClick={() => deleteSavedPackage(pkg.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>Mata Pelajaran: <strong>{pkg.schoolInfo.subject || pkg.teacherInfo.subject}</strong></div>
                    <div>Fase / Kelas: <strong>Fase {pkg.schoolInfo.phase} - {pkg.schoolInfo.grade}</strong></div>
                    <div>Total Butir: <strong>{pkg.questions.length} Soal</strong></div>
                    <div>Tanggal: <strong>{new Date(pkg.createdAt).toLocaleDateString('id-ID')}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => loadSavedPackage(pkg)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs shadow-xs"
                    >
                      Buka & Muat Paket Ini
                    </button>

                    <button
                      onClick={() => exportAssessmentToExcel(pkg)}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Ekspor Excel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              Simpan Paket Asesmen ke Bank Soal
            </h3>
            <p className="text-slate-500">
              Beri nama paket agar mudah dicari saat semester depan atau oleh rekan sejawat.
            </p>
            <input
              type="text"
              placeholder={`misal: ${schoolInfo.subject || 'Mapel'} - ${examConfig.assessmentType}`}
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSavePackage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
              >
                Simpan Paket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {activeEditorIdx !== null && questions[activeEditorIdx] && (
        <QuestionEditorModal
          question={questions[activeEditorIdx]}
          index={activeEditorIdx}
          isOpen={true}
          onClose={() => setActiveEditorIdx(null)}
          onSave={(updated) => updateQuestion(activeEditorIdx, updated)}
        />
      )}
    </div>
  );
};
