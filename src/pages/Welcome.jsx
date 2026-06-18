import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-stone-50 flex justify-center items-center py-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-5xl font-bold">
            <span className="text-emerald-600">M</span>
            <span className="text-stone-800">ANUGA</span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 text-left">
          <p className="text-base text-stone-800 leading-relaxed whitespace-pre-wrap">
            안녕하세요! 마뉴가입니다.
          </p>
          <p className="text-base text-stone-700 leading-relaxed mt-4">
            마뉴가는 당신의 생활패턴(컴퓨터 사용 시간, 운동, 수면 등)을 바탕으로 지금 당신에게 필요할 수 있는 영양소를 찾아드려요.
          </p>
          <p className="text-base text-stone-700 leading-relaxed mt-4">
            점수나 진단이 아니라, 당신의 하루에 맞는 제안이에요.
          </p>
          <p className="text-base text-stone-700 leading-relaxed mt-4">
            1분이면 충분해요.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
