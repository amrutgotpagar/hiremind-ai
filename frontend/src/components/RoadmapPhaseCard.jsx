function RoadmapPhaseCard({ phase }) {
  return (
    <div className="pipeline-step roadmap-phase-card">
      <span className="pipeline-step-number">Phase {phase.phaseNumber}</span>
      <h4>{phase.title}</h4>
      <p className="roadmap-phase-duration">{phase.estimatedWeeks} weeks</p>

      {phase.topics?.length > 0 && (
        <div className="roadmap-phase-section">
          <p className="roadmap-phase-section-label">Topics</p>
          <ul className="feedback-list">
            {phase.topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {phase.recommendedProjects?.length > 0 && (
        <div className="roadmap-phase-section">
          <p className="roadmap-phase-section-label">Recommended Projects</p>
          <ul className="feedback-list">
            {phase.recommendedProjects.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      {phase.recommendedCertifications?.length > 0 && (
        <div className="roadmap-phase-section">
          <p className="roadmap-phase-section-label">Certifications</p>
          <ul className="feedback-list">
            {phase.recommendedCertifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RoadmapPhaseCard