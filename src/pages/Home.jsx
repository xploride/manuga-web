import { useState, useEffect } from 'react'
import { Leaf, Bell, Check, Droplet, Pill } from 'lucide-react'
import { useCabinet } from '../hooks/useCabinet'

const NUTRIENT_STYLE = {
  "비타민B군": { icon: "⚡", bg: "bg-emerald-50", color: "text-emerald-600" },
  "비타민D": { icon: "☀️", bg: "bg-amber-50", color: "text-amber-500" },
  "오메가3": { icon: "💧", bg: "bg-blue-50", color: "text-blue-500" },
  "비타민C": { icon: "🍊", bg: "bg-orange-50", color: "text-orange-500" },
  "루테인": { icon: "👁️", bg: "bg-emerald-50", color: "text-emerald-600" },
  "유산균": { icon: "💧", bg: "bg-purple-50", color: "text-purple-500" },
  "마그네슘": { icon: "🌙", bg: "bg-indigo-50", color: "text-indigo-500" },
  "아연": { icon: "⚡", bg: "bg-cyan-50", color: "text-cyan-600" },
  "단백질": { icon: "⚡", bg: "bg-rose-50", color: "text-rose-500" },
}

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getYesterdayDateString() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function calculateStreak(streakDates) {
  if (!streakDates || streakDates.length === 0) return 0

  const today = getTodayDateString()
  const sortedDates = [...streakDates].sort().reverse()

  let streak = 0
  let currentDate = new Date(today)

  for (const dateStr of sortedDates) {
    const checkDate = new Date(dateStr)
    const expectedDate = new Date(currentDate)

    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (checkDate.getTime() < expectedDate.getTime()) {
      break
    }
  }

  return streak
}

export default function Home() {
  const { cabinetItems } = useCabinet()
  const [homeItems, setHomeItems] = useState([])
  const [streakDays, setStreakDays] = useState(0)

  // 캐비닛 항목이 변경될 때 및 마운트될 때 초기화
  useEffect(() => {
    const savedChecks = localStorage.getItem('homeChecks')
    const checks = savedChecks ? JSON.parse(savedChecks) : {}

    const items = cabinetItems.map((item, idx) => ({
      id: idx,
      name: item.name,
      checked: checks[item.name] || false,
    }))
    setHomeItems(items)

    // 스트릭 계산
    const streakDates = JSON.parse(localStorage.getItem('streakDates') || '[]')
    const streak = calculateStreak(streakDates)
    setStreakDays(streak)
  }, [cabinetItems])

  const toggleHomeItem = (id) => {
    setHomeItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
      // 체크 상태를 localStorage에 저장
      const checks = {}
      updated.forEach((item) => {
        checks[item.name] = item.checked
      })
      localStorage.setItem('homeChecks', JSON.stringify(checks))

      // 하나라도 체크되면 오늘 날짜를 streakDates에 추가
      const checkedAny = updated.some((item) => item.checked)
      if (checkedAny) {
        const streakDates = JSON.parse(localStorage.getItem('streakDates') || '[]')
        const today = getTodayDateString()
        if (!streakDates.includes(today)) {
          streakDates.push(today)
          localStorage.setItem('streakDates', JSON.stringify(streakDates))

          // 스트릭 재계산
          const streak = calculateStreak(streakDates)
          setStreakDays(streak)
        }
      }

      return updated
    })
  }

  const checkedCount = homeItems.filter((i) => i.checked).length
  const progress = homeItems.length ? (checkedCount / homeItems.length) * 100 : 0

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-lg font-bold text-emerald-700 tracking-tight">MANUGA</span>
        </div>
        <button className="text-stone-400 hover:text-stone-600" aria-label="알림">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        <h2 className="text-base font-semibold text-stone-800 mb-3">오늘의 건강 관리</h2>

        {/* Checklist */}
        <div className="space-y-2.5">
          {homeItems.map((item) => {
            const style = NUTRIENT_STYLE[item.name] || { bg: "bg-stone-100", color: "text-stone-500" }
            return (
              <button
                key={item.id}
                onClick={() => toggleHomeItem(item.id)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <span
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <span className={`font-medium ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-stone-200 rounded-full my-5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-emerald-500" />
            <span>{checkedCount} / {homeItems.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-emerald-500" />
            <span>{streakDays}일째</span>
          </div>
        </div>
      </div>
    </>
  )
}
