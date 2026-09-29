import React from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flat?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  subtitle,
  action,
  children,
  className = '',
  flat = false,
}) => {
  return (
    <div className={`p-5 ${flat ? 'foodloop-card-flat' : 'foodloop-card'} ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#EAE3CE]/70">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#3D5528] flex items-center justify-center shrink-0 border border-[#DDD4BE]">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-serif text-lg font-bold text-[#1F201C] tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-[#64625A] mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
