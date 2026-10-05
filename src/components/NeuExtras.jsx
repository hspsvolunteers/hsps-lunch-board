import React from 'react';

/**
 * 補充 NeuComponents 未涵蓋的新擬物化元件。
 * 樣式完全沿用 tailwind.config.js 中的 neu 色系與 shadow-neu-* 陰影。
 */

/** 凸起底座卡片 */
export const NeuCard = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag className={`rounded-2xl bg-neu-base shadow-neu-flat ${className}`} {...props}>
    {children}
  </Tag>
);

/** 多行輸入框（凹陷） */
export const NeuTextarea = ({ label, id, rows = 5, className = '', ...props }) => (
  <div className={`flex flex-col space-y-2 ${className}`}>
    {label && (
      <label htmlFor={id} className="pl-1 text-sm font-semibold text-neu-text">
        {label}
      </label>
    )}
    <textarea
      id={id}
      rows={rows}
      className="w-full resize-y appearance-none rounded-xl bg-neu-base px-4 py-3 leading-relaxed text-neu-text placeholder-gray-400 shadow-neu-pressed outline-none transition-shadow duration-200"
      {...props}
    />
  </div>
);

/** 下拉選單（凹陷） */
export const NeuSelect = ({ label, id, options = [], className = '', ...props }) => (
  <div className={`flex flex-col space-y-2 ${className}`}>
    {label && (
      <label htmlFor={id} className="pl-1 text-sm font-semibold text-neu-text">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        id={id}
        className="w-full cursor-pointer appearance-none rounded-xl bg-neu-base px-4 py-3 pr-10 text-neu-text shadow-neu-pressed outline-none"
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

/** 開關：凹陷軌道 + 凸起圓鈕 */
export const NeuSwitch = ({ id, checked, onChange, label, description, disabled = false }) => (
  <label
    htmlFor={id}
    className={`flex items-center justify-between gap-6 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
  >
    <span className="min-w-0">
      {label && <span className="block text-sm font-semibold text-neu-text">{label}</span>}
      {description && <span className="mt-0.5 block text-xs text-slate-400">{description}</span>}
    </span>
    <span className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full shadow-neu-pressed">
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`absolute left-1 h-6 w-6 rounded-full bg-neu-base shadow-neu-flat transition-transform duration-300 ease-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <span
          className={`absolute inset-0 m-auto h-2 w-2 rounded-full transition-colors duration-300 ${
            checked ? 'bg-emerald-600/60' : 'bg-neu-dark/60'
          }`}
        />
      </span>
    </span>
  </label>
);

/** 狀態標籤：低調文字色 + 小圓點 */
const STATUS_STYLE = {
  已回覆: 'text-emerald-700/80',
  處理中: 'text-amber-700/80',
  待處理: 'text-slate-500',
};

export const StatusTag = ({ status }) => (
  <span
    className={`inline-flex shrink-0 items-center gap-2 text-xs font-medium tracking-wider ${
      STATUS_STYLE[status] || 'text-slate-500'
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status || '待處理'}
  </span>
);

/** 載入中圖示 */
export const Spinner = ({ className = 'h-4 w-4' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** 線條箭頭 */
export const Chevron = ({ direction = 'down', className = 'h-4 w-4' }) => {
  const rotate = { down: '', up: 'rotate-180', left: 'rotate-90', right: '-rotate-90' }[direction];
  return (
    <svg className={`${className} ${rotate}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** 日期格式化 */
export const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
