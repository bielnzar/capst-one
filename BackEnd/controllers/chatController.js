/**
 * Chat Controller untuk MBKM Chatbot
 * Menangani request chat, parsing, dan response
 */

const { getAIResponse, isGroqConfigured } = require("../services/aiService");
const {
  detectActivityType,
  parseDuration,
  calculateSKS,
  getRequiredDocuments,
  generateFallbackResponse,
} = require("../services/mbkmLogic");

/**
 * POST /api/chat
 * Endpoint utama untuk chat dengan MBKM Chatbot
 *
 * Request body:
 * {
 *   "message": "magang 6 bulan di startup"
 * }
 *
 * Response:
 * {
 *   "reply": "string respons dari AI",
 *   "data": {
 *     "activity_type": "magang",
 *     "duration_weeks": 24,
 *     "estimated_sks": 20,
 *     "documents": [...]
 *   }
 * }
 */
exports.chat = async (req, res) => {
  try {
    // 1. Ambil message dari request body
    const { message } = req.body;

    // 2. Validasi input
    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong",
      });
    }

    // Trim dan batasi panjang pesan (max 1000 karakter)
    const trimmedMessage = message.trim().substring(0, 1000);

    // 3. Parsing jenis kegiatan
    const activity_type = detectActivityType(trimmedMessage);

    // 4. Parsing durasi
    const durationData = parseDuration(trimmedMessage);

    // 5. Konversi ke minggu (sudah dilakukan di parseDuration)
    const duration_weeks = durationData.weeks;

    // 6. Hitung SKS
    const estimated_sks = calculateSKS(duration_weeks);

    // 7. Ambil checklist dokumen
    const documents = getRequiredDocuments();

    // Siapkan data MBKM
    const mbkmData = {
      activity_type,
      duration_weeks,
      estimated_sks,
      documents,
    };

    // 8. Kirim data ke aiService
    let reply;

    try {
      if (isGroqConfigured()) {
        // Gunakan Groq AI jika API key tersedia
        reply = await getAIResponse(trimmedMessage, mbkmData);
      } else {
        // Gunakan fallback response jika Groq tidak dikonfigurasi
        console.warn("GROQ_API_KEY tidak dikonfigurasi, menggunakan fallback response");
        reply = generateFallbackResponse(mbkmData);
      }
    } catch (aiError) {
      // Jika AI gagal, gunakan fallback response
      console.error("Error dari AI Service:", aiError.message);
      reply = generateFallbackResponse(mbkmData);
    }

    // 9. Return response JSON
    return res.status(200).json({
      reply,
      data: mbkmData,
    });
  } catch (error) {
    console.error("Error di chatController:", error.message);

    // Error handling - jangan sampai server crash
    return res.status(500).json({
      error: "Terjadi kesalahan pada server",
      message: error.message,
    });
  }
};

/**
 * GET /api/chat/health
 * Endpoint untuk checking health/status chatbot
 */
exports.health = (req, res) => {
  try {
    const status = {
      status: "ok",
      groq_configured: isGroqConfigured(),
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({
      error: "Error checking health",
    });
  }
};
