import React, { useState } from 'react';
import { X, Check, Plus, Trash2, HelpCircle } from 'lucide-react';
import { QuestionItem, OptionItem } from '../types';

interface QuestionEditorModalProps {
  question: QuestionItem;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<QuestionItem>) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  index,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [questionText, setQuestionText] = useState(question.question);
  const [stimulus, setStimulus] = useState(question.stimulus || '');
  const [questionType, setQuestionType] = useState(question.questionType);
  const [answerKey, setAnswerKey] = useState(question.answerKey);
  const [explanation, setExplanation] = useState(question.explanation);
  const [bloomLevel, setBloomLevel] = useState(question.bloomLevel);
  const [cognitiveCategory, setCognitiveCategory] = useState(question.cognitiveCategory);
  const [hotsReason, setHotsReason] = useState(question.hotsReason || '');
  const [akmAspect, setAkmAspect] = useState(question.akmAspect || '');
  const [weight, setWeight] = useState(question.weight || 2);
  const [remedialNote, setRemedialNote] = useState(question.remedialNote || '');
  const [enrichmentNote, setEnrichmentNote] = useState(question.enrichmentNote || '');

  // Options state for PG
  const [options, setOptions] = useState<OptionItem[]>(
    question.options && question.options.length > 0
      ? question.options
      : [
          { label: 'A', text: '' },
          { label: 'B', text: '' },
          { label: 'C', text: '' },
          { label: 'D', text: '' },
        ]
  );

  const handleOptionChange = (idx: number, text: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], text };
      return copy;
    });
  };

  const handleSave = () => {
    onSave({
      question: questionText,
      stimulus,
      questionType,
      answerKey,
      explanation,
      bloomLevel,
      cognitiveCategory,
      hotsReason,
      akmAspect,
      weight,
      options: questionType === 'Pilihan Ganda' ? options : question.options,
      remedialNote,
      enrichmentNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Sunting Butir Soal No. {question.number}
            </h3>
            <p className="text-xs text-slate-500">
              TP Terkait: <strong>{question.tpCode}</strong> | Bentuk: {question.questionType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Level & Bentuk Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bentuk Soal
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Menjodohkan">Menjodohkan</option>
                <option value="Isian Singkat">Isian Singkat</option>
                <option value="Uraian">Uraian / Studi Kasus</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Level Bloom
              </label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="C1">C1 - Mengingat</option>
                <option value="C2">C2 - Memahami</option>
                <option value="C3">C3 - Mengaplikasikan</option>
                <option value="C4">C4 - Menganalisis</option>
                <option value="C5">C5 - Mengevaluasi</option>
                <option value="C6">C6 - Mencipta</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Kognitif
              </label>
              <select
                value={cognitiveCategory}
                onChange={(e) => setCognitiveCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="LOTS">LOTS (C1-C2)</option>
                <option value="MOTS">MOTS (C3)</option>
                <option value="HOTS">HOTS (C4-C6)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bobot Soal
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Stimulus */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Stimulus Soal (Narasi Kasus, Tabel Data, Fenomena Kontekstual)
            </label>
            <textarea
              rows={3}
              value={stimulus}
              onChange={(e) => setStimulus(e.target.value)}
              placeholder="Masukkan teks stimulus jika soal berbasis konteks..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Pertanyaan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Rumusan Pertanyaan *
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
          </div>

          {/* Options for Pilihan Ganda */}
          {questionType === 'Pilihan Ganda' && (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">
                Pilihan Jawaban & Pengecoh
              </label>
              {options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                    {opt.label}
                  </span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg"
                    placeholder={`Teks pilihan ${opt.label}...`}
                  />
                  <input
                    type="radio"
                    name="answerRadio"
                    checked={answerKey === opt.label}
                    onChange={() => setAnswerKey(opt.label)}
                    title="Jadikan Kunci"
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Kunci Jawaban (Non-PG) */}
          {questionType !== 'Pilihan Ganda' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kunci Jawaban / Kriteria Benar
              </label>
              <textarea
                rows={2}
                value={answerKey}
                onChange={(e) => setAnswerKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-emerald-800"
              />
            </div>
          )}

          {/* Pembahasan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pembahasan Lengkap & Alur Penalaran
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Alasan HOTS / Aspek AKM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Karakteristik HOTS (Mengapa soal menuntut penalaran?)
              </label>
              <input
                type="text"
                value={hotsReason}
                onChange={(e) => setHotsReason(e.target.value)}
                placeholder="misal: Menuntut evaluasi kausalitas data grafik..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Aspek AKM (Literasi / Numerasi)
              </label>
              <input
                type="text"
                value={akmAspect}
                onChange={(e) => setAkmAspect(e.target.value)}
                placeholder="misal: Literasi Membaca - Mengevaluasi isi teks"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Tindak Lanjut: Remedial & Pengayaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rekomendasi Remedial
              </label>
              <input
                type="text"
                value={remedialNote}
                onChange={(e) => setRemedialNote(e.target.value)}
                placeholder="Materi penguatan untuk siswa yang belum tuntas..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rekomendasi Pengayaan
              </label>
              <input
                type="text"
                value={enrichmentNote}
                onChange={(e) => setEnrichmentNote(e.target.value)}
                placeholder="Eksplorasi lanjut untuk siswa mahir..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
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
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};
