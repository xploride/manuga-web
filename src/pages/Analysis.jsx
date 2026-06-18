import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, ChevronRight, ArrowLeft } from 'lucide-react'
import { calculateAnalysis } from '../utils/analysisEngine'

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

const CATEGORY_LABELS = {
  eye: "눈 건강",
  fatigue: "피로 관리",
  circulation: "혈행 건강",
  immunity: "면역 관리",
  digestion: "장 건강",
  joints: "관절 관리",
  vitality: "활력 관리",
  recovery: "운동 회복",
  muscle: "근육 증가",
}

export default function Analysis() {
  const navigate = useNavigate()
  const [analysisData, setAnalysisData] = useState(null)
  const [lastAnalysisDate, setLastAnalysisDate] = useState('-')

  useEffect(() => {
    // localStorage에서 onboardingAnswers 읽기
    const answersStr = localStorage.getItem('onboardingAnswers')
    const analysisDateStr = localStorage.getItem('lastAnalysisDate')

    if (answersStr) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)
        setAnalysisData(result)

        // 분석 날짜 설정
        if (analysisDateStr) {
          setLastAnalysisDate(analysisDateStr)
        } else {
          // 기존 저장된 날짜가 없으면 오늘 날짜로 설정
          const today = new Date()
          const year = today.getFullYear()
          const month = String(today.getMonth() + 1).padStart(2, '0')
          const day = String(today.getDate()).padStart(2, '0')
          const todayDate = `${year}.${month}.${day}`
          setLastAnalysisDate(todayDate)
          localStorage.setItem('lastAnalysisDate', todayDate)
        }
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error)
      }
    }
  }, [])

  const handleCategoryClick = (categoryKey) => {
    navigate(`/analysis/${categoryKey}`)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="text-stone-500 hover:text-stone-700"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FlaskConical className="w-5 h-5 text-emerald-600" />
          <span className="text-base font-bold text-stone-800">생활패턴 분석</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        {/* Last Analysis Date */}
        <div className="bg-emerald-50 rounded-2xl px-4 py-3.5 mb-5">
          <p className="text-xs text-emerald-600 mb-0.5">최근 분석일</p>
          <p className="text-base font-semibold text-emerald-800">{lastAnalysisDate}</p>
        </div>

        {/* Categories - TOP 3 */}
        <div className="space-y-2.5 mb-6">
          {analysisData?.categories.map((category) => {
            const style = CATEGORY_STYLES[category.key]
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryClick(category.key)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <span className="font-medium text-stone-800 flex-1">{category.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate('/analysis/report')}
            className="w-full py-3 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-colors"
          >
            결과 보기
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-3 rounded-2xl bg-stone-100 text-stone-500 font-medium text-sm hover:bg-stone-200 transition-colors"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    </>
  )
}
