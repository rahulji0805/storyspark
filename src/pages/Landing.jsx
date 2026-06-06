import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef } from 'react'

export default function Landing() {
  const { dark, toggleTheme } = useTheme()
  const heroRef = useRef(null)

  useEffect(() => {
    document.title = 'StorySpark — Your Daily Chronicle'
  }, [])

  return (
    <div style={styles.page}>
      {/* Minimal top bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logoMark}>✦ StorySpark</span>
          <div style={styles.headerRight}>
            <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Toggle theme">
              {dark ? '◑' : '◐'}
            </button>
            <Link to="/auth" style={styles.headerCta}>Begin writing →</Link>
          </div>
        </div>
      </header>

      {/* Gold rule */}
      <div style={styles.goldRule} />

      {/* Hero */}
      <main style={styles.hero} ref={heroRef}>
        <div style={styles.heroInner}>

          {/* Eyebrow */}
          <p style={styles.eyebrow}>
            <span style={styles.eyebrowDot}>✦</span>
            A journal for the present moment
          </p>

          {/* Headline */}
          <h1 style={styles.headline}>
            Every day,<br />
            <em style={styles.headlineItalic}>a new chapter</em><br />
            begins.
          </h1>

          {/* Sub */}
          <p style={styles.sub}>
            StorySpark is a private space to record your wins, reflections,
            and quiet moments — and watch your story build, one day at a time.
          </p>

          {/* CTA group */}
          <div style={styles.ctaGroup}>
            <Link to="/auth" style={styles.ctaPrimary}>
              Start your story
            </Link>
            <span style={styles.ctaDivider}>—</span>
            <span style={styles.ctaNote}>Free. Private. Yours.</span>
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            {[
              { num: '365', label: 'Days to fill' },
              { num: '∞', label: 'Stories inside you' },
              { num: '1', label: 'Entry a day' },
            ].map(({ num, label }) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statNum}>{num}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative right column */}
        <div style={styles.heroRight}>
          <div style={styles.mockCard}>
            <div style={styles.mockDate}>Saturday, June 7</div>
            <div style={styles.mockTitle}>Today I learned something about patience.</div>
            <div style={styles.mockBody}>
              The project took longer than expected, but when I finally got it right — 
              the satisfaction was unlike anything else. Some things can't be rushed.
            </div>
            <div style={styles.mockTags}>
              <span style={styles.mockTag}>✦ Growth</span>
              <span style={styles.mockTag}>✦ Grateful</span>
            </div>
            <div style={styles.mockStreak}>🔥 12 day streak</div>
          </div>

          {/* Floating accent card */}
          <div style={styles.accentCard}>
            <span style={styles.accentCardNum}>47</span>
            <span style={styles.accentCardLabel}>entries written</span>
          </div>
        </div>
      </main>

      {/* Gold rule */}
      <div style={styles.goldRule} />

      {/* Features */}
      <section style={styles.features}>
        <p style={styles.featuresLabel}>What StorySpark gives you</p>
        <div style={styles.featuresGrid}>
          {[
            {
              icon: '✍️',
              title: 'Daily writing space',
              desc: 'A clean, distraction-free editor to capture your moment of the day.'
            },
            {
              icon: '📅',
              title: 'Calendar archive',
              desc: 'Browse your past entries by month. Every day you wrote, illuminated.'
            },
            {
              icon: '🔥',
              title: 'Streak tracking',
              desc: 'Build the habit. Your streak grows with every entry — don\'t break the chain.'
            },
            {
              icon: '🏷️',
              title: 'Mood & tags',
              desc: 'Label entries with how you felt. Grateful, proud, reflective — your emotional map.'
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{icon}</div>
              <h3 style={styles.featureTitle}>{title}</h3>
              <p style={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomCtaHeadline}>
          Your story is<br /><em>already happening.</em>
        </h2>
        <Link to="/auth" style={styles.ctaPrimary}>
          Open your journal
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>✦ StorySpark</span>
        <span style={{ color: 'var(--text-muted)' }}>A daily chronicle</span>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  header: {
    padding: '0 40px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoMark: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '18px',
    fontWeight: '500',
    letterSpacing: '0.02em',
    color: 'var(--accent)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  themeBtn: {
    fontSize: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    lineHeight: 1,
  },
  headerCta: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    textDecoration: 'none',
  },
  goldRule: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
    opacity: 0.3,
    margin: '0 40px',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    padding: '100px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'center',
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  eyebrow: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  eyebrowDot: {
    fontSize: '10px',
  },
  headline: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(52px, 6vw, 80px)',
    fontWeight: '400',
    lineHeight: '1.05',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  headlineItalic: {
    fontStyle: 'italic',
    fontWeight: '300',
    color: 'var(--accent)',
  },
  sub: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '16px',
    lineHeight: '1.7',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    fontWeight: '300',
  },
  ctaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  ctaPrimary: {
    display: 'inline-block',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--bg-primary)',
    background: 'var(--text-primary)',
    padding: '14px 32px',
    textDecoration: 'none',
    borderRadius: '2px',
    fontWeight: '500',
    transition: 'opacity 0.2s ease',
  },
  ctaDivider: {
    color: 'var(--text-muted)',
    fontSize: '18px',
  },
  ctaNote: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
  },
  statsRow: {
    display: 'flex',
    gap: '40px',
    paddingTop: '8px',
    borderTop: '1px solid var(--border)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '32px',
    fontWeight: '400',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  heroRight: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '36px',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mockDate: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
  },
  mockTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '22px',
    fontWeight: '400',
    lineHeight: 1.3,
    color: 'var(--text-primary)',
  },
  mockBody: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    fontWeight: '300',
  },
  mockTags: {
    display: 'flex',
    gap: '8px',
  },
  mockTag: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
    padding: '4px 10px',
    borderRadius: '2px',
  },
  mockStreak: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '12px',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
  },
  accentCard: {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    background: 'var(--accent)',
    borderRadius: '4px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: 'var(--shadow-md)',
  },
  accentCardNum: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '28px',
    fontWeight: '500',
    color: '#0E0C0A',
    lineHeight: 1,
  },
  accentCardLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '9px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(14,12,10,0.7)',
  },
  features: {
    padding: '80px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '48px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '28px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  featureIcon: {
    fontSize: '24px',
  },
  featureTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '20px',
    fontWeight: '400',
    color: 'var(--text-primary)',
  },
  featureDesc: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    fontWeight: '300',
  },
  bottomCta: {
    padding: '100px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '40px',
    borderTop: '1px solid var(--border)',
  },
  bottomCtaHeadline: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(40px, 5vw, 64px)',
    fontWeight: '400',
    lineHeight: '1.1',
    color: 'var(--text-primary)',
  },
  footer: {
    padding: '24px 80px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
  },
}
