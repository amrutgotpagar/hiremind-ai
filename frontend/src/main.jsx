import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/navbar.css'
import './styles/landing.css'
import './styles/forms.css'
import './styles/resumes.css'
import './styles/interview.css'
import './styles/hr.css'
import './styles/dashboard-stats.css'
import './styles/three-hero.css'
import './styles/ats.css'
import './styles/roadmap.css'
import './styles/dashboard-layout.css'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)