# トライアルサイト（Next.js + Supabase CMS）

CMS機能を持つ簡易ホームページのトライアル実装です。Topページ、記事一覧・詳細ページ、Markdown対応の管理画面（ログイン・記事作成/編集/削除・公開/下書き切り替え・サムネイルアップロード）を備え、**日本語・英語の多言語対応**（別URL方式）にも対応しています。

## 技術スタック

- Next.js 16（App Router / TypeScript）
- Supabase（PostgreSQL / Auth / Storage）
- Tailwind CSS v4
- react-markdown（Markdown入力のプレビュー表示）
- next-intl（多言語対応、`/ja/`・`/en/`のサブディレクトリ方式）

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. https://supabase.com でアカウントを作成し、新規プロジェクトを作成します。
2. プロジェクトの「Project Settings > Data API」からProject URL、「Project Settings > API Keys」からanon/publishable keyを控えます。
3. 「SQL Editor」を開き、[`supabase/schema.sql`](supabase/schema.sql) の内容を貼り付けて実行します（新規構築の場合はこれだけでOKです）。
   - `posts` テーブルの作成（`locale`・`translation_group_id`カラムを含む）
   - RLS（行レベルセキュリティ）ポリシーの設定（下書きは管理者のみ閲覧可）
   - サムネイル画像用の `thumbnails` Storageバケットの作成
   - Topページ編集用の `page_sections` テーブルの作成
   - **既にschema.sqlを実行済みで、あとから機能を追加する場合**は、代わりに以下のマイグレーションを順にSQL Editorで実行してください
     - [`supabase/migrations/0002_add_i18n.sql`](supabase/migrations/0002_add_i18n.sql)（多言語対応: `locale`・`translation_group_id`カラムの追加、slugのユニーク制約の変更）
     - [`supabase/migrations/0003_add_page_sections.sql`](supabase/migrations/0003_add_page_sections.sql)（ホーム編集機能: `page_sections`テーブルの追加）
4. 「Authentication > Users」から、管理者用のアカウント（メールアドレス＋パスワード）を1〜2件作成します。
   - サインアップ画面は用意していません。管理者アカウントはSupabaseダッシュボードから直接作成してください。

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、値を設定します。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=あなたのプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon/publishable key
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

`NEXT_PUBLIC_SITE_URL`はhreflangタグなどのURL生成に使われます。ローカル開発では`http://localhost:3000`のままで構いません。

`.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### 3. ローカルでの起動

```bash
npm install
npm run dev
```

http://localhost:3000 にアクセスすると `/ja` にリダイレクトされます。管理画面は http://localhost:3000/admin/posts （未ログインの場合は自動的にログイン画面へリダイレクトされます、多言語対応の対象外で日本語UI固定です）。

## 画面構成

### 公開側（`/ja/...`・`/en/...`）

| パス | 内容 |
|---|---|
| `/ja`, `/en` | Topページ（最新記事5件を表示） |
| `/ja/posts`, `/en/posts` | 公開済み記事の一覧（新着順、その言語の記事のみ） |
| `/ja/posts/[slug]`, `/en/posts/[slug]` | 記事詳細（対応する翻訳があれば言語切り替えリンクを表示） |

`/`や`/posts`など言語プレフィックスの無いパスにアクセスすると、デフォルト言語（`/ja`）にリダイレクトされます。

### 管理側（ログイン必須、日本語UI固定）

| パス | 内容 |
|---|---|
| `/admin/login` | ログイン画面 |
| `/admin/posts` | 記事一覧（日本語／Englishタブで言語ごとに表示切り替え） |
| `/admin/posts/new?locale=ja\|en` | 新規記事作成 |
| `/admin/posts/[id]` | 記事編集（対応する翻訳がある場合は切り替えタブ、無い場合は「English versionを新規作成」ボタンを表示） |
| `/admin/home` | Topページのセクション管理（日本語／Englishタブ、上下ボタンで並び替え、表示/非表示切り替え） |
| `/admin/home/new?locale=ja\|en&type=text\|image` | セクション追加（テキストブロック／画像ブロック） |
| `/admin/home/[id]` | セクション編集 |

記事編集画面ではタイトルからスラッグを自動生成（手動修正も可能）、Markdown入力とプレビューの切り替え、サムネイル画像のアップロード、公開/下書きの切り替えができます。日本語版の記事から「English versionを新規作成」すると、同じ`translation_group_id`を持つ英語版の下書きが作成され、そのまま編集画面に遷移します。

「ホーム編集」で追加したセクションは、Topページのヒーロー（サイト名・紹介文）と「最新記事」の間に、上から順番に表示されます。ドラッグ&ドロップではなく上下ボタンでの並び替えです。作成直後は非表示になっているので、内容を確認してから「Topページに表示する」にチェックを入れて公開してください。

## デプロイ手順（Vercel）

1. このプロジェクトをGitHubリポジトリにpushします。
2. https://vercel.com で「Add New... > Project」からそのリポジトリをインポートします。
3. Vercelのプロジェクト設定 > Environment Variables に以下を登録します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`（デプロイ後のURL、例: `https://tapme-xi.vercel.app`）
4. 「Deploy」を実行すると `〇〇.vercel.app` のURLで公開されます。
5. 独自ドメインを使う場合は、Vercelの「Domains」設定から接続します。

## 今後の拡張候補

- カテゴリ・タグ機能
- 画像以外のファイル添付
- 複数管理者アカウントでの権限分け
- DeepL APIを使った自動翻訳下書き機能
