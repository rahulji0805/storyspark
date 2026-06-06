-- Run this in your Supabase SQL editor

-- Create entries table
create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  content text not null,
  mood text check (mood in ('fired_up', 'happy', 'calm', 'reflective', 'tired', 'proud')),
  tags text[] default '{}',
  entry_date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table entries enable row level security;

-- Policy: users can only see/edit their own entries
create policy "Users manage their own entries"
  on entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger entries_updated_at
  before update on entries
  for each row execute procedure update_updated_at();

-- Index for fast user queries
create index entries_user_date on entries(user_id, entry_date desc);
