import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingManager } from './ListingManager';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { DemandInsightsView } from './DemandInsightsView';
import { IconShield, IconMapPin } from '../common/Icons';

export const VendorPortal: React.FC = () => {
  const { setActiveRole, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'availability' | 'demand'>('listings');

  return (
    <div className="space-y-6">
      {/* Vendor Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="card-tag px-2.5 py-0.5 bg-[#15803D] text-white font-semibold text-[10px]">
              Merchant Partner Portal
            </span>
            <span className="text-xs text-[#5B7A99] flex items-center space-x-1">
              <IconShield size={12} className="text-[#15803D]" />
              <span>Verified Cooperative ID: IN-8821</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111827]">
            Pan-India Artisan Guild & Merchant Operations
          </h1>
          <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">
            Welcome to the dedicated vendor management domain. Manage verified listings, publish slot availability, and review anonymized traveler search demand.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setActiveRole('traveler');
              navigateTo('explore');
            }}
            className="px-4 py-2 border border-[#E2E6EC] bg-white text-xs font-semibold text-[#111827] rounded-[2px] hover:bg-[#F7F8FA] transition-colors"
          >
            Switch to Traveler View
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="border-b border-[#E2E6EC] flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'listings'
              ? 'border-[#1B3A6B] text-[#1B3A6B] font-semibold'
              : 'border-transparent text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          Listing & Offerings Manager
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'availability'
              ? 'border-[#1B3A6B] text-[#1B3A6B] font-semibold'
              : 'border-transparent text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          Availability & Slot Calendar
        </button>

        <button
          onClick={() => setActiveTab('demand')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'demand'
              ? 'border-[#1B3A6B] text-[#1B3A6B] font-semibold'
              : 'border-transparent text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          Traveler Demand Insights
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'listings' && <ListingManager />}
        {activeTab === 'availability' && <AvailabilityCalendar />}
        {activeTab === 'demand' && <DemandInsightsView />}
      </div>
    </div>
  );
};
