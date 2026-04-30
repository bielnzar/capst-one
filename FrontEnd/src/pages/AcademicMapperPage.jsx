import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PdfDropzone from "../components/shared/PdfDropzone";
import { useAuthStore } from "../store/authStore"; // Import store untuk akses token[cite: 6]

const PROCESSING_STEPS = [
  "Upload file",
  "AI Parsing transkrip",
  "Mapping ke domain skill",
  "Generate rekomendasi karir",
];

export default function AcademicMapperPage() {
  const { token } = useAuthStore(); // Ambil token secara reaktif dari Zustand[cite: 6]
  const [step, setStep] = useState("upload");
  const [processingStep, setProcessingStep] = useState(0);
  const [file, setFile] = useState(null);

  const [resultData, setResultData] = useState({
    studentName: "",
    nrp: "",
    gpa: 0,
    skillData: [],
    careerMatches: [],
    extractedData: [],
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  async function handleUpload() {
    if (!file) return;

    // Validasi keberadaan token sebelum request[cite: 6]
    if (!token) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    setStep("processing");
    const formData = new FormData();
    formData.append("transcript", file);

    try {
      const interval = setInterval(() => {
        setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1000);

      const response = await fetch(`${API_URL}/courses/analyze`, {
        method: "POST",
        body: formData,
        headers: {
          // Menggunakan token dari Zustand Store[cite: 6, 7]
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        clearInterval(interval);
        setResultData({
          studentName: result.studentName,
          nrp: result.nrp,
          gpa: result.gpa,
          skillData: result.skillData,
          careerMatches: result.careerMatches,
          extractedData: result.extractedData,
        });
        setTimeout(() => setStep("result"), 800);
      } else {
        clearInterval(interval);
        alert(result.message || "Gagal memproses transkrip");
        setStep("upload");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
      setStep("upload");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Academic Mapper
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Academic Mapper & Career Path
        </h1>
      </div>

      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Upload Transkrip Nilai
            </h2>
            <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
            {file && (
              <button
                onClick={handleUpload}
                className="mt-4 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all"
              >
                Mulai Analisis AI
              </button>
            )}
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-green-800 mb-2">
              Automated Analysis
            </h3>
            <p className="text-xs text-green-700">
              Sistem menyamarkan data sensitif sebelum diproses AI untuk
              keamanan Anda.
            </p>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-700">
            {PROCESSING_STEPS[processingStep]}...
          </p>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard label="Nama Mahasiswa" value={resultData.studentName} />
            <StatsCard label="NRP" value={resultData.nrp} />
            <StatsCard label="GPA Transkrip" value={resultData.gpa} isGpa />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Skills Assessment
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={resultData.skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip />
                  <Radar
                    name="Skor"
                    dataKey="score"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Rekomendasi Jalur Karir
              </h2>
              <div className="space-y-4">
                {resultData.careerMatches.map((career, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800">
                        {career.role}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: career.color }}
                      >
                        {career.match}% Match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${career.match}%`,
                          backgroundColor: career.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setStep("upload")}
            className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
}

function StatsCard({ label, value, isGpa }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200">
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p
        className={`text-lg font-semibold mt-1 ${isGpa ? "text-green-600" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
