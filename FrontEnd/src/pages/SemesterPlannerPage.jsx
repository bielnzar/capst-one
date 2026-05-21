// Semester Planner Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import PdfDropzone from '../components/shared/PdfDropzone';
import { useAuthStore } from '../store/authStore';

const PROCESSING_STEPS = [
  "Membaca file PDF Transkrip...",
  "Mengekstrak mata kuliah historis...",
  "Mencocokkan dengan Master Kurikulum DTI...",
  "Menghitung sisa SKS dan meracik Blueprint..."
];

export default function SemesterPlannerPage() {
  const { token } = useAuthStore();
  const [step, setStep] = useState('intro'); // intro, processing, result
  const [file, setFile] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  
  // State untuk menyimpan data dari Backend & UI aktif
  const [selectedPlan, setSelectedPlan] = useState('fast'); 
  const [plannerData, setPlannerData] = useState(null);

  const API_URL = "http://localhost:8000/api";

  // Data Statis untuk Kartu Pilihan UI Andre
  const PLANS = [
    {
      id: 'fast',
      title: 'Plan A — Lulus 3.5 Tahun',
      color: '#ca8a04', // Yellow
      desc: 'Ambil maks SKS tiap semester, selesaikan TA di sem 7.',
      semesters: ['Sem 5–6: Maks SKS (22–24)', 'Sem 7: TA + Magang singkat', 'Sem 7.5: Sidang TA'],
    },
    {
      id: 'balanced',
      title: 'Plan B — Optimalkan SKS + Karir',
      color: '#2563eb', // Blue
      desc: 'Mix SKS optimal, fokus skill industri dan magang.',
      semesters: ['Sem 5–6: Maks SKS + pilih MK karir', 'Sem 7: Mix magang paruh waktu', 'Sem 8: TA dengan portofolio kuat'],
    },
    {
      id: 'experience',
      title: 'Plan C — Fokus Experience',
      color: '#9333ea', // Purple
      desc: 'Selesaikan MK wajib, magang penuh 4–6 bulan.',
      semesters: ['Sem 5–7: Selesaikan MK wajib', 'Sem 7–8: Magang MSIB/mandiri → konversi MBKM', 'Sem 8: Sidang TA dari magang'],
    },
  ];

  // ==========================================
  // LOGIKA UTAMA: FETCHING 2 API BERURUTAN
  // ==========================================
  async function handleGeneratePlan() {
    if (!file) return;

    if (!token) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    setStep('processing');
    
    // Efek loading buatan agar UI tidak terlihat freeze
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    const formData = new FormData();
    formData.append("file", file); // Sesuaikan dengan academic_router.py

    try {
      // 1. Panggil API Ekstraksi PDF
      const parseRes = await fetch(`${API_URL}/academic/upload-transcript`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const parseResult = await parseRes.json();

      if (!parseRes.ok) throw new Error(parseResult.detail || "Gagal membaca PDF Transkrip");

      // Ambil array matkul hasil ekstrak
      const extractedCourses = parseResult.data.courses;

      // 2. Panggil API Semester Planner (Rule-Based Python)
      const plannerRes = await fetch(`${API_URL}/planner/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ extracted_courses: extractedCourses }),
      });
      
      const plannerResult = await plannerRes.json();

      if (!plannerRes.ok) throw new Error(plannerResult.detail || "Gagal generate rute studi");

      clearInterval(interval);
      
      // Simpan data dari Python ke State UI
      // plannerResult.data jika di router dibungkus {"data": result}, atau langsung plannerResult
      const dataPayload = plannerResult.data || plannerResult; 
      
      setPlannerData(dataPayload);
      setSelectedPlan('fast'); // Default pilih Plan A
      setStep('result');
      
    } catch (error) {
      clearInterval(interval);
      alert(error.message);
      setStep('intro');
      setFile(null);
    }
  }

  // ==========================================
  // RENDER UI TAMPILAN
  // ==========================================
  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50/30">
      
      {/* Header (Milik Andre) */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          Semester Planner
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Blueprint Semester Planner</h1>
        <p className="text-sm text-gray-500 mt-1">AI merencanakan rute studi optimalmu berdasarkan transkrip dan target Kurikulum DTI.</p>
      </div>

      {/* --- STEP 1: INTRO & UPLOAD --- */}
      {step === 'intro' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Prasyarat & Ketentuan</h2>
          <p className="text-xs text-gray-500 mb-4">Sistem akan mengecek apakah kamu sudah memenuhi prasyarat untuk mendapat rekomendasi plan.</p>
          <ul className="space-y-2 mb-5">
            {['Sudah menyelesaikan minimal 60 SKS', 'Transkrip PDF berbasis teks (bukan scan)', 'Sistem terkalibrasi dengan Kurikulum ITS'].map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-yellow-500 mt-0.5">•</span> {t}
              </li>
            ))}
          </ul>
          <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
          {file && (
            <button
              onClick={handleGeneratePlan}
              className="mt-4 w-full py-2.5 rounded-xl bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-all shadow-md"
            >
              Generate Semester Plan
            </button>
          )}
        </div>
      )}

      {/* --- STEP 2: PROCESSING (LOADING) --- */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Memproses Rute Studi...</h2>
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            {PROCESSING_STEPS[processingStep]}
          </p>
        </div>
      )}

      {/* --- STEP 3: RESULT DASHBOARD --- */}
      {step === 'result' && plannerData && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Metadata Top Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Total SKS Diambil</p>
                <p className="text-lg font-bold text-gray-900">{plannerData.metadata.sks_completed} <span className="text-sm font-normal text-gray-500">SKS</span></p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Sisa Dibutuhkan</p>
                <p className="text-lg font-bold text-yellow-600">{plannerData.metadata.sks_needed} <span className="text-sm font-normal text-gray-500">SKS</span></p>
              </div>
            </div>
            
            <button onClick={() => { setStep('intro'); setFile(null) }} className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
              ← Upload Ulang
            </button>
          </div>

          {/* Cards 3 Plan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`bg-white rounded-2xl border p-5 text-left transition-all relative overflow-hidden
                  ${selectedPlan === plan.id ? 'border-2 shadow-md transform -translate-y-1' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'}
                `}
                style={selectedPlan === plan.id ? { borderColor: plan.color } : {}}
              >
                {/* Aksen warna di atas kartu terpilih */}
                {selectedPlan === plan.id && (
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: plan.color }}></div>
                )}
                
                <p className="text-sm font-bold text-gray-900 mb-1 mt-1">{plan.title}</p>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="space-y-1.5">
                  {plan.semesters.map((s) => (
                    <p key={s} className="text-xs text-gray-600 flex items-start gap-1.5 font-medium">
                      <span style={{ color: plan.color }}>›</span> {s}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Rincian Mata Kuliah (Dinamis dari Backend Python) */}
          <div className="mt-8 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Rincian Jadwal: {PLANS.find(p => p.id === selectedPlan)?.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Distribusi mata kuliah sisa berbasis kuota SKS Departemen.</p>
              </div>
              <span className="px-4 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold whitespace-nowrap">
                {plannerData.metadata.sks_needed} SKS Tersisa
              </span>
            </div>
            
            <div className="space-y-6">
              {plannerData.plans[selectedPlan]?.schedule.map((semester, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Header Tiap Semester */}
                  <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">{semester.periode}</span>
                    <span className="text-xs font-bold bg-white px-3 py-1 rounded-lg border border-gray-200 text-gray-600 shadow-sm">
                      Max: {semester.max_sks} SKS
                    </span>
                  </div>
                  
                  {/* Isi Matkul */}
                  <div className="p-5 bg-white">
                    <p className="text-xs font-bold text-indigo-500 mb-4 uppercase tracking-wider bg-indigo-50 inline-block px-2 py-1 rounded">
                      Fokus: {semester.fokus}
                    </p>
                    <ul className="space-y-3">
                      {semester.courses && semester.courses.length > 0 ? (
                        semester.courses.map((mk, mkIdx) => (
                          <li key={mkIdx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{mk.kode}</span>
                              <span className="font-medium text-gray-800">{mk.nama}</span>
                            </div>
                            <span className="font-bold text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 border border-gray-200">
                              {mk.sks} SKS
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 text-center">
                          Tidak ada mata kuliah wajib di periode ini (Fokus Magang/Praktik/Tugas Akhir)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}