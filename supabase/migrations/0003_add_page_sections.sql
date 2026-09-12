-- ホームページ編集機能のための追加マイグレーション
-- 既存プロジェクトに対して、Supabaseダッシュボード > SQL Editor で実行してください。

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null default 'home' check (page in ('home')),
  locale text not null check (locale in ('ja', 'en')),
  type text not null check (type in ('text', 'image')),
  position integer not null default 0,
  is_visible boolean not null default true,
  title text,
  body text,
  image_url text,
  image_alt text,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_sections_page_locale_position_idx
  on public.page_sections (page, locale, position);

-- posts テーブル作成時に定義済みの set_updated_at() 関数を再利用します
drop trigger if exists page_sections_set_updated_at on public.page_sections;
create trigger page_sections_set_updated_at
  before update on public.page_sections
  for each row
  execute function public.set_updated_at();

alter table public.page_sections enable row level security;

drop policy if exists "Public can read visible sections" on public.page_sections;
create policy "Public can read visible sections"
  on public.page_sections for select
  to anon, authenticated
  using (is_visible = true);

drop policy if exists "Authenticated users can read all sections" on public.page_sections;
create policy "Authenticated users can read all sections"
  on public.page_sections for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert sections" on public.page_sections;
create policy "Authenticated users can insert sections"
  on public.page_sections for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update sections" on public.page_sections;
create policy "Authenticated users can update sections"
  on public.page_sections for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete sections" on public.page_sections;
create policy "Authenticated users can delete sections"
  on public.page_sections for delete
  to authenticated
  using (true);
