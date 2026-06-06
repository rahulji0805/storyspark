import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await signUp(form.email, form.password, form.name)
      if (error) setError(error.message)
      else setSuccess('Check your email to confirm your account, then sign in.')
    } else {
      const { error } = await signIn(form.email, form.password)
      if (error) setError(error.message)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 btn-ghost !px-2">
          <ArrowLeft size={15} />
          <span className="text-sm">Back</span>
        </Link>
        <button onClick={toggle} className="btn-ghost !px-2 !py-2">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--spark)' }}>
            <span className="text-white font-bold font-display text-xl">S</span>
          </div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome back' : 'Start your story'}
          </h1>
          <p className="text-sm mt-1 font-body" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to continue writing' : 'Create your free account'}
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium mb-1.5 font-body" style={{ color: 'var(--text-secondary)' }}>Your name</label>
                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={form.name}
                  onChange={update('name')}
                  required
                  className="input-field"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5 font-body" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 font-body" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  required
                  minLength={6}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-xl text-sm font-body" style={{ background: '#fee2e2', color: '#dc2626' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="px-3 py-2.5 rounded-xl text-sm font-body" style={{ background: '#dcfce7', color: '#16a34a' }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-sm mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Switch mode */}
        <p className="text-center text-sm font-body mt-5" style={{ color: 'var(--text-muted)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
            className="font-medium underline underline-offset-2"
            style={{ color: 'var(--spark)' }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
