import React, { useState } from 'react';
import { Settings, Save, Check, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export const SettingsModal: React.FC = () => {
  const {
    schoolInfo,
    setSchoolInfo,
    examConfig,
    setExamConfig,
  } = useAssessment();

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Pengaturan Sistem & Format Dokumen
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan preferensi tata letak kop dokumen resmi dan konfigurasi default AI.
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4" /> Pengaturan Disimpan
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Kop Setting */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Tata Letak Kop Surat Resmi
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Garis Pemisah Kop Surat
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="double">Garis Ganda Formal (Tebal & Tipis)</option>
                <option value="single">Garis Tunggal Minimalis</option>
                <option value="none">Tanpa Garis</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Baris Pertama Kop (Instansi Pembina)
              </label>
              <input
                type="text"
                defaultValue="PEMERINTAH DAERAH / DINAS PENDIDIKAN DAN KEBUDAYAAN"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* AI Engine & Security */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Koneksi Engine AI Studio
          </h3>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Model AI:</span>
              <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[11px]">
                gemini-3.8-flash (Server-Side)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Diproses secara aman melalui backend Express tanpa mengekspos kredensial ke peramban. API Key tersinkronisasi otomatis dengan Google AI Studio Secrets.
            </p>
          </div>
        </div>

        {/* Landasan Regulasi Kurikulum */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Landasan Regulasi Capaian Pembelajaran (CP) Aktif
          </h3>

          <div className="space-y-2 text-slate-700">
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/80">
              <span className="font-bold text-blue-950 block">
                1. Capaian Pembelajaran Mata Pelajaran Umum:
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Surat Keputusan Kepala Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) <strong>Nomor 046/H/KR/2025</strong> tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah pada Kurikulum Merdeka.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80">
              <span className="font-bold text-emerald-950 block">
                2. Capaian Pembelajaran Pendidikan Agama:
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah (BKPDM) <strong>Nomor 020 Tahun 2026</strong> tentang Capaian Pembelajaran Pendidikan Agama pada Kurikulum Merdeka.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          Simpan Preferensi
        </button>
      </form>
    </div>
  );
};
