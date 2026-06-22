import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { calculateAnalysis } from '../utils/analysisEngine'
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
  "칼슘": { icon: "💧", bg: "bg-blue-50", color: "text-blue-500" },
  "비타민A": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "비타민E": { icon: "✨", bg: "bg-yellow-50", color: "text-yellow-500" },
}

const RANK_ICONS = ["🥇", "🥈", "🥉"]

export default function AnalysisReport() {
  const navigate = useNavigate()
  const { cabinetItems, addItem } = useCabinet()
  const [nutrientsData, setNutrients] = useState([])

  useEffect(() => {
    const answersStr = localStorage.getItem('onboardingAnswers')
    if (answersStr) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)
        setNutrients(result.nutrients)
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error)
      }
    }
  }, [])

  const handleAddToCabinet = (nutrientName, relatedCategory, reasons) => {
    const metadata = {
      source: 'analysis',
      relatedCategory: relatedCategory,
      reason: reasons && reasons.length > 0 ? reasons[0].source : '',
    }
    addItem(nutrientName, metadata)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => navigate('/analysis')}
          className="text-stone-500 hover:text-stone-700"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-base font-bold text-stone-800">분석 결과</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6 overflow-y-auto">
        <div className="space-y-6">
          {nutrientsData.map((nutrient, idx) => {
            const style = NUTRIENT_STYLE[nutrient.name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
            const content = NUTRIENT_CONTENT[nutrient.name]
            const isAdded = cabinetItems.some((item) => item.name === nutrient.name)

            return (
              <div key={nutrient.name} className="space-y-3">
                {/* Nutrient Header with Rank */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{RANK_ICONS[idx]}</span>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${style.bg}`}>
                    {style.icon}
                  </span>
                  <span className="text-lg font-bold text-stone-800">{nutrient.name}</span>
                </div>

                {/* Description */}
                {content && (
                  <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
                    <p className="text-sm text-stone-700">{content.description}</p>
                  </div>
                )}

                {/* Recommendation Reasons */}
                {nutrient.reasons && nutrient.reasons.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-stone-400 mb-2">추천 이유</p>
                    <div className="space-y-1.5">
                      {nutrient.reasons.map((reason, ridx) => (
                        <p key={ridx} className="text-sm text-stone-700 flex gap-2">
                          <span className="text-stone-400">•</span>
                          <span>{reason.source}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Category */}
                {nutrient.relatedCategory && (
                  <div className="px-4 py-2">
                    <p className="text-xs text-stone-500">
                      <span className="font-medium">관련:</span> {nutrient.relatedCategory}
                    </p>
                  </div>
                )}

                {/* Add to Cabinet Button */}
                <button
                  onClick={() => handleAddToCabinet(nutrient.name, nutrient.relatedCategory, nutrient.reasons)}
                  disabled={isAdded}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${
                    isAdded
                      ? 'bg-stone-100 text-stone-400'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isAdded ? '캐비닛에 담겨 있어요' : '캐비닛에 담기'}
                </button>

                {/* Divider */}
                {idx < nutrientsData.length - 1 && (
                  <div className="border-b border-stone-200 my-2" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
