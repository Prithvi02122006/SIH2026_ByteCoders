import React from 'react';
import { useApp } from '../../context/AppContext';

export const PrivacyPolicy: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-[#E2E6EC] rounded-[4px] p-6 sm:p-10 space-y-6">
        <div className="border-b border-[#E2E6EC] pb-4">
          <div className="text-[11px] uppercase font-semibold text-[#5B7A99] tracking-wider">
            Data Governance & Privacy
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#111827] mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Effective Date: September 2026. Version 1.2.
          </p>
        </div>

        <section className="space-y-2 text-xs text-[#4B5563] leading-relaxed">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
            1. Core Principle: Data Minimization
          </h2>
          <p>
            Passage is designed around direct manipulation rather than persistent surveillance. We do not maintain behavioral tracking profiles, third-party advertising cookies, or cross-site tracking pixels. Your journey preferences, accessibility requirements, and budget parameters are stored locally on your device during your session.
          </p>
        </section>

        <section className="space-y-2 text-xs text-[#4B5563] leading-relaxed">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
            2. Anonymized Demand Radar for Local Merchants
          </h2>
          <p>
            To empower independent artisans and small businesses against mass-market aggregators, we aggregate search filter trends into anonymized signals (for example: "45 travelers searched for wheelchair-accessible tea workshops in Higashiyama this week"). These signals are completely decoupled from user identities, IP addresses, or device identifiers.
          </p>
        </section>

        <section className="space-y-2 text-xs text-[#4B5563] leading-relaxed">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
            3. Geographic Coordinates & Cartographic Routing
          </h2>
          <p>
            When you select a starting point or hotel anchor for route computation, coordinates are utilized strictly for calculating point-to-point transit metrics and rendering map pins. We do not continuously record background location tracking or sell route histories to third parties.
          </p>
        </section>

        <section className="space-y-2 text-xs text-[#4B5563] leading-relaxed">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
            4. Merchant Data Integrity
          </h2>
          <p>
            Verified merchants control their own catalog listings, pricing, and availability schedules. Merchant contact information is shared with travelers only when necessary to confirm direct bookings or provide session arrival instructions.
          </p>
        </section>

        <section className="space-y-2 text-xs text-[#4B5563] leading-relaxed">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111827]">
            5. User Rights & Data Deletion
          </h2>
          <p>
            You have the right to inspect, export, or permanently wipe any stored session preferences or saved custom itineraries at any time. Because we do not rely on centralized behavioral logging, clearing your local session cache removes your data footprint entirely.
          </p>
        </section>

        <div className="pt-6 border-t border-[#E2E6EC] flex items-center justify-between">
          <button
            onClick={() => navigateTo('explore')}
            className="px-4 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors"
          >
            Return to Explore
          </button>
          <span className="text-[11px] text-[#9CA3AF]">
            Compliant with Japanese APPI and GDPR Standards
          </span>
        </div>
      </div>
    </div>
  );
};
