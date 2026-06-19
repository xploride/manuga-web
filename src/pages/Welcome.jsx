import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const MESSAGES = [
  "안녕하세요!",
  "마뉴가입니다",
  "당신의 하루를 살펴보고, 필요한 영양소를 찾아드릴게요",
]

export default function Welcome() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0, 1, 2 = 메시지, 3 = 최종
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (step < MESSAGES.length) {
      // 페이드인 (0.5초)
      setOpacity(0)
      const fadeInTimer = setTimeout(() => setOpacity(1), 50)

      // 유지 (1.5초)
      const holdTimer = setTimeout(() => setOpacity(1), 500)

      // 페이드아웃 (0.5초) + 다음 메시지로 (2초 후)
      const fadeOutTimer = setTimeout(() => setOpacity(0), 2000)
      const nextTimer = setTimeout(() => setStep(step + 1), 2500)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(holdTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }
  }, [step])

  return (
    <div className="min-h-screen bg-stone-50 flex justify-center items-center py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 tracking-tight">MANUGA</span>
          </div>
        </div>

        {/* Message Sequence or Final Screen */}
        {step < MESSAGES.length ? (
          // 메시지 시퀀스
          <div className="flex-1 flex items-center justify-center mb-8 h-16">
            <p
              className="text-xl text-stone-800 font-semibold transition-opacity duration-500"
              style={{ opacity }}
            >
              {MESSAGES[step]}
            </p>
          </div>
        ) : (
          // 최종 화면
          <div className="mb-8">
            <p className="text-lg text-stone-700 font-medium">
              1분이면 충분해요
            </p>
          </div>
        )}

        {/* Start Button - 최종 화면에서만 표시 */}
        {step >= MESSAGES.length && (
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition-colors"
          >
            시작하기
          </button>
        )}
      </div>
    </div>
  )
}
