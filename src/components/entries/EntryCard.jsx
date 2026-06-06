import { useState } from 'react'
import { format, parseISO } from 'date-fns'

const MOOD_MAP = {
  fired_up: '🔥',
  happy: '😊',
  calm: '😌',
  reflective: '🤔',
  tired: '😴',
  proud: '💪',
}

export default function EntryCard({ entry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const preview = entry.content.length > 200 && !expanded
    ? entry.content.slice(0, 200) + '...'
    : entry.content

  const formattedDate = (() => {
    try { return format(parseISO(entry.entry_date), 'EEEE, MMMM d, yyyy') }
    catch { return entry.entry_date }
  })()

  return (
    <article className="card p-5 hover:shadow-md transition-shadow animate-fade-up group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <time className="text-xs font-mono text-stone-400 dark:text-stone-500">
              {formattedDate}
            </time>
            {entry.mood && (
              <span className="text-base">{MOOD_MAP[entry.mood]}</span>
            )}
          </div>
          {entry.title && (
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 leading-snug">
              {entry.title}
            </h3>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 dark:hover:text-stone-300 transition-all"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(entry.id)}
                className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-600 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
        {preview}
      </p>

      {entry.content.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-spark-600 dark:text-spark-400 mt-2 hover:underline font-medium"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map(tag => (
            <span key={tag} className="tag bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
