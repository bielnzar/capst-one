const express = require("express");
const router = express.Router();
const multer = require("multer");
const courseController = require("../controllers/courseController");

// Konfigurasi penyimpanan sementara
const upload = multer({ dest: "uploads/" });

router.post(
  "/analyze",
  upload.single("transcript"),
  courseController.analyzeTranscript,
);

module.exports = router;
