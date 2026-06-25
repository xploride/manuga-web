import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

const MEDAL_ICONS = ["🥇", "🥈", "🥉"]

const INTAKE_TIPS = {
  "단백질": "💡 운동 직후 30분 이내 섭취하면 더 좋아요",
  "마그네슘": "💡 취침 전 섭취하면 더 좋아요",
  "오메가3": "💡 식후에 섭취하면 더 좋아요",
  "비타민D": "💡 낮 시간대 식후에 섭취하면 더 좋아요",
  "비타민C": "💡 식후에 섭취하면 더 좋아요",
  "비타민B군": "💡 아침 식후에 섭취하면 더 좋아요",
  "루테인": "💡 지방이 있는 식후에 섭취하면 더 좋아요",
  "아연": "💡 공복보다 식후에 섭취하면 더 좋아요",
  "유산균": "💡 공복 또는 식전에 섭취하면 더 좋아요",
  "칼슘": "💡 마그네슘과 함께 취침 전 섭취하면 더 좋아요",
  "비타민A": "💡 지방이 있는 식후에 섭취하면 더 좋아요",
  "비타민E": "💡 식후에 섭취하면 더 좋아요",
}

export default function AnalysisResult() {
  const navigate = useNavigate()
  const { cabinetItems, addItem } = useCabinet()
  const [analysisData, setAnalysisData] = useState(null)
  const [lastAnalysisDate, setLastAnalysisDate] = useState('-')
  const [showModal, setShowModal] = useState(false)
  const [addedItems, setAddedItems] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // localStorage에서 설문 답변 가져오기
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

  const handleAddToCabinet = () => {
    const newAddedItems = []

    analysisData.nutrients.forEach((nutrient) => {
      const isAlreadyAdded = cabinetItems.some((item) => item.name === nutrient.name)

      if (!isAlreadyAdded) {
        const reason = nutrient.reasons?.[0]?.source || ''
        addItem(nutrient.name, {
          source: 'analysis',
          relatedCategory: nutrient.relatedCategory,
          reason: reason,
        })
        newAddedItems.push({
          name: nutrient.name,
          relatedCategory: nutrient.relatedCategory,
          isNew: true,
        })
      } else {
        newAddedItems.push({
          name: nutrient.name,
          relatedCategory: nutrient.relatedCategory,
          isNew: false,
        })
      }
    })

    setAddedItems(newAddedItems)
    setShowModal(true)
  }

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-stone-500">분석 중...</p>
      </div>
    )
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

        {/* Encouragement Message */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-stone-800 mb-1">생활패턴 분석이 완료됐어요 ❤️</h3>
          <p className="text-sm text-stone-400">당신의 하루에 맞는 영양소를 추천해드려요</p>
        </div>

        {/* Top 3 Nutrients */}
        <p className="text-xs font-semibold text-stone-400 mb-2">추천 영양소</p>
        <div className="space-y-2.5 mb-6">
          {analysisData.nutrients.map((nutrient, index) => {
            const style = NUTRIENT_STYLE[nutrient.name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
            const content = NUTRIENT_CONTENT[nutrient.name]
            return (
              <div
                key={nutrient.name}
                className={`w-full rounded-2xl border border-stone-100 p-4 shadow-sm ${style.bg}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{MEDAL_ICONS[index]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{style.icon}</span>
                      <p className={`font-semibold ${style.color}`}>{nutrient.name}</p>
                    </div>
                    {content && (
                      <p className="text-xs text-stone-600 mt-1">{content.description}</p>
                    )}
                  </div>
                </div>

                {nutrient.reasons && nutrient.reasons.length > 0 && (
                  <div className="mb-3 ml-11">
                    <p className="text-xs font-semibold text-stone-600 mb-1.5">추천 이유:</p>
                    <ul className="space-y-1">
                      {nutrient.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-stone-600 flex gap-2">
                          <span className="text-stone-400">•</span>
                          <span>{reason.source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nutrient.relatedCategory && (
                  <div className="ml-11">
                    <p className="text-xs text-stone-500">
                      <span className="font-medium">관련:</span> {nutrient.relatedCategory}
                    </p>
                  </div>
                )}

                {INTAKE_TIPS[nutrient.name] && (
                  <div className="ml-11 mt-2">
                    <p className="text-xs text-stone-400">{INTAKE_TIPS[nutrient.name]}</p>
                  </div>
                )}
              </div>
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
                  {top45.map(([name, score], idx) => {
                    const index = idx + 4
                    const style = NUTRIENT_STYLE[name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
                    const content = NUTRIENT_CONTENT[name]
                    const reasons = analysisData.allReasons[name] || []

                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`w-full rounded-2xl border border-stone-100 p-4 shadow-sm opacity-80 ${style.bg}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-2xl">{index}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{style.icon}</span>
                              <p className={`font-semibold ${style.color}`}>{name}</p>
                            </div>
                            {content && (
                              <p className="text-xs text-stone-600 mt-1">{content.description}</p>
                            )}
                          </div>
                        </div>

                        {reasons && reasons.length > 0 && (
                          <div className="mb-3 ml-11">
                            <p className="text-xs font-semibold text-stone-600 mb-1.5">추천 이유:</p>
                            <ul className="space-y-1">
                              {reasons.map((reason, ridx) => (
                                <li key={ridx} className="text-xs text-stone-600 flex gap-2">
                                  <span className="text-stone-400">•</span>
                                  <span>{reason.source}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {INTAKE_TIPS[name] && (
                          <div className="ml-11 mt-2">
                            <p className="text-xs text-stone-400">{INTAKE_TIPS[name]}</p>
                          </div>
                        )}
                      </motion.div>
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
            onClick={handleAddToCabinet}
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
          >
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 max-w-sm mx-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-stone-800 text-center mb-6">
                  캐비닛에 담겼어요
                </h3>

                {/* Items List */}
                <div className="space-y-2.5 mb-6 max-h-64 overflow-y-auto">
                  {addedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-stone-50 rounded-2xl p-4"
                    >
                      {item.isNew ? (
                        <>
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-800 text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {item.relatedCategory}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-stone-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-500 text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5">
                              이미 담겨있어요
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => {
                    setShowModal(false)
                    navigate('/cabinet')
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
                >
                  캐비닛 확인하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
