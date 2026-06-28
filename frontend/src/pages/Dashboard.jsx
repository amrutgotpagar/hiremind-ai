import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 'var(--space-7)', maxWidth: '720px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Signed in as <span style={{ color: 'var(--color-accent)' }}>{user?.role}</span>
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Log Out
        </button>
      </div>

{user?.role === 'candidate' && (
  <div>
    <h3>Candidate Dashboard</h3>
    <p style={{ marginTop: 'var(--space-3)' }}>
      Upload your resume, generate interview questions, and practice with AI feedback.
    </p>
    <Link
      to="/resumes"
      style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}
    >
      Go to My Resumes →
    </Link>
  </div>
)}

      {user?.role === 'hr' && (
        <div>
          <h3>HR Dashboard</h3>
          <p style={{ marginTop: 'var(--space-3)' }}>
            View candidates, review interview results, and see rankings.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard