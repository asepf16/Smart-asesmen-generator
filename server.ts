import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi pada Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Endpoint: Analisis TP / ATP
app.post('/api/ai/analyze-tp', async (req, res) => {
  try {
    const { tps, subject, phase, grade } = req.body;
    if (!tps || !Array.isArray(tps) || tps.length === 0) {
      return res.status(400).json({ error: 'Daftar Tujuan Pembelajaran (TP) diperlukan.' });
    }

    const ai = getGenAI();
    const prompt = `
Anda adalah ahli asesmen pendidikan Kurikulum Merdeka (berdasarkan standar SK BSKAP No. 046/H/KR/2025 dan Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah / BKPDM Nomor 020 Tahun 2026 tentang pendidikan agama) serta Taksonomi Bloom Revisi.
Lakukan analisis mendalam terhadap Tujuan Pembelajaran (TP) berikut untuk Mata Pelajaran: ${subject || 'Umum'}, Fase: ${phase || 'D'}, Kelas: ${grade || '7'}.

Daftar TP yang dianalisis:
${JSON.stringify(tps, null, 2)}

Tugas:
Analisis setiap TP berdasarkan:
1. Kata Kerja Operasional (KKO) yang digunakan.
2. Dimensi kognitif (C1-Mengingat, C2-Memahami, C3-Mengaplikasikan, C4-Menganalisis, C5-Mengevaluasi, C6-Mencipta).
3. Kategori level (LOTS: C1-C2, MOTS: C3, HOTS: C4-C6) berdasarkan proses berpikir yang dituntut, bukan hanya kata kerja permukaan.
4. Kompetensi inti yang diukur.
5. Materi esensial / konsep pokok.
6. Pengetahuan, keterampilan, dan pemahaman yang ditargetkan.
7. Tingkat kompleksitas (Rendah, Sedang, Tinggi).
8. Rekomendasi 2-3 indikator soal spesifik.
9. Rekomendasi bentuk asesmen yang paling cocok (Pilihan Ganda, PG Kompleks, Uraian, Studi Kasus, Kinerja, Asesmen Autentik).
10. Potensi integrasi Literasi dan Numerasi AKM.

Kembalikan respon HANYA dalam format JSON dengan struktur array objek:
[
  {
    "id": "tp id sama seperti input jika ada",
    "code": "kode TP",
    "tpText": "rumusan TP",
    "kko": "kata kerja operasional utama",
    "bloomLevel": "C1 | C2 | C3 | C4 | C5 | C6",
    "cognitiveCategory": "LOTS | MOTS | HOTS",
    "coreCompetence": "kompetensi inti yang diukur",
    "essentialMaterial": "materi pokok esensial",
    "aspects": {
      "knowledge": "aspek pengetahuan",
      "skill": "aspek keterampilan",
      "understanding": "aspek pemahaman bermakna"
    },
    "complexity": "Rendah | Sedang | Tinggi",
    "recommendedIndicators": ["Indikator 1...", "Indikator 2..."],
    "recommendedAssessmentForms": ["Pilihan Ganda", "Uraian"],
    "akmRelevance": "relevansi literasi membaca atau numerasi"
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing TP:', error);
    res.status(500).json({ error: error.message || 'Gagal menganalisis Tujuan Pembelajaran.' });
  }
});

// 2. Endpoint: Ekstraksi Dokumen ATP (Text / Parsing)
app.post('/api/ai/parse-atp', async (req, res) => {
  try {
    const { documentText, filename } = req.body;
    if (!documentText || documentText.trim().length === 0) {
      return res.status(400).json({ error: 'Teks dokumen ATP tidak boleh kosong.' });
    }

    const ai = getGenAI();
    const prompt = `
Anda adalah ahli kurikulum yang bertugas menganalisis dokumen Alur Tujuan Pembelajaran (ATP) / Capaian Pembelajaran (CP) Kurikulum Merdeka (mengacu pada SK BSKAP No. 046/H/KR/2025 dan Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah / BKPDM Nomor 020 Tahun 2026 tentang pendidikan agama).
File: "${filename || 'Dokumen ATP'}"
 
Isi Dokumen:
---
${documentText.slice(0, 15000)}
---

Tugas Anda:
1. Identifikasi Mata Pelajaran, Jenjang, Fase, dan Kelas dari dokumen (jika tidak eksplisit, tentukan estimasi terbaik).
2. Ekstrak seluruh Elemen dan Capaian Pembelajaran (CP) yang tercantum.
3. Ekstrak setiap Tujuan Pembelajaran (TP), Kode TP (buatkan seperti TP.1, TP.2 jika belum ada penomoran), Materi Pokok, Lingkup Materi, dan Alokasi Waktu / Keterangan jika ada.
4. Jangan membuat atau mengasumsikan TP yang tidak ada dalam dokumen tanpa menandai bahwa itu adalah "Saran AI". Berikan tanda "isAiSuggested": true jika itu adalah penyempurnaan dari AI.

Kembalikan respon HANYA dalam format JSON dengan struktur:
{
  "subject": "nama mata pelajaran terdeteksi",
  "phase": "A | B | C | D | E | F",
  "grade": "angka kelas (misal: 7, 8, 10)",
  "elements": ["Elemen 1", "Elemen 2"],
  "cpSummary": "ringkasan CP keseluruhan",
  "tps": [
    {
      "code": "TP.1",
      "tpText": "rumusan tujuan pembelajaran persis atau disempurnakan",
      "material": "materi pokok terkait",
      "scope": "lingkup materi",
      "competence": "kompetensi yang diharapkan",
      "isAiSuggested": false
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error parsing ATP:', error);
    res.status(500).json({ error: error.message || 'Gagal membaca dan mengekstrak dokumen ATP.' });
  }
});

// 3. Endpoint: Generator Kisi-Kisi Soal
app.post('/api/ai/generate-kisi-kisi', async (req, res) => {
  try {
    const { schoolInfo, teacherInfo, examConfig, selectedTps } = req.body;
    if (!selectedTps || selectedTps.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal satu Tujuan Pembelajaran (TP).' });
    }

    const ai = getGenAI();
    const prompt = `
Anda adalah ahli penyusun kisi-kisi asesmen resmi Kurikulum Merdeka (SK BSKAP No. 046/H/KR/2025 dan Keputusan Kepala BKPDM Nomor 020 Tahun 2026 tentang pendidikan agama).
Susun kisi-kisi asesmen komprehensif, terstandar, dan profesional berdasarkan data berikut:

Identitas Asesmen:
- Sekolah: ${schoolInfo?.schoolName || 'SMP/SMA Negeri'}
- Mata Pelajaran: ${schoolInfo?.subject || 'Mata Pelajaran'}
- Jenjang/Fase/Kelas: ${schoolInfo?.educationLevel || 'SMP'} / Fase ${schoolInfo?.phase || 'D'} / Kelas ${schoolInfo?.grade || '7'}
- Semester: ${schoolInfo?.semester || 'Ganjil'} / Tahun Ajaran: ${schoolInfo?.academicYear || '2025/2026'}
- Jenis Asesmen: ${examConfig?.assessmentType || 'Sumatif Akhir Semester'}
- Total Jumlah Soal: ${examConfig?.totalQuestions || 10} Soal
- Alokasi Waktu: ${examConfig?.durationMinutes || 90} Menit
- Distribusi Kognitif yang diinginkan:
  * LOTS (C1-C2): ${examConfig?.distribution?.lots || 20}%
  * MOTS (C3): ${examConfig?.distribution?.mots || 30}%
  * HOTS (C4-C6): ${examConfig?.distribution?.hots || 50}%
- Distribusi Bentuk Soal: ${JSON.stringify(examConfig?.questionTypes || { "Pilihan Ganda": 5, "Pilihan Ganda Kompleks": 2, "Menjodohkan": 1, "Isian Singkat": 1, "Uraian": 1 })}

Daftar TP yang diujikan:
${JSON.stringify(selectedTps, null, 2)}

Ketentuan Penyusunan Kisi-Kisi:
1. Buat tepat ${examConfig?.totalQuestions || 10} butir kisi-kisi soal dengan nomor urut 1 sampai ${examConfig?.totalQuestions || 10}.
2. Hubungkan secara linear dan logis antara Tujuan Pembelajaran (TP) -> Materi Pokok -> Indikator Soal -> Level Kognitif -> Bentuk Soal -> Nomor Soal -> Bobot Soal.
3. Rumusan indikator soal harus operasional, jelas, dan memuat stimulus/konteks (misal: "Disajikan teks informasi/grafik/tabel tentang..., peserta didik dapat menganalisis...").
4. Level kognitif harus tepat (C1, C2, C3, C4, C5, atau C6) serta kategori (LOTS, MOTS, atau HOTS) sesuai proses berpikir.
5. Bobot soal harus proporsional (misal: PG: 1 atau 2 poin, PGK: 2 atau 3 poin, Isian: 2 poin, Uraian: 4 atau 5 poin).

Kembalikan respon HANYA dalam format JSON dengan format:
{
  "summary": {
    "totalQuestions": ${examConfig?.totalQuestions || 10},
    "totalScore": 100,
    "lotsCount": 2,
    "motsCount": 3,
    "hotsCount": 5
  },
  "items": [
    {
      "number": 1,
      "tpCode": "kode TP",
      "tpText": "rumusan TP",
      "material": "materi esensial",
      "indicator": "rumusan indikator soal yang spesifik dan terukur",
      "bloomLevel": "C1 | C2 | C3 | C4 | C5 | C6",
      "cognitiveCategory": "LOTS | MOTS | HOTS",
      "competence": "kompetensi yang diukur",
      "questionType": "Pilihan Ganda | Pilihan Ganda Kompleks | Menjodohkan | Isian Singkat | Uraian | Benar-Salah | Studi Kasus",
      "weight": 2,
      "stimulusType": "Teks Narasi | Tabel Data | Infografik | Kasus Kontekstual | Gambar Diagram | Tanpa Stimulus"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating kisi-kisi:', error);
    res.status(500).json({ error: error.message || 'Gagal menyusun kisi-kisi soal.' });
  }
});

// 4. Endpoint: Generator Soal Lengkap (HOTS, AKM, Formatif, Sumatif)
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const {
      mode, // 'hots' | 'akm' | 'formatif' | 'sumatif' | 'from-blueprint'
      schoolInfo,
      teacherInfo,
      blueprintItems,
      customConfig,
    } = req.body;

    const ai = getGenAI();
    let promptRole = '';

    if (mode === 'hots') {
      promptRole = `
Fokus Khusus: SOAL HOTS (Higher Order Thinking Skills).
- Mengukur kemampuan bernalar, menganalisis (C4), mengevaluasi (C5), atau mencipta/solusi (C6).
- Berbasis stimulus autentik, permasalahan dunia nyata, studi kasus, eksperimen, atau fenomena terkini.
- Tidak dapat dijawab dengan hafalan atau pencarian kata kunci langsung.
- Pilihan jawaban/distraktor harus logis, homogen, dan mencerminkan miskonsepsi peserta didik.
- Berikan alasan mengapa soal tersebut dikategorikan sebagai HOTS.`;
    } else if (mode === 'akm') {
      promptRole = `
Fokus Khusus: SOAL AKM (Asesmen Kompetensi Minimum) LITERASI & NUMERASI.
- Pendekatan AKM Kemendikbudristek:
  * Literasi Membaca: Menemukan informasi, Memahami (interpret & integrate), Mengevaluasi & Merefleksi. Teks informasi atau fiksi yang kaya konteks.
  * Numerasi: Bilangan, Aljabar, Geometri & Pengukuran, Data & Ketidakpastian. Konteks Personal, Sosial-Budaya, atau Saintifik.
- Soal harus berbasis stimulus kaya informasi (bisa teks data, skenario nyata, tabel, infografis simulasi).
- Bentuk bervariasi: Pilihan Ganda Kompleks (pilih lebih dari satu benar, atau pernyataan Benar/Salah), Menjodohkan, Isian Singkat, Uraian penalaran.`;
    } else if (mode === 'formatif') {
      promptRole = `
Fokus Khusus: ASESMEN FORMATIF (Assessment for Learning & as Learning).
- Bertujuan memantau pemahaman saat proses belajar, mendeteksi kesulitan belajar, dan memberikan umpan balik langsung.
- Sediakan indikator ketercapaian, rubrik penilaian deskriptif, dan rekomendasi tindak lanjut konkret:
  * Rekomendasi Remedial (untuk siswa yang belum mencapai tujuan).
  * Rekomendasi Pengayaan (untuk siswa yang sudah tuntas/mahir).`;
    } else {
      promptRole = `
Fokus Khusus: ASESMEN SUMATIF KOMPREHENSIF.
- Mengukur ketercapaian Tujuan Pembelajaran secara holistik.
- Sesuai dengan distribusi kisi-kisi, bobot, dan pedoman penskoran yang baku.`;
    }

    const prompt = `
Anda adalah tim ahli penyusun instrumen asesmen dan psikometri pendidikan Indonesia.
${promptRole}

Identitas Pembelajaran:
- Sekolah: ${schoolInfo?.schoolName || 'SMP/SMA Negeri'}
- Mata Pelajaran: ${schoolInfo?.subject || 'Mata Pelajaran'}
- Fase/Kelas: Fase ${schoolInfo?.phase || 'D'} / Kelas ${schoolInfo?.grade || '7'}
- Konfigurasi Tambahan: ${JSON.stringify(customConfig || {})}

Berikut adalah Kisi-Kisi / Spesifikasi Butir yang harus dibuatkan naskah soalnya:
${JSON.stringify(blueprintItems, null, 2)}

Ketentuan Mutu Soal:
1. Buat butir soal lengkap untuk setiap item kisi-kisi di atas.
2. Setiap butir soal HARUS memiliki:
   - Nomor soal (number)
   - Kode TP (tpCode)
   - Indikator soal (indicator)
   - Stimulus lengkap (stimulus) jika relevan (paragraf narasi/kasus/informasi kontekstual, tabel deskriptif, dialog, atau situasi masalah).
   - Pertanyaan (question) yang jelas, lugas, tidak menimbulkan multi-tafsir.
   - Bentuk soal (questionType): "Pilihan Ganda" | "Pilihan Ganda Kompleks" | "Benar-Salah" | "Menjodohkan" | "Isian Singkat" | "Uraian"
   - Opsi jawaban (options) jika Pilihan Ganda (A, B, C, D atau E) atau format pernyataan jika Pilihan Ganda Kompleks / Benar-Salah / Menjodohkan.
   - Kunci jawaban (answerKey) yang pasti benar dan tidak ambigu.
   - Pembahasan mendalam (explanation) yang menjelaskan penalaran logis mengapa kunci tersebut benar dan mengapa opsi lainnya keliru.
   - Level Kognitif (bloomLevel) misal "C4" dan kategori "HOTS | MOTS | LOTS".
   - Alasan HOTS / AKM (hotsReason / akmAspect).
   - Bobot nilai (weight) dan skor maksimal.
   - Pedoman penskoran & rubrik (rubric) untuk soal uraian/kinerja (Kriteria skor 4, 3, 2, 1, 0).
   - Rekomendasi Tindak Lanjut: catatan remedial dan pengayaan terkait butir soal ini.

Kembalikan respon HANYA dalam format JSON dengan struktur array objek:
[
  {
    "number": 1,
    "tpCode": "TP.1",
    "questionType": "Pilihan Ganda",
    "stimulus": "Teks stimulus kontekstual yang detail dan bermakna...",
    "question": "Berdasarkan stimulus di atas, manakah kesimpulan yang paling tepat mengenai...?",
    "options": [
      { "label": "A", "text": "Pernyataan opsi A..." },
      { "label": "B", "text": "Pernyataan opsi B..." },
      { "label": "C", "text": "Pernyataan opsi C..." },
      { "label": "D", "text": "Pernyataan opsi D..." }
    ],
    "complexItems": [], 
    "matchingPairs": [],
    "answerKey": "B",
    "explanation": "Pembahasan lengkap dan penalaran logis...",
    "bloomLevel": "C4",
    "cognitiveCategory": "HOTS",
    "competence": "Menganalisis hubungan sebab-akibat data",
    "hotsReason": "Menuntut siswa membandingkan data pada stimulus dan menarik kesimpulan kritis, bukan sekadar mengingat definisi.",
    "akmAspect": "Literasi Membaca - Mengevaluasi dan merefleksikan isi teks informasi",
    "weight": 2,
    "maxScore": 2,
    "rubric": [
      { "score": 2, "description": "Menjawab benar (B) dengan tepat." },
      { "score": 0, "description": "Menjawab salah atau kosong." }
    ],
    "remedialNote": "Pelajari kembali konsep dasar...",
    "enrichmentNote": "Eksplorasi studi kasus lanjutan..."
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan instrumen soal.' });
  }
});

// 5. Endpoint: Kontrol Kualitas & Validasi Soal (Psychometric & Pedagogical QA)
app.post('/api/ai/validate-questions', async (req, res) => {
  try {
    const { questions, subject, grade, phase } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Daftar soal diperlukan untuk validasi.' });
    }

    const ai = getGenAI();
    const prompt = `
Anda adalah reviewer instrumen asesmen dan psikometri pendidikan senior.
Lakukan telaah butir soal (kualitatif dan konstruksi) secara ketat terhadap kumpulan butir soal berikut:
Mata Pelajaran: ${subject || 'Umum'} (Kelas ${grade || '7'} / Fase ${phase || 'D'})

Daftar Soal:
${JSON.stringify(questions, null, 2)}

Aspek telaah:
1. Kesesuaian soal dengan Tujuan Pembelajaran dan indikator.
2. Ketepatan penentuan level kognitif (C1-C6, LOTS/MOTS/HOTS).
3. Kualitas dan keberfungsian stimulus (apakah stimulus benar-benar dibutuhkan atau hanya hiasan).
4. Ketepatan dan kebenaran kunci jawaban.
5. Homogenitas, panjang, dan kualitas distraktor (pengecoh).
6. Kejelasan konstruksi kalimat, tidak mengandung petunjuk jawaban pada butir lain.
7. Penggunaan Bahasa Indonesia yang baik dan sesuai kaidah PUEBI.
8. Potensi ambiguitas atau multi-tafsir.
9. Ketepatan rubrik dan pedoman penskoran.

Klasifikasikan setiap butir ke dalam status:
- "Sangat Baik" (memenuhi seluruh kaidah konstruksi butir dan HOTS/AKM)
- "Baik" (layak pakai dengan revisi minor)
- "Perlu Revisi" (memiliki kelemahan konstruksi, stimulus kurang berfungsi, kunci rancu, atau level kognitif tidak sesuai)

Berikan catatan telaah spesifik (critique) dan rekomendasi perbaikan (improvementSuggestion) untuk setiap nomor soal.

Kembalikan respon HANYA dalam format JSON dengan format:
{
  "overallVerdict": "Sangat Baik | Baik | Perlu Revisi Minor",
  "summary": "Ringkasan telaah umum kumpulan instrumen asesmen...",
  "validationResults": [
    {
      "number": 1,
      "status": "Sangat Baik | Baik | Perlu Revisi",
      "score": 92,
      "cognitiveCheck": "Sesuai (C4 HOTS terverifikasi)",
      "stimulusCheck": "Stimulus autentik dan berfungsi penuh",
      "keyCheck": "Kunci jawaban valid dan tepat",
      "distractorCheck": "Pengecoh homogen dan logis",
      "languageCheck": "Bahasa lugas dan komunikatif",
      "notes": "Catatan telaah butir...",
      "recommendations": "Saran perbaikan konkret jika ada..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error validating questions:', error);
    res.status(500).json({ error: error.message || 'Gagal memvalidasi butir soal.' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Smart Assessment Generator server running on http://0.0.0.0:${port}`);
  });
}

startServer();
