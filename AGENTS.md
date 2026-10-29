## 專案說明

該專案使用 Slidev 生成簡報，並使用 Astro 進行 landing page 的開發與總簡報的入口。

## 專案結構

- `./scripts/`：內有多個開發與建置相關的指令腳本
- `./landing/`：該目錄為 Astro 的 landing page 原始碼
- `./slides/`：存放多個 slidev 的簡報

## 專案配置

- 非必要請一律使用 `pnpm`，而非 `npm`
- 部屬策略暫時未定義清楚，未來並非藉由 CI/CD 部署個人 VPS 上
