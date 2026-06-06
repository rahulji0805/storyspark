import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MOOD_TAGS = ['Grateful', 'Proud', 'Reflective', 'Motivated', 'Peaceful', 'Growth', 'Challenged', 'Joyful']

export default function Dashboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [streak, setStreak] = useState(0)
  const [todayEntry, setTodayEntry] = useState(null)

  const today = new Date().toISOString().split('T')[0]
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  useEffect(() => {
    if (user) fetchEntries()
  }, [user])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setEntries(data)
      const te = data.find(e => e.created_at?.split('T')[0] === today)
      setTodayEntry(te || null)
      calculateStreak(data)
    }
  }

  const calculateStreak = (data) => {
    if (!data.length) return setStreak(0)
    const dates = [...new Set(data.map(e => e.created_at?.split('T')[0]))].sort().reverse()
    let s = 0
    let checkDate = new Date(today)
    for (const d of dates) {
      const entryDate = new Date(d)
      const diff = Math.floor((checkDate - entryDate) / 86400000)
      if (diff === 0 || diff === 1) { s++; checkDate = entryDate; }
      else break
    }
    setStreak(s)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    const { error } = await supabase.from('entries').insert({
      user_id: user.id,
      title: title.trim() || null,
      content: content.trim(),
      tags: selectedTags,
      created_at: new Date().toISOString(),
    })
    if (!error) {
      setContent('')
      setTitle('')
      setSelectedTags([])
      fetchEntries()
    }
    setSaving(false)
  }

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>

        {/* Date + Streak header */}
        <div style={styles.pageHeader}>
          <div>
            <p style={styles.dateLabel}>{todayFormatted}</p>
            <h1 style={styles.pageTitle}>
              {todayEntry ? 'Your entry today' : 'What happened today?'}
            </h1>
          </div>
          <div style={styles.streakBadge}>
            <span style={styles.streakFire}>🔥</span>
            <div>
              <span style={styles.streakNum}>{streak}</span>
              <span style={styles.streakLabel}>day streak</span>
            </div>
          </div>
        </div>

        <div style={styles.goldRule} />

        <div style={styles.layout}>
          {/* Editor */}
          <div style={styles.editorCol}>
            {todayEntry ? (
              <div style={styles.todayCard}>
                <div style={styles.entryDateTag}>Already written today ✦</div>
                <h2 style={styles.entryTitle}>{todayEntry.title || 'Untitled entry'}</h2>
                <p style={styles.entryBody}>{todayEntry.content}</p>
                {todayEntry.tags?.length > 0 && (
                  <div style={styles.tagRow}>
                    {todayEntry.tags.map(t => (
                      <span key={t} style={styles.tagPill}>✦ {t}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.editorCard}>
                <input
                  type="text"
                  placeholder="Give this moment a title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.titleInput}
                />
                <div style={styles.inputDivider} />
                <textarea
                  placeholder="Write your moment, win, or reflection for today…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={styles.textarea}
                  rows={10}
                />
                <div style={styles.editorFooter}>
                  <div style={styles.tagsRow}>
                    {MOOD_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{
                          ...styles.tagBtn,
                          ...(selectedTags.includes(tag) ? styles.tagBtnActive : {}),
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || !content.trim()}
                    style={{
                      ...styles.saveBtn,
                      opacity: !content.trim() ? 0.4 : 1,
                    }}
                  >
                    {saving ? 'Saving…' : 'Save entry →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent entries */}
          <div style={styles.recentCol}>
            <p style={styles.sectionLabel}>Recent entries</p>
            <div style={styles.entryList}>
              {entries.slice(0, 6).map(entry => (
                <div key={entry.id} style={styles.entryItem}>
                  <div style={styles.entryItemDate}>
                    {new Date(entry.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short'
                    })}
                  </div>
                  <div style={styles.entryItemContent}>
                    <p style={styles.entryItemTitle}>
                      {entry.title || entry.content?.slice(0, 50) + '…'}
                    </p>
                    {entry.tags?.length > 0 && (
                      <div style={styles.entryItemTags}>
                        {entry.tags.map(t => (
                          <span key={t} style={styles.entryItemTag}>✦ {t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p style={styles.emptyState}>No entries yet. Write your first one →</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={styles.statsBar}>
          {[
            { val: entries.length, label: 'Total entries' },
            { val: streak, label: 'Current streak' },
            { val: entries.reduce((a, e) => a + (e.content?.split(' ').length || 0), 0), label: 'Words written' },
          ].map(({ val, label }) => (
            <div key={label} style={styles.statItem}>
              <span style={styles.statVal}>{val.toLocaleString()}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    background: 'var(--bg-primary)',
    padding: '60px 0',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '8px',
  },
  pageTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '48px',
    fontWeight: '400',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    padding: '16px 24px',
    borderRadius: '4px',
  },
  streakFire: {
    fontSize: '28px',
  },
  streakNum: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '36px',
    fontWeight: '400',
    color: 'var(--accent)',
    display: 'block',
    lineHeight: 1,
  },
  streakLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'block',
  },
  goldRule: {
    height: '1px',
    background: 'linear-gradient(90deg, var(--accent), transparent)',
    opacity: 0.3,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  editorCol: {},
  editorCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  titleInput: {
    display: 'block',
    width: '100%',
    padding: '24px 28px 16px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '26px',
    fontWeight: '400',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  inputDivider: {
    height: '1px',
    background: 'var(--border)',
    margin: '0 28px',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '20px 28px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '15px',
    lineHeight: '1.8',
    color: 'var(--text-primary)',
    fontWeight: '300',
    minHeight: '200px',
  },
  editorFooter: {
    padding: '16px 28px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagBtn: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '5px 12px',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    background: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tagBtnActive: {
    background: 'var(--accent-glow)',
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
  },
  saveBtn: {
    alignSelf: 'flex-end',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.06em',
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '2px',
    padding: '10px 24px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'opacity 0.2s ease',
  },
  todayCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  entryDateTag: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
  },
  entryTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '28px',
    fontWeight: '400',
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  entryBody: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '15px',
    lineHeight: '1.8',
    color: 'var(--text-secondary)',
    fontWeight: '300',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagPill: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.08em',
    padding: '5px 12px',
    background: 'var(--accent-glow)',
    border: '1px solid rgba(184,134,11,0.2)',
    borderRadius: '2px',
    color: 'var(--accent)',
  },
  recentCol: {},
  sectionLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '16px',
  },
  entryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    overflow: 'hidden',
    background: 'var(--bg-card)',
  },
  entryItem: {
    display: 'flex',
    gap: '20px',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.15s ease',
    cursor: 'default',
  },
  entryItemDate: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    minWidth: '48px',
    paddingTop: '2px',
  },
  entryItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  entryItemTitle: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    color: 'var(--text-primary)',
    fontWeight: '400',
    lineHeight: 1.4,
  },
  entryItemTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  entryItemTag: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '9px',
    letterSpacing: '0.08em',
    color: 'var(--accent)',
    opacity: 0.7,
  },
  emptyState: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    color: 'var(--text-muted)',
    padding: '24px 20px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: 'var(--border)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  statItem: {
    background: 'var(--bg-card)',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statVal: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '36px',
    fontWeight: '400',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
}
