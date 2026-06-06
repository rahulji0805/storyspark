import { useState } from 'react'
import { format } from 'date-fns'

const MOODS = [
  { emoji: '🔥', label: 'Fired up', value: 'fired_up' },
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '🤔', label: 'Reflective', value: 'reflective' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '💪', label: 'Proud', value: 'proud' },
]

const TAGS = ['win', 'learning', 'gratitude', 'health', 'work', 'personal', 'creative', 'goal']

export default function EntryEditor({ onSave, onCancel, initial = null }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [mood, setMood] = useState(initial?.mood || '')
  const [selectedTags, setSelectedTags] = useState(initial?.tags || [])
  const [date, setDate] = useState(initial?.entry_date || format(new Date(), 'yyyy-MM-dd'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Write at least a sentence about your day.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ title, content, mood, tags: selectedTags, entry_date: date })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="card p-6 space-y-5 animate-fade-up">
      {/* Date */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-widest">
          {initial ? 'Edit Entry' : "Today's Entry"}
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="text-xs text-stone-500 dark:text-stone-400 bg-transparent border-none outline-none cursor-pointer font-mono"
        />
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Give this moment a title... (optional)"
        className="w-full bg-transparent border-none outline-none font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-700"
      />

      {/* Divider */}
      <div className="border-t border-stone-100 dark:border-stone-800" />

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What happened today? What did you learn? What are you proud of? Write freely..."
        rows={7}
        className="w-full bg-transparent border-none outline-none text-stone-700 dark:text-stone-300 placeholder:text-stone-300 dark:placeholder:text-stone-700 text-base leading-relaxed font-body"
        autoFocus
      />

      {/* Mood */}
      <div>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">
          How are you feeling?
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(mood === m.value ? '' : m.value)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-all ${
                mood === m.value
                  ? 'bg-spark-100 text-spark-700 border border-spark-300 dark:bg-spark-900/40 dark:text-spark-300 dark:border-spark-700'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              <span>{m.emoji}</span>
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`tag transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="btn-primary"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving...
            </span>
          ) : (
            <>✦ Save Entry</>
          )}
        </button>
      </div>
    </div>
  )
}
