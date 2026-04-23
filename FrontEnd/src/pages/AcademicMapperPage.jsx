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

const PROCESSING_STEPS = [
  "Upload file",
  "Parsing transkrip",
  "Mapping ke domain skill",
  "Generate rekomendasi",
];

export default function AcademicMapperPage() {
  const [step, setStep] = useState("upload"); // upload, processing, result
  const [processingStep, setProcessingStep] = useState(0);
  const [file, setFile] = useState(null);

  // State untuk menampung data hasil parsing backend
  const [skillData, setSkillData] = useState([]);
  const [careerMatches, setCareerMatches] = useState([]);
  const [extractedCourses, setExtractedCourses] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  async function handleUpload() {
    if (!file) return;
    setStep("processing");

    const formData = new FormData();
    formData.append("transcript", file);

    try {
      // Efek visual simulasi langkah processing
      const interval = setInterval(() => {
        setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 800);

      const response = await fetch(`${API_URL}/courses/analyze`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        clearInterval(interval);

        // Simpan data hasil parser
        setSkillData(result.skillData);
        setCareerMatches(result.careerMatches);
        setExtractedCourses(result.extractedData);

        setTimeout(() => {
          setStep("result");
        }, 1000);
      } else {
        clearInterval(interval);
        alert(result.message || "Gagal memproses transkrip");
        setStep("upload");
      }
    } catch (error) {
      console.error("Error upload:", error);
      alert("Gagal terhubung ke server.");
      setStep("upload");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Academic Mapper
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Academic Mapper & Career Path
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload transkrip nilaimu untuk memetakan kekuatan skill dan mendapat
          rekomendasi jalur karir.
        </p>
      </div>

      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Upload Transkrip Nilai
              </h2>
              <PdfDropzone
                onFile={setFile}
                label="Upload Transkrip PDF"
                hint="Pastikan transkrip berbasis teks, bukan hasil scan"
              />
              {file && (
                <button
                  onClick={handleUpload}
                  className="mt-4 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 active:scale-[0.98] transition-all"
                >
                  Analisis Sekarang
                </button>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-green-800 mb-2">
                Yang akan dihasilkan:
              </p>
              <ul className="space-y-1.5">
                {[
                  "Radar chart kekuatan skill (6 domain)",
                  "Rekomendasi jalur karir + match score",
                  "Skill gap analysis per role",
                ].map((t) => (
                  <li
                    key={t}
                    className="text-xs text-green-700 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bagian yang diminta untuk diubah teksnya */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <ChartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">AI Coming soon</p>
            <p className="text-xs text-gray-400 mt-1">
              Fitur analisis cerdas sedang dikembangkan
            </p>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto text-center">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">
            {PROCESSING_STEPS[processingStep]}...
          </h2>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <div className="flex justify-center gap-1.5">
            {PROCESSING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-6 rounded-full ${i <= processingStep ? "bg-green-600" : "bg-gray-100"}`}
              />
            ))}
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          {/* Tampilan hasil tetap menggunakan radar chart dengan data hasil parsing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Skills Assessment (Based on Parser)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip />
                  <Radar
                    name="Skill"
                    dataKey="score"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Matakuliah Terdeteksi
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {extractedCourses.map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-[10px] p-1.5 bg-gray-50 rounded border border-gray-100"
                    >
                      <span className="truncate font-medium text-gray-700">
                        {c.name}
                      </span>
                      <span className="text-green-600 font-bold ml-2">
                        {c.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-yellow-50 rounded-full mb-3">
                <ChartIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Career Analysis: AI Coming Soon
              </h3>
              <p className="text-xs text-gray-500 mt-2 px-6">
                Hasil pemetaan karir yang presisi sedang dalam tahap integrasi
                model AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStep("upload");
              setFile(null);
              setProcessingStep(0);
            }}
            className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
}

function ChartIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
