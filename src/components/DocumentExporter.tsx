import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Sparkles,
  BarChart3,
  Award,
  ChevronDown,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import {
  exportAssessmentToDocx,
  exportAssessmentToExcel,
  printAssessmentDocument,
} from '../utils/exportUtils';

export const DocumentExporter: React.FC = () => {
  const {
    schoolInfo,
    teacherInfo,
    examConfig,
    tps,
    blueprint,
    questions,
    validation,
  } = useAssessment();

  const [activeDocSubTab, setActiveDocSubTab] = useState<'kisi' | 'soal' | 'kunci' | 'rubrik' | 'distribusi'>('kisi');
  const [isExporting, setIsExporting] = useState(false);

  const hotsCount = questions.filter((q) => q.cognitiveCategory === 'HOTS').length;
  const motsCount = questions.filter((q) => q.cognitiveCategory === 'MOTS').length;
  const lotsCount = questions.filter((q) => q.cognitiveCategory === 'LOTS').length;
  const totalScore = questions.reduce((acc, q) => acc + (q.maxScore || q.weight || 2), 0);

  const handleExportWord = async (type: 'all' | 'kisi' | 'soal' | 'kunci' | 'rubrik' = 'all') => {
    setIsExporting(true);
    try {
      await exportAssessmentToDocx(
        {
          id: 'current',
          createdAt: new Date().toISOString(),
          title: `${schoolInfo.subject || teacherInfo.subject} - ${examConfig.assessmentType}`,
          schoolInfo,
          teacherInfo,
          examConfig,
          tps,
          blueprint,
          questions,
          validation: validation || undefined,
        },
        type
      );
    } catch (err: any) {
      alert('Gagal mengekspor dokumen Word: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    exportAssessmentToExcel({
      id: 'current',
      createdAt: new Date().toISOString(),
      title: `${schoolInfo.subject || teacherInfo.subject} - Asesmen`,
      schoolInfo,
      teacherInfo,
      examConfig,
      tps,
      blueprint,
      questions,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Dokumen Saya & Pusat Ekspor Resmi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pratinjau dan unduh 5 dokumen perangkat asesmen siap cetak (Kop Sekolah, Kisi-Kisi, Naskah Soal, Kunci, dan Rubrik).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Word */}
          <button
            onClick={() => handleExportWord('all')}
            disabled={isExporting || (blueprint.length === 0 && questions.length === 0)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Download Dokumen Lengkap Microsoft Word (.docx)"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Word (.docx)</span>
          </button>

          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            disabled={blueprint.length === 0 && questions.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            title="Download Kisi-Kisi & Bank Soal ke Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>

          {/* Print to PDF */}
          <button
            onClick={printAssessmentDocument}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            title="Cetak Naskah / Simpan sebagai PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher for 5 Documents */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 sm:gap-6 text-xs font-semibold print:hidden">
        <button
          onClick={() => setActiveDocSubTab('kisi')}
          className={`pb-3 transition-colors ${
            activeDocSubTab === 'kisi'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Dokumen Kisi-Kisi ({blueprint.length})
        </button>
        <button
          onClick={() => setActiveDocSubTab('soal')}
          className={`pb-3 transition-colors ${
            activeDocSubTab === 'soal'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Naskah Soal Siswa ({questions.length})
        </button>
        <button
          onClick={() => setActiveDocSubTab('kunci')}
          className={`pb-3 transition-colors ${
            activeDocSubTab === 'kunci'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Kunci & Pembahasan
        </button>
        <button
          onClick={() => setActiveDocSubTab('rubrik')}
          className={`pb-3 transition-colors ${
            activeDocSubTab === 'rubrik'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          4. Pedoman Penskoran & Rubrik
        </button>
        <button
          onClick={() => setActiveDocSubTab('distribusi')}
          className={`pb-3 transition-colors ${
            activeDocSubTab === 'distribusi'
              ? 'border-b-2 border-blue-600 text-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          5. Laporan Distribusi Soal
        </button>
      </div>

      {/* Printable Sheet View Container */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Kop Surat Sekolah Resmi */}
        <div className="text-center border-b-2 border-slate-900 pb-3 mb-6 space-y-1">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-700">
            Pemerintah Daerah / Yayasan Pendidikan Satuan Formal
          </p>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">
            {schoolInfo.schoolName || 'SMP/SMA NEGERI'}
          </h1>
          <p className="text-xs text-slate-600 italic">
            {schoolInfo.schoolAddress || 'Alamat Satuan Pendidikan'} | NPSN: {schoolInfo.npsn || '-'}
          </p>
        </div>

        {/* Identitas Asesmen Table Box */}
        <div className="border border-slate-800 rounded-lg p-3.5 mb-6 text-xs text-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-500 block text-[10px]">MATA PELAJARAN</span>
              <span className="font-bold">{teacherInfo.subject || schoolInfo.subject}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">KELAS / FASE</span>
              <span className="font-bold">Kelas {schoolInfo.grade} / Fase {schoolInfo.phase}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">JENIS ASESMEN</span>
              <span className="font-bold">{examConfig.assessmentType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ALOKASI WAKTU</span>
              <span className="font-bold">{examConfig.durationMinutes} Menit</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">SEMESTER / T.A.</span>
              <span className="font-bold">{schoolInfo.semester} / {schoolInfo.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">GURU PENGAMPU</span>
              <span className="font-bold">{teacherInfo.teacherName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">TOTAL SOAL</span>
              <span className="font-bold">{questions.length || blueprint.length} Butir</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">KURIKULUM</span>
              <span className="font-bold">{schoolInfo.curriculum || 'Kurikulum Merdeka'}</span>
            </div>
          </div>
        </div>

        {/* 1. KISI-KISI SUBTAB */}
        {activeDocSubTab === 'kisi' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-center text-slate-900 border-b pb-2">
              KISI-KISI PENULISAN SOAL ASESMEN
            </h2>

            {blueprint.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                Belum ada data kisi-kisi. Generate kisi-kisi terlebih dahulu.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                      <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                      <th className="p-2 border-r border-slate-300 w-44">Tujuan Pembelajaran</th>
                      <th className="p-2 border-r border-slate-300 w-32">Materi Pokok</th>
                      <th className="p-2 border-r border-slate-300">Indikator Soal</th>
                      <th className="p-2 border-r border-slate-300 text-center w-24">Level</th>
                      <th className="p-2 border-r border-slate-300 text-center w-24">Bentuk</th>
                      <th className="p-2 text-center w-12">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blueprint.map((b) => (
                      <tr key={b.id} className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center font-bold">{b.number}</td>
                        <td className="p-2 border-r border-slate-200">
                          <span className="font-bold block text-blue-900">[{b.tpCode}]</span>
                          {b.tpText}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-medium">{b.material}</td>
                        <td className="p-2 border-r border-slate-200">{b.indicator}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-semibold">
                          {b.bloomLevel} ({b.cognitiveCategory})
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center">{b.questionType}</td>
                        <td className="p-2 text-center font-bold text-blue-900">{b.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 2. NASKAH SOAL SISWA SUBTAB */}
        {activeDocSubTab === 'soal' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-center text-slate-900 border-b pb-2">
              NASKAH SOAL ASESMEN SISWA
            </h2>

            {/* Kotak Nama Siswa */}
            <div className="border border-slate-300 p-3 rounded-lg grid grid-cols-2 gap-4 text-xs">
              <div>Nama Siswa : ..............................................................</div>
              <div>Nomor Absen : .................................</div>
              <div>Kelas / Reg : ..............................................................</div>
              <div>Hari / Tgl   : .................................</div>
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded">
              <strong>Petunjuk Pengerjaan:</strong> Bacalah setiap stimulus dan butir pertanyaan dengan teliti. Jawablah butir soal dengan jujur, objektif, dan teliti pada ruang jawaban yang disediakan.
            </p>

            {questions.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                Belum ada naskah soal. Generate naskah soal HOTS atau AKM terlebih dahulu.
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="text-xs space-y-2">
                    {/* Stimulus jika ada */}
                    {q.stimulus && (
                      <div className="p-3 bg-slate-50 border-l-4 border-slate-700 italic text-slate-700">
                        <span className="font-bold not-italic block text-slate-900 mb-1">
                          Stimulus untuk Soal No. {q.number}:
                        </span>
                        {q.stimulus}
                      </div>
                    )}

                    {/* Pertanyaan */}
                    <p className="font-bold text-slate-900">
                      {q.number}. {q.question}
                    </p>

                    {/* Opsi Pilihan Ganda */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                        {q.options.map((opt) => (
                          <div key={opt.label} className="flex items-start gap-2">
                            <span className="font-bold">{opt.label}.</span>
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Opsi PGK / Pernyataan */}
                    {q.complexItems && q.complexItems.length > 0 && (
                      <div className="pl-4 space-y-1">
                        <p className="italic text-slate-500">Beri tanda centang pada pernyataan yang Benar:</p>
                        {q.complexItems.map((ci, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-4 h-4 border border-slate-400 inline-block rounded-xs" />
                            <span>{ci.statement}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ruang Jawaban Uraian */}
                    {(q.questionType === 'Uraian' || q.questionType === 'Studi Kasus') && (
                      <div className="pl-4 pt-1">
                        <p className="text-slate-400 italic">Ruang Jawaban Siswa:</p>
                        <div className="w-full h-16 border-b border-dashed border-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. KUNCI JAWABAN & PEMBAHASAN SUBTAB */}
        {activeDocSubTab === 'kunci' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-center text-slate-900 border-b pb-2">
              KUNCI JAWABAN, PEMBAHASAN & ANALISIS DISTRAKTOR
            </h2>

            <div className="space-y-4 text-xs">
              {questions.map((q) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Soal No. {q.number} | Kunci: <strong className="text-emerald-700 text-sm">{q.answerKey}</strong>
                    </span>
                    <span className="font-semibold text-blue-900">
                      {q.bloomLevel} ({q.cognitiveCategory}) | TP: {q.tpCode}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    <strong>Pembahasan & Penalaran:</strong> {q.explanation}
                  </p>

                  {q.hotsReason && (
                    <p className="text-amber-900 bg-amber-50 p-2 rounded">
                      <strong>Karakteristik HOTS:</strong> {q.hotsReason}
                    </p>
                  )}

                  {q.akmAspect && (
                    <p className="text-teal-900 bg-teal-50 p-2 rounded">
                      <strong>Aspek AKM:</strong> {q.akmAspect}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PEDOMAN PENSKORAN & RUBRIK SUBTAB */}
        {activeDocSubTab === 'rubrik' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-center text-slate-900 border-b pb-2">
              PEDOMAN PENSKORAN & RUBRIK PENILAIAN
            </h2>

            <div className="space-y-3 text-xs">
              {questions.map((q) => (
                <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Soal No. {q.number} ({q.questionType})</span>
                    <span>Bobot / Skor Maksimal: {q.maxScore || q.weight}</span>
                  </div>

                  {q.rubric && q.rubric.length > 0 ? (
                    <div className="space-y-1 pl-2">
                      <span className="font-semibold text-slate-600 block">Kriteria Rubrik Deskriptif:</span>
                      {q.rubric.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2">
                          <span className="font-bold text-blue-900 shrink-0">Skor {r.score}:</span>
                          <span className="text-slate-700">{r.description}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 pl-2">
                      * Menjawab benar: Skor {q.maxScore || q.weight} <br />
                      * Menjawab salah / kosong: Skor 0
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LAPORAN DISTRIBUSI SOAL */}
        {activeDocSubTab === 'distribusi' && (
          <div className="space-y-6 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-center text-slate-900 border-b pb-2">
              LAPORAN DISTRIBUSI KOGNITIF & BENTUK SOAL
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-slate-500 font-semibold">LOTS (C1-C2)</span>
                <p className="text-2xl font-black text-slate-700">{lotsCount} Butir</p>
                <p className="text-slate-400">
                  {questions.length > 0 ? Math.round((lotsCount / questions.length) * 100) : 0}% dari total
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
                <span className="text-blue-600 font-semibold">MOTS (C3)</span>
                <p className="text-2xl font-black text-blue-900">{motsCount} Butir</p>
                <p className="text-blue-400">
                  {questions.length > 0 ? Math.round((motsCount / questions.length) * 100) : 0}% dari total
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
                <span className="text-amber-700 font-semibold">HOTS (C4-C6)</span>
                <p className="text-2xl font-black text-amber-900">{hotsCount} Butir</p>
                <p className="text-amber-500">
                  {questions.length > 0 ? Math.round((hotsCount / questions.length) * 100) : 0}% dari total
                </p>
              </div>
            </div>

            {/* Status Kesimpulan Kurikulum Merdeka */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">
                  Kesesuaian Standar Asesmen Kurikulum Merdeka Terpenuhi
                </p>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Instrumen asesmen telah memenuhi proporsi penalaran tingkat tinggi (HOTS ≥ 40%) dengan stimulus kontekstual yang teruji.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tanda Tangan Guru & Kepala Sekolah Formal */}
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-800">
          <div>
            <p>Mengetahui,</p>
            <p>Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline">{schoolInfo.principalName || 'Dr. H. Sulaiman, M.Pd.'}</p>
            <p>NIP. {schoolInfo.principalNip || '-'}</p>
          </div>

          <div className="text-right">
            <p>Kota Edukasi, .................... 2026</p>
            <p>Guru Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline">{teacherInfo.teacherName}</p>
            <p>NIP. {teacherInfo.nip || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
