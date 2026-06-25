import { useNavigate } from 'react-router-dom'
import { Pill, Plus, ChevronRight, X, Check } from 'lucide-react'
import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function Cabinet() {
  const navigate = useNavigate()
  const { cabinetItems, mergeItems } = useCabinet()
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [showTip, setShowTip] = useState(false)
  const touchTimerRef = useRef(null)

  useEffect(() => {
    const tipShown = localStorage.getItem('cabinetTipShown')
    if (!tipShown) {
      setShowTip(true)
    }
  }, [])

  const handleItemClick = (name) => {
    if (isEditMode) return
    navigate(`/cabinet/${encodeURIComponent(name)}`)
  }

  const handleGroupClick = (groupId) => {
    if (isEditMode) return
    navigate(`/cabinet/group/${groupId}`)
  }

  const handleAddClick = () => {
    navigate('/cabinet/add')
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    touchTimerRef.current = setTimeout(() => {
      setIsEditMode(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current)
    }
  }

  const wobbleVariants = {
    initial: {
      rotate: 0,
    },
    animate: {
      rotate: [-1, 1, -1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const handleItemSelect = (name) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    setSelectedItems(newSelected)
  }

  const handleMergeClick = () => {
    if (selectedItems.size < 2) return
    setShowMergeModal(true)
  }

  const handleMergeConfirm = () => {
    if (!groupName.trim()) return
    mergeItems(Array.from(selectedItems), groupName)
    setIsEditMode(false)
    setSelectedItems(new Set())
    setGroupName('')
    setShowMergeModal(false)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setSelectedItems(new Set())
  }

  // 그룹화된 항목과 개별 항목 분리
  const { groups, individualItems } = useMemo(() => {
    const groupMap = new Map()
    const individuals = []

    cabinetItems.forEach((item) => {
      if (item.groupId) {
        if (!groupMap.has(item.groupId)) {
          groupMap.set(item.groupId, {
            groupId: item.groupId,
            groupName: item.groupName,
            items: [],
          })
        }
        groupMap.get(item.groupId).items.push(item)
      } else {
        individuals.push(item)
      }
    })

    return {
      groups: Array.from(groupMap.values()),
      individualItems: individuals,
    }
  }, [cabinetItems])

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Pill className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-base font-bold text-stone-800">건강 캐비닛</span>
        </div>
        {isEditMode && (
          <button
            onClick={handleCancelEdit}
            className="text-stone-500 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-24">
        {/* Tip */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-emerald-50 rounded-2xl p-4 mb-4 flex items-start gap-3 border border-emerald-100"
            >
              <span className="text-2xl shrink-0">💊</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-800 mb-1">여러 영양소를 하나로 합칠 수 있어요</p>
                <p className="text-xs text-emerald-700">항목을 길게 눌러 편집 모드로 진입하세요</p>
              </div>
              <button
                onClick={() => {
                  setShowTip(false)
                  localStorage.setItem('cabinetTipShown', 'true')
                }}
                className="text-emerald-600 hover:text-emerald-700 shrink-0 mt-0.5"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2.5">
          {/* Group Items */}
          {groups.map((group) => (
            <motion.button
              key={group.groupId}
              onClick={() => handleGroupClick(group.groupId)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              variants={wobbleVariants}
              animate={isEditMode ? 'animate' : 'initial'}
              className={`w-full flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 shadow-sm text-left transition-all select-none touch-none ${
                isEditMode
                  ? 'border-stone-300 opacity-50 cursor-not-allowed'
                  : 'border-stone-100 active:scale-95'
              }`}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
              disabled={isEditMode}
            >
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5 text-emerald-600" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800">{group.groupName}</p>
                <p className="text-xs text-stone-500 mt-0.5 truncate">
                  {group.items.map((item) => item.name).join(', ')}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
            </motion.button>
          ))}

          {/* Individual Items */}
          {individualItems.map((item) => {
            const style = NUTRIENT_STYLE[item.name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
            const isSelected = selectedItems.has(item.name)

            return (
              <motion.button
                key={item.name}
                onClick={() => {
                  if (isEditMode) {
                    handleItemSelect(item.name)
                  } else {
                    handleItemClick(item.name)
                  }
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                variants={wobbleVariants}
                animate={isEditMode ? 'animate' : 'initial'}
                className={`w-full flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 shadow-sm text-left transition-all select-none touch-none ${
                  isSelected ? 'bg-emerald-50 border-emerald-300' : 'border-stone-100'
                } ${isEditMode ? 'active:scale-100' : 'active:scale-95'}`}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              >
                {isEditMode && (
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                )}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <span className="font-medium text-stone-800 flex-1">{item.name}</span>
                {!isEditMode && <ChevronRight className="w-4 h-4 text-stone-300" />}
              </motion.button>
            )
          })}

          {cabinetItems.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-10">담은 영양소가 없어요</p>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      {!isEditMode && (
        <button
          onClick={handleAddClick}
          className="absolute right-5 bottom-24 w-12 h-12 rounded-full bg-emerald-600 shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
          aria-label="영양소 추가"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Merge Button (Edit Mode) */}
      {isEditMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-5 py-4 bg-white border-t border-stone-200">
          <button
            onClick={handleMergeClick}
            disabled={selectedItems.size < 2}
            className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${
              selectedItems.size < 2
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            합치기
          </button>
        </div>
      )}

      {/* Merge Modal */}
      <AnimatePresence>
        {showMergeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMergeModal(false)}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
          >
            <motion.div
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 max-w-sm mx-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMergeModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-stone-800 mb-4">제품명 입력</h3>

                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="예: 센트룸 이뮨부스트"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 mb-4"
                  autoFocus
                />

                <p className="text-xs text-stone-500 mb-4">
                  선택된 영양소: {Array.from(selectedItems).join(', ')}
                </p>

                <button
                  onClick={handleMergeConfirm}
                  disabled={!groupName.trim()}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${
                    !groupName.trim()
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
