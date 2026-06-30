import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateRoadmap } from '../api/careerRoadmap'

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Uber', 'Netflix', 'OpenAI', 'Other']
const ROLES = ['Software Engineer', 'Frontend Developer', 'Full Stack Developer', 'Data Analyst', 'AI Engineer', 'Other']
const EXPERIENCE_LEVELS = [
  { value: 'student', label: 'Student' },
  { value: 'fresher', label: 'Fresher / New Grad' },
  { value: '1-3 years', label: '1-3 Years Experience' },
  { value: '3+ years', label: '3+ Years Experience' },
]

function CareerRoadmap() {
  const [targetCompany, setTargetCompany] = useState('Google')
  const [customCompany, setCustomCompany] = useState('')
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [customRole, setCustomRole] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [currentProjects, setCurrentProjects] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('fresher')
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear())
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(10)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setGenerating(true)

    const finalCompany = targetCompany === 'Other' ? customCompany.trim() : targetCompany
    const finalRole = targetRole === 'Other' ? customRole.trim() : targetRole

    if (!finalCompany || !finalRole) {
      setError('Please enter a company and role.')
      setGenerating(false)
      return
    }

    try {
      const res = await generateRoadmap({
        targetCompany: finalCompany,
        targetRole: finalRole,
        currentSkills,
        currentProjects,
        experienceLevel,
        graduationYear: Number(graduationYear),
        weeklyStudyHours: Number(weeklyStudyHours),
      })
      navigate(`/career-roadmap/${res.data.roadmap._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate roadmap. Please try again.')
      setGenerating(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>AI Career Roadmap</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      <p className="interview-subtitle">
        Tell us where you're headed, and get a personalized, honest roadmap to get there.
      </p>

      <form className="upload-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="targetCompany">Target Company</label>
          <select
            id="targetCompany"
            className="form-input"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {targetCompany === 'Other' && (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: 'var(--space-3)' }}
              placeholder="Enter company name"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              required
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="targetRole">Target Role</label>
          <select
            id="targetRole"
            className="form-input"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {targetRole === 'Other' && (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: 'var(--space-3)' }}
              placeholder="Enter role title"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              required
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentSkills">Current Skills</label>
          <input
            id="currentSkills"
            type="text"
            className="form-input"
            placeholder="e.g. JavaScript, React, Node.js, MongoDB"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
          />
          <p className="qa-hint">Separate skills with commas.</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentProjects">Current Projects</label>
          <textarea
            id="currentProjects"
            className="form-input qa-textarea"
            rows={4}
            placeholder="Briefly describe what you've built so far..."
            value={currentProjects}
            onChange={(e) => setCurrentProjects(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experienceLevel">Experience Level</label>
          <select
            id="experienceLevel"
            className="form-input"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            {EXPERIENCE_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="graduationYear">Graduation Year</label>
          <input
            id="graduationYear"
            type="number"
            className="form-input"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            min="2015"
            max="2035"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="weeklyStudyHours">Weekly Study Hours</label>
          <input
            id="weeklyStudyHours"
            type="number"
            className="form-input"
            value={weeklyStudyHours}
            onChange={(e) => setWeeklyStudyHours(e.target.value)}
            min="1"
            max="80"
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="form-submit" disabled={generating}>
          {generating ? 'Generating your roadmap...' : 'Generate Roadmap →'}
        </button>
      </form>
    </div>
  )
}

export default CareerRoadmap