import React from 'react';

/**
 * 新擬物化按鈕 (NeuButton)
 * 預設為凸起狀態，Hover 時陰影略微放大，點擊 (Active) 時呈現物理凹陷感。
 */
export const NeuButton = ({
    children,
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        px-6 py-3 rounded-xl font-medium tracking-wide transition-shadow duration-200 ease-in-out
        bg-neu-base text-neu-text 
        ${disabled
                    ? 'opacity-50 cursor-not-allowed shadow-neu-flat'
                    : 'shadow-neu-flat hover:shadow-neu-hover active:shadow-neu-pressed'
                }
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * 新擬物化輸入框 (NeuInput)
 * 預設為凹陷狀態，營造出可以輸入文字的立體溝槽感。
 */
export const NeuInput = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-semibold text-neu-text pl-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                // 使用 placeholder-gray-400 (或自訂透明度) 讓提示字元融入背景
                className="
          w-full px-4 py-3 rounded-xl appearance-none outline-none
          bg-neu-base text-neu-text placeholder-gray-400
          shadow-neu-pressed
          transition-shadow duration-200
        "
                {...props}
            />
        </div>
    );
};