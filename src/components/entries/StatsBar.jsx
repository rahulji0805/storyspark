export default function StatsBar({ entries, streak }) {
  const totalWords = entries.reduce((sum, e) => sum + e.content.split(/\s+/).filter(Boolean).length, 0)
  const thisMonth = entries.filter(e => {
    const now = new Date()
    const d = new Date(e.entry_date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const stats = [
    { label: 'Day Streak', value: streak, suffix: streak === 1 ? 'day' : 'days', icon: '🔥' },
    { label: 'Total Entries', value: entries.length, suffix: entries.length === 1 ? 'entry' : 'entries', icon: '✦' },
    { label: 'This Month', value: thisMonth, suffix: 'entries', icon: '📅' },
    { label: 'Words Written', value: totalWords.toLocaleString(), suffix: 'words', icon: '✍️' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, suffix, icon }) => (
        <div
          key={label}
          className="card p-4 text-center hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-1">{icon}</div>
          <div className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            {value}
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
