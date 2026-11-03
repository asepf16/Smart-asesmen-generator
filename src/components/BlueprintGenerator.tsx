import React, { useState } from 'react';
import {
  Grid3X3,
  Sparkles,
  Sliders,
  Printer,
  Download,
  Flame,
  Target,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Copy,
  FileSpreadsheet,
  Check,
  PlusCircle,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { exportAssessmentToExcel, printAssessmentDocument } from '../utils/exportUtils';
import { BlueprintItem } from '../types';
import { BlueprintEditorModal } from './BlueprintEditorModal';

export const BlueprintGenerator: React.FC = () => {
  const {
    schoolInfo,
    teacherInfo,
    examConfig,
    setExamConfig,
    selectedTpIds,
    blueprint,
    generateBlueprint,
    updateBlueprintItem,
    deleteBlueprintItem,
    addBlueprintItem,
    duplicateBlueprintItem,
    isLoading,
    loadingMessage,
    setActiveTab,
    tps,
    questions,
  } = useAssessment();

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeEditItem, setActiveEditItem] = useState<BlueprintItem | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Quick state for question distribution
  const [totalQuestions, setTotalQuestions] = useState(examConfig.totalQuestions || 10);
  const [lotsPct, setLotsPct] = useState(examConfig.distribution?.lots || 20);
  const [motsPct, setMotsPct] = useState(examConfig.distribution?.mots || 30);
  const [hotsPct, setHotsPct] = useState(examConfig.distribution?.hots || 50);

  const handleUpdateConfig = () => {
    setExamConfig((prev) => ({
      ...prev,
      totalQuestions,
      distribution: {
        lots: lotsPct,
        mots: motsPct,
        hots: hotsPct,
      },
    }));
    setShowConfigModal(false);
  };

  const handleExcelExport = () => {
    if (blueprint.length === 0) {
      alert('Belum ada kisi-kisi yang disusun.');
      return;
    }
    exportAssessmentToExcel({
      id: 'current',
      createdAt: new Date().toISOString(),
      title: `${schoolInfo.subject || teacherInfo.subject}_Kisi_Kisi`,
      schoolInfo,
      teacherInfo,
      examConfig,
      tps,
      blueprint,
      questions,
    });
  };

  const handleSaveItem = (updated: Partial<BlueprintItem>) => {
    if (activeEditItem) {
      updateBlueprintItem(activeEditItem.id, updated);
      setSaveSuccessMsg(`Butir No. ${activeEditItem.number} berhasil diperbarui!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleAddNewItem = () => {
    addBlueprintItem();
    setSaveSuccessMsg('Butir kisi-kisi baru berhasil ditambahkan.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const totalWeight = blueprint.reduce((acc, curr) => acc + (Number(curr.weight) || 1), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Generator & Editor Kisi-Kisi Soal Asesmen
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Format resmi Kemendikbudristek: Anda dapat menyusun otomatis dengan AI, mengedit tiap butir, menambah, menduplikasi, atau menghapus indikator soal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Button Tambah Butir Manual */}
          <button
            onClick={handleAddNewItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-300 transition-all active:scale-95"
            title="Tambah Butir Kisi-Kisi Baru secara Manual"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Tambah Butir</span>
          </button>

          {/* Button Config */}
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-all"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            Distribusi Soal
          </button>

          {/* Button Generate AI */}
          <button
            onClick={generateBlueprint}
            disabled={isLoading || selectedTpIds.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{blueprint.length > 0 ? 'Generate Ulang Kisi-Kisi' : 'Generate Kisi-Kisi (AI)'}</span>
          </button>

          {/* Export to Excel */}
          <button
            onClick={handleExcelExport}
            disabled={blueprint.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            title="Ekspor ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Loading message */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Menyusun Kisi-Kisi Soal</p>
            <p className="text-blue-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Distribution Configuration Drawer/Modal */}
      {showConfigModal && (
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-300 space-y-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Konfigurasi Distribusi Tingkat Kognitif & Bentuk Soal
            </h3>
            <span className="text-slate-500">Total persentase kognitif: {lotsPct + motsPct + hotsPct}%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Jumlah Soal
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proporsi LOTS (C1-C2) %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={lotsPct}
                onChange={(e) => setLotsPct(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proporsi MOTS (C3) %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={motsPct}
                onChange={(e) => setMotsPct(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proporsi HOTS (C4-C6) %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={hotsPct}
                onChange={(e) => setHotsPct(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-amber-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowConfigModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleUpdateConfig}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs"
            >
              Terapkan Konfigurasi
            </button>
          </div>
        </div>
      )}

      {/* Blueprint Table */}
      {blueprint.length === 0 && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <Grid3X3 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Kisi-kisi soal belum dibuat
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-4">
            Klik tombol <strong>"Generate Kisi-Kisi (AI)"</strong> di atas untuk memetakan otomatis, atau gunakan <strong>"Tambah Butir"</strong> untuk menginput kisi-kisi mandiri.
          </p>
          <button
            onClick={handleAddNewItem}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Butir Kisi-Kisi Manual
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Identitas Resmi Dokumen */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mata Pelajaran</span>
              <span className="font-bold text-slate-800">{teacherInfo.subject || schoolInfo.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas / Fase</span>
              <span className="font-bold text-slate-800">Kelas {schoolInfo.grade} / Fase {schoolInfo.phase}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Jenis Asesmen</span>
              <span className="font-bold text-slate-800">{examConfig.assessmentType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Butir / Bobot</span>
              <span className="font-bold text-blue-900">{blueprint.length} Butir ({totalWeight} Poin)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-3 px-3 border-b border-slate-800 text-center w-12">No</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-52">Tujuan Pembelajaran (TP)</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-40">Materi Pokok</th>
                  <th className="py-3 px-3.5 border-b border-slate-800">Indikator Soal Operasional</th>
                  <th className="py-3 px-2 border-b border-slate-800 text-center w-24">Kognitif</th>
                  <th className="py-3 px-2 border-b border-slate-800 text-center w-32">Bentuk Soal</th>
                  <th className="py-3 px-2 border-b border-slate-800 text-center w-14">Bobot</th>
                  <th className="py-3 px-3 border-b border-slate-800 text-center w-28">Fasilitas Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blueprint.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">
                      {item.number}
                    </td>
                    <td className="py-3 px-3.5 align-top space-y-1">
                      <span className="inline-block bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.tpCode}
                      </span>
                      <p className="font-medium text-slate-800 leading-snug">
                        {item.tpText}
                      </p>
                    </td>
                    <td className="py-3 px-3.5 align-top font-semibold text-slate-700">
                      {item.material}
                    </td>
                    <td className="py-3 px-3.5 align-top text-slate-800 leading-relaxed">
                      {item.indicator}
                      {item.stimulusType && (
                        <span className="block mt-1 text-[10px] text-slate-400 italic">
                          Stimulus: {item.stimulusType}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.cognitiveCategory === 'HOTS'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.cognitiveCategory === 'MOTS'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {item.bloomLevel} ({item.cognitiveCategory})
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center align-top font-medium text-slate-700">
                      <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-[11px] inline-block">
                        {item.questionType}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center align-top font-bold text-blue-900">
                      {item.weight}
                    </td>
                    {/* FASILITAS EDIT & AKSI */}
                    <td className="py-3 px-3 text-center align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setActiveEditItem(item)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg transition-colors border border-blue-200"
                          title="Sunting / Edit Butir Kisi-Kisi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateBlueprintItem(item.id)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg transition-colors border border-emerald-200"
                          title="Salin / Duplikasi Butir"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBlueprintItem(item.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-lg transition-colors border border-rose-200"
                          title="Hapus Butir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action Toolbar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNewItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                Tambah Butir ke Tabel
              </button>
              <span className="text-xs text-slate-500">
                Total <strong>{blueprint.length}</strong> butir kisi-kisi ({totalWeight} poin).
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('soal-hots')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Flame className="w-4 h-4" />
                Generate Soal HOTS
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('soal-akm')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Target className="w-4 h-4" />
                Generate Soal AKM
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Editor Modal */}
      {activeEditItem && (
        <BlueprintEditorModal
          item={activeEditItem}
          availableTps={tps}
          isOpen={true}
          onClose={() => setActiveEditItem(null)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};
