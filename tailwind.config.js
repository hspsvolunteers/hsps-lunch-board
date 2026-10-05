/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 定義新擬物化的基礎色系
        neu: {
          base: '#e0e5ec', // 核心底色 (偏暖的極淺灰藍色)
          text: '#4a5568', // 主要文字顏色 (深灰，確保閱讀對比度)
          light: '#ffffff', // 高光色
          dark: '#a3b1c6'  // 陰影色
        }
      },
      boxShadow: {
        // 凸起狀態 (適用於卡片、外框、未按下的按鈕)
        'neu-flat': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',

        // 凸起狀態 Hover (適用於按鈕懸停，陰影稍微擴大)
        'neu-hover': '12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255, 0.6)',

        // 凹陷狀態 (適用於 Input 輸入框、按鈕 Click 按壓狀態)
        'neu-pressed': 'inset 6px 6px 10px 0 rgba(163, 177, 198, 0.7), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.8)',
      }
    },
  },
  plugins: [],
}