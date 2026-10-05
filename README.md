# 胡適國小 營養午餐問題反應站 (hsps-lunch-board)

> 一起守護孩子們的校園飲食健康。提供透明公開的午餐問題反應與即時進度查詢平台。

---

## 🎨 專案特色

* **Neumorphism 新擬物化設計**：沉穩柔和的軟質陰影底座（`#e0e5ec`）、凹凸觸摸感按鈕與輸入欄位，維持極簡純粹的現代 UI 質感。
* **家長公開前台**：
  * 首頁佈告欄（`/`）：即時查看公開案件與校方處理回覆。
  * 問題反應表單（`/#/submit`）：區分公開資訊與私密聯絡資訊，送出後提供專屬追蹤碼。
* **委員管理後台**（`/#/admin`）：
  * 支援密碼驗證登入（`/#/login`）與路由保護。
  * 即時案件手風琴展開、查閱家長個資、編輯狀態、回覆內容及前台公開開關。
* **Serverless 後端**：透過單一 Google Apps Script (GAS) Web App 介接 Google 試算表儲存。
* **零 404 / 零白屏保證**：採用 `HashRouter` 與相對路徑建置，無縫支援 GitHub Pages、Vercel、Netlify 或任何靜態主機。

---

## 🛠️ 技術堆疊

* **核心框架**：React 19 + Vite 8
* **樣式設計**：Tailwind CSS (自訂 Neumorphism 色系與 `boxShadow`)
* **路由管理**：React Router DOM 7 (`HashRouter`)
* **後端服務**：Google Apps Script (GAS)

---

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 專案建置
npm run build
```
