import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconClose,
  IconMapPin,
  IconClock,
  IconStepFree,
  IconWheelchair,
  IconShield
} from '../common/Icons';

export const VendorStorefrontModal: React.FC = () => {
  const { activeStorefront, closeStorefront, addExperienceToTrip } = useApp();

  if (!activeStorefront) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111827]/50 backdrop-blur-[2px]">
      <div className="bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E2E6EC] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex items-center space-x-2">
            <IconShield size={16} className="text-[#1B3A6B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1B3A6B]">
              Verified Merchant Storefront
            </span>
            {activeStorefront.specialty_tier === 'hidden-gem' && (
              <span className="card-tag px-2 py-0.5 bg-[#1B3A6B] text-white font-medium text-[10px]">
                Independent Artisan
              </span>
            )}
          </div>
          <button
            onClick={closeStorefront}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded-[2px]"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111827] leading-tight">
                {activeStorefront.experience_title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#5B7A99]">
              <span className="font-semibold text-[#111827]">
                {activeStorefront.vendor_name}
              </span>
              <span>Est. {activeStorefront.vendor_established}</span>
              <span className="flex items-center space-x-1">
                <IconMapPin size={13} />
                <span>{activeStorefront.neighborhood}</span>
              </span>
              <span>Coordinates: {activeStorefront.geolocation.lat}, {activeStorefront.geolocation.lng}</span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeStorefront.images.map((img, idx) => (
              <div key={idx} className="h-56 bg-[#E5E7EB] rounded-[2px] overflow-hidden border border-[#E2E6EC]">
                <img
                  src={img}
                  alt={`${activeStorefront.experience_title} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Description & Artisan Story */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
              About This Experience & Heritage
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {activeStorefront.full_description}
            </p>
          </div>

          {/* Key Facts & Accessibility Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] text-xs">
            <div>
              <div className="text-[11px] text-[#5B7A99] uppercase tracking-wider font-medium">Session Length</div>
              <div className="font-semibold text-[#111827] mt-0.5">{activeStorefront.duration_minutes} minutes</div>
            </div>
            <div>
              <div className="text-[11px] text-[#5B7A99] uppercase tracking-wider font-medium">Pricing Base</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {activeStorefront.price_per_head === 0 ? 'Free entry' : `₹${activeStorefront.price_per_head} / person`}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#5B7A99] uppercase tracking-wider font-medium">Group Capacity</div>
              <div className="font-semibold text-[#111827] mt-0.5">Max {activeStorefront.maximum_capacity} guests</div>
            </div>
            <div>
              <div className="text-[11px] text-[#5B7A99] uppercase tracking-wider font-medium">Hours of Trade</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {activeStorefront.structured_hours
                  ? `${activeStorefront.structured_hours.open} - ${activeStorefront.structured_hours.close}`
                  : activeStorefront.hours}
              </div>
            </div>
          </div>

          {/* Physical & Sensory Accessibility Profile */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
              Physical & Sensory Accessibility Profile
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={`px-3 py-1.5 border rounded-[2px] flex items-center space-x-1.5 ${
                  activeStorefront.accessibility.step_free
                    ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
                    : 'border-[#E2E6EC] bg-white text-[#9CA3AF]'
                }`}
              >
                <IconStepFree size={14} />
                <span>{activeStorefront.accessibility.step_free ? 'Step-Free Entrance Verified' : 'Steps Required'}</span>
              </span>

              <span
                className={`px-3 py-1.5 border rounded-[2px] flex items-center space-x-1.5 ${
                  activeStorefront.accessibility.wheelchair
                    ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
                    : 'border-[#E2E6EC] bg-white text-[#9CA3AF]'
                }`}
              >
                <IconWheelchair size={14} />
                <span>{activeStorefront.accessibility.wheelchair ? 'Wheelchair Compatible' : 'Limited Wheelchair Access'}</span>
              </span>

              {activeStorefront.accessibility.senior_paced && (
                <span className="px-3 py-1.5 border border-[#1B3A6B] bg-[#F0F4F8] text-[#1B3A6B] rounded-[2px]">
                  Senior-Friendly Pacing
                </span>
              )}

              {activeStorefront.accessibility.low_sensory && (
                <span className="px-3 py-1.5 border border-[#5B7A99] bg-[#F7F8FA] text-[#5B7A99] rounded-[2px]">
                  Low Sensory / Calm Acoustics
                </span>
              )}
            </div>
          </div>

          {/* Offerings and Packages */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
              Current Offerings & Sessions
            </h3>
            <div className="space-y-2">
              {activeStorefront.offerings.map(item => (
                <div
                  key={item.id}
                  className="p-3 border border-[#E2E6EC] rounded-[2px] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#111827]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-semibold text-sm text-[#111827]">
                      {item.price === 0 ? 'Free' : `₹${item.price}`}
                    </span>
                    <span className="text-[11px] text-[#5B7A99] block">
                      {item.duration_minutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Provenance & Legal Licensing Attribution (Part C.3/C.4) */}
          <div className="p-3.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] text-xs text-[#6B7280] space-y-1">
            <div className="font-semibold text-[#111827]">
              Source Provenance & Licensing Attribution:
            </div>
            <div>
              {activeStorefront.attribution || 'Wikimedia Commons (CC BY-SA 4.0) & OpenStreetMap Contributors'}
            </div>
            {activeStorefront.data_source === 'osm_llm_estimated' && (
              <div className="text-[11px] text-[#B45309]">
                Estimated public domain listing. Local merchants can claim and verify this profile.
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-[#E2E6EC] bg-[#FFFFFF] flex items-center justify-between">
          <div className="text-xs text-[#5B7A99]">
            Direct booking and route slot reserved through merchant cooperative.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={closeStorefront}
              className="px-4 py-2 border border-[#E2E6EC] text-xs font-medium text-[#4B5563] hover:bg-[#F7F8FA] rounded-[2px]"
            >
              Close
            </button>
            <button
              onClick={() => addExperienceToTrip(activeStorefront)}
              className="px-5 py-2 bg-[#1B3A6B] text-xs font-medium text-white hover:bg-[#152e55] rounded-[2px] transition-colors"
            >
              Add to My Dynamic Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
