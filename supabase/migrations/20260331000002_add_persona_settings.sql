create table user_persona_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  persona text check (persona in ('explorer', 'pressure')),
  custom_instructions text not null default '',
  updated_at timestamptz default now(),
  unique(user_id, persona)
);

alter table user_persona_settings enable row level security;

create policy "own persona settings only" on user_persona_settings
  for all using (auth.uid() = user_id);
