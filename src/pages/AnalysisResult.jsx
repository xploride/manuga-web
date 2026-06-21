import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateAnalysis, getCategoryDetails } from '../utils/analysisEngine'
import { useCabinet } from '../hooks/useCabinet'

const NUTRIENT_MAPPING = {
  eye: ["루테인", "비타민A"],
  fatigue: ["마그네슘", "비타민B군"],
  circulation: ["오메가3"],
  immunity: ["비타민C", "아연", "비타민D"],
  digestion: ["유산균"],
  joints: ["칼슘", "마그네슘"],
  vitality: ["비타민B군", "마그네슘"],
  recovery: ["단백질", "마그네슘"],
  muscle: ["단백질", "아연"],
}

export default function AnalysisResult() {
  const navigate = useNavigate()
  const { cabinetItems, addItem } = useCabinet()
  const [analysisData, setAnalysisData] = useState(null)
  const [lastAnalysisDate, setLastAnalysisDate] = useState('-')
  const [showModal, setShowModal] = useState(false)
  const [addedItems, setAddedItems] = useState([])

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

    analysisData.categories.forEach((category) => {
      const mainNutrient = NUTRIENT_MAPPING[category.key]?.[0]
      if (!mainNutrient) return

      const isAlreadyAdded = cabinetItems.some((item) => item.name === mainNutrient)

      if (!isAlreadyAdded) {
        const reason = category.reasons?.[0]?.source || ''
        addItem(mainNutrient, {
          source: 'analysis',
          category: category.label,
          reason: reason,
        })
        newAddedItems.push({
          name: mainNutrient,
          category: category.label,
          isNew: true,
        })
      } else {
        newAddedItems.push({
          name: mainNutrient,
          category: category.label,
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
                              {item.category}
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
