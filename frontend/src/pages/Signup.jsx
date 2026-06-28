import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [hrInviteCode, setHrInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup({
        name,
        email,
        password,
        role,
        ...(role === 'hr' ? { hrInviteCode } : {}),
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
          Get started with AI-powered interview prep.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">I am signing up as</label>
            <div className="role-toggle">
              <button
                type="button"
                className={role === 'candidate' ? 'role-option role-option-active' : 'role-option'}
                onClick={() => setRole('candidate')}
              >
                Candidate
              </button>
              <button
                type="button"
                className={role === 'hr' ? 'role-option role-option-active' : 'role-option'}
                onClick={() => setRole('hr')}
              >
                HR
              </button>
            </div>
          </div>

          {role === 'hr' && (
            <div className="form-group">
              <label className="form-label" htmlFor="hrInviteCode">HR Invite Code</label>
              <input
                id="hrInviteCode"
                type="text"
                className="form-input"
                value={hrInviteCode}
                onChange={(e) => setHrInviteCode(e.target.value)}
                required
              />
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup