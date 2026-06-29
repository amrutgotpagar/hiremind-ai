import ScoreRing from './ScoreRing'

function AtsScoreConstellation({ scores }) {
  const items = [
    { label: 'Keyword Match', value: scores.keywordMatch },
    { label: 'Formatting', value: scores.formatting },
    { label: 'Skills Coverage', value: scores.skillsCoverage },
    { label: 'Resume Strength', value: scores.resumeStrength },
    { label: 'Content Quality', value: scores.contentQuality },
    { label: 'Experience Relevance', value: scores.experienceRelevance },
  ]

  return (
    <div className="ats-constellation">
      {items.map((item) => (
        <ScoreRing key={item.label} label={item.label} score={item.value} size={104} />
      ))}
    </div>
  )
}

export default AtsScoreConstellation