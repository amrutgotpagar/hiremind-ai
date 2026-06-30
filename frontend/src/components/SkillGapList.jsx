const URGENCY_ORDER = { critical: 0, important: 1, 'nice-to-have': 2 }
const URGENCY_LABELS = { critical: 'Critical', important: 'Important', 'nice-to-have': 'Nice to Have' }

function SkillGapList({ currentSkills, missingSkills }) {
  const sorted = [...(missingSkills || [])].sort(
    (a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]
  )

  return (
    <div className="keyword-columns">
      <div className="keyword-card">
        <p className="keyword-card-title keyword-card-title-matched">Current Skills</p>
        <div className="keyword-pills">
          {currentSkills.length === 0 ? (
            <p className="empty-state">None listed</p>
          ) : (
            currentSkills.map((s) => (
              <span key={s} className="keyword-pill keyword-pill-matched">{s}</span>
            ))
          )}
        </div>
      </div>
      <div className="keyword-card">
        <p className="keyword-card-title keyword-card-title-missing">Skills to Develop</p>
        {sorted.length === 0 ? (
          <p className="empty-state">None — you're well covered!</p>
        ) : (
          <div className="urgency-groups">
            {['critical', 'important', 'nice-to-have'].map((level) => {
              const items = sorted.filter((s) => s.urgency === level)
              if (items.length === 0) return null
              return (
                <div key={level} className="urgency-group">
                  <p className={`urgency-group-label urgency-${level}`}>{URGENCY_LABELS[level]}</p>
                  <div className="keyword-pills">
                    {items.map((s) => (
                      <span key={s._id || s.skill} className={`keyword-pill urgency-pill-${level}`}>
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillGapList