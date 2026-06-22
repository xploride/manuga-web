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
        const parsed = JSON.parse(savedItems)

        // 데이터 마이그레이션: 문자열 배열(구버전) → 객체 배열(신버전)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          // 구버전 데이터 (문자열 배열)를 신버전으로 변환
          const migratedItems = parsed.map((name) => ({
            name,
            addedAt: getTodayDate(),
            memo: '',
            source: 'manual',
            groupId: null,
            groupName: null,
          }))
          setCabinetItems(migratedItems)
          // 변환된 데이터 저장
          localStorage.setItem('cabinetItems', JSON.stringify(migratedItems))
        } else {
          // 신버전 데이터 (객체 배열)는 그대로 사용
          // groupId와 groupName이 없는 기존 항목들도 마이그레이션
          const migratedItems = parsed.map((item) => ({
            ...item,
            groupId: item.groupId !== undefined ? item.groupId : null,
            groupName: item.groupName !== undefined ? item.groupName : null,
          }))
          setCabinetItems(migratedItems)
          // 마이그레이션이 필요한 경우 저장
          if (JSON.stringify(migratedItems) !== JSON.stringify(parsed)) {
            localStorage.setItem('cabinetItems', JSON.stringify(migratedItems))
          }
        }
      } catch (error) {
        console.error('캐비닛 항목 로드 실패:', error)
        setCabinetItems([])
      }
    } else {
      setCabinetItems([])
    }
    setIsLoading(false)
  }, [])

  const addItem = (name, metadata = {}) => {
    setCabinetItems(prev => {
      if (prev.find(item => item.name === name)) return prev
      const newItem = {
        name,
        addedAt: getTodayDate(),
        memo: '',
        source: metadata.source || 'manual',
        groupId: null,
        groupName: null,
        ...(metadata.category && { category: metadata.category }),
        ...(metadata.relatedCategory && { relatedCategory: metadata.relatedCategory }),
        ...(metadata.reason && { reason: metadata.reason }),
      }
      const updated = [...prev, newItem]
      localStorage.setItem('cabinetItems', JSON.stringify(updated))
      return updated
    })
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

  const mergeItems = (itemNames, groupName) => {
    const groupId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const updatedItems = cabinetItems.map((item) => {
      if (itemNames.includes(item.name)) {
        return {
          ...item,
          groupId,
          groupName,
        }
      }
      return item
    })

    setCabinetItems(updatedItems)
    localStorage.setItem('cabinetItems', JSON.stringify(updatedItems))
    return groupId
  }

  const unmergeGroup = (groupId) => {
    const updatedItems = cabinetItems.map((item) => {
      if (item.groupId === groupId) {
        return {
          ...item,
          groupId: null,
          groupName: null,
        }
      }
      return item
    })

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
        mergeItems,
        unmergeGroup,
      }}
    >
      {children}
    </CabinetContext.Provider>
  )
}
