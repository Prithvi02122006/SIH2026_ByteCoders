import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#3B3A34] mb-1">
          {label}
          {props.required && <span className="text-[#A83232] ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#FCF9F2] text-[#1F201C] text-sm rounded-[8px] border px-3 py-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5F7A3E] ${
          error
            ? 'border-[#B45309] focus:border-[#B45309] focus:ring-[#B45309]'
            : 'border-[#DDD4BE] focus:border-[#5F7A3E]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-[11px] text-[#A83232] mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#64625A] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
