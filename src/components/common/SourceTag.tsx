import React from 'react';

export type SourceType = 'your_data' | 'public_data' | 'estimated';

interface SourceTagProps {
  type?: SourceType;
  sourceText?: string;
  className?: string;
}

export const SourceTag: React.FC<SourceTagProps> = ({
  type = 'your_data',
  sourceText,
  className = '',
}) => {
  if (type === 'your_data' && !sourceText) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-tight px-1.5 py-0.5 rounded bg-[#EAE3CE] text-[#3D4F28] border border-[#DDD4BE] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#5F7A3E]"></span>
        Your data
      </span>
    );
  }

  if (type === 'public_data' || (sourceText && sourceText.toLowerCase().includes('public data'))) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-tight px-1.5 py-0.5 rounded bg-[#F2EDE1] text-[#55524A] border border-[#DDD4BE] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></span>
        {sourceText || 'Public data'}
      </span>
    );
  }

  // Estimated
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-tight px-1.5 py-0.5 rounded bg-[#FBF0D8] text-[#8C5511] border border-[#EACFA8] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#C87D1E]"></span>
      {sourceText || 'Estimated'}
    </span>
  );
};
