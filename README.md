# トライアルサイト（Next.js + Supabase CMS）

CMS機能を持つ簡易ホームページのトライアル実装です。Topページ、記事一覧・詳細ページ、Markdown対応の管理画面（ログイン・記事作成/編集/削除・公開/下書き切り替え・サムネイルアップロード）を備えています。

## 技術スタック

- Next.js 16（App Router / TypeScript）
- Supabase（PostgreSQL / Auth / Storage）
- Tailwind CSS v4
- react-markdown（Markdown入力のプレビュー表示）

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. https://supabase.com でアカウントを作成し、新規プロジェクトを作成します。
2. プロジェクトの「Project Settings > API」から `Project URL` と `anon public key` を控えます。
3. 「SQL Editor」を開き、[`supabase/schema.sql`](supabase/schema.sql) の内容を貼り付けて実行します。
   - `posts` テーブルの作成
   - RLS（行レベルセキュリティ）ポリシーの設定（下書きは管理者のみ閲覧可）
   - サムネイル画像用の `thumbnails` Storageバケットの作成
4. 「Authentication > Users」から、管理者用のアカウント（メールアドレス＋パスワード）を1〜2件作成します。
   - サインアップ画面は用意していません。管理者アカウントはSupabaseダッシュボードから直接作成してください。

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、Supabaseの値を設定します。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=あなたのプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon key
```

`.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### 3. ローカルでの起動

```bash
npm install
npm run dev
```

http://localhost:3000 で公開側のサイトを確認できます。管理画面は http://localhost:3000/admin/posts （未ログインの場合は自動的にログイン画面へリダイレクトされます）。

## 画面構成

### 公開側

| パス | 内容 |
|---|---|
| `/` | Topページ（最新記事5件を表示） |
| `/posts` | 公開済み記事の一覧（新着順） |
| `/posts/[slug]` | 記事詳細 |

### 管理側（ログイン必須）

| パス | 内容 |
|---|---|
| `/admin/login` | ログイン画面 |
| `/admin/posts` | 記事一覧（下書き含む全件、編集・削除） |
| `/admin/posts/new` | 新規記事作成 |
| `/admin/posts/[id]` | 記事編集 |

記事編集画面ではタイトルからスラッグを自動生成（手動修正も可能）、Markdown入力とプレビューの切り替え、サムネイル画像のアップロード、公開/下書きの切り替えができます。

## デプロイ手順（Vercel）

1. このプロジェクトをGitHubリポジトリにpushします。
2. https://vercel.com で「Add New... > Project」からそのリポジトリをインポートします。
3. Vercelのプロジェクト設定 > Environment Variables に以下を登録します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 「Deploy」を実行すると `〇〇.vercel.app` のURLで公開されます。
5. 独自ドメインを使う場合は、Vercelの「Domains」設定から接続します。

## 今後の拡張候補

- カテゴリ・タグ機能
- 画像以外のファイル添付
- 複数管理者アカウントでの権限分け
- 多言語対応
