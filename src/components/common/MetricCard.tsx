import React from 'react';
import { SourceTag, SourceType } from './SourceTag';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sourceType?: SourceType;
  sourceText?: string;
  subtext?: string;
  trendText?: string;
  trendPositive?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  sourceType = 'your_data',
  sourceText,
  subtext,
  trendText,
  trendPositive,
  tooltip,
  icon,
  className = '',
}) => {
  return (
    <div className={`p-4 foodloop-card ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-[#64625A] uppercase tracking-wider">{label}</span>
          {tooltip && (
            <span
              className="text-[#8C8A80] hover:text-[#1F201C] cursor-help text-[11px] font-bold"
              title={tooltip}
            >
              (?)
            </span>
          )}
        </div>
        <SourceTag type={sourceType} sourceText={sourceText} />
      </div>

      <div className="flex items-baseline gap-1.5 my-1.5">
        <span className="font-serif text-3xl font-bold tracking-tight text-[#1F201C]">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-[#64625A]">{unit}</span>}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#EAE3CE]/60 text-xs">
        {subtext && <span className="text-[#64625A]">{subtext}</span>}
        {trendText && (
          <span
            className={`font-medium ${
              trendPositive ? 'text-[#3E7326]' : 'text-[#B45309]'
            }`}
          >
            {trendText}
          </span>
        )}
      </div>
    </div>
  );
};
