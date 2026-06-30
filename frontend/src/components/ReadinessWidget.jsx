import { Link } from 'react-router-dom'
import ScoreRing from './ScoreRing'

function ReadinessWidget({ roadmap }) {
  if (!roadmap) {
    return (
      <div className="dash-panel">
        <p className="dash-panel-title">Career Readiness</p>
        <p className="empty-state">
          Generate your first AI Career Roadmap to see your readiness score.
        </p>
        <Link to="/career-roadmap" className="dash-panel-cta">
          Generate Roadmap →
        </Link>
      </div>
    )
  }

  const critical = roadmap.missingSkills.filter((s) => s.urgency === 'critical').length
  const important = roadmap.missingSkills.filter((s) => s.urgency === 'important').length
  const niceToHave = roadmap.missingSkills.filter((s) => s.urgency === 'nice-to-have').length
  const hasGapData = roadmap.missingSkills.length > 0

  return (
    <div className="dash-panel dash-panel-readiness">
      <p className="dash-panel-title">Career Readiness</p>
      <p className="readiness-target">{roadmap.targetRole} at {roadmap.targetCompany}</p>

      <div className="readiness-ring-row">
        <ScoreRing label="Readiness" score={roadmap.readinessScore} size={128} />
        <div className="readiness-gap-bars">
          {hasGapData ? (
            <>
              <div className="readiness-gap-row">
                <span className="readiness-gap-dot urgency-dot-critical" />
                <span className="readiness-gap-label">Critical Gaps</span>
                <span className="readiness-gap-count">{critical}</span>
              </div>
              <div className="readiness-gap-row">
                <span className="readiness-gap-dot urgency-dot-important" />
                <span className="readiness-gap-label">Important Gaps</span>
                <span className="readiness-gap-count">{important}</span>
              </div>
              <div className="readiness-gap-row">
                <span className="readiness-gap-dot urgency-dot-nice" />
                <span className="readiness-gap-label">Nice-to-Have</span>
                <span className="readiness-gap-count">{niceToHave}</span>
              </div>
            </>
          ) : (
            <p className="readiness-no-gaps">
              No specific skill gaps logged for this roadmap yet.
            </p>
          )}
        </div>
      </div>

      <Link to={`/career-roadmap/${roadmap._id}`} className="dash-panel-cta">
        View Full Roadmap →
      </Link>
    </div>
  )
}

export default ReadinessWidget