# tantuyu.slidevs

這裡收錄 tantuyu 在課程與分享中使用的簡報。

## 使用 Slidev

簡報以 [Slidev](https://sli.dev/) 製作，以自訂的腳本指令進行編譯

簡報內容僅供參考，某些簡報不再過多維護或更正

## Develop

開發簡報總覽首頁

```
pnpm dev:landing
```

進入簡報開發

```
pnpm dev
```

編譯生產

```
pnpm build
pnpm preview
```

使用 wrangler 登入後部署到 Cloudflare Worker & Page

```
pnpm build
pnpm exec wrangler deploy
```
