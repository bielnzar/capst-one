/**
 * Chat Routes
 * Routing untuk endpoint MBKM Chatbot
 */

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// POST /api/chat
// Endpoint untuk mengirim pesan ke chatbot
router.post("/", chatController.chat);

// GET /api/chat/health
// Endpoint untuk checking status chatbot
router.get("/health", chatController.health);

module.exports = router;
