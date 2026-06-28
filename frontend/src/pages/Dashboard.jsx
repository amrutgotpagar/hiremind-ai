import { useAuth } from '../context/AuthContext'
import HRDashboardStats from '../components/HRDashboardStats'
import CandidateDashboardStats from '../components/CandidateDashboardStats'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 'var(--space-7)', maxWidth: '960px', margin: '0 auto' }}>
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
            Your resume, interview activity, and AI feedback at a glance.
          </p>
          <CandidateDashboardStats />
        </div>
      )}

      {user?.role === 'hr' && (
        <div>
          <h3>HR Dashboard</h3>
          <p style={{ marginTop: 'var(--space-3)' }}>
            Overview of candidates, interview performance, and rankings.
          </p>
          <HRDashboardStats />
        </div>
      )}
    </div>
  )
}

export default Dashboard