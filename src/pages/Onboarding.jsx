import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useOnboarding } from '../hooks/useOnboarding'
import { useUser } from '../hooks/useUser'

const QUESTIONS = [
  {
    id: 1,
    title: "성별",
    type: "single",
    options: ["남성", "여성"],
  },
  {
    id: 2,
    title: "연령대",
    type: "single",
    options: ["20대", "30대", "40대", "50대", "60대+"],
  },
  {
    id: 3,
    title: "컴퓨터 사용시간",
    type: "single",
    options: ["1시간 이하", "1~4시간", "4~8시간", "8시간 이상"],
  },
  {
    id: 4,
    title: "하루 평균 앉아있는 시간",
    type: "single",
    options: ["1시간 이하", "1~3시간", "3~6시간", "6~8시간", "8시간 이상"],
  },
  {
    id: 5,
    title: "하루 평균 걷는 시간",
    type: "single",
    options: ["30분 이하", "30분~1시간", "1~2시간", "2시간 이상"],
  },
  {
    id: 6,
    title: "하루 평균 햇빛 노출",
    type: "single",
    options: ["거의 없음", "30분 이하", "30분~1시간", "1시간 이상"],
  },
  {
    id: 7,
    title: "업무상 신체활용 강도",
    type: "single",
    options: ["매우낮음 (주로 앉아서 근무)", "낮음", "보통 (서있고 이동 있음)", "높음", "매우높음 (중량물·육체노동)"],
  },
  {
    id: 8,
    title: "운동 빈도",
    type: "single",
    options: ["안함", "주1~2회", "주3~4회", "주5회 이상"],
  },
  {
    id: 9,
    title: "건강 목표 (최대 2개)",
    type: "multi",
    maxSelect: 2,
    options: ["눈건강", "운동회복", "근육증가", "면역관리", "장건강", "혈행건강", "관절관리", "활력관리"],
  },
  {
    id: 10,
    title: "현재 고민 (최대 3개)",
    type: "multi",
    maxSelect: 3,
    options: ["눈피로", "만성피로", "수면부족", "자고 일어나도 피곤함", "근육회복 느림", "관절불편", "장트러블", "특별한 고민 없음"],
  },
  {
    id: 11,
    title: "식습관",
    type: "single",
    options: ["균형있게 먹음", "육류위주", "탄수화물위주", "배달음식위주", "불규칙함"],
  },
  {
    id: 12,
    title: "수면 상태",
    type: "single",
    options: ["매우좋음", "보통", "부족함", "매우부족함"],
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { saveAnswers } = useOnboarding()
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const question = QUESTIONS[currentStep]
  const isAnswered = answers[question.id] !== undefined && answers[question.id].length > 0
  const isLastStep = currentStep === QUESTIONS.length - 1

  const handleSelectOption = (option) => {
    if (question.type === "single") {
      setAnswers({
        ...answers,
        [question.id]: [option],
      })
    } else {
      const currentAnswers = answers[question.id] || []
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [question.id]: currentAnswers.filter((a) => a !== option),
        })
      } else if (currentAnswers.length < question.maxSelect) {
        setAnswers({
          ...answers,
          [question.id]: [...currentAnswers, option],
        })
      }
    }
  }

  const handleNext = async () => {
    if (isLastStep) {
      // 설문 완료 - 답변 저장 후 분석 결과로 이동
      setIsSaving(true)

      // Context에 저장
      saveAnswers(answers)

      // 분석 날짜 저장
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const analysisDate = `${year}.${month}.${day}`
      localStorage.setItem('lastAnalysisDate', analysisDate)

      setIsSaving(false)
      navigate('/analysis-result')
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const selectedAnswers = answers[question.id] || []
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-stone-50 flex justify-center py-8">
      <div className="w-full max-w-sm bg-stone-50 flex flex-col rounded-3xl overflow-hidden shadow-sm border border-stone-200">
        {/* Progress Bar */}
        <div className="h-1 bg-stone-200">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <p className="text-xs text-stone-400 mb-2">
            질문 {currentStep + 1} / {QUESTIONS.length}
          </p>
          <h2 className="text-lg font-bold text-stone-800">{question.title}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pb-6">
          {question.type === "multi" && (
            <p className="text-xs text-stone-500 mb-4">
              {selectedAnswers.length} / {question.maxSelect}개 선택됨
            </p>
          )}

          <div className="space-y-2.5">
            {question.options.map((option) => {
              const isSelected = selectedAnswers.includes(option)
              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 shadow-sm text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-stone-100 hover:shadow-md hover:border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-emerald-600' : 'text-stone-800'}`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 bg-white px-5 py-4 flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 py-3 rounded-2xl border-2 border-stone-200 text-stone-500 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-stone-300"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
              isAnswered
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isLastStep ? '완료' : '다음'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
