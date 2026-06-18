import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function AnalysisDetail() {
  const { categoryKey } = useParams()
  const navigate = useNavigate()
  const { cabinetItems, addItem } = useCabinet()
  const [categoryDetails, setCategoryDetails] = useState(null)
  const [categoryReasons, setCategoryReasons] = useState([])

  useEffect(() => {
    const answersStr = localStorage.getItem('onboardingAnswers')
    if (answersStr && categoryKey) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)

        // TOP 3에 없어도 모든 카테고리 정보 가져오기
        const categoryReasons = result.reasons[categoryKey] || []
        const details = getCategoryDetails(categoryKey, categoryReasons)
        setCategoryDetails(details)
        setCategoryReasons(categoryReasons)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      }
    }
  }, [categoryKey])

  if (!categoryKey || !CATEGORY_STYLES[categoryKey]) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">카테고리를 찾을 수 없습니다.</p>
      </div>
    )
  }

  if (!categoryDetails) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">로드 중...</p>
      </div>
    )
  }

  const style = CATEGORY_STYLES[categoryKey]
  const isAdded = cabinetItems.some((item) => item.name === categoryDetails.mainNutrient)

  const handleAddToCabinet = () => {
    addItem(categoryDetails.mainNutrient)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
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
      <div className="flex-1 px-5 pb-6">
        {/* Category Header */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${style.bg}`}>
            {style.icon}
          </span>
          <span className="text-lg font-bold text-stone-800">{categoryDetails.label}</span>
        </div>

        {/* Analysis Reason */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-3 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 mb-1.5">분석 이유</p>
          {categoryReasons.length > 0 ? (
            <div className="space-y-1.5">
              {categoryReasons.map((reason, idx) => (
                <p key={idx} className="text-sm text-stone-700">
                  ✔ {reason.source}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-700 leading-relaxed">{categoryDetails.reason}</p>
          )}
        </div>

        {/* Suggestion */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-3">
          <p className="text-xs font-semibold text-emerald-600 mb-1.5">관리 제안</p>
          <p className="text-sm text-emerald-800 leading-relaxed">{categoryDetails.suggestion}</p>
        </div>

        {/* Main & Related Nutrients */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-stone-400 mb-2">추천 영양소</p>
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full px-3 py-1.5">
              {categoryDetails.mainNutrient}
            </span>
            {categoryDetails.relatedNutrients && categoryDetails.relatedNutrients.length > 0 && (
              <div className="space-y-1">
                {categoryDetails.relatedNutrients.map((nutrient, idx) => (
                  <span key={idx} className="inline-block ml-2 bg-stone-100 text-stone-600 text-sm rounded-full px-3 py-1.5">
                    {nutrient}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add to Cabinet Button */}
        <button
          onClick={handleAddToCabinet}
          disabled={isAdded}
          className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${
            isAdded
              ? 'bg-stone-100 text-stone-400'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isAdded ? '캐비닛에 담겨 있어요' : '캐비닛에 담기'}
        </button>

        {/* Go to Cabinet Button */}
        {isAdded && (
          <button
            onClick={() => navigate('/cabinet')}
            className="w-full py-3 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-semibold text-sm mt-2.5 hover:bg-emerald-50 transition-colors"
          >
            캐비닛 바로가기
          </button>
        )}
      </div>
    </>
  )
}
