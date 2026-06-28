import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCandidates } from '../api/hr'

function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    setLoading(true)
    setError('')
    try {
      const res = await getCandidates()
      setCandidates(res.data.candidates || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidates.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Candidates</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="empty-state">No candidates yet.</p>
      ) : (
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <Link key={candidate._id} to={`/candidates/${candidate._id}`} className="candidate-row">
              <div>
                <p className="candidate-name">{candidate.name || 'Unnamed Candidate'}</p>
                <p className="candidate-email">{candidate.email}</p>
              </div>
              <span style={{ color: 'var(--color-accent)' }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Candidates