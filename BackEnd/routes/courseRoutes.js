const express = require("express");
const router = express.Router();
const multer = require("multer");
const courseController = require("../controllers/courseController");
const verifyToken = require("../middleware/authMiddleware"); // Wajib diimport

// Konfigurasi penyimpanan sementara
const upload = multer({ dest: "uploads/" });

/**
 * Endpoint: POST /api/courses/analyze
 * Penjelasan:
 * 1. verifyToken: Memeriksa JWT dan mengisi req.user dengan data dari database[cite: 2].
 * 2. upload.single: Mengurus file PDF yang masuk[cite: 1, 4].
 * 3. analyzeTranscript: Menghubungkan ke FastAPI & mengirim data dinamis.
 */
router.post(
  "/analyze",
  verifyToken, // Tambahkan ini di sini agar req.user.id terbaca!
  upload.single("transcript"),
  courseController.analyzeTranscript,
);

module.exports = router;
