import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Journal' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-ink-50/90 backdrop-blur-md dark:bg-ink-950/90"
      style={{ borderColor: '#dedad2' }}
    >
      <style>{`.dark header { border-color: #272420 !important; }`}</style>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <span className="text-lg logo-shimmer font-display font-semibold select-none">✦</span>
          <div>
            <span className="font-display text-xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
              StorySpark
            </span>
          </div>
        </Link>

        {/* Nav */}
        {user && (
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-medium transition-all ${
                  location.pathname === to
                    ? 'text-gold-500 border-b border-gold-500'
                    : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'
                }`}
                style={{ letterSpacing: '0.15em' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="btn-ghost p-2" aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {user && (
            <button
              onClick={handleSignOut}
              className="text-xs tracking-widest uppercase text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
              style={{ letterSpacing: '0.15em' }}
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </header>
  )
}