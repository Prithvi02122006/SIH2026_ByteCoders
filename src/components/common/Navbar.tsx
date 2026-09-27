import React from 'react';
import { useApp } from '../../context/AppContext';
import { IconShield, IconMapPin } from './Icons';

export const Navbar: React.FC = () => {
  const { currentView, navigateTo, activeRole, setShowRoleModal, currentCity } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E6EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('explore')}
            className="flex items-center space-x-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 bg-[#1B3A6B] rounded-[2px] flex items-center justify-center text-white font-serif text-lg font-bold">
              P
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-[#111827] tracking-tight block leading-tight">
                Passage
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#5B7A99] font-medium block">
                Local & Experiences
              </span>
            </div>
          </button>
        </div>

        {/* Minimal 3-4 Top-Level Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => navigateTo('explore')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-[2px] ${
              currentView === 'explore'
                ? 'text-[#1B3A6B] bg-[#F0F4F8]'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F7F8FA]'
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => navigateTo('trip-builder')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-[2px] ${
              currentView === 'trip-builder'
                ? 'text-[#1B3A6B] bg-[#F0F4F8]'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F7F8FA]'
            }`}
          >
            Plan a Trip
          </button>

          <button
            onClick={() => navigateTo('vendor-portal')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-[2px] ${
              currentView === 'vendor-portal'
                ? 'text-[#1B3A6B] bg-[#F0F4F8]'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F7F8FA]'
            }`}
          >
            For Vendors
          </button>
        </nav>

        {/* Role & Account Control */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center text-xs text-[#5B7A99] border-r border-[#E2E6EC] pr-3 space-x-1">
            <IconMapPin size={13} className="text-[#5B7A99]" />
            <span>{currentCity.name}, {currentCity.state}</span>
          </div>

          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center space-x-2 py-1 px-2.5 rounded-[2px] border border-[#E2E6EC] hover:bg-[#F7F8FA] transition-colors text-xs font-medium text-[#111827]"
            title="Switch between Traveler and Vendor domain"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeRole === 'vendor' ? 'bg-[#15803D]' : 'bg-[#1D4ED8]'
              }`}
            />
            <span className="capitalize">{activeRole} Mode</span>
            <span className="text-[10px] text-[#5B7A99]">Change</span>
          </button>
        </div>
      </div>
    </header>
  );
};
