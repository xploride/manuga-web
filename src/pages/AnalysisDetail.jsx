import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function AnalysisDetail() {
  const { nutrientName } = useParams()
  const navigate = useNavigate()
  const { cabinetItems, addItem } = useCabinet()
  const [nutrientDetail, setNutrientDetail] = useState(null)
  const [nutrientReasons, setNutrientReasons] = useState([])
  const [relatedCategory, setRelatedCategory] = useState('')

  useEffect(() => {
    const answersStr = localStorage.getItem('onboardingAnswers')
    if (answersStr && nutrientName) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)

        // allReasons에서 해당 영양소의 이유들 가져오기
        const reasons = result.allReasons[nutrientName] || []
        const nutrientData = result.nutrients.find((n) => n.name === nutrientName)
        const category = nutrientData?.relatedCategory || ''

        setNutrientReasons(reasons)
        setRelatedCategory(category)

        // NUTRIENT_CONTENT에서 영양소 정보 가져오기
        const content = NUTRIENT_CONTENT[nutrientName]
        if (content) {
          setNutrientDetail(content)
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      }
    }
  }, [nutrientName])

  if (!nutrientName || !NUTRIENT_STYLE[nutrientName]) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">영양소를 찾을 수 없습니다.</p>
      </div>
    )
  }

  if (!nutrientDetail) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">로드 중...</p>
      </div>
    )
  }

  const style = NUTRIENT_STYLE[nutrientName]
  const isAdded = cabinetItems.some((item) => item.name === nutrientName)

  const handleAddToCabinet = () => {
    const metadata = {
      source: 'analysis',
      relatedCategory: relatedCategory,
      reason: nutrientReasons.length > 0 ? nutrientReasons[0].source : '',
    }
    addItem(nutrientName, metadata)
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
        {/* Nutrient Header */}
        <div className={`rounded-2xl p-5 mb-5 ${style.bg}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{style.icon}</span>
            <span className={`text-2xl font-bold ${style.color}`}>{nutrientName}</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">{nutrientDetail.description}</p>
        </div>

        {/* For Who */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-3 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 mb-2">추천하는 분</p>
          <p className="text-sm text-stone-700">{nutrientDetail.forWho}</p>
        </div>

        {/* Foods */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-3 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 mb-2">주요 식품</p>
          <p className="text-sm text-stone-700">{nutrientDetail.foods}</p>
        </div>

        {/* Recommendation Reasons */}
        {nutrientReasons.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-3 shadow-sm">
            <p className="text-xs font-semibold text-stone-400 mb-2">추천 이유</p>
            <div className="space-y-1.5">
              {nutrientReasons.map((reason, idx) => (
                <p key={idx} className="text-sm text-stone-700 flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>{reason.source}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Related Category */}
        {relatedCategory && (
          <div className="mb-6">
            <p className="text-xs text-stone-500">
              <span className="font-medium">관련:</span> {relatedCategory}
            </p>
          </div>
        )}

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
