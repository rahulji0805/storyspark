import { useMemo } from 'react'
import { format, startOfYear, eachDayOfInterval, parseISO, isToday, getDay } from 'date-fns'

export default function CalendarHeatmap({ entries }) {
  const entryDates = useMemo(() => {
    const map = {}
    entries.forEach(e => { map[e.entry_date] = true })
    return map
  }, [entries])

  const months = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const days = eachDayOfInterval({ start, end: now })

    const result = []
    let currentMonth = null
    let currentWeeks = []
    let currentWeek = []

    const firstDow = getDay(start)
    for (let i = 0; i < firstDow; i++) currentWeek.push(null)

    days.forEach(day => {
      const monthKey = format(day, 'MMM')
      if (monthKey !== currentMonth) {
        if (currentMonth !== null) {
          if (currentWeek.length) currentWeeks.push(currentWeek)
          result.push({ month: currentMonth, weeks: currentWeeks })
        }
        currentMonth = monthKey
        currentWeeks = []
        currentWeek = []
      }
      currentWeek.push(day)
      if (getDay(day) === 6) {
        currentWeeks.push(currentWeek)
        currentWeek = []
      }
    })
    if (currentWeek.length) currentWeeks.push(currentWeek)
    if (currentMonth) result.push({ month: currentMonth, weeks: currentWeeks })

    return result
  }, [])

  return (
    <div className="card p-5 overflow-x-auto">
      <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
        Your Year in Stories
      </h2>
      <div className="flex gap-3">
        {months.map(({ month, weeks }) => (
          <div key={month} className="flex-shrink-0">
            <div className="text-xs font-mono text-stone-400 dark:text-stone-500 mb-1.5 text-center">
              {month}
            </div>
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day ? format(day, 'MMM d, yyyy') : ''}
                      className={`w-3 h-3 rounded-sm transition-all ${
                        !day
                          ? 'bg-transparent'
                          : entryDates[format(day, 'yyyy-MM-dd')]
                          ? isToday(day)
                            ? 'bg-spark-500 ring-2 ring-spark-300 dark:ring-spark-700'
                            : 'bg-spark-400 dark:bg-spark-500'
                          : isToday(day)
                          ? 'bg-stone-300 ring-2 ring-stone-400 dark:bg-stone-600 dark:ring-stone-500'
                          : 'bg-stone-200 dark:bg-stone-800'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-stone-400">
        <span>Less</span>
        {['bg-stone-200 dark:bg-stone-800', 'bg-spark-200', 'bg-spark-300', 'bg-spark-400', 'bg-spark-500'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
