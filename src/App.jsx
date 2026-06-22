import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import RootGuard from './pages/RootGuard'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
import AnalysisDetail from './pages/AnalysisDetail'
import AnalysisResult from './pages/AnalysisResult'
import AnalysisReport from './pages/AnalysisReport'
import Cabinet from './pages/Cabinet'
import CabinetDetail from './pages/CabinetDetail'
import CabinetGroup from './pages/CabinetGroup'
import AddNutrient from './pages/AddNutrient'
import Onboarding from './pages/Onboarding'
import Welcome from './pages/Welcome'
import BottomNav from './components/BottomNav'

const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

const PageTransition = ({ children }) => {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      custom={1}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const showBottomNav = ['/', '/analysis', '/cabinet'].includes(location.pathname)
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/welcome" element={
          <PageTransition>
            <Welcome />
          </PageTransition>
        } />
        <Route path="/onboarding" element={
          <PageTransition>
            <Onboarding />
          </PageTransition>
        } />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-stone-50 flex justify-center py-8">
              <div className="w-full max-w-sm bg-stone-50 flex flex-col rounded-3xl overflow-hidden shadow-sm border border-stone-200 relative">
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={
                        <PageTransition>
                          <RootGuard />
                        </PageTransition>
                      } />
                      <Route path="/analysis" element={
                        <PageTransition>
                          <Analysis />
                        </PageTransition>
                      } />
                      <Route path="/analysis/:categoryKey" element={
                        <PageTransition>
                          <AnalysisDetail />
                        </PageTransition>
                      } />
                      <Route path="/analysis-result" element={
                        <PageTransition>
                          <AnalysisResult />
                        </PageTransition>
                      } />
                      <Route path="/analysis/report" element={
                        <PageTransition>
                          <AnalysisReport />
                        </PageTransition>
                      } />
                      <Route path="/cabinet" element={
                        <PageTransition>
                          <Cabinet />
                        </PageTransition>
                      } />
                      <Route path="/cabinet/add" element={
                        <PageTransition>
                          <AddNutrient />
                        </PageTransition>
                      } />
                      <Route path="/cabinet/group/:groupId" element={
                        <PageTransition>
                          <CabinetGroup />
                        </PageTransition>
                      } />
                      <Route path="/cabinet/:nutrientName" element={
                        <PageTransition>
                          <CabinetDetail />
                        </PageTransition>
                      } />
                    </Routes>
                  </AnimatePresence>
                </div>
                {showBottomNav && <BottomNav />}
              </div>
            </div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
