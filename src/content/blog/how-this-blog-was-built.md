---
title: "用 AI 建構這個部落格：從 PRD 到 GitHub Pages 的全過程"
description: "從一份 PRD 出發，用 Claude Code 在一個 session 內初始化 Astro + Tailwind 專案、設計 Design System、配置 CI/CD，並修掉三個上線前的 Bug。這是部落格本身的建構紀錄。"
pubDate: 2026-04-08
tags: ["Astro", "TailwindCSS", "CI-CD", "AI", "ClaudeCode"]
---

你正在讀的這篇文章，和它所在的部落格，都是用 AI 建構的。

這不是比喻——我把一份 PRD 丟給 Claude Code，一個 session 之內它初始化了 Astro 專案、設計了完整的 Design System、寫好了 GitHub Actions 部署流程，並且產出了這個你現在看到的網站。

這篇文章記錄的就是那個過程：每個技術決策背後的理由，以及讓網站真正上線之前踩到的三個坑。

---

## 先有 PRD，再有程式碼

在叫 AI 動手之前，我先寫了一份 PRD。

這不是因為我特別嚴謹，而是因為 AI 最擅長的是「執行清楚的規格」，最容易失敗的是「猜測你想要什麼」。PRD 就是讓 AI 有足夠的上下文可以做出好的決策，不需要每一步都問你。

PRD 定義了幾件事：

**技術棧**：Astro + Tailwind CSS + MDX + GitHub Pages。每一項都有明確的原因，不是隨機挑的。

**設計規範**：我不只說「要好看」，我給了具體的配色（Slate Blue `#4F46E5`、Soft Orange `#F59E0B`、Off-white `#F8FAFC`）、要有圓角和充足空白、整體感要「親切且可靠」。

**功能需求**：標籤分類、程式碼高亮、閱讀時間估算、SEO 自動化。

**部署流程**：push 到 `main` 就自動建置並發布到 GitHub Pages。

有了這份 PRD，Claude 產出的第一版就很接近最終結果——不是因為 AI 很聰明，而是規格夠清楚。

---

## 技術選型的理由

### Astro

Astro 的核心概念是 **Island Architecture**：頁面預設輸出純 HTML，只有需要互動的元件才載入 JavaScript。對部落格來說，這代表極快的首頁載入速度，以及對 SEO 天然友善的靜態 HTML。

另一個讓我選 Astro 的原因是 **Content Collections**——內建的文章管理系統，用 Zod 做 schema 驗證，讓每篇文章的 frontmatter 都有型別保護。不用自己處理 Markdown 的讀取和解析。

### Tailwind CSS

對 AI 來說，Tailwind 是最友善的 CSS 解決方案。原因很簡單：**class 就是文件**。`text-primary-600`、`hover:shadow-card-hover`、`rounded-md`——AI 不需要猜測你的自訂 CSS class 是什麼意思，class 名稱本身就是完整的說明。

相比之下，如果你用 CSS Modules 或自訂 class，AI 每次調整樣式都需要先讀 CSS 檔案才能理解現有的樣式體系。Tailwind 把這個摩擦降到最低。

### MDX + GitHub Pages

MDX 讓 Markdown 文章可以嵌入 Astro 元件，未來如果想在文章裡放互動式程式碼範例或資料圖表，直接寫就好。

GitHub Pages 則是零成本、有 CDN、和 GitHub Actions 天生整合。對個人部落格來說沒有更好的選擇。

---

## Design System：tailwind.config.js 的設計邏輯

這是整個專案裡我花最多心思定義的部分，也是讓 AI 可以在整個網站保持視覺一致性的關鍵。

### 語義化配色

`tailwind.config.js` 裡不只是定義顏色，而是定義**語義**：

```js
colors: {
  primary: { DEFAULT: '#4F46E5', 50: '...', ..., 900: '...' },
  accent:  { DEFAULT: '#F59E0B', ... },
  background: '#F8FAFC',
  text: { DEFAULT: '#1E293B', muted: '#64748B' },
}
```

選 **Slate Blue** 作為主色，是因為它帶有技術感和穩定感，不像純藍那麼冷，不像紫色那麼特立獨行。**Soft Orange** 作為強調色則帶來溫暖感，用在 CTA 按鈕上能讓使用者感覺到「這可以點」。

每個顏色都有完整的 50–900 scale，這讓 hover 狀態、active 狀態、背景淺色版本都有足夠的層次可以用——不需要自己計算透明度或混色。

### 命名語義化陰影

```js
boxShadow: {
  'card':       '0 1px 3px 0 rgb(0 0 0 / 0.07), ...',
  'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), ...',
  'nav':        '0 1px 0 0 #E2E8F0',
}
```

與其每次都寫 `shadow-[0_1px_3px...]`，不如給它一個名字。`shadow-card` 和 `shadow-card-hover` 讓程式碼的意圖一目瞭然，AI 寫元件時也不需要每次查詢正確的陰影數值。

### `@layer components`：把模式提升為元件

```css
@layer components {
  .card {
    @apply bg-surface rounded-md shadow-card border border-border
           transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5;
  }
  .btn-primary { ... }
  .tag { ... }
}
```

這些不是 Tailwind 提供的，而是我在 `global.css` 裡定義的元件 class。每次要做一個卡片，就用 `class="card"`，不需要每次都重寫十幾個 utility class 的組合。**命名讓意圖清晰，也讓 AI 的輸出更一致。**

### 一個靜默失敗的坑

上線後第一個發現的問題是：**網站完全沒有樣式。**

根本原因很隱晦：`tailwind.config.js` 最後一行寫了 `require('@tailwindcss/typography')`，但 `package.json` 有 `"type": "module"`，整個專案是 ESM 環境，`require()` 根本不存在。

