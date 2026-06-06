# ✦ StorySpark

> Turn your everyday moments into a story worth telling.

StorySpark is a minimal, beautiful journaling web app that helps you capture daily wins, track your mood, build streaks, and watch your personal story unfold over time.


## Features

- ✦ **Daily Journal Entries** — Write freely with titles, content, mood, and tags
- 🔥 **Streak Tracking** — Build the journaling habit, day by day
- 📅 **Calendar View** — See every day you showed up
- 🌡️ **Year Heatmap** — GitHub-style contribution graph for your journaling
- 🏷️ **Mood & Tags** — Filter and explore your story themes
- 📊 **Profile Stats** — Words written, top moods, tag analytics
- 🌙 **Dark / Light Mode** — Toggle with a click, remembers your preference
- 🔐 **Auth** — Secure sign up / sign in via Supabase

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth + DB | Supabase |
| Routing | React Router v6 |
| Dates | date-fns |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/storyspark.git
cd storyspark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run this SQL in your Supabase SQL editor:

```sql
create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  content text not null,
  mood text,
  tags text[] default '{}',
  entry_date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table entries enable row level security;

create policy "Users can only access their own entries"
  on entries for all
  using (auth.uid() = user_id);
```

3. Copy your project URL and anon key from **Project Settings → API**

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173` 🚀

## Deployment

Deploy to [Vercel](https://vercel.com) in one command:

```bash
npx vercel
```

Add your environment variables in the Vercel dashboard.

## Project Structure

```
storyspark/
├── src/
│   ├── components/
│   │   ├── auth/        # Login/Signup UI
│   │   ├── calendar/    # Heatmap + Calendar
│   │   ├── entries/     # EntryCard, EntryEditor, StatsBar
│   │   └── layout/      # Navbar
│   ├── context/         # AuthContext, ThemeContext
│   ├── hooks/           # useEntries (all DB operations)
│   ├── lib/             # Supabase client
│   └── pages/           # Landing, Dashboard, Calendar, Profile
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

## License

MIT — feel free to fork and build on it.

---

Built with ✦ and a lot of daily entries.
