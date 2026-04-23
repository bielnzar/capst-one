// Semester Planner Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import PdfDropzone from '../components/shared/PdfDropzone'

export default function SemesterPlannerPage() {
  const [step, setStep] = useState('intro')
  const [file, setFile] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const PLANS = [
    {
      id: 'fast',
      title: 'Plan A — Lulus 3.5 Tahun',
      color: '#ca8a04',
      desc: 'Ambil maks SKS tiap semester, selesaikan TA di sem 7.',
      semesters: ['Sem 5–6: Maks SKS (22–24)', 'Sem 7: TA + Magang singkat', 'Sem 7.5: Sidang TA'],
    },
    {
      id: 'balanced',
      title: 'Plan B — Optimalkan SKS + Karir',
      color: '#2563eb',
      desc: 'Mix SKS optimal, fokus skill industri dan magang.',
      semesters: ['Sem 5–6: Maks SKS + pilih MK karir', 'Sem 7: Mix magang paruh waktu', 'Sem 8: TA dengan portofolio kuat'],
    },
    {
      id: 'experience',
      title: 'Plan C — Fokus Experience',
      color: '#9333ea',
      desc: 'Selesaikan MK wajib, magang penuh 4–6 bulan.',
      semesters: ['Sem 5–7: Selesaikan MK wajib', 'Sem 7–8: Magang MSIB/mandiri → konversi MBKM', 'Sem 8: Sidang TA dari magang'],
    },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          Semester Planner
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Blueprint Semester Planner</h1>
        <p className="text-sm text-gray-500 mt-1">AI merencanakan rute studi optimalmu berdasarkan transkrip dan target.</p>
      </div>

      {step === 'intro' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Prasyarat & Ketentuan</h2>
          <p className="text-xs text-gray-500 mb-4">Sistem akan mengecek apakah kamu sudah memenuhi prasyarat untuk mendapat rekomendasi plan.</p>
          <ul className="space-y-2 mb-5">
            {['Sudah menyelesaikan minimal 60 SKS', 'Transkrip PDF berbasis teks (bukan scan)', 'IPS minimal 2.75 untuk Plan A'].map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-yellow-500 mt-0.5">•</span> {t}
              </li>
            ))}
          </ul>
          <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
          {file && (
            <button
              onClick={() => setStep('result')}
              className="mt-4 w-full py-2.5 rounded-xl bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-all"
            >
              Generate Semester Plan
            </button>
          )}
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`bg-white rounded-2xl border p-5 text-left transition-all
                  ${selectedPlan === plan.id ? 'border-2 shadow-sm' : 'border-gray-200 hover:border-gray-300'}
                `}
                style={selectedPlan === plan.id ? { borderColor: plan.color } : {}}
              >
                <p className="text-sm font-semibold text-gray-900 mb-1">{plan.title}</p>
                <p className="text-xs text-gray-500 mb-3">{plan.desc}</p>
                <div className="space-y-1">
                  {plan.semesters.map((s) => (
                    <p key={s} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span style={{ color: plan.color }}>›</span> {s}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => { setStep('intro'); setFile(null) }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Upload ulang transkrip
          </button>
        </div>
      )}
    </div>
  )
}

// 