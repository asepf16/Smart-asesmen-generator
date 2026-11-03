import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Packer,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import * as XLSX from 'xlsx';
import { AssessmentPackage, QuestionItem, BlueprintItem } from '../types';

/**
 * Generate and download a comprehensive, professional .docx file for the assessment package
 */
export async function exportAssessmentToDocx(pkg: AssessmentPackage, docType: 'all' | 'kisi' | 'soal' | 'kunci' | 'rubrik' = 'all') {
  const { schoolInfo, teacherInfo, examConfig, tps, blueprint, questions } = pkg;

  const docChildren: any[] = [];

  // Kop Sekolah Formal
  const kopParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `PEMERINTAH DAERAH / YAYASAN PENDIDIKAN`,
          bold: true,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (schoolInfo.schoolName || 'SMP/SMA NEGERI').toUpperCase(),
          bold: true,
          size: 26,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${schoolInfo.schoolAddress || 'Alamat Sekolah'} | NPSN: ${schoolInfo.npsn || '-'}`,
          italics: true,
          size: 18,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '_________________________________________________________________________________',
          bold: true,
          size: 20,
        }),
      ],
      spacing: { after: 300 },
    }),
  ];

  docChildren.push(...kopParagraphs);

  // Bagian Identitas Asesmen
  const identityRows = [
    ['Mata Pelajaran', `: ${schoolInfo.subject || teacherInfo.subject || '-'}`, 'Kelas / Fase', `: Kelas ${schoolInfo.grade} / Fase ${schoolInfo.phase}`],
    ['Jenis Asesmen', `: ${examConfig.assessmentType}`, 'Semester / T.A.', `: ${schoolInfo.semester} / ${schoolInfo.academicYear}`],
    ['Guru Pengampu', `: ${teacherInfo.teacherName}`, 'Alokasi Waktu', `: ${examConfig.durationMinutes} Menit`],
  ];

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: identityRows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell, idx) =>
              new TableCell({
                width: { size: idx % 2 === 0 ? 20 : 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: cell, bold: idx % 2 === 0, size: 20 })],
                  }),
                ],
              })
          ),
        })
    ),
  });

  docChildren.push(infoTable);
  docChildren.push(new Paragraph({ spacing: { after: 300 } }));

  // SECTION 1: KISI-KISI
  if (docType === 'all' || docType === 'kisi') {
    docChildren.push(
      new Paragraph({
        text: 'I. KISI-KISI PENULISAN SOAL ASESMEN',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
      })
    );

    const kisiHeaderCells = ['No', 'Kode TP & Rumusan Tujuan Pembelajaran', 'Materi Pokok', 'Indikator Soal', 'Kognitif', 'Bentuk', 'Bobot'];
    const kisiHeaderRow = new TableRow({
      tableHeader: true,
      children: kisiHeaderCells.map(
        (text) =>
          new TableCell({
            shading: { fill: '002D62' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 18 })],
              }),
            ],
          })
      ),
    });

    const kisiDataRows = (blueprint || []).map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.number), size: 18 })] })],
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: `[${item.tpCode}] `, bold: true, size: 18 }), new TextRun({ text: item.tpText, size: 18 })] }),
              ],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: item.material, size: 18 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: item.indicator, size: 18 })] })],
            }),
            new TableCell({
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.bloomLevel} (${item.cognitiveCategory})`, size: 18 })] }),
              ],
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.questionType, size: 18 })] })],
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.weight), size: 18 })] })],
            }),
          ],
        })
    );

    const kisiTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [kisiHeaderRow, ...kisiDataRows],
    });

    docChildren.push(kisiTable);
    docChildren.push(new Paragraph({ spacing: { after: 400 } }));
  }

  // SECTION 2: NASKAH SOAL
  if (docType === 'all' || docType === 'soal') {
    docChildren.push(
      new Paragraph({
        text: 'II. NASKAH SOAL ASESMEN SISWA',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 150 },
      })
    );

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Petunjuk Umum: Bacalah stimulus dan butir pertanyaan dengan teliti. Kerjakan soal dengan jujur, objektif, dan teliti.',
            italics: true,
            size: 18,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    (questions || []).forEach((q) => {
      // Kotak Stimulus jika ada
      if (q.stimulus && q.stimulus.trim().length > 0) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[STIMULUS SOAL NO. ${q.number}]`,
                bold: true,
                size: 18,
                color: '002D62',
              }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: q.stimulus,
                italics: true,
                size: 19,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      // Butir Pertanyaan
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${q.number}. `,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: q.question,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: `  (${q.questionType} | Bobot: ${q.weight})`,
              italics: true,
              size: 16,
              color: '555555',
            }),
          ],
          spacing: { before: 100, after: 100 },
        })
      );

      // Pilihan Ganda
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: `${opt.label}. `,
                  bold: true,
                  size: 20,
                }),
                new TextRun({
                  text: opt.text,
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
      }

      // Pilihan Ganda Kompleks
      if (q.complexItems && q.complexItems.length > 0) {
        docChildren.push(
          new Paragraph({
            indent: { left: 720 },
            children: [new TextRun({ text: 'Tentukan kebenaran pernyataan berikut:', italics: true, size: 18 })],
            spacing: { after: 50 },
          })
        );
        q.complexItems.forEach((ci, ciIdx) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 1000 },
              children: [
                new TextRun({ text: `[   ]  ${ci.statement}`, size: 19 }),
              ],
              spacing: { after: 40 },
            })
          );
        });
      }

      // Menjodohkan
      if (q.matchingPairs && q.matchingPairs.length > 0) {
        docChildren.push(
          new Paragraph({
            indent: { left: 720 },
            children: [new TextRun({ text: 'Pasangkan kolom kiri dan kanan yang bersesuaian:', italics: true, size: 18 })],
            spacing: { after: 50 },
          })
        );
        q.matchingPairs.forEach((pair, pIdx) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 1000 },
              children: [
                new TextRun({ text: `(${pIdx + 1}) ${pair.left}  <====>  [ ... ] ${pair.right}`, size: 19 }),
              ],
              spacing: { after: 40 },
            })
          );
        });
      }

      // Ruang jawaban untuk uraian
      if (q.questionType === 'Uraian' || q.questionType === 'Studi Kasus') {
        docChildren.push(
          new Paragraph({
            indent: { left: 720 },
            children: [
              new TextRun({
                text: 'Jawaban:\n\n\n\n',
                italics: true,
                color: '888888',
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      docChildren.push(new Paragraph({ spacing: { after: 150 } }));
    });
  }

  // SECTION 3: KUNCI JAWABAN DAN PEMBAHASAN
  if (docType === 'all' || docType === 'kunci') {
    docChildren.push(
      new Paragraph({
        text: 'III. KUNCI JAWABAN, PEMBAHASAN & ANALISIS DISTRAKTOR',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 150 },
      })
    );

    (questions || []).forEach((q) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Soal No. ${q.number} | Kunci: `, bold: true, size: 20 }),
            new TextRun({ text: `${q.answerKey} `, bold: true, color: '006600', size: 22 }),
            new TextRun({ text: `[${q.bloomLevel} - ${q.cognitiveCategory}]`, bold: true, color: '002D62', size: 18 }),
          ],
          spacing: { before: 100, after: 50 },
        })
      );

      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Pembahasan & Penalaran: ', bold: true, size: 18 }),
            new TextRun({ text: q.explanation, size: 18 }),
          ],
          spacing: { after: 50 },
        })
      );

      if (q.hotsReason) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Karakteristik HOTS: ', bold: true, color: '8B0000', size: 18 }),
              new TextRun({ text: q.hotsReason, size: 18 }),
            ],
            spacing: { after: 50 },
          })
        );
      }

      if (q.akmAspect) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Aspek AKM: ', bold: true, color: '00008B', size: 18 }),
              new TextRun({ text: q.akmAspect, size: 18 }),
            ],
            spacing: { after: 50 },
          })
        );
      }

      docChildren.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // SECTION 4: PEDOMAN PENSKORAN & RUBRIK
  if (docType === 'all' || docType === 'rubrik') {
    docChildren.push(
      new Paragraph({
        text: 'IV. PEDOMAN PENSKORAN & RUBRIK PENILAIAN',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 150 },
      })
    );

    (questions || []).forEach((q) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Pedoman Penilaian Soal No. ${q.number} (${q.questionType} - Skor Maks: ${q.maxScore || q.weight})`, bold: true, size: 19 }),
          ],
          spacing: { before: 80, after: 40 },
        })
      );

      if (q.rubric && q.rubric.length > 0) {
        q.rubric.forEach((r) => {
          docChildren.push(
            new Paragraph({
              indent: { left: 720 },
              children: [
                new TextRun({ text: `* Skor ${r.score}: `, bold: true, size: 18 }),
                new TextRun({ text: r.description, size: 18 }),
              ],
              spacing: { after: 30 },
            })
          );
        });
      } else {
        docChildren.push(
          new Paragraph({
            indent: { left: 720 },
            children: [
              new TextRun({ text: `* Menjawab benar: Skor ${q.maxScore || q.weight}\n* Menjawab salah: Skor 0`, size: 18 }),
            ],
            spacing: { after: 30 },
          })
        );
      }

      if (q.remedialNote || q.enrichmentNote) {
        docChildren.push(
          new Paragraph({
            indent: { left: 720 },
            children: [
              new TextRun({ text: `Rekomendasi Tindak Lanjut:\n- Remedial: ${q.remedialNote || '-'}\n- Pengayaan: ${q.enrichmentNote || '-'}`, italics: true, size: 17 }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });

    // Tanda Tangan Guru & Kepala Sekolah
    docChildren.push(
      new Paragraph({ spacing: { before: 400, after: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Mengetahui,\nKepala Sekolah\n\n\n\n', size: 20 }),
                      new TextRun({ text: schoolInfo.principalName || 'Nama Kepala Sekolah', bold: true, underline: {}, size: 20 }),
                      new TextRun({ text: `\nNIP. ${schoolInfo.principalNip || '-'}`, size: 18 }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: `..., .................... 2026\nGuru Mata Pelajaran\n\n\n\n`, size: 20 }),
                      new TextRun({ text: teacherInfo.teacherName, bold: true, underline: {}, size: 20 }),
                      new TextRun({ text: `\nNIP. ${teacherInfo.nip || '-'}`, size: 18 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Smart Assessment Generator - HOTS & AKM Kemendikbudristek',
                    italics: true,
                    size: 16,
                    color: '777777',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16 }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16 }),
                  new TextRun({ text: ' dari ', size: 16 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16 }),
                ],
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const cleanTitle = (pkg.title || 'Asesmen').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${cleanTitle}_${docType}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generate and download Excel (.xlsx) file containing Kisi-Kisi and Question Bank sheets
 */
export function exportAssessmentToExcel(pkg: AssessmentPackage) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Kisi-Kisi
  const kisiData = (pkg.blueprint || []).map((b) => ({
    'No Soal': b.number,
    'Kode TP': b.tpCode,
    'Rumusan Tujuan Pembelajaran': b.tpText,
    'Materi Pokok': b.material,
    'Indikator Soal': b.indicator,
    'Level Bloom': b.bloomLevel,
    'Kategori Kognitif': b.cognitiveCategory,
    'Kompetensi yang Diukur': b.competence,
    'Bentuk Soal': b.questionType,
    'Bobot Skor': b.weight,
    'Jenis Stimulus': b.stimulusType,
  }));
  const wsKisi = XLSX.utils.json_to_sheet(kisiData);
  XLSX.utils.book_append_sheet(wb, wsKisi, 'Kisi-Kisi Soal');

  // Sheet 2: Bank Soal & Kunci
  const soalData = (pkg.questions || []).map((q) => {
    let optionsText = '';
    if (q.options) {
      optionsText = q.options.map((o) => `${o.label}. ${o.text}`).join(' | ');
    }
    return {
      'No': q.number,
      'Kode TP': q.tpCode,
      'Bentuk Soal': q.questionType,
      'Stimulus': q.stimulus || '-',
      'Pertanyaan': q.question,
      'Pilihan Jawaban': optionsText,
      'Kunci Jawaban': q.answerKey,
      'Pembahasan': q.explanation,
      'Level Kognitif': `${q.bloomLevel} (${q.cognitiveCategory})`,
      'Karakteristik HOTS / AKM': q.hotsReason || q.akmAspect || '-',
      'Bobot': q.weight,
      'Skor Maksimal': q.maxScore || q.weight,
      'Remedial': q.remedialNote || '-',
      'Pengayaan': q.enrichmentNote || '-',
    };
  });
  const wsSoal = XLSX.utils.json_to_sheet(soalData);
  XLSX.utils.book_append_sheet(wb, wsSoal, 'Bank Soal & Kunci');

  const cleanTitle = (pkg.title || 'Asesmen').replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(wb, `${cleanTitle}_Kisi_dan_Soal.xlsx`);
}

/**
 * Trigger print dialog with clean layout
 */
export function printAssessmentDocument() {
  window.print();
}
