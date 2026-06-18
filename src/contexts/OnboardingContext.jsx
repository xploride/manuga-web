import { createContext, useState, useEffect } from 'react'

export const OnboardingContext = createContext()

export function OnboardingProvider({ children }) {
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastAnalysisDate, setLastAnalysisDate] = useState(null)

  // 앱 시작 시 localStorage에서 설문 답변 로드
  useEffect(() => {
    const savedAnswers = localStorage.getItem('onboardingAnswers')
    const savedDate = localStorage.getItem('lastAnalysisDate')
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers))
      } catch (error) {
        console.error('설문 답변 로드 실패:', error)
      }
    }
    if (savedDate) {
      setLastAnalysisDate(new Date(savedDate))
    }
    setIsLoading(false)
  }, [])

  const saveAnswers = (newAnswers) => {
    setAnswers(newAnswers)
    localStorage.setItem('onboardingAnswers', JSON.stringify(newAnswers))
    const now = new Date()
    setLastAnalysisDate(now)
    localStorage.setItem('lastAnalysisDate', now.toISOString())
  }

  const clearAnswers = () => {
    setAnswers({})
    localStorage.removeItem('onboardingAnswers')
    localStorage.removeItem('lastAnalysisDate')
    setLastAnalysisDate(null)
  }

  return (
    <OnboardingContext.Provider
      value={{
        answers,
        isLoading,
        lastAnalysisDate,
        saveAnswers,
        clearAnswers,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}
