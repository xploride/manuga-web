import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useCabinet } from '../hooks/useCabinet'
import { NUTRIENT_CONTENT } from '../constants/nutrientContent'

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
  "비타민A": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "칼슘": { icon: "💧", bg: "bg-stone-100", color: "text-stone-500" },
  "비타민E": { icon: "✨", bg: "bg-yellow-50", color: "text-yellow-600" },
}

const CORE12 = Object.keys(NUTRIENT_STYLE)

export default function AddNutrient() {
  const navigate = useNavigate()
  const { cabinetItems, addItem, hasItem } = useCabinet()
  const [query, setQuery] = useState("")
  const [showAllCore12, setShowAllCore12] = useState(false)
  const [expandedNutrient, setExpandedNutrient] = useState(null)

  const filteredCore12 = CORE12.filter((n) => n.includes(query))
  const visibleCore12 = showAllCore12 ? filteredCore12 : filteredCore12.slice(0, 6)

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => {
            navigate('/cabinet')
            setQuery("")
            setShowAllCore12(false)
          }}
          className="text-stone-500 hover:text-stone-700"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-base font-bold text-stone-800">영양소 추가</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        {/* Search Box */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-stone-200 px-3 py-2.5 mb-4">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색"
            className="flex-1 text-sm outline-none placeholder:text-stone-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-stone-300" aria-label="검색 지우기">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Core12 Label */}
        <p className="text-xs font-semibold text-stone-400 mb-2">Core12</p>

        {/* Nutrient List */}
        <div className="space-y-2">
          {visibleCore12.map((name) => {
            const style = NUTRIENT_STYLE[name]
            const added = hasItem(name)
            const isExpanded = expandedNutrient === name
            const content = NUTRIENT_CONTENT[name]

            return (
              <div key={name} className="overflow-hidden">
                {/* Main Row */}
                <div className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3 shadow-sm">
                  <button
                    onClick={() => setExpandedNutrient(isExpanded ? null : name)}
                    className="flex-1 flex items-center gap-3"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                      {style.icon}
                    </span>
                    <span className="font-medium text-stone-800">{name}</span>
                  </button>
                  <button
                    onClick={() => setExpandedNutrient(isExpanded ? null : name)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => addItem(name, { source: 'manual' })}
                    disabled={added}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      added ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-500 hover:bg-emerald-100 hover:text-emerald-600'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && content && (
                  <div className="bg-stone-50 border border-t-0 border-stone-100 rounded-b-2xl px-4 py-3 space-y-2.5">
                    <div>
                      <p className="text-xs font-semibold text-stone-400 mb-1">설명</p>
                      <p className="text-sm text-stone-700 leading-relaxed">{content.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-400 mb-1">추천 대상</p>
                      <p className="text-sm text-stone-700 leading-relaxed">{content.forWho}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {visibleCore12.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-6">검색 결과가 없어요</p>
          )}
        </div>

        {/* Show All Button */}
        {!showAllCore12 && filteredCore12.length > 6 && (
          <button
            onClick={() => setShowAllCore12(true)}
            className="w-full flex items-center justify-center gap-1 text-sm text-stone-500 mt-3 py-2 hover:text-stone-700"
          >
            전체 보기 <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  )
}
