import { useNavigate } from 'react-router-dom'
import { Pill, Plus, ChevronRight } from 'lucide-react'
import { useCabinet } from '../hooks/useCabinet'

const NUTRIENT_STYLE = {
  "비타민B군": { icon: "⚡", bg: "bg-emerald-50", color: "text-emerald-600" },
  "비타민D": { icon: "☀️", bg: "bg-amber-50", color: "text-amber-500" },
  "오메가3": { icon: "💧", bg: "bg-blue-50", color: "text-blue-500" },
  "비타민C": { icon: "🍊", bg: "bg-orange-50", color: "text-orange-500" },
  "루테인": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "유산균": { icon: "💧", bg: "bg-purple-50", color: "text-purple-500" },
  "마그네슘": { icon: "🌙", bg: "bg-indigo-50", color: "text-indigo-500" },
  "아연": { icon: "⚡", bg: "bg-cyan-50", color: "text-cyan-600" },
  "단백질": { icon: "⚡", bg: "bg-rose-50", color: "text-rose-500" },
}

export default function Cabinet() {
  const navigate = useNavigate()
  const { cabinetItems } = useCabinet()

  const handleItemClick = (name) => {
    navigate(`/cabinet/${encodeURIComponent(name)}`)
  }

  const handleAddClick = () => {
    navigate('/cabinet/add')
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Pill className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-base font-bold text-stone-800">건강 캐비닛</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-24">
        <div className="space-y-2.5">
          {cabinetItems.map((item) => {
            const style = NUTRIENT_STYLE[item.name] || { icon: "💊", bg: "bg-stone-100", color: "text-stone-500" }
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <span className="font-medium text-stone-800 flex-1">{item.name}</span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            )
          })}
          {cabinetItems.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-10">담은 영양소가 없어요</p>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddClick}
        className="absolute right-5 bottom-24 w-12 h-12 rounded-full bg-emerald-600 shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
        aria-label="영양소 추가"
      >
        <Plus className="w-5 h-5" />
      </button>
    </>
  )
}
