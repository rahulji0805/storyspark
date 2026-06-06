import { useState } from 'react'
import { format } from 'date-fns'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import { useEntries } from '../hooks/useEntries'

const MOOD_LABELS = { fired_up: '🔥 Fired up', happy: '😊 Happy', calm: '😌 Calm', reflective: '🤔 Reflective', tired: '😴 Tired', proud: '💪 Proud' }

export default function ProfilePage() {
  const { user } = useAuth()
  const { entries, getStreak } = useEntries()
  const streak = getStreak()

  const totalWords = entries.reduce((sum, e) => sum + e.content.split(/\s+/).filter(Boolean).length, 0)
  const avgWords = entries.length ? Math.round(totalWords / entries.length) : 0

  const moodCounts = entries.reduce((acc, e) => {
    if (e.mood) acc[e.mood] = (acc[e.mood] || 0) + 1
    return acc
  }, {})
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

  const tagCounts = entries.reduce((acc, e) => {
    (e.tags || []).forEach(t => { acc[t] = (acc[t] || 0) + 1 })
    return acc
  }, {})
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const joinedDate = user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Recently'

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="card p-6 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-spark-400 to-amber-500 flex items-center justify-center text-white text-2xl font-display font-bold shadow-md">
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                {user?.email?.split('@')[0] || 'Storyteller'}
              </h1>
              <p className="text-sm text-stone-400 dark:text-stone-500">{user?.email}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Member since {joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-up">
          {[
            { label: 'Current Streak', value: `${streak} 🔥`, sub: streak === 1 ? 'day' : 'days' },
            { label: 'Total Entries', value: entries.length, sub: 'stories written' },
            { label: 'Words Written', value: totalWords.toLocaleString(), sub: 'total words' },
            { label: 'Avg per Entry', value: avgWords, sub: 'words' },
            { label: 'Top Mood', value: topMood ? MOOD_LABELS[topMood[0]]?.split(' ')[0] : '—', sub: topMood ? MOOD_LABELS[topMood[0]]?.split(' ').slice(1).join(' ') : 'no entries yet' },
            { label: 'This Year', value: entries.filter(e => new Date(e.entry_date).getFullYear() === new Date().getFullYear()).length, sub: 'entries in ' + new Date().getFullYear() },
          ].map(({ label, value, sub }) => (
            <div key={label} className="card p-4 text-center">
              <div className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">{value}</div>
              <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mt-0.5">{label}</div>
              <div className="text-xs text-stone-400 dark:text-stone-500">{sub}</div>
            </div>
          ))}
        </div>

        {/* Top tags */}
        {topTags.length > 0 && (
          <div className="card p-5 animate-fade-up">
            <h2 className="font-display text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">Your Most Used Tags</h2>
            <div className="space-y-2">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400 w-24">#{tag}</span>
                  <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-spark-400 dark:bg-spark-500 rounded-full transition-all"
                      style={{ width: `${(count / entries.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 dark:text-stone-500 w-8 text-right">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="card p-8 text-center animate-fade-up">
            <div className="text-4xl mb-3">✦</div>
            <p className="text-stone-500 dark:text-stone-400">Your stats will appear here once you start writing.</p>
          </div>
        )}
      </div>
    </div>
  )
}
