import { Link, useLocation } from 'react-router-dom'

const CANDIDATE_NAV = [
    { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
    { to: '/resumes', label: 'My Resumes', icon: '▤' },
    { to: '/ats', label: 'ATS Checker', icon: '◎' },
    { to: '/career-roadmap', label: 'AI Career Roadmap', icon: '↗', badge: 'NEW' },
]

const COMING_SOON_NAV = [
    { label: 'Mock Interviews', icon: '◐' },
    { label: 'AI Feedback', icon: '◇' },
    { label: 'Job Match', icon: '⬡' },
    { label: 'Company Insights', icon: '▥' },
    { label: 'Saved Jobs', icon: '♡' },
]

const HR_NAV = [
    { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
    { to: '/candidates', label: 'Candidates', icon: '▤' },
    { to: '/rankings', label: 'Rankings', icon: '↗' },
]

function DashboardSidebar({ role }) {
    const location = useLocation()
    const navItems = role === 'hr' ? HR_NAV : CANDIDATE_NAV

    return (
        <aside className="dash-sidebar">
            <Link to="/" className="dash-sidebar-logo">
                HireMind <span className="navbar-logo-accent">AI</span>
            </Link>

            <nav className="dash-sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`dash-sidebar-link ${location.pathname === item.to ? 'dash-sidebar-link-active' : ''}`}
                    >
                        <span className="dash-sidebar-icon">{item.icon}</span>
                        {item.label}
                        {item.badge && <span className="dash-sidebar-badge">{item.badge}</span>}
                    </Link>
                ))}

                {role !== 'hr' && (
                    <>
                        <p className="dash-sidebar-section-label">Coming Soon</p>
                        {COMING_SOON_NAV.map((item) => (
                            <div key={item.label} className="dash-sidebar-link dash-sidebar-link-disabled">
                                <span className="dash-sidebar-icon">{item.icon}</span>
                                {item.label}
                                <span className="dash-sidebar-badge dash-sidebar-badge-soon">Soon</span>
                            </div>
                        ))}
                    </>
                )}
            </nav>

            <div className="dash-sidebar-footer">
                <p className="dash-sidebar-footer-title">HireMind AI</p>
                <p className="dash-sidebar-footer-text">
                    AI Interview Copilot — built end-to-end with React, Node.js, MongoDB & Gemini.
                </p>
            </div>

        </aside>
    )
}

export default DashboardSidebar