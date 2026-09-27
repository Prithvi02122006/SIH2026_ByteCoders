import React from 'react';
import { ExperienceListing } from '../../types';
import { IconMapPin, IconClock, IconStepFree } from '../common/Icons';

interface SummaryCardProps {
  experience: ExperienceListing;
  onOpenStorefront: (exp: ExperienceListing) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  experience,
  onOpenStorefront
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'food': return 'Street Food & Dining';
      case 'culture': return 'Culture & Heritage';
      case 'workshops': return 'Artisan Workshop';
      case 'nightlife': return 'Evening & Acoustic';
      case 'hidden-gems': return 'Independent Gem';
      case 'markets': return 'Bazaar & Antiques';
      case 'nature': return 'Ghats & Sanctuaries';
      default: return category;
    }
  };

  // Determine structured hours status (Part D.8)
  const renderHoursBadge = () => {
    if (experience.structured_hours) {
      return (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] ${
          experience.open_now
            ? 'bg-[#DCFCE7] text-[#15803D]'
            : 'bg-[#FEE2E2] text-[#B91C1C]'
        }`}>
          {experience.open_now
            ? `Open Now • until ${experience.structured_hours.close}`
            : `Closed • opens ${experience.structured_hours.open}`}
        </span>
      );
    }
    return (
      <span className="text-[10px] text-[#5B7A99]">
        {experience.hours}
      </span>
    );
  };

  return (
    <article
      onClick={() => onOpenStorefront(experience)}
      className="card-surface bg-white overflow-hidden cursor-pointer transition-colors hover:border-[#1B3A6B] group flex flex-col justify-between"
    >
      <div>
        {/* Primary Image with Category and Independent Tag */}
        <div className="relative h-48 w-full bg-[#E5E7EB] overflow-hidden">
          <img
            src={experience.images[0]}
            alt={experience.experience_title}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
            loading="lazy"
          />

          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="card-tag px-2 py-0.5 bg-[#FFFFFF] text-[#1B3A6B] border border-[#E2E6EC] font-semibold text-[10px] tracking-wide">
              {getCategoryLabel(experience.category)}
            </span>

            {experience.specialty_tier === 'hidden-gem' && (
              <span className="card-tag px-2 py-0.5 bg-[#1B3A6B] text-white font-medium text-[10px] tracking-wide">
                Independent
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-[#FFFFFF]/95 text-[#111827] text-xs font-semibold border border-[#E2E6EC] rounded-[2px]">
            {experience.price_per_head === 0 ? 'Free' : `₹${experience.price_per_head} / person`}
          </div>
        </div>

        {/* Card Summary Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5B7A99]">
            <span className="flex items-center space-x-1">
              <IconMapPin size={12} />
              <span>{experience.neighborhood}</span>
            </span>
            <div>{renderHoursBadge()}</div>
          </div>

          <h3 className="font-serif font-bold text-lg text-[#111827] leading-snug line-clamp-2">
            {experience.experience_title}
          </h3>

          <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
            {experience.one_line_teaser}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-[#F7F8FA] border-t border-[#E2E6EC] flex items-center justify-between text-[11px] text-[#5B7A99]">
        <div className="flex items-center space-x-1.5">
          <IconClock size={12} />
          <span>{experience.duration_minutes} min</span>
        </div>

        <div className="flex items-center space-x-2">
          {experience.accessibility.step_free && (
            <span className="flex items-center space-x-1 text-[#15803D]" title="Step-free access verified">
              <IconStepFree size={12} />
              <span className="text-[10px]">Step-Free</span>
            </span>
          )}
          <span className="text-[#1B3A6B] font-medium group-hover:underline">
            View Storefront
          </span>
        </div>
      </div>
    </article>
  );
};
