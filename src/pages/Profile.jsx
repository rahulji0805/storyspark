import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (user) fetchEntries()
  }, [user])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
  }

  // Analytics
  const totalWords = entries.reduce((a, e) => a + (e.content?.split(' ').length || 0), 0)
  const avgWords = entries.length ? Math.round(totalWords / entries.length) : 0
  const uniqueDays = new Set(entries.map(e => e.created_at?.split('T')[0])).size

  // Tag frequency
  const tagFreq = {}
  entries.forEach(e => e.tags?.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1 }))
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxTagCount = topTags[0]?.[1] || 1

  // Monthly breakdown
  const monthlyData = {}
  entries.forEach(e => {
    const key = e.created_at?.slice(0, 7)
    if (key) monthlyData[key] = (monthlyData[key] || 0) + 1
  })
  const months = Object.entries(monthlyData).sort().reverse().slice(0, 6)
  const maxMonth = Math.max(...months.map(m => m[1]), 1)

  // Streak calc
  const today = new Date().toISOString().split('T')[0]
  const dates = [...new Set(entries.map(e => e.created_at?.split('T')[0]))].sort().reverse()
  let streak = 0
  let checkDate = new Date(today)
  for (const d of dates) {
    const diff = Math.floor((checkDate - new Date(d)) / 86400000)
    if (diff === 0 || diff === 1) { streak++; checkDate = new Date(d) }
    else break
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>

        {/* Profile header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={styles.emailLabel}>{user?.email}</p>
            <h1 style={styles.title}>Your Chronicle</h1>
            <p style={styles.memberSince}>Member since {memberSince}</p>
          </div>
        </div>

        <div style={styles.goldRule} />

        {/* Stats grid */}
        <div style={styles.statsGrid}>
          {[
            { val: entries.length, label: 'Entries written', sub: 'total' },
            { val: streak, label: 'Current streak', sub: 'days' },
            { val: uniqueDays, label: 'Days with entries', sub: 'unique days' },
            { val: totalWords.toLocaleString(), label: 'Words written', sub: 'total' },
            { val: avgWords, label: 'Avg entry length', sub: 'words' },
          ].map(({ val, label, sub }) => (
            <div key={label} style={styles.statCard}>
              <span style={styles.statVal}>{val}</span>
              <span style={styles.statLabel}>{label}</span>
              <span style={styles.statSub}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={styles.twoCol}>
          {/* Top tags */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Most used moods & tags</p>
            <div style={styles.tagList}>
              {topTags.length > 0 ? topTags.map(([tag, count]) => (
                <div key={tag} style={styles.tagRow}>
                  <div style={styles.tagRowLeft}>
                    <span style={styles.tagName}>✦ {tag}</span>
                    <span style={styles.tagCount}>{count}×</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${(count / maxTagCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )) : (
                <p style={styles.emptyState}>No tags yet — add moods to your entries!</p>
              )}
            </div>
          </div>

          {/* Monthly writing */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Writing by month</p>
            <div style={styles.barChart}>
              {months.length > 0 ? months.map(([month, count]) => (
                <div key={month} style={styles.barItem}>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.bar,
                        height: `${(count / maxMonth) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={styles.barLabel}>
                    {new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                  <span style={styles.barNum}>{count}</span>
                </div>
              )) : (
                <p style={styles.emptyState}>No entries yet to chart.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent entries list */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>All entries</p>
          <div style={styles.entryTable}>
            {entries.length > 0 ? entries.map(entry => (
              <div key={entry.id} style={styles.entryRow}>
                <span style={styles.entryRowDate}>
                  {new Date(entry.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
                <span style={styles.entryRowTitle}>
                  {entry.title || entry.content?.slice(0, 60) + '…'}
                </span>
                <span style={styles.entryRowWords}>
                  {entry.content?.split(' ').length || 0}w
                </span>
                <div style={styles.entryRowTags}>
                  {entry.tags?.map(t => (
                    <span key={t} style={styles.entryRowTag}>{t}</span>
                  ))}
                </div>
              </div>
            )) : (
              <p style={styles.emptyState}>No entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', background: 'var(--bg-primary)', padding: '60px 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '48px' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '28px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: 'var(--accent)', fontWeight: '400', flexShrink: 0 },
  emailLabel: { fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' },
  title: { fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: '400', color: 'var(--text-primary)', lineHeight: 1 },
  memberSince: { fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: '4px' },
  goldRule: { height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', opacity: 0.3 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  statCard: { background: 'var(--bg-card)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '4px' },
  statVal: { fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '400', color: 'var(--text-primary)', lineHeight: 1 },
  statLabel: { fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '400' },
  statSub: { fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  section: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px' },
  sectionLabel: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px' },
  tagList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  tagRow: { display: 'flex', flexDirection: 'column', gap: '6px' },
  tagRowLeft: { display: 'flex', justifyContent: 'space-between' },
  tagName: { fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text-primary)' },
  tagCount: { fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--accent)' },
  progressTrack: { height: '3px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' },
  progressBar: { height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' },
  barChart: { display: 'flex', gap: '12px', alignItems: 'flex-end', height: '140px' },
  barItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  barTrack: { flex: 1, width: '100%', background: 'var(--bg-secondary)', borderRadius: '2px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', background: 'var(--accent)', opacity: 0.7, borderRadius: '2px', minHeight: '4px', transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)' },
  barLabel: { fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' },
  barNum: { fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--accent)' },
  entryTable: { display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  entryRow: { display: 'grid', gridTemplateColumns: '120px 1fr 40px auto', gap: '16px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' },
  entryRowDate: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  entryRowTitle: { fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  entryRowWords: { fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' },
  entryRowTags: { display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  entryRowTag: { fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--accent)', background: 'var(--accent-glow)', padding: '2px 8px', borderRadius: '2px', whiteSpace: 'nowrap' },
  emptyState: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' },
}
