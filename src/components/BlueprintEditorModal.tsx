import React, { useState } from 'react';
import { X, Check, Grid3X3, Lightbulb, BookOpen } from 'lucide-react';
import { BlueprintItem, TujuanPembelajaran } from '../types';

interface BlueprintEditorModalProps {
  item: BlueprintItem;
  availableTps: TujuanPembelajaran[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<BlueprintItem>) => void;
}

export const BlueprintEditorModal: React.FC<BlueprintEditorModalProps> = ({
  item,
  availableTps,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [tpCode, setTpCode] = useState(item.tpCode);
  const [tpText, setTpText] = useState(item.tpText);
  const [material, setMaterial] = useState(item.material);
  const [indicator, setIndicator] = useState(item.indicator);
  const [bloomLevel, setBloomLevel] = useState(item.bloomLevel);
  const [cognitiveCategory, setCognitiveCategory] = useState(item.cognitiveCategory);
  const [competence, setCompetence] = useState(item.competence || '');
  const [questionType, setQuestionType] = useState(item.questionType);
  const [weight, setWeight] = useState(item.weight || 2);
  const [stimulusType, setStimulusType] = useState(item.stimulusType || 'Narasi Kasus Kontekstual');

  // When teacher picks a TP from dropdown, auto-fill code, text, material, and competence
  const handleSelectTp = (selectedId: string) => {
    const found = availableTps.find((t) => t.id === selectedId || t.code === selectedId);
    if (found) {
      setTpCode(found.code);
      setTpText(found.tpText);
      setMaterial(found.material);
      if (found.competence) setCompetence(found.competence);
    }
  };

  const handleBloomChange = (level: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6') => {
    setBloomLevel(level);
    if (level === 'C1' || level === 'C2') {
      setCognitiveCategory('LOTS');
    } else if (level === 'C3') {
      setCognitiveCategory('MOTS');
    } else {
      setCognitiveCategory('HOTS');
    }
  };

  const handleSave = () => {
    onSave({
      tpCode,
      tpText,
      material,
      indicator,
      bloomLevel,
      cognitiveCategory,
      competence,
      questionType,
      weight,
      stimulusType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {item.number}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Sunting Butir Kisi-Kisi No. {item.number}
              </h3>
              <p className="text-xs text-slate-500">
                Format resmi kisi-kisi Kurikulum Merdeka Kemendikbudristek
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Quick TP Selector */}
          {availableTps.length > 0 && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
              <label className="block font-semibold text-blue-950 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Pilih Cepat dari Daftar Tujuan Pembelajaran (TP)
              </label>
              <select
                onChange={(e) => handleSelectTp(e.target.value)}
                defaultValue=""
                className="w-full px-2.5 py-1.5 border border-blue-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  -- Pilih TP untuk mengisi otomatis materi dan rumusan --
                </option>
                {availableTps.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.code}] {t.material} - {t.tpText.slice(0, 80)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* TP Code & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kode TP *
              </label>
              <input
                type="text"
                required
                value={tpCode}
                onChange={(e) => setTpCode(e.target.value)}
                placeholder="misal: TP.1.1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Materi Pokok Esensial *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="misal: Teks Eksplanasi Kausalitas"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rumusan TP */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Rumusan Tujuan Pembelajaran (TP) *
            </label>
            <textarea
              rows={2}
              required
              value={tpText}
              onChange={(e) => setTpText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Indikator Soal Operasional */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Indikator Soal Operasional (Spesifik & Terukur) *
              </label>
              <span className="text-[11px] text-slate-400">
                Formula: Disajikan [stimulus], peserta didik dapat [KKO]...
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="misal: Disajikan teks narasi fenomena alam, peserta didik dapat menganalisis hubungan sebab-akibat dengan tepat."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium leading-relaxed"
            />
          </div>

          {/* Grid Kognitif, Bentuk, Bobot & Stimulus */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Bloom Level */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Level Bloom
              </label>
              <select
                value={bloomLevel}
                onChange={(e) => handleBloomChange(e.target.value as any)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-bold"
              >
                <option value="C1">C1 - Mengingat</option>
                <option value="C2">C2 - Memahami</option>
                <option value="C3">C3 - Mengaplikasikan</option>
                <option value="C4">C4 - Menganalisis</option>
                <option value="C5">C5 - Mengevaluasi</option>
                <option value="C6">C6 - Mencipta</option>
              </select>
            </div>

            {/* Cognitive Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Kognitif
              </label>
              <select
                value={cognitiveCategory}
                onChange={(e) => setCognitiveCategory(e.target.value as any)}
                className={`w-full px-2.5 py-2 border rounded-lg bg-white font-bold ${
                  cognitiveCategory === 'HOTS'
                    ? 'border-amber-300 text-amber-900 bg-amber-50/50'
                    : cognitiveCategory === 'MOTS'
                    ? 'border-blue-300 text-blue-900 bg-blue-50/50'
                    : 'border-slate-300 text-slate-800'
                }`}
              >
                <option value="LOTS">LOTS (C1-C2)</option>
                <option value="MOTS">MOTS (C3)</option>
                <option value="HOTS">HOTS (C4-C6)</option>
              </select>
            </div>

            {/* Bentuk Soal */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bentuk Soal
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Benar-Salah">Benar-Salah</option>
                <option value="Menjodohkan">Menjodohkan</option>
                <option value="Isian Singkat">Isian Singkat</option>
                <option value="Uraian">Uraian</option>
                <option value="Studi Kasus">Studi Kasus</option>
              </select>
            </div>

            {/* Bobot Soal */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bobot Skor (Poin)
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-blue-900 font-bold"
              />
            </div>
          </div>

          {/* Jenis Stimulus & Kompetensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Stimulus Kontekstual
              </label>
              <select
                value={stimulusType}
                onChange={(e) => setStimulusType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Narasi Kasus Kontekstual">Narasi Kasus Kontekstual</option>
                <option value="Teks Informasi Ilmiah">Teks Informasi Ilmiah</option>
                <option value="Tabel Data Statistik">Tabel Data Statistik</option>
                <option value="Grafik / Diagram Visual">Grafik / Diagram Visual</option>
                <option value="Infografik Multimodal">Infografik Multimodal</option>
                <option value="Percakapan / Dialog">Percakapan / Dialog</option>
                <option value="Tanpa Stimulus (Langsung)">Tanpa Stimulus (Langsung)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kompetensi yang Diukur
              </label>
              <input
                type="text"
                value={competence}
                onChange={(e) => setCompetence(e.target.value)}
                placeholder="misal: Menganalisis dan menalar data sebab-akibat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Perubahan akan otomatis tersinkronisasi ke format naskah soal dan dokumen ekspor.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              Simpan Perubahan Kisi-Kisi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
