import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const features = [
  { icon: '✦', title: 'Daily Entries', desc: 'Write your wins, reflections, and moments that matter.' },
  { icon: '🔥', title: 'Streak Tracking', desc: 'Build the habit. Watch your streak grow day by day.' },
  { icon: '📅', title: 'Year in Review', desc: 'A beautiful heatmap of every day you showed up.' },
  { icon: '🏷️', title: 'Mood & Tags', desc: 'Track how you felt. Filter your story by themes.' },
]

export default function LandingPage() {
  const { theme, toggle } = useTheme()
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-spark-100 blur-3xl opacity-50 dark:bg-spark-950 dark:opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-60 dark:bg-amber-950 dark:opacity-20" />
      </div>
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl streak-fire">✦</span>
          <span className="font-display text-lg font-semibold">StorySpark</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="btn-ghost rounded-full p-2">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-spark-200 bg-spark-50 px-4 py-1.5 text-xs text-spark-700 dark:border-spark-800 dark:bg-spark-950/50 dark:text-spark-400 mb-8">
          <span className="streak-fire text-sm">🔥</span>
          Your story is worth telling
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-6 animate-fade-up">
          Every day is a <span className="text-spark-500 italic">chapter</span><br />in your story.
        </h1>
        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-10">
          StorySpark is a minimal journaling app that helps you capture daily wins, track your mood, and build a story worth looking back on.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/signup" className="btn-primary text-base px-7 py-3">Start your story →</Link>
          <Link to="/login" className="btn-ghost text-base">Already have an account</Link>
        </div>
      </main>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 mb-1">{title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="text-center py-8 text-xs text-stone-400 dark:text-stone-600">
        Built with ✦ by StorySpark
      </footer>
    </div>
  )
}
