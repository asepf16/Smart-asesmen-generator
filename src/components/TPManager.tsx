import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { TujuanPembelajaran } from '../types';
import { ATPUploader } from './ATPUploader';

export const TPManager: React.FC = () => {
  const {
    tps,
    addTp,
    updateTp,
    deleteTp,
    selectedTpIds,
    toggleTpSelection,
    selectAllTps,
    deselectAllTps,
    runTPAnalysis,
    isLoading,
    setActiveTab,
  } = useAssessment();

  const [activeSubTab, setActiveSubTab] = useState<'manual' | 'upload'>('manual');

  // Form input manual state
  const [newCode, setNewCode] = useState(`TP.${tps.length + 1}`);
  const [newText, setNewText] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newCompetence, setNewCompetence] = useState('');
  const [newScope, setNewScope] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editText, setEditText] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [editCompetence, setEditCompetence] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newMaterial.trim()) return;

    addTp({
      code: newCode || `TP.${tps.length + 1}`,
      tpText: newText,
      material: newMaterial,
      competence: newCompetence || 'Menguasai dan menalar konsep',
      scope: newScope || 'Lingkup Materi',
    });

    setNewText('');
    setNewMaterial('');
    setNewCompetence('');
    setNewScope('');
    setNewCode(`TP.${tps.length + 2}`);
  };

  const startEdit = (tp: TujuanPembelajaran) => {
    setEditingId(tp.id);
    setEditCode(tp.code);
    setEditText(tp.tpText);
    setEditMaterial(tp.material);
    setEditCompetence(tp.competence || '');
  };

  const saveEdit = (id: string) => {
    updateTp(id, {
      code: editCode,
      tpText: editText,
      material: editMaterial,
      competence: editCompetence,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Switcher */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Kelola Tujuan Pembelajaran (TP) & Alur Dokumen ATP
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pilih cara input Tujuan Pembelajaran: tulis manual atau unggah langsung berkas ATP (PDF, DOCX, XLSX).
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('manual')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSubTab === 'manual'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Input Manual TP
            </button>
            <button
              onClick={() => setActiveSubTab('upload')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                activeSubTab === 'upload'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Upload Dokumen ATP
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 2: UPLOAD ATP */}
      {activeSubTab === 'upload' && <ATPUploader />}

      {/* SUBTAB 1: INPUT MANUAL & LIST OF TP */}
      {activeSubTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Input Tambah TP */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Tujuan Pembelajaran (TP)
              </h3>
              <span className="text-[11px] text-slate-400">Manual Entry</span>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode TP *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="misal: TP.1.1 atau TP.8.1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rumusan Tujuan Pembelajaran (TP) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="misal: Menganalisis struktur teks eksplanasi ilmiah dan hubungan kausalitas fenomena alam..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Materi Pokok Esensial *
                </label>
                <input
                  type="text"
                  required
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="misal: Teks Eksplanasi dan Kausalitas Bencana"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Indikator / Kompetensi yang Diharapkan
                </label>
                <input
                  type="text"
                  value={newCompetence}
                  onChange={(e) => setNewCompetence(e.target.value)}
                  placeholder="misal: Menganalisis dan menalar data sebab-akibat"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                Simpan & Tambah ke Daftar TP
              </button>
            </form>
          </div>

          {/* List TP Terdaftar */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Daftar TP yang Siap Diujikan ({tps.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Centang TP yang akan dijadikan dasar pembuatan Kisi-Kisi dan Soal
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllTps}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Pilih Semua
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={deselectAllTps}
                  className="text-slate-500 hover:underline"
                >
                  Batal Semua
                </button>
              </div>
            </div>

            {tps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">Belum ada Tujuan Pembelajaran yang diinput.</p>
                <p className="text-[11px] text-slate-400">
                  Gunakan formulir di samping atau muat preset kurikulum di bagian atas.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {tps.map((tp) => {
                  const isSelected = selectedTpIds.includes(tp.id);
                  const isEditing = editingId === tp.id;

                  if (isEditing) {
                    return (
                      <div
                        key={tp.id}
                        className="p-3.5 rounded-xl border border-blue-400 bg-blue-50/50 space-y-2 text-xs"
                      >
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded"
                          />
                          <input
                            type="text"
                            value={editMaterial}
                            onChange={(e) => setEditMaterial(e.target.value)}
                            placeholder="Materi Pokok"
                            className="col-span-2 px-2 py-1 bg-white border border-slate-300 rounded"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => saveEdit(tp.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded font-semibold"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={tp.id}
                      className={`p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                        isSelected
                          ? 'border-blue-300 bg-blue-50/30 shadow-xs'
                          : 'border-slate-200 bg-white opacity-70'
                      }`}
                    >
                      <button
                        onClick={() => toggleTpSelection(tp.id)}
                        className="mt-0.5 text-blue-600 focus:outline-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded text-[11px]">
                            {tp.code}
                          </span>
                          <span className="text-slate-500 text-[11px] font-medium">
                            Materi: <strong className="text-slate-700">{tp.material}</strong>
                          </span>
                          {tp.isAiSuggested && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-semibold">
                              Saran AI
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 leading-snug">
                          {tp.tpText}
                        </p>
                        {tp.competence && (
                          <p className="text-[11px] text-slate-500">
                            Kompetensi: {tp.competence}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(tp)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Sunting TP"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTp(tp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                          title="Hapus TP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Terpilih: <strong>{selectedTpIds.length}</strong> dari {tps.length} TP
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await runTPAnalysis();
                    setActiveTab('tp-analisis');
                  }}
                  disabled={selectedTpIds.length === 0 || isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Analisis Taksonomi Bloom (AI)
                </button>

                <button
                  onClick={() => setActiveTab('kisi-kisi')}
                  disabled={selectedTpIds.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  Lanjut ke Kisi-Kisi
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
