import React, { useState } from 'react';
import { School, User, BookOpen, Check, ArrowRight, Save } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { AssessmentType } from '../types';

export const SchoolIdentityForm: React.FC = () => {
  const {
    schoolInfo,
    setSchoolInfo,
    teacherInfo,
    setTeacherInfo,
    examConfig,
    setExamConfig,
    setActiveTab,
  } = useAssessment();

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const assessmentTypes: AssessmentType[] = [
    'Asesmen Formatif',
    'Asesmen Sumatif Harian/Lingkup Materi',
    'Asesmen Sumatif Tengah Semester',
    'Asesmen Sumatif Akhir Semester',
    'Asesmen Sumatif Akhir Tahun',
    'Asesmen Sumatif Akhir Jenjang',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-blue-600" />
              Identitas Satuan Pendidikan & Guru Pengampu
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Data ini akan dicantumkan secara otomatis pada Kop Surat Kisi-Kisi, Naskah Soal, dan Pedoman Penskoran resmi.
            </p>
          </div>
          {savedAlert && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Check className="w-4 h-4" /> Data Tersimpan
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identitas Sekolah */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Identitas Satuan Pendidikan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Sekolah / Madrasah *
              </label>
              <input
                type="text"
                required
                value={schoolInfo.schoolName}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, schoolName: e.target.value }))
                }
                placeholder="misal: SMP Negeri 1 Merdeka Belajar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NPSN (Opsional)
              </label>
              <input
                type="text"
                value={schoolInfo.npsn || ''}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, npsn: e.target.value }))
                }
                placeholder="misal: 20210088"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenjang Pendidikan *
              </label>
              <select
                value={schoolInfo.educationLevel}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({
                    ...prev,
                    educationLevel: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="TK/PAUD">TK / PAUD</option>
                <option value="SD/MI">SD / MI</option>
                <option value="SMP/MTs">SMP / MTs</option>
                <option value="SMA/MA">SMA / MA</option>
                <option value="SMK">SMK</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fase Kurikulum Merdeka *
              </label>
              <select
                value={schoolInfo.phase}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({
                    ...prev,
                    phase: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-blue-900"
              >
                <option value="Fondasi">Fase Fondasi (PAUD)</option>
                <option value="A">Fase A (Kelas 1 - 2)</option>
                <option value="B">Fase B (Kelas 3 - 4)</option>
                <option value="C">Fase C (Kelas 5 - 6)</option>
                <option value="D">Fase D (Kelas 7 - 9 SMP)</option>
                <option value="E">Fase E (Kelas 10 SMA)</option>
                <option value="F">Fase F (Kelas 11 - 12 SMA/SMK)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tingkat Kelas *
              </label>
              <input
                type="text"
                required
                value={schoolInfo.grade}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, grade: e.target.value }))
                }
                placeholder="misal: 7, 8, 10, atau XI"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Semester *
              </label>
              <select
                value={schoolInfo.semester}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({
                    ...prev,
                    semester: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tahun Pelajaran *
              </label>
              <input
                type="text"
                value={schoolInfo.academicYear}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, academicYear: e.target.value }))
                }
                placeholder="2025/2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kurikulum
              </label>
              <input
                type="text"
                value={schoolInfo.curriculum}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, curriculum: e.target.value }))
                }
                placeholder="Kurikulum Merdeka"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Sekolah (Untuk Kop Surat)
              </label>
              <input
                type="text"
                value={schoolInfo.schoolAddress || ''}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, schoolAddress: e.target.value }))
                }
                placeholder="Jl. Raya Pendidikan No. 12, Jawa Barat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={schoolInfo.principalName || ''}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, principalName: e.target.value }))
                }
                placeholder="Dr. H. Sulaiman, M.Pd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={schoolInfo.principalNip || ''}
                onChange={(e) =>
                  setSchoolInfo((prev) => ({ ...prev, principalNip: e.target.value }))
                }
                placeholder="19750812 200003 1 004"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Guru */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Identitas Pendidik / Guru
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Guru (dengan gelar) *
              </label>
              <input
                type="text"
                required
                value={teacherInfo.teacherName}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({ ...prev, teacherName: e.target.value }))
                }
                placeholder="misal: Asep Firdaus, S.Pd., M.Si."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Guru (Opsional)
              </label>
              <input
                type="text"
                value={teacherInfo.nip || ''}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({ ...prev, nip: e.target.value }))
                }
                placeholder="19880415 201101 1 009"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mata Pelajaran Diampu *
              </label>
              <input
                type="text"
                required
                value={teacherInfo.subject}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="misal: Bahasa Indonesia"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Data Pembelajaran & Asesmen */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Tujuan dan Jenis Asesmen yang Dirancang
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Asesmen *
              </label>
              <select
                value={examConfig.assessmentType}
                onChange={(e) =>
                  setExamConfig((prev) => ({
                    ...prev,
                    assessmentType: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
              >
                {assessmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alokasi Waktu Pengerjaan (Menit)
              </label>
              <input
                type="number"
                min={15}
                max={240}
                value={examConfig.durationMinutes}
                onChange={(e) =>
                  setExamConfig((prev) => ({
                    ...prev,
                    durationMinutes: Number(e.target.value) || 90,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit & Next Step CTA */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Simpan Identitas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tp-input')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            Lanjut ke Input TP & Upload ATP
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
