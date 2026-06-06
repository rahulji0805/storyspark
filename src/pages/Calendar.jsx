import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function Calendar() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEntries, setSelectedEntries] = useState([])
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

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

  const entryDates = new Set(entries.map(e => e.created_at?.split('T')[0]))

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y, m) => {
    let d = new Date(y, m, 1).getDay()
    return d === 0 ? 6 : d - 1 // Mon = 0
  }

  const handleDayClick = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setSelectedEntries(entries.filter(e => e.created_at?.split('T')[0] === dateStr))
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>✦ Archive</p>
            <h1 style={styles.title}>Your story,<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>month by month.</em></h1>
          </div>
          <div style={styles.stats}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{entries.length}</span>
              <span style={styles.statLabel}>total entries</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{entryDates.size}</span>
              <span style={styles.statLabel}>days written</span>
            </div>
          </div>
        </div>

        <div style={styles.goldRule} />

        <div style={styles.layout}>
          {/* Calendar */}
          <div style={styles.calendarCol}>
            {/* Month nav */}
            <div style={styles.monthNav}>
              <button onClick={prevMonth} style={styles.navBtn}>←</button>
              <div style={styles.monthTitle}>
                <span style={styles.monthName}>{MONTHS[viewMonth]}</span>
                <span style={styles.yearLabel}>{viewYear}</span>
              </div>
              <button onClick={nextMonth} style={styles.navBtn}>→</button>
            </div>

            {/* Day headers */}
            <div style={styles.dayHeaders}>
              {DAYS.map(d => (
                <div key={d} style={styles.dayHeader}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={styles.grid}>
              {/* Empty cells */}
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} style={styles.emptyCell} />
              ))}

              {/* Days */}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const hasEntry = entryDates.has(dateStr)
                const isToday = dateStr === today.toISOString().split('T')[0]
                const isSelected = dateStr === selectedDate

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    style={{
                      ...styles.dayCell,
                      ...(hasEntry ? styles.dayCellActive : {}),
                      ...(isToday ? styles.dayCellToday : {}),
                      ...(isSelected ? styles.dayCellSelected : {}),
                    }}
                  >
                    <span style={styles.dayNum}>{day}</span>
                    {hasEntry && <span style={styles.dayDot} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Entry viewer */}
          <div style={styles.viewerCol}>
            {selectedDate ? (
              <div>
                <p style={styles.viewerDate}>
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                {selectedEntries.length > 0 ? (
                  <div style={styles.viewerEntries}>
                    {selectedEntries.map(entry => (
                      <div key={entry.id} style={styles.viewerEntry}>
                        {entry.title && <h3 style={styles.viewerTitle}>{entry.title}</h3>}
                        <p style={styles.viewerBody}>{entry.content}</p>
                        {entry.tags?.length > 0 && (
                          <div style={styles.viewerTags}>
                            {entry.tags.map(t => (
                              <span key={t} style={styles.viewerTag}>✦ {t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noEntry}>
                    <p style={styles.noEntryText}>No entry for this day.</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.viewerPlaceholder}>
                <p style={styles.placeholderIcon}>📅</p>
                <p style={styles.placeholderText}>Select a day to read your entry.</p>
                <p style={styles.placeholderSub}>Days with a dot have entries.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', background: 'var(--bg-primary)', padding: '60px 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' },
  title: { fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: '400', color: 'var(--text-primary)', lineHeight: 1.05 },
  stats: { display: 'flex', gap: '16px' },
  statBox: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '100px', alignItems: 'center' },
  statNum: { fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '400', color: 'var(--accent)', lineHeight: 1 },
  statLabel: { fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' },
  goldRule: { height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', opacity: 0.3 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start' },
  calendarCol: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px' },
  monthNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  navBtn: { width: '32px', height: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '2px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  monthTitle: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  monthName: { fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '400', color: 'var(--text-primary)' },
  yearLabel: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)' },
  dayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' },
  dayHeader: { fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
  emptyCell: { height: '40px' },
  dayCell: { height: '40px', background: 'none', border: '1px solid var(--border)', borderRadius: '2px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', transition: 'all 0.15s ease', color: 'var(--text-secondary)' },
  dayCellActive: { borderColor: 'var(--accent)', background: 'var(--accent-glow)' },
  dayCellToday: { borderColor: 'var(--text-primary)', background: 'var(--bg-hover)' },
  dayCellSelected: { background: 'var(--text-primary)', borderColor: 'var(--text-primary)' },
  dayNum: { fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.05em', color: 'inherit' },
  dayDot: { width: '3px', height: '3px', borderRadius: '50%', background: 'var(--accent)' },
  viewerCol: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '32px', minHeight: '360px' },
  viewerDate: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '24px' },
  viewerEntries: { display: 'flex', flexDirection: 'column', gap: '24px' },
  viewerEntry: { display: 'flex', flexDirection: 'column', gap: '12px' },
  viewerTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: '400', color: 'var(--text-primary)', lineHeight: 1.2 },
  viewerBody: { fontFamily: 'DM Sans, sans-serif', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-secondary)', fontWeight: '300' },
  viewerTags: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  viewerTag: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-glow)', padding: '4px 10px', borderRadius: '2px', border: '1px solid rgba(184,134,11,0.2)' },
  noEntry: { padding: '40px 0', textAlign: 'center' },
  noEntryText: { fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--text-muted)', fontStyle: 'italic' },
  viewerPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px', textAlign: 'center' },
  placeholderIcon: { fontSize: '32px', opacity: 0.4 },
  placeholderText: { fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--text-secondary)', fontStyle: 'italic' },
  placeholderSub: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)' },
}
