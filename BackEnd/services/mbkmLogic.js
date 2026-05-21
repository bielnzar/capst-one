/**
 * MBKM Logic Service
 * Menangani kalkulasi SKS, deteksi aktivitas, dan checklist dokumen
 */

/**
 * Menghitung estimasi SKS berdasarkan durasi minggu
 * Aturan: setiap 4 minggu = 6 SKS, maksimal 20 SKS
 * @param {number} durationWeeks - Durasi dalam minggu
 * @returns {number} Estimasi SKS
 */
const calculateSKS = (durationWeeks) => {
  // Setiap 4 minggu = 6 SKS
  const sksPerFourWeeks = 6;
  const weeksPerCycle = 4;

  // Hitung jumlah cycle
  const cycles = Math.ceil(durationWeeks / weeksPerCycle);
  let estimatedSKS = cycles * sksPerFourWeeks;

  // Cap maksimal di 20 SKS
  if (estimatedSKS > 20) {
    estimatedSKS = 20;
  }

  return estimatedSKS;
};

/**
 * Mengkonversi durasi dari bulan ke minggu
 * @param {number} months - Jumlah bulan
 * @returns {number} Jumlah minggu
 */
const convertMonthsToWeeks = (months) => {
  // 1 bulan = 4 minggu (standar)
  return months * 4;
};

/**
 * Mengkonversi durasi dari minggu ke minggu (identity function)
 * Tetap diperlukan untuk consistency
 * @param {number} weeks - Jumlah minggu
 * @returns {number} Jumlah minggu
 */
const convertWeeksToWeeks = (weeks) => {
  return weeks;
};

/**
 * Deteksi jenis aktivitas MBKM dari pesan pengguna
 * @param {string} message - Pesan dari pengguna
 * @returns {string} Jenis aktivitas (magang, lomba, studi_independen, pertukaran_pelajar, unknown)
 */
const detectActivityType = (message) => {
  const lowerMessage = message.toLowerCase();

  // Regex untuk mendeteksi berbagai jenis aktivitas
  const activityPatterns = {
    magang: /magang|internship|internship|praktik/i,
    lomba: /lomba|kompetisi|competition|contest/i,
    studi_independen: /studi independen|independent study|proyek mandiri/i,
    pertukaran_pelajar: /pertukaran pelajar|exchange|student exchange/i,
  };

  for (const [activity, pattern] of Object.entries(activityPatterns)) {
    if (pattern.test(lowerMessage)) {
      return activity;
    }
  }

  return "unknown";
};

/**
 * Parse durasi dari pesan pengguna
 * Mendeteksi format: "6 bulan", "12 minggu", "3 bulan", dst
 * @param {string} message - Pesan dari pengguna
 * @returns {object} {value: number, unit: string, weeks: number}
 */
const parseDuration = (message) => {
  const lowerMessage = message.toLowerCase();

  // Regex untuk mendeteksi pola durasi
  // Contoh: "6 bulan", "12 minggu", "3 months", "4 weeks"
  const durationPattern = /(\d+)\s*(bulan|bulan|minggu|minggu|month|months|week|weeks)/i;
  const match = message.match(durationPattern);

  if (!match) {
    // Default 6 bulan jika tidak ditemukan
    return {
      value: 6,
      unit: "bulan",
      weeks: convertMonthsToWeeks(6),
    };
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  let weeks = 0;

  // Normalisasi unit
  if (
    unit === "bulan" ||
    unit === "bulan" ||
    unit === "month" ||
    unit === "months"
  ) {
    weeks = convertMonthsToWeeks(value);
  } else if (
    unit === "minggu" ||
    unit === "minggu" ||
    unit === "week" ||
    unit === "weeks"
  ) {
    weeks = convertWeeksToWeeks(value);
  }

  return {
    value,
    unit,
    weeks,
  };
};

/**
 * Dapatkan checklist dokumen MBKM standar
 * @returns {array} Array berisi daftar dokumen yang diperlukan
 */
const getRequiredDocuments = () => {
  return ["LoA (Letter of Acceptance)", "PKS (Perjanjian Kerjasama)", "Form AK01", "Form Matching"];
};

/**
 * Generate response fallback jika AI gagal
 * @param {object} data - Data MBKM hasil parsing
 * @returns {string} Response text dalam Bahasa Indonesia
 */
const generateFallbackResponse = (data) => {
  const { activity_type, duration_weeks, estimated_sks } = data;

  let activityName = "aktivitas MBKM";
  switch (activity_type) {
    case "magang":
      activityName = "magang";
      break;
    case "lomba":
      activityName = "lomba";
      break;
    case "studi_independen":
      activityName = "studi independen";
      break;
    case "pertukaran_pelajar":
      activityName = "pertukaran pelajar";
      break;
  }

  const durationMonths = Math.round(duration_weeks / 4);

  return `Berdasarkan informasi yang Anda berikan tentang ${activityName} selama ${durationMonths} bulan (${duration_weeks} minggu), berikut estimasi konversi SKS:

**Estimasi Konversi SKS: ${estimated_sks} SKS**

Perhitungan: Dengan durasi ${duration_weeks} minggu, estimasi SKS adalah ${estimated_sks} SKS (setiap 4 minggu = 6 SKS, maksimal 20 SKS).

**Checklist Dokumen MBKM yang Diperlukan:**
${getRequiredDocuments()
  .map((doc, idx) => `${idx + 1}. ${doc}`)
  .join("\n")}

Catatan: Hasil ini hanya estimasi. Untuk konversi SKS yang pasti, silakan konsultasi dengan tim MBKM DTI ITS. Pastikan semua dokumen sudah lengkap sebelum mengajukan permohonan konversi SKS.`;
};

module.exports = {
  calculateSKS,
  convertMonthsToWeeks,
  convertWeeksToWeeks,
  detectActivityType,
  parseDuration,
  getRequiredDocuments,
  generateFallbackResponse,
};
