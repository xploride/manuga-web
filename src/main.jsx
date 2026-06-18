import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext'
import { CabinetProvider } from './contexts/CabinetContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <OnboardingProvider>
          <CabinetProvider>
            <App />
          </CabinetProvider>
        </OnboardingProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
