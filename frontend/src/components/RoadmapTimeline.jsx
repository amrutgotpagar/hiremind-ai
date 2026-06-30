import { useEffect, useRef, useState } from 'react'

function TimelinePhase({ phase, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`timeline-node ${visible ? 'timeline-node-visible' : ''}`}>
      <div className="timeline-node-marker">
        <span className="timeline-node-number">{phase.phaseNumber}</span>
      </div>
      <div className="timeline-node-card">
        <div className="timeline-node-header">
          <h4>{phase.title}</h4>
          <span className="roadmap-phase-duration">{phase.estimatedWeeks} weeks</span>
        </div>

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
    </div>
  )
}

function RoadmapTimeline({ phases }) {
  return (
    <div className="timeline-track">
      <div className="timeline-line" />
      {phases.map((phase, i) => (
        <TimelinePhase key={phase._id || phase.phaseNumber} phase={phase} index={i} />
      ))}
    </div>
  )
}

export default RoadmapTimeline