import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-7)', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default GuestRoute