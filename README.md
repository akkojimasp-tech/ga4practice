# GA4 Practice Demo

GA4勉強会向けの、GitHub Pagesでそのまま公開できる静的デモサイトです。

トップ、サービス紹介、料金、お問い合わせの4ページで構成しています。

## 使い方

1. 勉強会で使う `gtag.js` のスニペットを各HTMLの `<head>` に追加します。
2. GitHub に push します。
3. GitHub Pages を有効化して公開します。

## このサイトで試せること

- CTAクリックイベント
- ページ遷移を含む回遊確認
- ファイルダウンロード風イベント
- `select_item`, `add_to_cart`, `purchase`
- `generate_lead` のフォーム送信イベント
- 画面下部のログ表示によるイベント確認

## GitHub Pages 公開メモ

リポジトリ設定の Pages で、デプロイ元を対象ブランチの root にすると、そのまま公開できます。