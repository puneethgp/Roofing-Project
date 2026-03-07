-- 1. Create the storage bucket for project images
insert into storage.buckets (id, name, public) 
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files in the bucket
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'project-images' );

-- 3. Allow authenticated/anon users to upload and manage files (for admin use)
create policy "Admin Upload Access" 
on storage.objects for insert 
with check ( bucket_id = 'project-images' );

create policy "Admin Update Access" 
on storage.objects for update 
using ( bucket_id = 'project-images' );

create policy "Admin Delete Access" 
on storage.objects for delete 
using ( bucket_id = 'project-images' );

-- 4. Create the projects table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    "completionDate" text,
    duration text,
    address text,
    owner jsonb,
    "outputImages" text[],
    "progressImages" text[],
    "materialImages" text[],
    materials jsonb[]
);

-- 5. Create the global_settings table for material categories
create table if not exists public.global_settings (
    key text primary key,
    value jsonb not null
);

-- 6. Setup Row Level Security (RLS) for the tables
-- Enable RLS
alter table public.projects enable row level security;
alter table public.global_settings enable row level security;

-- Allow public read access to projects and global settings
create policy "Public Read Projects" on public.projects for select using (true);
create policy "Public Read Settings" on public.global_settings for select using (true);

-- Allow anon insert/update/delete (in a real app, you'd restrict this to authenticated admins)
create policy "Admin Manage Projects" on public.projects for all using (true) with check (true);
create policy "Admin Manage Settings" on public.global_settings for all using (true) with check (true);
