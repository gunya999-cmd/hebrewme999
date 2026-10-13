-- Run this migration in the Supabase project before enabling cloud sync.
create table if not exists public.miriam_learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"attempts":[],"reviews":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.miriam_learning_progress enable row level security;
create policy "Miriam progress read own" on public.miriam_learning_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Miriam progress insert own" on public.miriam_learning_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Miriam progress update own" on public.miriam_learning_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
