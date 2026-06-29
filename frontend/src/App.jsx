import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Resumes from './pages/Resumes'
import Interview from './pages/Interview'
import AtsChecker from './pages/AtsChecker'
import AtsReport from './pages/AtsReport'
import Candidates from './pages/Candidates'
import CandidateDetail from './pages/CandidateDetail'
import Rankings from './pages/Rankings'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Resumes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <AtsChecker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats/:id"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <AtsReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidates"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <CandidateDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rankings"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <Rankings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App