import { useState } from 'react'
import { format } from 'date-fns'
import Navbar from '../components/layout/Navbar'
import EntryEditor from '../components/entries/EntryEditor'
import EntryCard from '../components/entries/EntryCard'
import StatsBar from '../components/entries/StatsBar'
import CalendarHeatmap from '../components/calendar/CalendarHeatmap'
import { useEntries } from '../hooks/useEntries'

export default function DashboardPage() {
  const { entries, loading, createEntry, updateEntry, deleteEntry, getStreak } = useEntries()
  const [showEditor, setShowEditor] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [filter, setFilter] = useState('all')
  const streak = getStreak()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const hasEntryToday = entries.some(e => e.entry_date === todayStr)

  const handleCreate = async (data) => {
    await createEntry(data)
    setShowEditor(false)
  }

  const handleUpdate = async (data) => {
    await updateEntry(editingEntry.id, data)
    setEditingEntry(null)
  }

  const handleDelete = async (id) => {
    await deleteEntry(id)
  }

  const allTags = [...new Set(entries.flatMap(e => e.tags || []))]

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => e.tags?.includes(filter) || e.mood === filter)

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-stone-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading your story...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'} ✦
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
            {streak > 0 && <span className="ml-2 text-spark-500 font-medium">🔥 {streak} day streak</span>}
          </p>
        </div>

        {/* Stats */}
        <StatsBar entries={entries} streak={streak} />

        {/* Today's entry prompt */}
        {!hasEntryToday && !showEditor && (
          <div
            onClick={() => setShowEditor(true)}
            className="card p-5 border-dashed border-2 border-stone-200 dark:border-stone-700 cursor-pointer hover:border-spark-300 dark:hover:border-spark-700 hover:shadow-md transition-all group text-center animate-fade-up"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✦</div>
            <p className="font-medium text-stone-700 dark:text-stone-300">Write today's entry</p>
            <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">What happened today? What are you proud of?</p>
          </div>
        )}

        {/* Editor for new entry */}
        {showEditor && !editingEntry && (
          <EntryEditor
            onSave={handleCreate}
            onCancel={() => setShowEditor(false)}
          />
        )}

        {/* Editing existing entry */}
        {editingEntry && (
          <EntryEditor
            initial={editingEntry}
            onSave={handleUpdate}
            onCancel={() => setEditingEntry(null)}
          />
        )}

        {/* Add new entry button (when today already has entry) */}
        {hasEntryToday && !showEditor && !editingEntry && (
          <button onClick={() => setShowEditor(true)} className="btn-ghost text-sm">
            + Add another entry
          </button>
        )}

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`tag ${filter === 'all' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(filter === tag ? 'all' : tag)}
                className={`tag ${filter === tag ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Heatmap */}
        {entries.length > 0 && <CalendarHeatmap entries={entries} />}

        {/* Entries list */}
        <div className="space-y-4">
          {filtered.length === 0 && entries.length > 0 && (
            <p className="text-center text-stone-400 py-8">No entries match this filter.</p>
          )}
          {filtered.length === 0 && entries.length === 0 && !showEditor && (
            <div className="text-center py-12">
              <p className="text-stone-400 dark:text-stone-500 text-lg">Your story starts today.</p>
              <p className="text-stone-300 dark:text-stone-600 text-sm mt-1">Write your first entry above ↑</p>
            </div>
          )}
          {filtered.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={setEditingEntry}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
