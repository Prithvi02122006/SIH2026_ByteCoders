import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceListing } from '../../types';
import { IconClose, IconMapPin } from '../common/Icons';
import { calculateDistanceKm } from '../../engine/routingEngine';

export const NearbyVendorAdPopup: React.FC = () => {
  const {
    allowNearbyAds,
    experiences,
    openStorefront,
    activeStorefront,
    activeRole,
    userLocation
  } = useApp();

  const [dismissed, setDismissed] = useState<boolean>(false);
  const [promotedListing, setPromotedListing] = useState<ExperienceListing | null>(null);

  // Surface eligible listing periodically if traveler opted in
  useEffect(() => {
    if (!allowNearbyAds || activeRole !== 'traveler' || dismissed) {
      setPromotedListing(null);
      return;
    }

    const eligible = experiences.filter(e => e.eligible_for_nearby_promotions !== false);
    if (eligible.length === 0) return;

    // Pick an independent or signature gem
    const pick = eligible.find(e => e.specialty_tier === 'hidden-gem') || eligible[0];

    // Delay so it never appears instantly on page load, even for opted-in travelers
    const timer = setTimeout(() => {
      setPromotedListing(pick);
    }, 22000);

    return () => clearTimeout(timer);
  }, [allowNearbyAds, activeRole, experiences, dismissed]);

  // Don't show if modal is already open or traveler opted out
  if (!allowNearbyAds || dismissed || !promotedListing || activeStorefront || activeRole !== 'traveler') {
    return null;
  }

  return (
    <aside
      aria-label="Nearby Merchant Recommendation"
      className="fixed bottom-16 right-4 sm:right-6 z-30 max-w-sm w-full bg-white border border-[#1B3A6B] rounded-[4px] p-3.5 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between border-b border-[#E2E6EC] pb-1.5 mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1B3A6B]">
            Nearby Independent Recommendation
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#9CA3AF] hover:text-[#111827] p-0.5"
          title="Dismiss recommendation"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div
        onClick={() => openStorefront(promotedListing)}
        className="cursor-pointer group flex items-start space-x-3"
      >
        <div className="w-16 h-16 rounded-[2px] bg-[#E5E7EB] overflow-hidden flex-shrink-0">
          <img
            src={promotedListing.images[0]}
            alt={promotedListing.experience_title}
            className="w-full h-full object-cover group-hover:opacity-90"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-xs text-[#111827] line-clamp-1 group-hover:text-[#1B3A6B]">
            {promotedListing.experience_title}
          </h4>
          <div className="flex items-center space-x-1 text-[11px] text-[#5B7A99] mt-0.5">
            <IconMapPin size={11} />
            <span>
              {promotedListing.neighborhood}
              {userLocation && (() => {
                const distKm = calculateDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  promotedListing.geolocation.lat,
                  promotedListing.geolocation.lng
                );
                const label = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;
                return ` (approx. ${label} away)`;
              })()}
            </span>
          </div>
          <p className="text-[11px] text-[#4B5563] line-clamp-1 mt-0.5">
            {promotedListing.one_line_teaser}
          </p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[#E2E6EC] flex items-center justify-between text-[11px]">
        <span className="font-semibold text-[#111827]">
          {promotedListing.price_per_head === 0 ? 'Free' : `₹${promotedListing.price_per_head}`}
        </span>
        <button
          onClick={() => openStorefront(promotedListing)}
          className="text-[#1B3A6B] font-semibold hover:underline"
        >
          View Full Storefront
        </button>
      </div>
    </aside>
  );
};
