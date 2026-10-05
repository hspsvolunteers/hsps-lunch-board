import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相對路徑，確保部屬至 GitHub Pages 子目錄或任何自訂網域時靜態資源均能正確載入，避免白屏
  base: './',
})
