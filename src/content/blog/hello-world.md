---
title: "Hello World：用 AI 開始開發之旅"
description: "這是我用 Claude 輔助建立個人部落格的第一篇文章，記錄整個過程與心得。"
pubDate: 2026-04-08
tags: ["AI", "Astro", "Frontend"]
---

## 為什麼用 AI 開發部落格？

過去幾個月，我一直在探索 **AI 輔助開發**的可能性。從需求分析、架構設計到程式碼撰寫，AI 工具大幅縮短了從「想法」到「實作」的距離。

這個部落格本身就是最好的例子 — 整個專案結構、設計系統、部署流程，都是透過與 Claude 對話逐步完成的。

## 技術選型

```ts
// astro.config.mjs 核心設定
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
});
```

- **Astro** — 超快速的靜態網站生成器，Island Architecture 讓互動元件按需載入
- **Tailwind CSS** — 設計系統化，讓 AI 更容易理解並調整樣式
- **MDX** — 在 Markdown 中嵌入 React/Astro 元件，文章更有彈性

## 接下來

後續文章將涵蓋：

1. 如何用 AI 快速 Prototype UI
2. Prompt Engineering 在開發中的實際應用
3. GitHub Actions + GitHub Pages 零成本部署

敬請期待！
