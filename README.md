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

## ブログの更新

ブログ記事は `src/data/blog-data.json` に追加します。既存記事と同じ形式で `id`、`date`、`title`、`summary`、`text`、`image` を記入してください。画像は `public/images/` に追加し、`image` には `images/ファイル名.webp` のように指定します。活動予定は `src/data/schedule-data.json` で更新します。更新後は `npm run build` を実行し、新しい `dist/` を公開します。

サイトの共通ヘッダーとフッターは `src/components/`、ページ本文は `src/pages/`、共通のタイトル・メタ情報・読み込み設定は `src/layouts/BaseLayout.astro` で管理します。
