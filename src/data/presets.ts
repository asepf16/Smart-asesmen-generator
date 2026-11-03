import { TujuanPembelajaran, SchoolIdentity, TeacherIdentity } from '../types';

export interface SubjectPreset {
  id: string;
  name: string;
  level: 'SD/MI' | 'SMP/MTs' | 'SMA/MA';
  phase: 'B' | 'D' | 'E';
  grade: string;
  subject: string;
  material: string;
  tps: TujuanPembelajaran[];
}

export const SUBJECT_PRESETS: SubjectPreset[] = [
  {
    id: 'smp-informatika-7',
    name: 'SMP Informatika - Berpikir Komputasional (Fase D / Kelas 7)',
    level: 'SMP/MTs',
    phase: 'D',
    grade: '7',
    subject: 'Informatika',
    material: 'Berpikir Komputasional & Algoritma Sederhana',
    tps: [
      {
        id: 'tp-inf-1',
        code: 'TP.7.1',
        tpText: 'Menerapkan berpikir komputasional untuk menyelesaikan persoalan optimasi penjadwalan dan dekomposisi data dalam kehidupan sehari-hari.',
        material: 'Dekomposisi dan Pengenalan Pola',
        scope: 'Berpikir Komputasional',
        competence: 'Menganalisis dan memecahkan persoalan terstruktur',
      },
      {
        id: 'tp-inf-2',
        code: 'TP.7.2',
        tpText: 'Menganalisis algoritma langkah demi langkah untuk mengurutkan data (sorting) dan mencari informasi (searching) dengan efisien.',
        material: 'Algoritma Searching dan Sorting',
        scope: 'Algoritma dan Pemrograman',
        competence: 'Mengevaluasi efisiensi langkah algoritma',
      },
      {
        id: 'tp-inf-3',
        code: 'TP.7.3',
        tpText: 'Merancang representasi data berupa struktur pohon (tree) dan graf sederhana untuk memodelkan keterhubungan antar objek nyata.',
        material: 'Struktur Data Graf dan Pohon',
        scope: 'Representasi Data',
        competence: 'Menciptakan model relasi data',
      },
    ],
  },
  {
    id: 'smp-bindo-8',
    name: 'SMP Bahasa Indonesia - Teks Eksplanasi & Argumentasi (Fase D / Kelas 8)',
    level: 'SMP/MTs',
    phase: 'D',
    grade: '8',
    subject: 'Bahasa Indonesia',
    material: 'Teks Eksplanasi Ilmiah & Teks Tanggapan Kritis',
    tps: [
      {
        id: 'tp-bin-1',
        code: 'TP.8.1',
        tpText: 'Menganalisis struktur teks eksplanasi ilmiah dan hubungan kausalitas (sebab-akibat) pada fenomena bencana alam dan sosial terkini.',
        material: 'Struktur dan Kaidah Kebahasaan Teks Eksplanasi',
        scope: 'Teks Informasi',
        competence: 'Menginterpretasi dan mengevaluasi hubungan logis teks',
      },
      {
        id: 'tp-bin-2',
        code: 'TP.8.2',
        tpText: 'Menilai akurasi data fakta dan opini penulis dalam artikel opini populer serta mengidentifikasi bias informasi.',
        material: 'Fakta, Opini, dan Bias Informasi',
        scope: 'Literasi Kritis',
        competence: 'Mengevaluasi kredibilitas argumen dan bukti',
      },
      {
        id: 'tp-bin-3',
        code: 'TP.8.3',
        tpText: 'Menyusun teks tanggapan kritis berbasis bukti empiris dan santun berbahasa mengenai isu lingkungan hidup lokal.',
        material: 'Penyusunan Teks Tanggapan Kritis',
        scope: 'Menulis Teks Berbasis Bukti',
        competence: 'Mengonstruksi argumen persuasif dan solutif',
      },
    ],
  },
  {
    id: 'smp-matematika-8',
    name: 'SMP Matematika - Statistika & Peluang Kontekstual (Fase D / Kelas 8)',
    level: 'SMP/MTs',
    phase: 'D',
    grade: '8',
    subject: 'Matematika',
    material: 'Penyajian Data, Ukuran Pemusatan, & Peluang Empiris',
    tps: [
      {
        id: 'tp-mat-1',
        code: 'TP.8.M1',
        tpText: 'Menganalisis dan membandingkan data menggunakan ukuran pemusatan (mean, median, modus) serta ukuran penyebaran untuk menarik kesimpulan rasional dalam situasi sosial.',
        material: 'Ukuran Pemusatan Data Tunggal dan Kelompok',
        scope: 'Analisis Data dan Peluang',
        competence: 'Menalar dan menginterpretasi representasi statistik',
      },
      {
        id: 'tp-mat-2',
        code: 'TP.8.M2',
        tpText: 'Menentukan dan mengevaluasi peluang empiris dan teoretis dari suatu percobaan kontekstual untuk mendukung pengambilan keputusan berisiko.',
        material: 'Peluang Teoretis dan Empiris',
        scope: 'Ketidakpastian dan Peluang',
        competence: 'Memprediksi probabilitas kejadian realistis',
      },
    ],
  },
  {
    id: 'sma-biologi-10',
    name: 'SMA IPA / Biologi - Perubahan Lingkungan & Ekosistem (Fase E / Kelas 10)',
    level: 'SMA/MA',
    phase: 'E',
    grade: '10',
    subject: 'Biologi',
    material: 'Keseimbangan Ekosistem & Solusi Perubahan Iklim',
    tps: [
      {
        id: 'tp-bio-1',
        code: 'TP.10.1',
        tpText: 'Menganalisis dampak aktivitas antropogenik terhadap jaring-jaring makanan dan daya lenting ekosistem perairan.',
        material: 'Dinamika Ekosistem dan Aliran Energi',
        scope: 'Ekologi dan Lingkungan',
        competence: 'Menganalisis dinamika sistem biologis',
      },
      {
        id: 'tp-bio-2',
        code: 'TP.10.2',
        tpText: 'Mengevaluasi efektivitas berbagai strategi mitigasi perubahan iklim berbasis kearifan lokal dan bioteknologi ramah lingkungan.',
        material: 'Mitigasi Bencana Iklim dan Bioremediasi',
        scope: 'Keberlanjutan Lingkungan',
        competence: 'Mengevaluasi solusi rekayasa lingkungan',
      },
    ],
  },
  {
    id: 'smp-pai-7',
    name: 'SMP Pendidikan Agama Islam & BP - Akhlak & Muamalah (Fase D / Kelas 7 - BKPDM No. 020/2026)',
    level: 'SMP/MTs',
    phase: 'D',
    grade: '7',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    material: 'Hakikat Ibadah Sosial, Integritas Amanah, dan Moderasi Beragama',
    tps: [
      {
        id: 'tp-pai-1',
        code: 'TP.7.PAI.1',
        tpText: 'Menganalisis makna hakiki amanah dan kejujuran dalam konteks interaksi sosial di era digital serta dampaknya terhadap harmoni masyarakat (Keputusan Kepala BKPDM No. 020/2026).',
        material: 'Amanah, Kejujuran, dan Etika Digital',
        scope: 'Akidah dan Akhlak',
        competence: 'Menganalisis nilai integritas dan etika sosial religius',
      },
      {
        id: 'tp-pai-2',
        code: 'TP.7.PAI.2',
        tpText: 'Mengevaluasi implementasi prinsip moderasi beragama dan toleransi aktif dalam merespons keberagaman masyarakat multikultural.',
        material: 'Toleransi Aktif dan Moderasi Beragama',
        scope: 'Fikih Sosial dan Kebangsaan',
        competence: 'Mengevaluasi sikap toleran dalam kemajemukan bangsa',
      },
      {
        id: 'tp-pai-3',
        code: 'TP.7.PAI.3',
        tpText: 'Merumuskan solusi pemecahan masalah kesenjangan sosial melalui optimalisasi zakat, infak, sedekah, dan wakaf produktif.',
        material: 'ZISWAF Produktif dan Keadilan Sosial',
        scope: 'Fikih Muamalah',
        competence: 'Menciptakan gagasan filantropi Islam solutif',
      },
    ],
  },
];

export const INITIAL_SCHOOL: SchoolIdentity = {
  schoolName: 'SMP Negeri 1 Merdeka Belajar',
  npsn: '20210088',
  educationLevel: 'SMP/MTs',
  phase: 'D',
  grade: '8',
  semester: 'Ganjil',
  academicYear: '2025/2026',
  curriculum: 'Kurikulum Merdeka (SK BSKAP No. 046/H/KR/2025 & Keputusan Kepala BKPDM No. 020 Tahun 2026)',
  schoolAddress: 'Jl. Pendidikan Nasional No. 45, Kota Edukasi',
  principalName: 'Dr. H. Sulaiman, M.Pd.',
  principalNip: '19750812 200003 1 004',
};

export const INITIAL_TEACHER: TeacherIdentity = {
  teacherName: 'Asep Firdaus, S.Pd., M.Si.',
  nip: '19880415 201101 1 009',
  subject: 'Bahasa Indonesia',
  role: 'Guru Mata Pelajaran',
};
