import { Home as HomeIcon, FlaskConical, Pill } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: '/', label: '홈', icon: HomeIcon },
    { id: '/analysis', label: '분석', icon: FlaskConical },
    { id: '/cabinet', label: '캐비닛', icon: Pill },
  ]

  return (
    <div className="border-t border-stone-100 bg-white px-6 py-3 flex justify-between">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = location.pathname === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <Icon className="w-5 h-5" />
            <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
