import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, ChevronRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateAnalysis } from '../utils/analysisEngine'

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

export default function Analysis() {
  const navigate = useNavigate()
  const [analysisData, setAnalysisData] = useState(null)
  const [lastAnalysisDate, setLastAnalysisDate] = useState('-')
  const [isExpanded, setIsExpanded] = useState(false)

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

  const handleNutrientClick = (nutrientName) => {
    navigate(`/analysis/${nutrientName}`)
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

        {/* Nutrients - TOP 3 */}
        <div className="space-y-2.5 mb-6">
          {analysisData?.nutrients.map((nutrient) => {
            const style = NUTRIENT_STYLE[nutrient.name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
            return (
              <button
                key={nutrient.name}
                onClick={() => handleNutrientClick(nutrient.name)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-stone-800">{nutrient.name}</span>
                  {nutrient.relatedCategory && (
                    <p className="text-xs text-stone-400 mt-0.5">{nutrient.relatedCategory}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            )
          })}

          {/* Top 4-5 Nutrients (Expandable) */}
          <AnimatePresence>
            {isExpanded && (() => {
              const allNutrients = Object.entries(analysisData.allNutrientScores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
              const top5 = allNutrients.slice(0, 5)
              const top45 = top5.slice(3)

              return (
                <div className="space-y-2.5">
                  {top45.map(([name], idx) => {
                    const index = idx + 3
                    const style = NUTRIENT_STYLE[name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }

                    return (
                      <motion.button
                        key={name}
                        onClick={() => handleNutrientClick(name)}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95 opacity-80"
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg font-medium text-stone-600 ${style.bg}`}>
                          {index}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-stone-800">{name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300" />
                      </motion.button>
                    )
                  })}
                </div>
              )
            })()}
          </AnimatePresence>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 rounded-2xl bg-stone-100 text-stone-600 font-medium text-sm hover:bg-stone-200 transition-colors mb-4"
        >
          {isExpanded ? "접기" : "더보기"}
        </button>

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
