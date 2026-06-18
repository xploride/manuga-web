import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 localStorage에서 사용자 정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email) => {
    const userData = { email, isLoggedIn: true, loginTime: new Date().toISOString() }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('onboardingAnswers')
    localStorage.removeItem('cabinetItems')
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}
