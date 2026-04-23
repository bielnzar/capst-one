// Opportunity Board Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'

const MOCK_OPPORTUNITIES = [
    { id: 1, title: 'Backend Engineer Intern', company: 'Gojek', location: 'Jakarta', type: 'Remote OK', duration: '4–6 bulan', minSem: 5, match: 94, tags: ['Node.js', 'PostgreSQL'], verified: true },
    { id: 2, title: 'ML Engineer Intern', company: 'Tokopedia', location: 'Jakarta', type: 'Hybrid', duration: '3 bulan', minSem: 5, match: 78, tags: ['Python', 'TensorFlow'], verified: true },
    { id: 3, title: 'Cloud DevOps Intern', company: 'Telkom Indonesia', location: 'Surabaya', type: 'On-site', duration: '6 bulan', minSem: 4, match: 65, tags: ['AWS', 'Docker'], verified: true },
  ]
  
  export default function OpportunityBoardPage() {
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const [reminders, setReminders] = useState({})
  
    const filtered = MOCK_OPPORTUNITIES.filter(
      (o) =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.company.toLowerCase().includes(search.toLowerCase())
    )
  
    function toggleReminder(id) {
      setReminders((r) => ({ ...r, [id]: !r[id] }))
    }
  
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
            <div key={opp.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all">
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
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${opp.match}%`,
                        backgroundColor: opp.match >= 80 ? '#16a34a' : opp.match >= 60 ? '#ca8a04' : '#9ca3af',
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{opp.match}% match</span>
                </div>
                <button
                  onClick={() => toggleReminder(opp.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                    ${reminders[opp.id]
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  {reminders[opp.id] ? '🔔 On' : '🔕 Remind'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // 