// 404 Page
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <p className="text-gray-600 mb-6">Halaman tidak ditemukan.</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm">
          Kembali ke Home
        </button>
      </div>
    </div>
  )
}
  