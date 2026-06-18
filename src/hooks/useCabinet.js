import { useContext } from 'react'
import { CabinetContext } from '../contexts/CabinetContext'

export function useCabinet() {
  const context = useContext(CabinetContext)
  if (!context) {
    throw new Error('useCabinet must be used within CabinetProvider')
  }
  return context
}
