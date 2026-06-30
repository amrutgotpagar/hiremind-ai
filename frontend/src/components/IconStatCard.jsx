import { Link } from 'react-router-dom'

function IconStatCard({ icon, label, value, linkTo, linkLabel, accentClass }) {
  return (
    <div className="icon-stat-card">
      <div className={`icon-stat-icon ${accentClass || ''}`}>{icon}</div>
      <p className="icon-stat-label">{label}</p>
      <p className="icon-stat-value">{value}</p>
      {linkTo && (
        <Link to={linkTo} className="icon-stat-link">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

export default IconStatCard