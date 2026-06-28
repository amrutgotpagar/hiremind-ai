import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div style={{ padding: 'var(--space-7)', textAlign: 'center' }}>
      <h1>HireMind AI</h1>
      <p style={{ marginTop: 'var(--space-3)' }}>
        Your AI-powered interview copilot.
      </p>
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default Landing