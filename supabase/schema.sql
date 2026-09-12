-- Supabase セットアップ用SQL
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください。

-- 1. posts テーブル
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  body text not null default '',
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  locale text not null default 'ja' check (locale in ('ja', 'en')),
  translation_group_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_locale_slug_key unique (locale, slug)
);

create index if not exists posts_locale_status_created_at_idx
  on public.posts (locale, status, created_at desc);

create index if not exists posts_translation_group_id_idx
  on public.posts (translation_group_id);

-- 2. updated_at を自動更新するトリガー
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

-- 3. RLS（行レベルセキュリティ）を有効化
alter table public.posts enable row level security;

-- 公開記事は誰でも閲覧可能
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

-- ログイン済みユーザー（管理者）は下書き含め全件閲覧・編集可能
drop policy if exists "Authenticated users can read all posts" on public.posts;
create policy "Authenticated users can read all posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- 4. page_sections テーブル（Topページの差し込みコンテンツ）
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

-- 5. サムネイル画像用の Storage バケット
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- 誰でもサムネイル画像を閲覧可能（バケットは公開設定）
drop policy if exists "Public can view thumbnails" on storage.objects;
create policy "Public can view thumbnails"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'thumbnails');

-- ログイン済みユーザーのみアップロード・更新・削除可能
drop policy if exists "Authenticated users can upload thumbnails" on storage.objects;
create policy "Authenticated users can upload thumbnails"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'thumbnails');

drop policy if exists "Authenticated users can update thumbnails" on storage.objects;
create policy "Authenticated users can update thumbnails"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'thumbnails');

drop policy if exists "Authenticated users can delete thumbnails" on storage.objects;
create policy "Authenticated users can delete thumbnails"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'thumbnails');
