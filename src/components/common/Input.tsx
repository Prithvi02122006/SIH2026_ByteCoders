import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  unit?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  unit,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#3B3A34] mb-1">
          {label}
          {props.required && <span className="text-[#A83232] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full bg-[#FCF9F2] text-[#1F201C] placeholder-[#8F8D84] text-sm rounded-[8px] border px-3 py-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5F7A3E] ${
            error
              ? 'border-[#B45309] focus:border-[#B45309] focus:ring-[#B45309]'
              : 'border-[#DDD4BE] focus:border-[#5F7A3E]'
          } ${unit ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64625A]">
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-[11px] text-[#A83232] mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#64625A] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
