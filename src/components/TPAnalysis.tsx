import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Edit2,
  Check,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Grid3X3,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { TPAnalysisItem } from '../types';

export const TPAnalysis: React.FC = () => {
  const {
    tps,
    selectedTpIds,
    tpAnalyses,
    setTpAnalyses,
    runTPAnalysis,
    isLoading,
    loadingMessage,
    setActiveTab,
  } = useAssessment();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBloom, setEditBloom] = useState<'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6'>('C4');
  const [editCategory, setEditCategory] = useState<'LOTS' | 'MOTS' | 'HOTS'>('HOTS');
  const [editKKO, setEditKKO] = useState('');
  const [editComplexity, setEditComplexity] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');

  const startEdit = (item: TPAnalysisItem) => {
    setEditingId(item.id);
    setEditBloom(item.bloomLevel);
    setEditCategory(item.cognitiveCategory);
    setEditKKO(item.kko);
    setEditComplexity(item.complexity);
  };

  const saveEdit = (id: string) => {
    setTpAnalyses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              bloomLevel: editBloom,
              cognitiveCategory: editCategory,
              kko: editKKO,
              complexity: editComplexity,
            }
          : item
      )
    );
    setEditingId(null);
  };

  const getBloomBadge = (level: string, cat: string) => {
    if (cat === 'HOTS') {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (cat === 'MOTS') {
      return 'bg-blue-100 text-blue-900 border-blue-300';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Analisis Taksonomi Bloom & Kompleksitas Kognitif TP
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penelaahan mendalam terhadap KKO, dimensi kognitif (C1–C6), tuntutan proses bernalar (LOTS/MOTS/HOTS), dan rekomendasi asesmen.
          </p>
        </div>

        <button
          onClick={runTPAnalysis}
          disabled={isLoading || selectedTpIds.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{tpAnalyses.length > 0 ? 'Analisis Ulang AI' : 'Jalankan Analisis AI'}</span>
        </button>
      </div>

      {/* Loading message */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-3 text-xs text-indigo-900">
          <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
          <div>
            <p className="font-bold">AI Sedang Bekerja</p>
            <p className="text-indigo-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Guidance Note */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-950">
            Prinsip Penentuan Level Kognitif Kurikulum Merdeka:
          </p>
          <p className="leading-relaxed">
            Level kognitif ditentukan dari <strong>proses berpikir yang benar-benar dituntut</strong>, bukan sekadar kata kerja permukaan. Soal HOTS (C4–C6) menuntut analisis hubungan, evaluasi argumen, pemecahan masalah dunia nyata, atau perumusan solusi baru.
          </p>
        </div>
      </div>

      {/* Analysis Table */}
      {tpAnalyses.length === 0 && !isLoading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <BrainCircuit className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Belum ada data analisis TP
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>"Jalankan Analisis AI"</strong> di kanan atas untuk memetakan Taksonomi Bloom dan rekomendasi bentuk asesmen secara otomatis.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-3 px-3.5 border-b border-slate-800 w-16">Kode</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-64">Rumusan TP & Materi</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-28">KKO & Level</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-28">Kompleksitas</th>
                  <th className="py-3 px-3.5 border-b border-slate-800">Rekomendasi Indikator Asesmen</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-32">Bentuk Asesmen</th>
                  <th className="py-3 px-3.5 border-b border-slate-800 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tpAnalyses.map((item) => {
                  const isEditing = editingId === item.id;

                  if (isEditing) {
                    return (
                      <tr key={item.id} className="bg-indigo-50/50">
                        <td className="py-3 px-3.5 font-bold">{item.code}</td>
                        <td className="py-3 px-3.5">
                          <p className="font-semibold text-slate-800">{item.tpText}</p>
                        </td>
                        <td className="py-3 px-3.5 space-y-1">
                          <input
                            type="text"
                            value={editKKO}
                            onChange={(e) => setEditKKO(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            placeholder="KKO"
                          />
                          <div className="flex gap-1">
                            <select
                              value={editBloom}
                              onChange={(e) => setEditBloom(e.target.value as any)}
                              className="px-1 py-1 bg-white border border-slate-300 rounded text-xs"
                            >
                              <option value="C1">C1</option>
                              <option value="C2">C2</option>
                              <option value="C3">C3</option>
                              <option value="C4">C4</option>
                              <option value="C5">C5</option>
                              <option value="C6">C6</option>
                            </select>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value as any)}
                              className="px-1 py-1 bg-white border border-slate-300 rounded text-xs"
                            >
                              <option value="LOTS">LOTS</option>
                              <option value="MOTS">MOTS</option>
                              <option value="HOTS">HOTS</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-3 px-3.5">
                          <select
                            value={editComplexity}
                            onChange={(e) => setEditComplexity(e.target.value as any)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          >
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                          </select>
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {item.recommendedIndicators.join('; ')}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {item.recommendedAssessmentForms.join(', ')}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                            title="Simpan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-blue-900 align-top">
                        {item.code}
                      </td>
                      <td className="py-3 px-3.5 align-top space-y-1">
                        <p className="font-semibold text-slate-800 leading-snug">
                          {item.tpText}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Materi: <strong className="text-slate-700">{item.essentialMaterial}</strong>
                        </p>
                        {item.akmRelevance && (
                          <p className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                            AKM: {item.akmRelevance}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3.5 align-top space-y-1">
                        <span className="font-bold text-slate-700 block">
                          {item.kko}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${getBloomBadge(
                            item.bloomLevel,
                            item.cognitiveCategory
                          )}`}
                        >
                          {item.bloomLevel} ({item.cognitiveCategory})
                        </span>
                      </td>
                      <td className="py-3 px-3.5 align-top">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.complexity === 'Tinggi'
                              ? 'bg-rose-100 text-rose-800'
                              : item.complexity === 'Sedang'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.complexity}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 align-top text-slate-700 space-y-1">
                        {item.recommendedIndicators?.map((ind, i) => (
                          <div key={i} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{ind}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex flex-wrap gap-1">
                          {item.recommendedAssessmentForms?.map((form, i) => (
                            <span
                              key={i}
                              className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded"
                            >
                              {form}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 align-top text-center">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Sunting Level / KKO"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Analisis ini digunakan sebagai acuan distribusi kisi-kisi dan formula soal HOTS/AKM.
            </span>

            <button
              onClick={() => setActiveTab('kisi-kisi')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Grid3X3 className="w-4 h-4" />
              Lanjut Susun Kisi-Kisi
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