更糟的是：Tailwind 在載入設定失敗時不會報錯，它只是靜默地輸出空的 CSS。結果就是：build 成功、沒有任何警告、但網站上所有 Tailwind class 全都無效。

修法是把 `require()` 換成 ESM import：

```js
// 錯誤：ESM 環境下 require 不存在
plugins: [require('@tailwindcss/typography')]

// 正確
import typography from '@tailwindcss/typography';
plugins: [typography]
```

這是一個「懂得看結果」比「懂得寫程式碼」更重要的案例——AI 寫的程式碼沒有語法錯誤，但結果是錯的。你必須自己看到「怎麼完全沒有樣式」這個現象，然後去找根因。

---

## 專案結構與元件拆分

### Content Collections Schema

```ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(
      z.string().regex(/^[^/]+$/, 'Tag must not contain "/"')
    ).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Tag 的正則驗證是血淚教訓：第一次把標籤寫成 `CI/CD`，Astro 的靜態路由生成器把斜線當成路徑分隔符，build 直接爆掉。加上這條驗證之後，未來如果有人（包括 AI）嘗試加入含斜線的 tag，會在 build 時就報錯，不會等到路由出問題才發現。

### 版型層次

```
BaseLayout（HTML shell、OG meta、字體、Navbar、Footer）
  └── BlogLayout（文章標題、tags、發布日期、閱讀時間）
         └── 文章內容
```

BaseLayout 負責所有頁面共用的 HTML 結構和 SEO meta；BlogLayout 負責文章頁特有的 metadata 顯示。這樣的層次讓每個 layout 只做一件事，修改時不會互相影響。

### `siteUrl()` Helper

```ts
export function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
```

這個小 helper 是上線後第二個重要的修復。

部落格部署在 GitHub Pages 的子路徑 `/CCSuSu` 下，所有內部連結都需要加上這個前綴。但如果直接把 `/CCSuSu` 硬寫進每個 `href`，本地開發時就會壞掉（本地的 base 是 `/`）。

`import.meta.env.BASE_URL` 是 Astro 在 build 時注入的環境變數，production 是 `/CCSuSu/`，development 是 `/`。透過這個 helper 統一處理，讓程式碼在兩個環境下都能正確運作。

### CJK 感知閱讀時間

```ts
export function getReadingTime(content: string): number {
  const cjkChars = (content.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) ?? []).length;
  const latinWords = (content.match(/\b[a-zA-Z]+\b/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkChars / 400 + latinWords / 200));
}
```

大多數閱讀時間計算器只處理英文（約 200-250 詞/分鐘）。但中文的閱讀速度以字元計算，大約是 400 字/分鐘。這個函數分別計算中文字元和英文詞彙，再加總得出更準確的估算值。

---

## GitHub Actions：push 即部署的三個坑

### 坑一：沒有 package-lock.json

第一次 CI 就掛了：

```
Dependencies lock file is not found. Supported file patterns: package-lock.json
```

`actions/setup-node` 的 `cache: npm` 需要 lock file 才能建立快取；`npm ci` 也需要 lock file 才能安裝。但我的 repo 沒有 `package-lock.json`。

修法：移除 `cache: npm`，改用 `actions/cache` 自訂快取策略（以 `package.json` hash 為 key），並把 `npm ci` 換成 `npm install`。

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package.json') }}

- run: npm install
```

### 坑二：Deploy Job 無步驟、直接失敗

Build job 成功了，但 deploy job 顯示「This check has no steps」，2 秒就掛。

原因：deploy job 使用了 `environment: github-pages`，但 GitHub Pages 在 repo 的 Settings 裡還沒有啟用。這個 environment 不存在，job 在連第一個 step 都沒跑之前就被系統終止了。

這是一個純設定問題，不需要改程式碼。到 repo Settings → Pages → Build and deployment → Source，選 **GitHub Actions** 即可。

### 坑三：sub-path 路由 404

文章連結全部 404。

問題出在兩處：

**第一：** `astro.config.mjs` 裡 `base: '/ccsusu'`（小寫），但 repo 名稱是 `CCSuSu`（有大寫）。GitHub Pages 的路徑是大小寫敏感的，所以實際 URL 是 `/CCSuSu` 而不是 `/ccsusu`。

**第二：** 所有 `.astro` 元件裡的 `href="/blog/..."` 都是硬寫的絕對路徑，沒有加 base 前綴。點連結後去的是 `seasu.github.io/blog/...` 而不是 `seasu.github.io/CCSuSu/blog/...`。

這兩個問題需要同時修才能讓路由完全正常：修正 `base` 的大小寫，以及全站改用 `siteUrl()` helper 產生連結。

---

## 結語：AI 幫你跑，你得知道跑去哪

Claude Code 在一個 session 內完成了 21 個檔案、898 行的初始化。從專案架構到 Design System，到 GitHub Actions 設定，到第一篇文章的結構——全部都是對話產出的。

但讓網站真正正確地跑起來，需要我去看每一個錯誤訊息、理解根因、決定怎麼修。

`require()` 在 ESM 環境下靜默失敗，是因為我知道「網站沒有樣式」是不正常的，然後去追根因。tag 加正則驗證，是因為我理解 URL 路由不能含斜線。`siteUrl()` helper，是因為我知道本地和 production 的 base path 不一樣。

這些判斷不是 AI 做的，是我做的。AI 補上的是執行速度——從「知道要什麼」到「程式碼寫好了」的那段距離被大幅縮短。

這個部落格本身，就是「AI co-pilot，人負責方向」最直接的示範。
