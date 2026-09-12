-- 多言語対応のための追加マイグレーション
-- 既にsupabase/schema.sqlを実行済みのプロジェクトに対して、
-- Supabaseダッシュボード > SQL Editor で実行してください。

-- 1. locale / translation_group_id カラムを追加
--    既存の記事はすべて locale = 'ja' として扱い、
--    translation_group_id には行ごとに新しいUUIDを発行します。
alter table public.posts
  add column if not exists locale text not null default 'ja'
    check (locale in ('ja', 'en')),
  add column if not exists translation_group_id uuid not null default gen_random_uuid();

-- 2. slugの一意制約を「サイト全体で一意」から「同じ言語内で一意」に変更
--    （日本語版と英語版で同じslugを使えるようにするため）
alter table public.posts drop constraint if exists posts_slug_key;
alter table public.posts add constraint posts_locale_slug_key unique (locale, slug);

-- 3. 検索用インデックス
create index if not exists posts_locale_status_created_at_idx
  on public.posts (locale, status, created_at desc);

create index if not exists posts_translation_group_id_idx
  on public.posts (translation_group_id);
