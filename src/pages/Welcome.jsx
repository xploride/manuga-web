import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const MESSAGES = [
  "안녕하세요!",
  "마뉴가입니다",
  <div key="msg3" className="text-center">
    <div>당신의 하루를 살펴보고,</div>
    <div>필요한 영양소를 찾아드릴게요</div>
  </div>,
]

export default function Welcome() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (step < MESSAGES.length) {
      setOpacity(0)
      const fadeInTimer = setTimeout(() => setOpacity(1), 50)
      const fadeOutTimer = setTimeout(() => setOpacity(0), 2000)
      const nextTimer = setTimeout(() => setStep(step + 1), 2500)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }
  }, [step])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
      {/* Message Sequence or Final Screen - 중앙 배치 */}
      {step < MESSAGES.length ? (
        // 메시지 시퀀스 - 중앙에 페이드인/아웃
        <div className="h-24 flex items-center justify-center px-8 w-full">
          <div
            className="text-xl text-stone-800 font-semibold text-center transition-opacity duration-500"
            style={{ opacity }}
          >
            {MESSAGES[step]}
          </div>
        </div>
      ) : (
        // 최종 화면 - 로고 + 텍스트 한 덩어리로 중앙 배치
        <div className="flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 tracking-tight">MANUGA</span>
          </div>

          {/* Text */}
          <p className="text-lg text-stone-700 font-medium">
            1분이면 충분해요
          </p>
        </div>
      )}

      {/* Start Button - 최종 화면에서만 보임, 콘텐츠 아래에 자연스럽게 */}
      {step >= MESSAGES.length && (
        <div className="w-full px-8 max-w-sm mx-auto mt-12 pb-12">
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition-colors"
          >
            시작하기
          </button>
        </div>
      )}
    </div>
  )
}
