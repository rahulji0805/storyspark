import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { dark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const navLinks = [
    { path: '/dashboard', label: 'Journal' },
    { path: '/calendar', label: 'Archive' },
    { path: '/profile', label: 'Profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      {/* Left — Logo */}
      <Link to={user ? '/dashboard' : '/'} style={styles.logo}>
        <span style={styles.logoMark}>✦</span>
        <span style={styles.logoText}>StorySpark</span>
      </Link>

      {/* Center — Nav links */}
      {user && (
        <div style={styles.links}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...styles.link,
                ...(isActive(path) ? styles.linkActive : {}),
              }}
            >
              {label}
              {isActive(path) && <span style={styles.linkDot} />}
            </Link>
          ))}
        </div>
      )}

      {/* Right — Actions */}
      <div style={styles.actions}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={styles.iconBtn}
          title={dark ? 'Light mode' : 'Dark mode'}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {user ? (
          <button onClick={handleSignOut} style={styles.signOutBtn}>
            Sign out
          </button>
        ) : (
          <Link to="/auth" style={styles.signInBtn}>
            Begin →
          </Link>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '64px',
    background: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flex: '1',
  },
  logoMark: {
    fontSize: '14px',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  logoText: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '20px',
    fontWeight: '500',
    letterSpacing: '0.02em',
    color: 'var(--text-primary)',
  },
  links: {
    display: 'flex',
    gap: '36px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  link: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s ease',
  },
  linkActive: {
    color: 'var(--text-primary)',
  },
  linkDot: {
    display: 'block',
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  signOutBtn: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '7px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  signInBtn: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--bg-primary)',
    background: 'var(--text-primary)',
    border: 'none',
    borderRadius: '2px',
    padding: '8px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
}