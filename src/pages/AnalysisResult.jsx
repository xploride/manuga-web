import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { calculateAnalysis, getCategoryDetails } from '../utils/analysisEngine'

export default function AnalysisResult() {
  const navigate = useNavigate()
  const [analysisData, setAnalysisData] = useState(null)

  useEffect(() => {
    // localStorage에서 설문 답변 가져오기
    const answersStr = localStorage.getItem('onboardingAnswers')
    if (answersStr) {
      try {
        const answers = JSON.parse(answersStr)
        const result = calculateAnalysis(answers)
        setAnalysisData(result)
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error)
        // 샘플 데이터로 폴백
        const sampleAnswers = {
          3: ["4~8시간"],
          4: ["6~8시간"],
          9: ["눈건강"],
          10: ["눈피로"],
        }
        const result = calculateAnalysis(sampleAnswers)
        setAnalysisData(result)
      }
    }
  }, [])

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-stone-500">분석 중...</p>
      </div>
    )
  }

  const lastAnalysisDate = new Date().toISOString().split('T')[0].replace(/-/g, '.')

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
          <span className="text-base font-bold text-stone-800">분석 결과</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        {/* Analysis Date */}
        <div className="bg-emerald-50 rounded-2xl px-4 py-3.5 mb-5">
          <p className="text-xs text-emerald-600 mb-0.5">분석일</p>
          <p className="text-base font-semibold text-emerald-800">{lastAnalysisDate}</p>
        </div>

        {/* Top 3 Categories */}
        <p className="text-xs font-semibold text-stone-400 mb-2">추천 카테고리</p>
        <div className="space-y-2.5 mb-6">
          {analysisData.categories.map((category, index) => {
            const details = getCategoryDetails(category.key, category.reasons)
            return (
              <button
                key={category.key}
                onClick={() => navigate(`/analysis/${category.key}`)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <div className="text-lg">{details.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{index + 1}. {category.label}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    추천: {category.nutrients.join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate('/cabinet')}
            className="w-full py-3 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-colors"
          >
            캐비닛으로 이동
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
