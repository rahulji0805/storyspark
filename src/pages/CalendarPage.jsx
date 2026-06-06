import { useState, useMemo } from 'react'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth } from 'date-fns'
import Navbar from '../components/layout/Navbar'
import { useEntries } from '../hooks/useEntries'

const MOOD_MAP = { fired_up: '🔥', happy: '😊', calm: '😌', reflective: '🤔', tired: '😴', proud: '💪' }

export default function CalendarPage() {
  const { entries, loading } = useEntries()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const entryMap = useMemo(() => {
    const map = {}
    entries.forEach(e => {
      if (!map[e.entry_date]) map[e.entry_date] = []
      map[e.entry_date].push(e)
    })
    return map
  }, [entries])

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const allDays = eachDayOfInterval({ start, end })
    const firstDow = getDay(start)
    const blanks = Array(firstDow).fill(null)
    return [...blanks, ...allDays]
  }, [currentMonth])

  const selectedEntries = selectedDate ? (entryMap[selectedDate] || []) : []

  const prevMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">Calendar</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">See your story unfold, day by day.</p>
        </div>

        {/* Calendar */}
        <div className="card p-5 animate-fade-up">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="btn-ghost p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={nextMonth} className="btn-ghost p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-xs font-mono text-stone-400 dark:text-stone-500 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} />
              const dateStr = format(day, 'yyyy-MM-dd')
              const hasEntry = !!entryMap[dateStr]
              const isSelected = selectedDate === dateStr
              const today = isToday(day)

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-spark-500 text-white shadow-md scale-105'
                      : today
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : hasEntry
                      ? 'bg-spark-100 text-spark-800 hover:bg-spark-200 dark:bg-spark-900/40 dark:text-spark-300'
                      : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
                  }`}
                >
                  {format(day, 'd')}
                  {hasEntry && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-spark-400 dark:bg-spark-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected date entries */}
        {selectedDate && (
          <div className="animate-fade-up space-y-3">
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
              {format(parseISO(selectedDate), 'EEEE, MMMM d')}
            </h3>
            {selectedEntries.length === 0 ? (
              <div className="card p-5 text-center text-stone-400 dark:text-stone-500">
                No entry for this day.
              </div>
            ) : (
              selectedEntries.map(entry => (
                <div key={entry.id} className="card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {entry.mood && <span className="text-lg">{MOOD_MAP[entry.mood]}</span>}
                    {entry.title && (
                      <h4 className="font-display font-semibold text-stone-900 dark:text-stone-100">{entry.title}</h4>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                  {entry.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.tags.map(tag => (
                        <span key={tag} className="tag bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
