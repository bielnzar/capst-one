import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import PdfDropzone, { ProcessingState } from '../components/shared/PdfDropzone'
import { useUploadTranscript, useAcademicMapperResult } from '../hooks/hooks'
import { useUploadStore } from '../store/authStore'

const PROCESSING_STEPS = ['Upload file', 'Parsing transkrip', 'Mapping ke domain skill', 'Generate rekomendasi']

const MOCK_SKILL_DATA = [
  { subject: 'Web Dev', score: 82, fullMark: 100 },
  { subject: 'Database', score: 75, fullMark: 100 },
  { subject: 'Cloud', score: 60, fullMark: 100 },
  { subject: 'AI/ML', score: 55, fullMark: 100 },
  { subject: 'Security', score: 40, fullMark: 100 },
  { subject: 'Networking', score: 50, fullMark: 100 },
]

const MOCK_CAREER_MATCHES = [
  { role: 'Backend Engineer', match: 94, color: '#16a34a' },
  { role: 'Full Stack Developer', match: 88, color: '#2563eb' },
  { role: 'DevOps Engineer', match: 71, color: '#ca8a04' },
  { role: 'ML Engineer', match: 58, color: '#9333ea' },
]

const MOCK_SKILL_GAP = {
  'Backend Engineer': [
    { item: 'Docker & Kubernetes', type: 'sertifikasi', priority: 'high' },
    { item: 'Message Queue (Kafka)', type: 'skill', priority: 'high' },
    { item: 'System Design', type: 'matkul', priority: 'medium' },
  ],
}

export default function AcademicMapperPage() {
  const [file, setFile] = useState(null)
  const [step, setStep] = useState('upload')
  const [processingStep, setProcessingStep] = useState(0)
  const [selectedCareer, setSelectedCareer] = useState(null)

  const { setTranscriptDocumentId } = useUploadStore()
  const uploadMutation = useUploadTranscript()

  async function handleUpload() {
    if (!file) return
    setStep('processing')

    const interval = setInterval(() => {
      setProcessingStep((s) => {
        if (s >= PROCESSING_STEPS.length - 1) {
          clearInterval(interval)
          setTimeout(() => setStep('result'), 500)
          return s
        }
        return s + 1
      })
    }, 800)

    // Uncomment when backend is ready:
    // const formData = new FormData()
    // formData.append('file', file)
    // const { documentId } = await uploadMutation.mutateAsync(formData)
    // setTranscriptDocumentId(documentId)
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
        <h1 className="text-2xl font-semibold text-gray-900">Academic Mapper & Career Path</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload transkrip nilaimu untuk memetakan kekuatan skill dan mendapat rekomendasi jalur karir.
        </p>
      </div>

      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Upload Transkrip Nilai</h2>
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
              <p className="text-xs font-semibold text-green-800 mb-2">Yang akan dihasilkan:</p>
              <ul className="space-y-1.5">
                {['Radar chart kekuatan skill (6 domain)', 'Rekomendasi jalur karir + match score', 'Skill gap analysis per role'].map((t) => (
                  <li key={t} className="text-xs text-green-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <ChartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Hasil analisis akan muncul di sini</p>
            <p className="text-xs text-gray-400 mt-1">Upload transkrip untuk memulai</p>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto">
          <h2 className="text-sm font-semibold text-gray-700 mb-6 text-center">Memproses transkrip...</h2>
          <ProcessingState steps={PROCESSING_STEPS} currentStep={processingStep} />
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Overall Score', value: '73%', sub: '6 domain skill' },
              { label: 'Skills Assessed', value: '24', sub: 'Matakuliah dianalisis' },
              { label: 'Career Matches', value: '4', sub: 'Jalur karir cocok' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Skills Assessment</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={MOCK_SKILL_DATA}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
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
              <div className="mt-4 grid grid-cols-2 gap-2">
                {MOCK_SKILL_DATA.map(({ subject, score }) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-8 text-right">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Career Recommendations</h2>
              <div className="space-y-3">
                {MOCK_CAREER_MATCHES.map(({ role, match, color }) => (
                  <button
                    key={role}
                    onClick={() => setSelectedCareer(role)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all
                      ${selectedCareer === role ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${match}%`, backgroundColor: color }} />
                        </div>
                        <span className="text-xs text-gray-500">{match}% match</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                      {match >= 80 ? 'Best' : match >= 60 ? 'Good' : 'Fair'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedCareer && MOCK_SKILL_GAP[selectedCareer] && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Skill Gap — {selectedCareer}</h2>
                <button onClick={() => setSelectedCareer(null)} className="text-xs text-gray-400 hover:text-gray-600">
                  Tutup
                </button>
              </div>
              <div className="space-y-2">
                {MOCK_SKILL_GAP[selectedCareer].map(({ item, type, priority }) => (
                  <div key={item} className="flex items-center gap-3 py-2.5 px-3 rounded-lg border border-gray-100">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                    <span className="text-sm text-gray-800 flex-1">{item}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep('upload')
                setFile(null)
                setProcessingStep(0)
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Upload ulang
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ChartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}