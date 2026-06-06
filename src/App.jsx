import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// New premium pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      fontFamily: 'DM Mono, monospace',
      fontSize: '12px',
      letterSpacing: '0.1em',
      color: 'var(--accent)',
    }}>
      ✦
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function Layout({ children, showNav = true }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {showNav && <Navbar />}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Landing — no navbar (has its own header) */}
          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />

          {/* Auth — no navbar */}
          <Route path="/login" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />

          {/* Protected routes — with navbar */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/calendar" element={
            <PrivateRoute>
              <Layout>
                <Calendar />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}