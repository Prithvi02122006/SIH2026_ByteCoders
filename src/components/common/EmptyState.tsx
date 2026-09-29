import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center border-2 border-dashed border-[#DDD4BE] rounded-[14px] bg-[#FCF9F2]/70 ${className}`}>
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#EAE3CE] text-[#3D5528] flex items-center justify-center border border-[#DDD4BE]">
          {icon}
        </div>
      )}
      <h4 className="font-serif text-lg font-bold text-[#1F201C] mb-1">{title}</h4>
      <p className="text-xs text-[#64625A] max-w-md mx-auto mb-5 leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
