import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { uploadResume, getMyResumes, generateQuestions } from '../api/resumes'
import { startInterview } from '../api/interviews'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB — matches backend Multer limit

function getFileName(filePath) {
  if (!filePath) return 'Resume'
  return filePath.split(/[\\/]/).pop()
}

function getQuestionText(q) {
  if (typeof q === 'string') return q
  if (q && typeof q === 'object') return q.question || q.text || JSON.stringify(q)
  return String(q)
}

function Resumes() {
  const [resumes, setResumes] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [error, setError] = useState('')
  const [generatingId, setGeneratingId] = useState(null)
  const [startingId, setStartingId] = useState(null)
  const [questionsByResume, setQuestionsByResume] = useState({})
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  async function fetchResumes() {
    setLoadingList(true)
    try {
      const res = await getMyResumes()
      setResumes(res.data.resumes || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resumes.')
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  function handleFileChange(e) {
    const file = e.target.files[0]
    setError('')
    if (!file) {
      setSelectedFile(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Max size is 5MB.')
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setError('')
    try {
      await uploadResume(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await fetchResumes()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleGenerateQuestions(resumeId) {
    setGeneratingId(resumeId)
    setError('')
    try {
      const res = await generateQuestions(resumeId)
      setQuestionsByResume((prev) => ({ ...prev, [resumeId]: res.data.questions || [] }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.')
    } finally {
      setGeneratingId(null)
    }
  }

  async function handleStartInterview(resumeId) {
    setStartingId(resumeId)
    setError('')
    try {
      const res = await startInterview(resumeId)
      navigate(`/interview/${res.data.interview._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Please try again.')
      setStartingId(null)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Resumes</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>

      <div className="upload-card">
        <div className="upload-drop-zone" onClick={() => fileInputRef.current?.click()}>
          <p>Click to select a PDF or DOC file (max 5MB)</p>
          {selectedFile && <p className="upload-filename">{selectedFile.name}</p>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="upload-file-input"
          onChange={handleFileChange}
        />

        {error && (
          <p className="form-error" style={{ marginTop: 'var(--space-3)' }}>
            {error}
          </p>
        )}

        <button className="upload-button" onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>

      <div className="page-header">
        <h3>Uploaded Resumes</h3>
        <button className="refresh-link" onClick={fetchResumes}>
          Refresh
        </button>
      </div>

      {loadingList ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p className="empty-state">No resumes uploaded yet.</p>
      ) : (
        <div className="resume-list">
          {resumes.map((resume) => (
            <div key={resume._id} className="resume-item">
              <div className="resume-row">
                <span className="resume-name">{getFileName(resume.filePath)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`status-badge status-${resume.status}`}>{resume.status}</span>
                  {resume.status === 'parsed' && (
                    <button
                      className="generate-button"
                      onClick={() => handleGenerateQuestions(resume._id)}
                      disabled={generatingId === resume._id}
                    >
                      {generatingId === resume._id ? 'Generating...' : 'Generate Questions'}
                    </button>
                  )}
                </div>
              </div>

              {questionsByResume[resume._id] && (
                <div className="questions-preview">
                  <p className="questions-preview-label">Generated Questions</p>
                  <ol className="questions-list">
                    {questionsByResume[resume._id].map((q, i) => (
                      <li key={i}>{getQuestionText(q)}</li>
                    ))}
                  </ol>
                  <button
                    className="upload-button"
                    style={{ marginTop: 'var(--space-4)' }}
                    onClick={() => handleStartInterview(resume._id)}
                    disabled={startingId === resume._id}
                  >
                    {startingId === resume._id ? 'Starting...' : 'Start Interview →'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Resumes