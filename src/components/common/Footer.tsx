import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E6EC] mt-16 text-sm text-[#4B5563]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#1B3A6B] rounded-[2px] flex items-center justify-center text-white font-serif text-sm font-bold">
                P
              </div>
              <span className="font-serif font-bold text-base text-[#111827]">Passage</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Intelligent local experiences and real-time dynamic tour planning. Sourced directly from independent neighborhood merchants and artisan guilds.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#111827] tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('explore')}
                  className="hover:text-[#1B3A6B] text-left transition-colors"
                >
                  Explore Local Experiences
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('trip-builder')}
                  className="hover:text-[#1B3A6B] text-left transition-colors"
                >
                  Dynamic Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('vendor-portal')}
                  className="hover:text-[#1B3A6B] text-left transition-colors"
                >
                  Local Vendor Onboarding
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#111827] tracking-wider mb-3">
              Accessibility & Ethics
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Every route calculation supports step-free verification, senior-friendly pacing buffers, and low-sensory sanctuary indicators without automated profiling.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#111827] tracking-wider mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-[#1B3A6B] text-left transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-[#1B3A6B] text-left transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <span className="text-[#9CA3AF] text-xs">Merchant Verification Standard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E2E6EC] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF]">
          <div>Passage Tour Platform. Pan-India Regional Network.</div>
          <div className="mt-2 sm:mt-0">Direct-manipulation travel planning. No automated chat agents.</div>
        </div>
      </div>
    </footer>
  );
};
