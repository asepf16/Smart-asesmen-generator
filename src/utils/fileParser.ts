import * as XLSX from 'xlsx';

export async function parseUploadedFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'csv') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = (e) => reject(new Error('Gagal membaca file teks/CSV'));
      reader.readAsText(file);
    });
  }

  if (extension === 'xlsx' || extension === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          let fullText = '';
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const text = XLSX.utils.sheet_to_txt(worksheet);
            fullText += `--- SHEET: ${sheetName} ---\n${text}\n\n`;
          });
          resolve(fullText);
        } catch (err) {
          reject(new Error('Gagal membaca dokumen Excel: ' + (err as any).message));
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file Excel'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Fallback for DOCX/PDF/others: read as text/binary strings or plain text chunks
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      // Clean visible strings from raw data if docx/pdf
      if (extension === 'docx') {
        const cleaned = content.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\xC0-\xFF\n\r\t]/g, ' ');
        resolve(cleaned.slice(0, 20000));
      } else {
        resolve(content.slice(0, 20000));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca dokumen'));
    reader.readAsText(file);
  });
}
