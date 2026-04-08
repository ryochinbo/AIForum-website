# AIForum Website

AIに関する情報交換・勉強会コミュニティ「AIForum」の公式サイトです。

🌐 **サイトURL**: https://ryochinbo.github.io/AIForum-website/

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| 静的サイトジェネレーター | [Eleventy (11ty)](https://www.11ty.dev/) v2 |
| テンプレートエンジン | Nunjucks |
| ホスティング | GitHub Pages (`docs/` フォルダ) |
| CI/CD | GitHub Actions（`main` push 時に自動ビルド） |

---

## ディレクトリ構成

```
AIForum-website/
├── posts/              # 記事フォルダ（1記事 = 1フォルダ）
│   ├── 2025-09-01_lt01/
│   │   ├── index.md   # 記事本文
│   │   └── image.png  # サムネイル画像（任意）
│   └── ...
├── _includes/          # Nunjucksテンプレート
│   ├── base.njk        # HTMLベースレイアウト
│   ├── header.njk      # ナビバー
│   └── footer.njk      # フッター
├── _data/
│   └── site.json       # サイト共通設定
├── styles/
│   └── style.css       # スタイルシート
├── images/             # 共通画像
├── index.html          # トップページ
├── docs/               # ビルド出力（GitHub Pages配信元）
└── .eleventy.js        # Eleventy設定
```

---

## 記事の追加方法

### 1. フォルダを作成する

`posts/` 内に `YYYY-MM-DD_スラグ名/` の形式でフォルダを作成します。

```
posts/2026-04-10_lt04/
```

> **注意**: フォルダ名は英数字・ハイフンのみ使用してください。日本語フォルダ名にするとサムネイル画像のパスが壊れます。

### 2. `index.md` を作成する

フォルダ内に `index.md` を作成し、以下のフォーマットで記述します。

```markdown
---
title: "第4回 LT会"
description: "イベントの概要説明（一覧ページやSNS共有時に表示されます）"
date: 2026-04-10
tags: [LT会, イベント]
layout: base.njk
permalink: "/posts/2026-04-10_lt04/"
thumbnail: "./thumbnail.jpg"
---

<div class="section">
<article>

<div class="post-meta">
  <time datetime="2026-04-10">2026/04/10</time>
  <span class="tag-pill">LT会</span>
  <span class="tag-pill">イベント</span>
</div>

# 第4回 LT会

記事本文をここに書きます。Markdownが使えます。

## セクション見出し

- 箇条書きも使えます
- **太字**、*斜体*も可能

</article>
</div>
```

### 3. サムネイル画像を追加する（任意）

同じフォルダに画像ファイルを置き、front matter の `thumbnail:` に指定します。

```
posts/2026-04-10_lt04/
├── index.md
└── thumbnail.jpg   ← ここに置く
```

```yaml
thumbnail: "./thumbnail.jpg"
```

画像を指定しない場合はデフォルトのプレースホルダーが表示されます。

### 4. スライドを埋め込む（Docswell）

Docswellの埋め込みコードをそのまま `index.md` 内に貼り付けるだけで表示されます。

```html
<script async class="docswell-embed"
  src="https://www.docswell.com/assets/libs/docswell-embed/docswell-embed.min.js"
  data-src="https://www.docswell.com/slide/XXXXX/embed"
  data-aspect="0.5625"></script>
```

---

## ローカルでの開発・確認

### 初回セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run start
```

ブラウザで http://localhost:8080/AIForum-website/ を開いて確認できます。ファイルを保存すると自動でリロードされます。

### ビルド

```bash
npm run build
```

`docs/` フォルダに出力されます。

---

## 公開（デプロイ）の仕組み

`main` ブランチに push すると GitHub Actions が自動で以下を実行します。

1. `docs/` フォルダを削除（クリーンビルド）
2. Eleventy でサイトをビルド
3. 生成された `docs/` をコミット＆プッシュ
4. GitHub Pages が `docs/` フォルダの内容を配信

> 記事を追加・編集したら、作業ブランチで PR を作成して `main` にマージしてください。マージ後に自動でサイトが更新されます。

---

## 活動履歴

| 日付 | 内容 |
|---|---|
| 2025/07/28 | コミュニティ発足 |
| 2025/08/25 | GAS → GitHub Pages に移行 |
| 2025/09/01 | 第1回 LT会 |
| 2025/11/10 | 第2回 LT会 |
| 2025/12/22 | 第3回 LT会 |
