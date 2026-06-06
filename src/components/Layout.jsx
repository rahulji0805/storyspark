import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon, PenLine, LayoutDashboard, BookOpen, LogOut, Flame } from 'lucide-react'
import { useEntries } from '../hooks/useEntries'

export default function Layout() {
  const { signOut, user } = useAuth()
  const { theme, toggle } = useTheme()
  const { streak } = useEntries()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Writer'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--spark)' }}>
              <span className="text-white text-xs font-bold font-display">S</span>
            </div>
            <span className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
              StorySpark
            </span>
          </NavLink>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
              { to: '/timeline', icon: BookOpen, label: 'Timeline' },
            ].map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'hover:opacity-80'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'var(--spark)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                })}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'var(--spark-light)' }}>
                <Flame size={13} style={{ color: 'var(--spark)' }} />
                <span className="text-xs font-medium font-mono" style={{ color: 'var(--spark)' }}>{streak}</span>
              </div>
            )}

            {/* Write button */}
            <NavLink to="/new" className="btn-primary flex items-center gap-1.5 !py-1.5 !px-3 text-xs">
              <PenLine size={13} />
              <span className="hidden sm:inline">Write</span>
            </NavLink>

            {/* Theme toggle */}
            <button onClick={toggle} className="btn-ghost !px-2 !py-2 rounded-xl">
              {theme === 'dark'
                ? <Sun size={16} style={{ color: 'var(--text-muted)' }} />
                : <Moon size={16} style={{ color: 'var(--text-muted)' }} />
              }
            </button>

            {/* Sign out */}
            <button onClick={handleSignOut} className="btn-ghost !px-2 !py-2 rounded-xl" title="Sign out">
              <LogOut size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 page-enter">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t flex" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {[
          { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
          { to: '/new', icon: PenLine, label: 'Write' },
          { to: '/timeline', icon: BookOpen, label: 'Timeline' },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-body font-medium transition-colors ${
                isActive ? '' : ''
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--spark)' : 'var(--text-muted)',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
