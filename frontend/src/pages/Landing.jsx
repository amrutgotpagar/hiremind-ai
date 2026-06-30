import { useEffect, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NeuralHero from '../components/NeuralHero'

const pipelineSteps = [
  {
    step: '01',
    title: 'Upload Resume',
    description: 'Upload your resume as a PDF or DOC file.',
  },
  {
    step: '02',
    title: 'AI Parses It',
    description: 'We extract the text and structure from your resume automatically.',
  },
  {
    step: '03',
    title: 'AI Generates Questions',
    description: 'Gemini reads your real experience and writes interview questions tailored to it.',
  },
  {
    step: '04',
    title: 'You Answer',
    description: 'Answer each question in your own words, at your own pace.',
  },
  {
    step: '05',
    title: 'AI Evaluates & Scores',
    description: 'Get an overall score plus detailed feedback on every answer.',
  },
]

function Landing() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location])

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

        <NeuralHero />

        <div className="hero-actions">
          <Link to="/signup" className="hero-cta-primary">
            Start Practicing →
          </Link>
          <Link to="/login" className="hero-cta-secondary">
            Log In
          </Link>
        </div>
      </section>

      <section id="features" className="features">
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

      <section id="how-it-works" className="pipeline">
        <p className="pipeline-eyebrow">How It Works</p>
        <h2 className="pipeline-heading">From resume to feedback, in five steps</h2>
        <div className="pipeline-track">
          {pipelineSteps.map((step, i) => (
            <Fragment key={step.step}>
              <div className="pipeline-step">
                <span className="pipeline-step-number">{step.step}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              {i < pipelineSteps.length - 1 && <span className="pipeline-arrow">→</span>}
            </Fragment>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing