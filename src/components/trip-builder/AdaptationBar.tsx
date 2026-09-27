import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconClock,
  IconRain,
  IconClose,
  IconBudget,
  IconStepFree,
  IconAuto,
  IconSpark
} from '../common/Icons';

interface AdaptationBarProps {
  onOpenSwapModal: () => void;
}

export const AdaptationBar: React.FC<AdaptationBarProps> = ({ onOpenSwapModal }) => {
  const {
    triggerAdaptation,
    isComputingItinerary,
    adaptationNotice,
    dismissNotice,
    tripWizard,
    setTripBuilderTab
  } = useApp();

  const [seniorFriendlyActive, setSeniorFriendlyActive] = useState<boolean>(
    tripWizard.accessibility.senior_paced || tripWizard.accessibility.step_free
  );

  const handleSeniorToggle = () => {
    const nextVal = !seniorFriendlyActive;
    setSeniorFriendlyActive(nextVal);
    triggerAdaptation('senior_toggle', { enableSenior: nextVal });
  };

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-4 space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#1B3A6B] block">
            Real-Time Adaptation Controls
          </span>
          <h3 className="font-serif font-bold text-sm text-[#111827]">
            Plan Disruption and Quick-Action Handlers
          </h3>
        </div>
        <div className="text-[11px] text-[#5B7A99]">
          Direct manipulation engine (no conversational AI prompt required)
        </div>
      </div>

      {/* Disruption Buttons Row */}
      <div className="flex flex-wrap gap-2 pt-1">
        {/* Less Time */}
        <button
          onClick={() => triggerAdaptation('less_time')}
          disabled={isComputingItinerary}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs font-medium text-[#111827] hover:bg-[#F0F4F8] hover:border-[#CBD5E1] transition-colors disabled:opacity-50"
          title="Shorten schedule and remove furthest stop"
        >
          <IconClock size={13} className="text-[#5B7A99]" />
          <span>Less Time</span>
        </button>

        {/* It's Raining */}
        <button
          onClick={() => triggerAdaptation('rain')}
          disabled={isComputingItinerary}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs font-medium text-[#111827] hover:bg-[#F0F4F8] hover:border-[#CBD5E1] transition-colors disabled:opacity-50"
          title="Swap outdoor spots for indoor ateliers and tearooms"
        >
          <IconRain size={13} className="text-[#1D4ED8]" />
          <span>It is Raining</span>
        </button>

        {/* Spot Closed */}
        <button
          onClick={() => triggerAdaptation('closed')}
          disabled={isComputingItinerary}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs font-medium text-[#111827] hover:bg-[#F0F4F8] hover:border-[#CBD5E1] transition-colors disabled:opacity-50"
          title="Remove first scheduled venue if closed today"
        >
          <IconClose size={13} className="text-[#B91C1C]" />
          <span>This Spot is Closed</span>
        </button>

        {/* Lower My Budget */}
        <button
          onClick={() => triggerAdaptation('lower_budget')}
          disabled={isComputingItinerary}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs font-medium text-[#111827] hover:bg-[#F0F4F8] hover:border-[#CBD5E1] transition-colors disabled:opacity-50"
          title="Swap to walking/subway and budget craft experiences"
        >
          <IconBudget size={13} className="text-[#15803D]" />
          <span>Lower My Budget</span>
        </button>

        {/* Swap Stop */}
        <button
          onClick={onOpenSwapModal}
          disabled={isComputingItinerary}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs font-medium text-[#111827] hover:bg-[#F0F4F8] hover:border-[#CBD5E1] transition-colors disabled:opacity-50"
          title="Select a specific stop to substitute"
        >
          <IconAuto size={13} className="text-[#5B7A99]" />
          <span>Swap This Stop</span>
        </button>

        {/* Senior / Accessibility Friendly Toggle */}
        <button
          onClick={handleSeniorToggle}
          disabled={isComputingItinerary}
          className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-[2px] text-xs font-medium transition-colors ${
            seniorFriendlyActive
              ? 'bg-[#15803D] text-white border-[#15803D]'
              : 'bg-[#F7F8FA] border-[#E2E6EC] text-[#111827] hover:bg-[#F0F4F8]'
          }`}
          title="Re-bias route for step-free access and 20-min rest buffers"
        >
          <IconStepFree size={13} />
          <span>Senior / Accessibility Friendly</span>
        </button>

        {/* Digital Twin Simulator Tab Launcher */}
        <button
          onClick={() => setTripBuilderTab('digital-twin')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EBF5FF] border border-[#BFDBFE] rounded-[2px] text-xs font-semibold text-[#1B3A6B] hover:bg-[#DBEAFE] transition-colors"
          title="Open interactive Weather-Driven Digital Twin simulation"
        >
          <IconSpark size={13} className="text-[#1B3A6B]" />
          <span>Simulate Weather Twin</span>
        </button>
      </div>

      {/* Notice Banner showing adaptation results */}
      {adaptationNotice && (
        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[2px] text-xs text-[#166534] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>{adaptationNotice}</span>
          </div>
          <button
            onClick={dismissNotice}
            className="text-[#166534] hover:text-[#14532D] text-xs ml-2 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
