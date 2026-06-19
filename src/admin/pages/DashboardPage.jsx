import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-500 text-sm">Dashboard — placeholder</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
