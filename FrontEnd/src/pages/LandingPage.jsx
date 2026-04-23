import { useNavigate } from 'react-router-dom'
import { FEATURE_COLORS } from '../lib/utils'

const FEATURES = [
  {
    key: 'academic-mapper',
    title: 'Academic Mapper',
    desc: 'Upload transkrip untuk memetakan kekuatan skill dan rekomendasi karir.',
    path: '/academic-mapper',
  },
  {
    key: 'semester-planner',
    title: 'Semester Planner',
    desc: 'Rekomendasi 3 plan studi sesuai prasyarat dan targetmu.',
    path: '/semester-planner',
  },
  {
    key: 'opportunity-board',
    title: 'Opportunity Board',
    desc: 'Cari magang/lomba terverifikasi dan aktifkan reminder.',
    path: '/opportunity-board',
  },
  {
    key: 'cv-reviewer',
    title: 'AI CV Reviewer',
    desc: 'Skor & feedback CV sesuai target role kamu.',
    path: '/cv-reviewer',
  },
  {
    key: 'sks-chatbot',
    title: 'Konversi SKS Agent',
    desc: 'Chatbot untuk estimasi konversi SKS jalur magang/prestasi.',
    path: '/sks-chatbot',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
              <span className="w-2 h-2 rounded-full bg-gray-900" />
              SPARK DTI
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mt-4">Perencanaan Akademik & Rute Karir</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Pilih fitur yang ingin kamu coba. Beberapa fitur membutuhkan login (mode demo tetap bisa kamu lihat untuk UI).
            </p>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Masuk
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {FEATURES.map((f) => {
            const c = FEATURE_COLORS[f.key]
            return (
              <button
                key={f.key}
                onClick={() => navigate(f.path)}
                className="text-left bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <p className="text-xs font-semibold mt-4" style={{ color: c.text }}>
                  Buka →
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}