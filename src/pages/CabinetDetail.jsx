import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCabinet } from '../hooks/useCabinet'
import { NUTRIENT_CONTENT } from '../constants/nutrientContent'

const NUTRIENT_STYLE = {
  "비타민B군": { icon: "⚡", bg: "bg-emerald-50", color: "text-emerald-600" },
  "비타민D": { icon: "☀️", bg: "bg-amber-50", color: "text-amber-500" },
  "오메가3": { icon: "💧", bg: "bg-blue-50", color: "text-blue-500" },
  "비타민C": { icon: "⚡", bg: "bg-orange-50", color: "text-orange-500" },
  "루테인": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "유산균": { icon: "💧", bg: "bg-purple-50", color: "text-purple-500" },
  "마그네슘": { icon: "🌙", bg: "bg-indigo-50", color: "text-indigo-500" },
  "아연": { icon: "⚡", bg: "bg-cyan-50", color: "text-cyan-600" },
  "단백질": { icon: "⚡", bg: "bg-rose-50", color: "text-rose-500" },
  "비타민A": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "칼슘": { icon: "💧", bg: "bg-stone-100", color: "text-stone-500" },
  "비타민E": { icon: "✨", bg: "bg-yellow-50", color: "text-yellow-600" },
}

export default function CabinetDetail() {
  const { nutrientName } = useParams()
  const navigate = useNavigate()
  const { cabinetItems, removeItem, updateMemo } = useCabinet()
  const [memo, setMemo] = useState('')
  const [addedAt, setAddedAt] = useState('-')

  const decodedName = nutrientName ? decodeURIComponent(nutrientName) : ""

  // 캐비닛 항목 찾기
  useEffect(() => {
    const item = cabinetItems.find((i) => i.name === decodedName)
    if (item) {
      setAddedAt(item.addedAt)
      setMemo(item.memo)
    }
  }, [decodedName, cabinetItems])

  if (!decodedName || !NUTRIENT_STYLE[decodedName]) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">영양소를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const style = NUTRIENT_STYLE[decodedName]

  const handleDelete = () => {
    removeItem(decodedName)
    navigate('/cabinet')
  }

  const handleMemoChange = (e) => {
    const newMemo = e.target.value
    setMemo(newMemo)
    updateMemo(decodedName, newMemo)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => navigate('/cabinet')}
          className="text-stone-500 hover:text-stone-700"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-base font-bold text-stone-800">{decodedName}</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        {/* Icon */}
        <div className="flex justify-center py-6">
          <span className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${style.bg}`}>
            {style.icon}
          </span>
        </div>

        {/* Description */}
        {NUTRIENT_CONTENT[decodedName] && (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-3">
            <p className="text-xs font-semibold text-emerald-600 mb-1.5">정보</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{NUTRIENT_CONTENT[decodedName].description}</p>
          </div>
        )}

        {/* Added Date */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-3 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 mb-1">추가일</p>
          <p className="text-sm text-stone-700">{addedAt}</p>
        </div>

        {/* Memo */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-6 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 mb-2">메모</p>
          <textarea
            value={memo}
            onChange={handleMemoChange}
            placeholder="메모를 입력하세요..."
            className="w-full text-sm text-stone-700 border border-stone-200 rounded-lg p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors resize-none"
            rows={4}
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-2xl border-2 border-rose-200 text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-colors"
        >
          삭제
        </button>
      </div>
    </>
  )
}
