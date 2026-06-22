import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function CabinetGroup() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { cabinetItems, unmergeGroup, updateMemo } = useCabinet()
  const [groupItems, setGroupItems] = useState([])
  const [groupName, setGroupName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    const items = cabinetItems.filter((item) => item.groupId === groupId)
    setGroupItems(items)

    if (items.length > 0) {
      setGroupName(items[0].groupName || '')
      setEditingName(items[0].groupName || '')
    }
  }, [groupId, cabinetItems])

  if (groupItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-stone-500">그룹을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleSaveGroupName = () => {
    if (editingName.trim() && editingName !== groupName) {
      // 그룹의 모든 항목의 groupName 업데이트
      groupItems.forEach((item) => {
        updateMemo(item.name, item.memo) // 기존 메모 유지하면서 업데이트
      })
      setGroupName(editingName)
    }
    setIsEditing(false)
  }

  const handleUnmergeGroup = () => {
    unmergeGroup(groupId)
    navigate('/cabinet')
  }

  const handleItemClick = (name) => {
    navigate(`/cabinet/${encodeURIComponent(name)}`)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <button
          onClick={() => navigate('/cabinet')}
          className="text-stone-500 hover:text-stone-700"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-base font-bold text-stone-800">그룹 상세</span>
        </div>
        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6">
        {/* Group Name Section */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-5">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="그룹 이름"
                autoFocus
              />
              <button
                onClick={handleSaveGroupName}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditingName(groupName)
                }}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-200 text-stone-600 hover:bg-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 mb-0.5">그룹 이름</p>
                <p className="text-base font-semibold text-emerald-800">{groupName}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Group Items List */}
        <p className="text-xs font-semibold text-stone-400 mb-2">포함된 영양소</p>
        <div className="space-y-2.5 mb-6">
          {groupItems.map((item) => {
            const style =
              NUTRIENT_STYLE[item.name] || { icon: '💊', bg: 'bg-stone-100', color: 'text-stone-500' }
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl border border-stone-100 px-4 py-3.5 shadow-sm text-left transition-transform active:scale-95"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg}`}>
                  {style.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800">{item.name}</p>
                  {item.memo && <p className="text-xs text-stone-500 mt-0.5">{item.memo}</p>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Unmerge Button */}
        <button
          onClick={handleUnmergeGroup}
          className="w-full py-3 rounded-2xl border-2 border-rose-200 text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-colors"
        >
          그룹 해제
        </button>
      </div>
    </>
  )
}
