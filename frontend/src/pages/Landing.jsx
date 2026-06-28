import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Landing() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <p className="hero-eyebrow">AI-Powered Interview Copilot</p>
        <h1 className="hero-headline">
          Practice interviews.
          <br />
          Get hired <span className="hero-underline">smarter.</span>
        </h1>
        <p className="hero-subtext">
          Upload your resume, let AI generate questions tailored to your experience,
          and get scored feedback before you walk into the real thing.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="hero-cta-primary">
            Start Practicing →
          </Link>
          <Link to="/login" className="hero-cta-secondary">
            Log In
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-number">01</span>
          <h3>Resume-Aware Questions</h3>
          <p>
            AI reads your actual resume and generates interview questions specific
            to your real projects and experience — not generic templates.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-number">02</span>
          <h3>Instant AI Feedback</h3>
          <p>
            Answer each question, then get an overall score plus per-question
            feedback on what worked and what to improve.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-number">03</span>
          <h3>Built for Recruiters Too</h3>
          <p>
            HR teams can review candidates, dig into full interview transcripts,
            and see rankings sorted by performance.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Landing