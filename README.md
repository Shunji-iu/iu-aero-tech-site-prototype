# 茨城大学 航空技術研究会ウェブサイト

このサイトは Astro で静的な HTML を生成します。公開先のサーバーで Node.js を動かす必要はありません。

## 開発・ビルド

```sh
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` が作成する `dist/` の中身を、利用するホスティングサービスの公開フォルダーに配置してください。ページURLは従来どおり `index.html` や `blog.html` です。

## GitHub Pagesへの公開

このリポジトリは GitHub Actions でビルド・公開します。GitHub のリポジトリ設定で **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。その後 `main` ブランチへ push するたびにサイトが公開されます。Actions タブから手動で実行することもできます。

公開先は `https://shunji-iu.github.io/iu-aero-tech-site-prototype/` です。ローカル開発とプレビューではルートパスを使い、GitHub Actions上のビルドではリポジトリのパスを自動設定します。

## 画像の追加

画像ファイルはすべて `public/images/` に置きます。ページやデータからは `images/ファイル名.webp` の形式で指定します（`public/` はパスに含めません）。GitHub Pagesのサブパスで表示するため、先頭に `/` を付けずに指定してください。ファイル名は半角英数字とハイフンにすると扱いやすいです。写真は容量を抑えやすいWebP形式がおすすめです。

活動内容ページで現在参照している画像は次の名前です。該当する画像をこの名前で `public/images/` に追加すると表示されます。

- `activity1.webp`、`activity2.webp`、`activity3.webp`、`activity4.webp`
- `drone.webp`
- `plane.webp`
- `rocket.webp`

トップページの画像を差し替える場合は、同じフォルダー内の `top1-pc.webp`、`top1-sp.webp`、`top2-pc.webp`、`top2-sp.webp`、`top3-pc.webp`、`top3-sp.webp` と同じ名前で置き換えます。

## ブログの更新

1. 記事の写真を `public/images/` に追加します。例：`public/images/blog4.webp`
2. `src/content/blog/` にMarkdownファイルを追加します。ファイル名を `blog4.md` のようにし、`blog` の後の番号は重複しないようにします。

```md
---
date: 2026-10-10
title: 活動報告
summary: 記事一覧に表示する短い紹介文です。
image: images/blog4.webp
---

ここから記事本文を書きます。**太字**、箇条書き、リンクなどのMarkdown記法が使えます。

- できごと
- 活動の様子

[リンクの例](https://example.com)
```

`date`、`title`、`summary`、`image` は `---` で囲んだヘッダーに記入し、その下に本文をMarkdownで書きます。JSONのカンマやHTMLタグは不要です。活動予定は `src/data/schedule-data.json` で更新します。更新後は `npm run build` を実行し、新しい `dist/` を公開します。GitHub Pagesの場合、変更を `main` ブランチへpushすると自動でビルド・公開されます。

サイトの共通ヘッダーとフッターは `src/components/`、ページ本文は `src/pages/`、共通のタイトル・メタ情報・読み込み設定は `src/layouts/BaseLayout.astro` で管理します。
