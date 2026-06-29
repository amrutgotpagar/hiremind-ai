import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyResumes } from '../api/resumes'
import { analyzeResume } from '../api/ats'

function getFileName(filePath) {
  if (!filePath) return 'Resume'
  return filePath.split(/[\\/]/).pop()
}

function AtsChecker() {
  const [resumes, setResumes] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchResumes()
  }, [])

  async function fetchResumes() {
    setLoadingList(true)
    try {
      const res = await getMyResumes()
      const parsedOnly = (res.data.resumes || []).filter((r) => r.status === 'parsed')
      setResumes(parsedOnly)
      if (parsedOnly.length > 0) setSelectedResumeId(parsedOnly[0]._id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resumes.')
    } finally {
      setLoadingList(false)
    }
  }

  async function handleAnalyze(e) {
    e.preventDefault()
    if (!selectedResumeId) return
    setAnalyzing(true)
    setError('')
    try {
      const res = await analyzeResume(selectedResumeId, jobDescription)
      navigate(`/ats/${res.data.report._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
      setAnalyzing(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>ATS Resume Checker</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      <p className="interview-subtitle">
        Check how well your resume performs against real ATS screening — with or
        without a specific job description.
      </p>

      {loadingList ? (
        <p>Loading your resumes...</p>
      ) : resumes.length === 0 ? (
        <div className="upload-card">
          <p className="empty-state">
            No parsed resumes yet. Upload and parse a resume first.
          </p>
          <Link to="/resumes" className="upload-button" style={{ display: 'inline-block', marginTop: 'var(--space-4)', textAlign: 'center' }}>
            Go to My Resumes →
          </Link>
        </div>
      ) : (
        <form className="upload-card" onSubmit={handleAnalyze}>
          <div className="form-group">
            <label className="form-label" htmlFor="resumeSelect">Select Resume</label>
            <select
              id="resumeSelect"
              className="form-input"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {getFileName(r.filePath)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="jobDescription">
              Job Description <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="jobDescription"
              className="form-input qa-textarea"
              rows={8}
              placeholder="Paste a job description here to get a tailored keyword match score, or leave blank for a general ATS check."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="form-submit" disabled={analyzing}>
            {analyzing ? 'Analyzing your resume...' : 'Run ATS Check →'}
          </button>
        </form>
      )}
    </div>
  )
}

export default AtsChecker