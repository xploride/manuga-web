import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { calculateAnalysis, getCategoryDetails } from '../utils/analysisEngine'
import { useCabinet } from '../hooks/useCabinet'

const CATEGORY_STYLES = {
  eye: { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  fatigue: { icon: "🌙", bg: "bg-indigo-50", color: "text-indigo-500" },
  circulation: { icon: "❤️", bg: "bg-rose-50", color: "text-rose-500" },
  immunity: { icon: "🛡️", bg: "bg-amber-50", color: "text-amber-600" },
  digestion: { icon: "🔄", bg: "bg-purple-50", color: "text-purple-500" },
  joints: { icon: "🦴", bg: "bg-blue-50", color: "text-blue-500" },
  vitality: { icon: "⚡", bg: "bg-cyan-50", color: "text-cyan-600" },
  recovery: { icon: "💪", bg: "bg-rose-50", color: "text-rose-500" },
  muscle: { icon: "🏋️", bg: "bg-orange-50", color: "text-orange-500" },
}

export default function AnalysisReport() {
  const navigate = useNavigate()
  const { cabinetItems, addItem, hasItem } = useCabinet()
  const [categoriesData, setCategoriesData] = useState([])

  useEffect(() => {
    const answersStr = localStorage.getItem('onboardingAnswers')
    if (answersStr) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)

        // TOP3 카테고리 상세 정보 생성
        const detailedCategories = result.categories.map(category => {
          const categoryReasons = result.reasons[category.key] || []
          const details = getCategoryDetails(category.key, categoryReasons)
          return {
            ...category,
            ...details,
          }
        })

        setCategoriesData(detailedCategories)
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error)
      }
    }
  }, [])

  const handleAddToCabinet = (nutrientName, category, reasons) => {
    const metadata = {
      source: 'analysis',
      category: category,
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
          {categoriesData.map((category, idx) => {
            const style = CATEGORY_STYLES[category.key]
            const isAdded = hasItem(category.mainNutrient)

            return (
              <div key={category.key} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${style.bg}`}>
                    {style.icon}
                  </span>
                  <span className="text-lg font-bold text-stone-800">{category.label}</span>
                </div>

                {/* Analysis Reason */}
                <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-stone-400 mb-1.5">분석 이유</p>
                  {category.reasonList && category.reasonList.length > 0 ? (
                    <div className="space-y-1.5">
                      {category.reasonList.map((reason, ridx) => (
                        <p key={ridx} className="text-sm text-stone-700">
                          ✔ {reason.source}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-700 leading-relaxed">{category.reason}</p>
                  )}
                </div>

                {/* Suggestion */}
                <div className="bg-emerald-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-emerald-600 mb-1.5">관리 제안</p>
                  <p className="text-sm text-emerald-800 leading-relaxed">{category.suggestion}</p>
                </div>

                {/* Main & Related Nutrients */}
                <div>
                  <p className="text-xs font-semibold text-stone-400 mb-2">추천 영양소</p>
                  <div className="space-y-1.5">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full px-3 py-1.5">
                      {category.mainNutrient}
                    </span>
                    {category.relatedNutrients && category.relatedNutrients.length > 0 && (
                      <div className="space-y-1">
                        {category.relatedNutrients.map((nutrient, nidx) => (
                          <span key={nidx} className="inline-block ml-2 bg-stone-100 text-stone-600 text-sm rounded-full px-3 py-1.5">
                            {nutrient}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cabinet Button */}
                <button
                  onClick={() => handleAddToCabinet(category.mainNutrient, category.label, category.reasonList)}
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
                {idx < categoriesData.length - 1 && (
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
