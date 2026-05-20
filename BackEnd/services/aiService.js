/**
 * AI Service untuk Groq API
 * Menangani komunikasi dengan Groq AI untuk menjawab pertanyaan MBKM
 */

const axios = require("axios");
const { getRequiredDocuments } = require("./mbkmLogic");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-specdec"; // Latest active Groq model

/**
 * Membuat prompt system untuk AI
 * Memberikan instruksi kepada AI tentang perilaku yang diinginkan
 */
const getSystemPrompt = () => {
  const documents = getRequiredDocuments();
  const docList = documents.map((doc, idx) => `${idx + 1}. ${doc}`).join("\n");

  return `Anda adalah asisten chatbot ahli tentang MBKM (Magang, Beasiswa, Kerja, Magang, Program Pertukaran) di DTI ITS.

Tugas Anda:
1. Menjawab pertanyaan tentang MBKM dengan santai tapi profesional
2. Menjelaskan estimasi konversi SKS berdasarkan durasi aktivitas
3. Memberikan checklist dokumen yang diperlukan
4. Selalu dalam Bahasa Indonesia

Aturan Konversi SKS:
- 1 bulan = 4 minggu
- Setiap 4 minggu = 6 SKS
- Maksimal 20 SKS

Dokumen yang Diperlukan untuk MBKM:
${docList}

Dalam setiap jawaban Anda:
- Jelaskan estimasi SKS dengan alasan perhitungan
- Sebutkan checklist dokumen
- Ingatkan bahwa hasil hanya estimasi dan perlu dikonsultasikan dengan tim MBKM
- Nada santai tapi profesional
- Gunakan Bahasa Indonesia yang baik

Contoh format jawaban yang diharapkan:
"Untuk [jenis aktivitas] selama [durasi], estimasi konversi SKS adalah [X] SKS. Ini dihitung dari [penjelasan perhitungan]. Pastikan Anda menyiapkan dokumen: [daftar dokumen]. Hasil ini hanya estimasi, konsultasikan dengan tim MBKM untuk kepastian."`;
};

/**
 * Mengirim pertanyaan ke Groq API dan mendapatkan respons
 * @param {string} userMessage - Pesan dari pengguna
 * @param {object} mbkmData - Data MBKM hasil parsing (optional)
 * @returns {Promise<string>} Respons dari AI
 */
const getAIResponse = async (userMessage, mbkmData = null) => {
  try {
    // Validasi API Key
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY tidak dikonfigurasi di .env");
    }

    // Siapkan context tambahan dari MBKM data jika tersedia
    let contextMessage = userMessage;
    if (mbkmData) {
      contextMessage = `${userMessage}

[Data MBKM yang terdeteksi]
- Jenis Aktivitas: ${mbkmData.activity_type}
- Durasi: ${mbkmData.duration_weeks} minggu
- Estimasi SKS: ${mbkmData.estimated_sks}
- Dokumen: ${mbkmData.documents.join(", ")}`;
    }

    // Kirim request ke Groq API
    const response = await axios.post(
      GROQ_BASE_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: getSystemPrompt(),
          },
          {
            role: "user",
            content: contextMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 detik timeout
      }
    );

    // Extract respons dari Groq API
    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("Respons tidak valid dari Groq API");
    }
  } catch (error) {
    // Log error untuk debugging - DETAILED
    console.error("❌ Error dari Groq API:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);
    console.error("   Response Data:", error.response?.data);
    console.error("   Request URL:", GROQ_BASE_URL);
    console.error("   Request Model:", GROQ_MODEL);
    console.error("   API Key Present:", !!GROQ_API_KEY);
    console.error("   API Key (first 10 chars):", GROQ_API_KEY?.substring(0, 10) + "...");

    // Re-throw error untuk ditangani di controller
    throw error;
  }
};

/**
 * Validasi bahwa Groq API key tersedia
 * @returns {boolean}
 */
const isGroqConfigured = () => {
  return !!GROQ_API_KEY;
};

module.exports = {
  getAIResponse,
  getSystemPrompt,
  isGroqConfigured,
};
