import { createContext, useState, useEffect } from 'react'

export const CabinetContext = createContext()

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function CabinetProvider({ children }) {
  const [cabinetItems, setCabinetItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 localStorage에서 캐비닛 항목 로드
  useEffect(() => {
    const savedItems = localStorage.getItem('cabinetItems')
    if (savedItems) {
      try {
        setCabinetItems(JSON.parse(savedItems))
      } catch (error) {
        console.error('캐비닛 항목 로드 실패:', error)
        const defaultItems = [
          { name: '비타민B군', addedAt: '2025.08.20', memo: '' },
          { name: '비타민D', addedAt: '2025.08.23', memo: '' },
          { name: '오메가3', addedAt: '2025.08.21', memo: '' },
        ]
        setCabinetItems(defaultItems)
      }
    } else {
      const defaultItems = [
        { name: '비타민B군', addedAt: '2025.08.20', memo: '' },
        { name: '비타민D', addedAt: '2025.08.23', memo: '' },
        { name: '오메가3', addedAt: '2025.08.21', memo: '' },
      ]
      setCabinetItems(defaultItems)
    }
    setIsLoading(false)
  }, [])

  const addItem = (name) => {
    if (!cabinetItems.find((item) => item.name === name)) {
      const newItem = {
        name,
        addedAt: getTodayDate(),
        memo: '',
      }
      const updatedItems = [...cabinetItems, newItem]
      setCabinetItems(updatedItems)
      localStorage.setItem('cabinetItems', JSON.stringify(updatedItems))
    }
  }

  const removeItem = (name) => {
    const updatedItems = cabinetItems.filter((item) => item.name !== name)
    setCabinetItems(updatedItems)
    localStorage.setItem('cabinetItems', JSON.stringify(updatedItems))
  }

  const hasItem = (name) => {
    return cabinetItems.some((item) => item.name === name)
  }

  const updateMemo = (name, memo) => {
    const updatedItems = cabinetItems.map((item) =>
      item.name === name ? { ...item, memo } : item
    )
    setCabinetItems(updatedItems)
    localStorage.setItem('cabinetItems', JSON.stringify(updatedItems))
  }

  return (
    <CabinetContext.Provider
      value={{
        cabinetItems,
        isLoading,
        addItem,
        removeItem,
        hasItem,
        updateMemo,
      }}
    >
      {children}
    </CabinetContext.Provider>
  )
}
