import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Home from './Home'

export default function RootGuard() {
  const navigate = useNavigate()

  useEffect(() => {
    const onboardingAnswers = localStorage.getItem('onboardingAnswers')
    if (!onboardingAnswers) {
      navigate('/welcome', { replace: true })
    }
  }, [navigate])

  const onboardingAnswers = localStorage.getItem('onboardingAnswers')

  if (!onboardingAnswers) {
    return null
  }

  return <Home />
}
