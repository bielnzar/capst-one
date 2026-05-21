/**
 * MBKM Chatbot Component
 * Komponen React untuk chat UI dengan MBKM AI Chatbot
 */

import { useState, useRef, useEffect } from "react";
import axios from "axios";

const MBKMChatbot = () => {
  // State management
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Halo! 👋 Saya adalah MBKM Chatbot DTI ITS. Saya siap membantu Anda dengan informasi tentang MBKM, estimasi konversi SKS, dan checklist dokumen yang diperlukan. Silakan ceritakan tentang aktivitas MBKM Anda!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Mengirim pesan ke backend
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!inputValue.trim()) return;

    // Tambahkan pesan user ke chat
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setError(null);
    setIsLoading(true);

    try {
      // Kirim request ke backend (baseURL sudah di setup di main.jsx)
      const response = await axios.post("/chat", {
        message: inputValue,
      });

      // Extract data dari response
      const { reply, data } = response.data;

      // Format pesan bot dengan data MBKM
      const botMessageText = formatBotResponse(reply, data);

      // Tambahkan pesan bot ke chat
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: botMessageText,
        data: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Handle error
      const errorMessage = err.response?.data?.error || "Terjadi kesalahan saat menghubungi server";

      setError(errorMessage);

      // Tampilkan pesan error di chat
      const errorBotMessage = {
        id: messages.length + 2,
        type: "bot",
        isError: true,
        text: `❌ ${errorMessage}. Silakan coba lagi.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format response bot dengan styling
   */
  const formatBotResponse = (reply, data) => {
    return reply;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-indigo-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">💬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MBKM Chatbot</h1>
              <p className="text-sm text-gray-600">Konsultasi MBKM DTI ITS dengan AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Bot Message */}
            {message.type === "bot" && (
              <div className="flex gap-3 max-w-2xl">
                {/* Bot Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">🤖</span>
                </div>

                {/* Bot Bubble */}
                <div className="flex flex-col gap-2">
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.isError
                        ? "bg-red-100 text-red-900 border border-red-300"
                        : "bg-white text-gray-900 border border-indigo-200 shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  </div>

                  {/* MBKM Data Card (jika ada) */}
                  {message.data && (
                    <div className="bg-white border border-indigo-200 rounded-lg p-4 shadow-sm max-w-md">
                      <div className="grid gap-3">
                        {/* Jenis Aktivitas */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Jenis Aktivitas</p>
                          <p className="text-sm font-medium text-indigo-600 capitalize">
                            {message.data.activity_type.replace(/_/g, " ")}
                          </p>
                        </div>

                        {/* Durasi */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Durasi</p>
                          <p className="text-sm font-medium text-gray-900">
                            {message.data.duration_weeks} minggu (~{Math.round(message.data.duration_weeks / 4)} bulan)
                          </p>
                        </div>

                        {/* Estimasi SKS */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded p-3 border border-indigo-200">
                          <p className="text-xs font-semibold text-gray-600 uppercase">Estimasi SKS</p>
                          <p className="text-2xl font-bold text-indigo-600">{message.data.estimated_sks} SKS</p>
                        </div>

                        {/* Checklist Dokumen */}
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Dokumen yang Diperlukan</p>
                          <ul className="space-y-1">
                            {message.data.documents.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                                <span className="text-sm text-gray-900">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-xs text-gray-600 italic border-t border-indigo-200 pt-2">
                          ⓘ Hasil ini hanya estimasi. Konsultasikan dengan tim MBKM DTI ITS untuk kepastian.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User Message */}
            {message.type === "user" && (
              <div className="flex gap-3 max-w-2xl justify-end">
                {/* User Bubble */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-lg px-4 py-3 shadow-md">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">👤</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <div className="bg-white border border-indigo-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-indigo-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ceritakan tentang aktivitas MBKM Anda... (misal: magang 6 bulan)"
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-indigo-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Mengirim...
                </>
              ) : (
                <>
                  <span>Kirim</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-900">
              ⚠️ {error}
            </div>
          )}

          {/* Helper Text */}
          <p className="text-xs text-gray-600 mt-3">
            💡 Tips: Ceritakan jenis aktivitas MBKM dan durasinya (misal: "magang 6 bulan", "lomba 3 minggu", "pertukaran pelajar 1 semester")
          </p>
        </div>
      </div>
    </div>
  );
};

export default MBKMChatbot;
