import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyle = 'inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5F7A3E] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      // Dark olive button with subtle lift
      variantStyle = 'bg-[#2D431E] text-[#FBF3DC] hover:bg-[#3B5727] active:translate-y-0.5 shadow-xs hover:shadow-sm';
      break;
    case 'secondary':
      // Muted sage green
      variantStyle = 'bg-[#6E8B4E] text-[#FFFFFF] hover:bg-[#5C7541] active:translate-y-0.5 shadow-xs';
      break;
    case 'outline':
      variantStyle = 'bg-[#FCF9F2] text-[#2D431E] border border-[#DDD4BE] hover:bg-[#F3EBD4] active:translate-y-0.5';
      break;
    case 'danger':
      variantStyle = 'bg-[#A83232] text-white hover:bg-[#912828] active:translate-y-0.5';
      break;
    case 'ghost':
      variantStyle = 'text-[#2D431E] hover:bg-[#F3EBD4]/70 active:bg-[#EAE0C5]';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'text-xs px-3 py-1.5 gap-1.5';
      break;
    case 'md':
      sizeStyle = 'text-sm px-4 py-2 gap-2';
      break;
    case 'lg':
      sizeStyle = 'text-base px-5 py-2.5 gap-2.5';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
