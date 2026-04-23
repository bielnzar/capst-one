
// Opportunity Board Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useReminderStore } from '../store/authStore'

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: 'Onsite IT Intern (HQ)',
    company: 'SLB Indonesia',
    location: 'Jakarta',
    type: 'On-site',
    duration: '4–6 bulan',
    minSem: 5,
    tags: ['IT Support', 'Troubleshooting', 'Office Ops'],
    verified: true,
    notes:
      'Internya jadi Onsite IT Intern di HQ Office SLB Indonesia yang ada di Jakarta. Rolenya buat support user-user local & expat yang ada di office, dan handle tugas-tugas daily operational IT.',
  },
  {
    id: 2,
    title: 'Backend Engineer Intern',
    company: 'Tokopedia',
    location: 'Jakarta',
    type: 'Hybrid',
    duration: '3 bulan',
    minSem: 5,
    tags: ['Backend', 'API', 'Database'],
    verified: true,
    notes:
      'Role Backend pada Tokopedia umumnya berfokus pada pengembangan layanan (service) dan API, integrasi database, menjaga reliability/performance, serta kolaborasi dengan product/mobile/web untuk kebutuhan fitur.',
  },
  {
    id: 3,
    title: 'Cloud DevOps Intern',
    company: 'Telkom Indonesia',
    location: 'Surabaya',
    type: 'On-site',
    duration: '6 bulan',
    minSem: 4,
    tags: ['AWS', 'Docker', 'CI/CD'],
    verified: true,
    notes:
      'Fokus pada operational cloud dan automation: deploy, monitoring, dan membantu tim menjalankan pipeline CI/CD serta praktik DevOps harian.',
  },
  ]
  
  export default function OpportunityBoardPage() {
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState(null)
  const reminders = useReminderStore((s) => s.reminders)
  const toggleReminder = useReminderStore((s) => s.toggleReminder)
  
  const selectedOpp = selectedId ? MOCK_OPPORTUNITIES.find((o) => o.id === selectedId) : null

    const filtered = MOCK_OPPORTUNITIES.filter(
      (o) =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.company.toLowerCase().includes(search.toLowerCase())
    )
  
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            Opportunity Board
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">Opportunity Board</h1>
          <p className="text-sm text-gray-500 mt-1">Lowongan magang dan pekerjaan terverifikasi dari alumni DTI.</p>
        </div>
  
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari role atau perusahaan..."
            className="w-full max-w-sm px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((opp) => (
          <button
            key={opp.id}
            type="button"
            onClick={() => setSelectedId(opp.id)}
            className="text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{opp.company.charAt(0)}</span>
                </div>
                {opp.verified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    Verified ✓
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900">{opp.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{opp.company} · {opp.location}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opp.type} · {opp.duration}</p>
  
              <div className="flex flex-wrap gap-1 mt-3">
                {opp.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{t}</span>
                ))}
              </div>
  
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Klik untuk lihat detail
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleReminder(opp.id)
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                    ${reminders[opp.id]
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  {reminders[opp.id] ? '🔔 On' : '🔕 Remind'}
                </button>
              </div>
          </button>
          ))}
        </div>

      {/* Detail modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedId(null)}
          />
          <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-gray-200 shadow-xl p-6 mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-900">{selectedOpp.title}</p>
                  {selectedOpp.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      Verified ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOpp.company} · {selectedOpp.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close detail"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <InfoCard label="Tipe" value={selectedOpp.type} />
              <InfoCard label="Durasi" value={selectedOpp.duration} />
              <InfoCard label="Minimal Semester" value={`Sem ${selectedOpp.minSem}+`} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-700 mb-2">Detail</p>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedOpp.notes || 'Belum ada detail deskripsi untuk lowongan ini.'}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-700 mb-2">Skills / Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedOpp.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleReminder(selectedOpp.id)}
                className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors
                  ${reminders[selectedOpp.id]
                    ? 'bg-pink-50 border-pink-200 text-pink-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {reminders[selectedOpp.id] ? '🔔 Reminder aktif' : '🔕 Aktifkan reminder'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="px-3.5 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    )
  }
  
function InfoCard({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

// 
