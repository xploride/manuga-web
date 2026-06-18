import { Routes, Route, useLocation } from 'react-router-dom'
import RootGuard from './pages/RootGuard'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
import AnalysisDetail from './pages/AnalysisDetail'
import AnalysisResult from './pages/AnalysisResult'
import AnalysisReport from './pages/AnalysisReport'
import Cabinet from './pages/Cabinet'
import CabinetDetail from './pages/CabinetDetail'
import AddNutrient from './pages/AddNutrient'
import Onboarding from './pages/Onboarding'
import BottomNav from './components/BottomNav'

function App() {
  const location = useLocation()
  const showBottomNav = ['/', '/analysis', '/cabinet'].includes(location.pathname)
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-stone-50 flex justify-center py-8">
            <div className="w-full max-w-sm bg-stone-50 flex flex-col rounded-3xl overflow-hidden shadow-sm border border-stone-200 relative">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<RootGuard />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/analysis/:categoryKey" element={<AnalysisDetail />} />
                  <Route path="/analysis-result" element={<AnalysisResult />} />
                  <Route path="/analysis/report" element={<AnalysisReport />} />
                  <Route path="/cabinet" element={<Cabinet />} />
                  <Route path="/cabinet/:nutrientName" element={<CabinetDetail />} />
                  <Route path="/cabinet/add" element={<AddNutrient />} />
                </Routes>
              </div>
              {showBottomNav && <BottomNav />}
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
