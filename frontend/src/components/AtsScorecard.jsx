const SECTION_LABELS = {
  contact: 'Contact Information',
  summary: 'Summary / Objective',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
}

function AtsScorecard({ sections, matchedKeywords, missingKeywords }) {
  return (
    <div className="ats-scorecard">
      <div className="scorecard-panel">
        <p className="scorecard-panel-title">Section Coverage</p>
        <div className="section-checklist">
          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <div key={key} className="section-check-item">
              <span className={sections[key] ? 'section-check-icon-present' : 'section-check-icon-missing'}>
                {sections[key] ? '✓' : '✕'}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scorecard-panel">
        <p className="scorecard-panel-title">Keyword Match</p>
        <div className="keyword-card" style={{ border: 'none', padding: 0 }}>
          <p className="keyword-card-title keyword-card-title-matched">Matched</p>
          <div className="keyword-pills">
            {matchedKeywords.length === 0 ? (
              <p className="empty-state">None matched</p>
            ) : (
              matchedKeywords.map((kw) => <span key={kw} className="keyword-pill keyword-pill-matched">{kw}</span>)
            )}
          </div>
        </div>
        <div className="keyword-card" style={{ border: 'none', padding: 0, marginTop: 'var(--space-4)' }}>
          <p className="keyword-card-title keyword-card-title-missing">Missing</p>
          <div className="keyword-pills">
            {missingKeywords.length === 0 ? (
              <p className="empty-state">None missing</p>
            ) : (
              missingKeywords.map((kw) => <span key={kw} className="keyword-pill keyword-pill-missing">{kw}</span>)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtsScorecard