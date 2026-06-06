import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage({ type: 'success', text: 'Check your email to confirm your account.' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Left panel — decorative */}
      <div style={styles.leftPanel}>
        <div style={styles.leftInner}>
          <Link to="/" style={styles.logoBack}>← Back</Link>
          <div style={styles.leftContent}>
            <div style={styles.pullquote}>
              <div style={styles.pullquoteRule} />
              <p style={styles.pullquoteText}>
                "The act of writing is the act of discovering what you believe."
              </p>
              <p style={styles.pullquoteAttr}>— David Hare</p>
            </div>
          </div>
          <p style={styles.leftTagline}>✦ StorySpark — Your daily chronicle</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          {/* Mode toggle */}
          <div style={styles.modeToggle}>
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMessage(null) }}
                style={{
                  ...styles.modeBtn,
                  ...(mode === m ? styles.modeBtnActive : {}),
                }}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <div style={styles.formDivider} />

          {/* Heading */}
          <h1 style={styles.heading}>
            {mode === 'signin' ? (
              <>Welcome<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>back.</em></>
            ) : (
              <>Begin your<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>story.</em></>
            )}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={styles.input}
                autoComplete="email"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={styles.input}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {message && (
              <div style={{
                ...styles.message,
                ...(message.type === 'error' ? styles.messageError : styles.messageSuccess)
              }}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p style={styles.switchText}>
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null) }}
              style={styles.switchBtn}
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
  },
  leftPanel: {
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  },
  leftInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    justifyContent: 'space-between',
  },
  logoBack: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'rgba(247,245,240,0.5)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  leftContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  pullquote: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '360px',
  },
  pullquoteRule: {
    width: '40px',
    height: '2px',
    background: 'var(--accent)',
  },
  pullquoteText: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '28px',
    fontWeight: '300',
    fontStyle: 'italic',
    lineHeight: '1.4',
    color: 'var(--bg-primary)',
    opacity: 0.9,
  },
  pullquoteAttr: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.1em',
    opacity: 0.4,
  },
  leftTagline: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    opacity: 0.35,
  },
  rightPanel: {
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  modeToggle: {
    display: 'flex',
    gap: '0',
  },
  modeBtn: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '8px 20px',
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modeBtnActive: {
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    borderColor: 'var(--text-primary)',
  },
  formDivider: {
    height: '1px',
    background: 'var(--border)',
  },
  heading: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '48px',
    fontWeight: '400',
    lineHeight: '1.1',
    color: 'var(--text-primary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  input: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '12px 16px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s ease',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '2px',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
  },
  messageError: {
    background: 'rgba(180,50,50,0.1)',
    border: '1px solid rgba(180,50,50,0.3)',
    color: '#c04040',
  },
  messageSuccess: {
    background: 'var(--accent-glow)',
    border: '1px solid rgba(184,134,11,0.3)',
    color: 'var(--accent)',
  },
  submitBtn: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    letterSpacing: '0.06em',
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '2px',
    padding: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '4px',
    transition: 'opacity 0.2s ease',
  },
  switchText: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
}
