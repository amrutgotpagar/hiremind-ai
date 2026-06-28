import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        HireMind <span className="navbar-logo-accent">AI</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <Link to="/dashboard" className="navbar-cta">
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Log in
            </Link>
            <Link to="/signup" className="navbar-cta">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar