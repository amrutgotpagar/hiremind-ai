import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="footer-logo">
            HireMind <span className="navbar-logo-accent">AI</span>
          </p>
          <p className="footer-tagline">
            Practice interviews. Get AI feedback. Land the job.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/#features" className="navbar-link">
            Features
          </Link>
          <Link to="/#how-it-works" className="navbar-link">
            How It Works
          </Link>
          <Link to="/login" className="navbar-link">
            Log in
          </Link>
          <Link to="/signup" className="navbar-link">
            Sign Up
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HireMind AI. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer