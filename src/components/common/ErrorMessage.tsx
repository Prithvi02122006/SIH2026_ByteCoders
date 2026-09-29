import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'warning' | 'error';
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = 'warning',
  onDismiss,
  className = '',
}) => {
  const isWarning = variant === 'warning';
  const border = isWarning ? 'border-[#EACFA8] bg-[#FDF8EC]' : 'border-[#E8BFBD] bg-[#FDF2F2]';
  const iconColor = isWarning ? 'text-[#C87D1E]' : 'text-[#A83232]';
  const titleColor = isWarning ? 'text-[#8C5511]' : 'text-[#8E2824]';
  const textColor = isWarning ? 'text-[#6B4611]' : 'text-[#70201D]';

  return (
    <div className={`p-4 rounded-[12px] border ${border} ${className} flex items-start gap-3`}>
      <div className={`shrink-0 mt-0.5 ${iconColor}`}>
        {isWarning ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        {title && <h5 className={`text-sm font-semibold ${titleColor} mb-0.5`}>{title}</h5>}
        <p className={`text-xs ${textColor} leading-relaxed`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs text-[#8C8A80] hover:text-[#1F201C] p-1 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
};
