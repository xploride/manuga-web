import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const MESSAGES = [
  <div key="msg0" className="text-center text-stone-800" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300, fontSize: '2.8rem', letterSpacing: '0.05em' }}>
    안녕하세요!
  </div>,
  <div key="msg1" className="text-center text-stone-800" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 200, fontSize: '2rem', letterSpacing: '0' }}>
    마뉴가입니다
  </div>,
  <div key="msg2" className="text-center text-stone-800" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 200, fontSize: '1.2rem', lineHeight: '1.6' }}>
    <div>당신의 하루를 살펴보고,</div>
    <div>필요한 영양소를 찾아드릴게요</div>
  </div>,
]

export default function Welcome() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // 이미 설문을 완료한 사용자는 바로 홈으로 리다이렉트
    const onboardingAnswers = localStorage.getItem('onboardingAnswers')
    if (onboardingAnswers) {
      navigate('/', { replace: true })
      return
    }
  }, [navigate])

  useEffect(() => {
    if (step < MESSAGES.length) {
      setOpacity(0)
      const fadeInTimer = setTimeout(() => setOpacity(1), 50)
      const fadeOutTimer = setTimeout(() => setOpacity(0), 1700)
      const nextTimer = setTimeout(() => setStep(step + 1), 2100)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }
  }, [step])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center relative">
      {step < MESSAGES.length ? (
        // 메시지 시퀀스만 표시 (버튼 없음)
        <div className="absolute left-0 right-0 px-8 w-full" style={{ top: '37%' }}>
          <div
            className="text-center transition-opacity duration-300"
            style={{ opacity }}
          >
            {MESSAGES[step]}
          </div>
        </div>
      ) : (
        // 최종 화면 - 절대 위치로 배치
        <div className="relative w-full min-h-screen">
          {/* 로고 + 텍스트: 상단 35% 지점 */}
          <div className="absolute left-0 right-0 w-full px-6" style={{ top: '35%' }}>
            <div className="flex flex-col items-center gap-3">
              {/* Logo */}
              <div className="flex items-center gap-3 justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-emerald-700 tracking-tight">MANUGA</span>
              </div>

              {/* Text */}
              <p className="text-stone-600 text-base">
                1분이면 충분해요
              </p>
            </div>
          </div>

          {/* Button: 상단 60% 지점 */}
          <div className="absolute left-0 right-0 px-6 w-full" style={{ top: '60%' }}>
            <div className="max-w-sm mx-auto">
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition-colors"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
