import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BudgetTier, CategoryType, GroupType, IndianTransportMode, TransportMode } from '../../types';
import { PAN_INDIA_CITIES } from '../../data/panIndiaCities';
import {
  IconWalk,
  IconAutoRickshaw,
  IconMetro,
  IconTransit,
  IconMapPin,
  IconClock,
  IconBudget,
  IconStepFree,
  IconWheelchair
} from '../common/Icons';

interface TripBuilderWizardProps {
  onComplete: () => void;
}

export const TripBuilderWizard: React.FC<TripBuilderWizardProps> = ({ onComplete }) => {
  const { tripWizard, updateTripWizard, generateItineraryFromWizard, currentCity, setCurrentCity } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    { number: 1, title: 'Where', label: 'City & Starting Point' },
    { number: 2, title: 'When', label: 'Hours & Date' },
    { number: 3, title: 'Budget', label: 'Spending Envelope' },
    { number: 4, title: 'Who', label: 'Party Dynamic' },
    { number: 5, title: 'Interests', label: 'Curated Focus' },
    { number: 6, title: 'Transit', label: 'Indian Mobility Modes' },
    { number: 7, title: 'Sequencing', label: 'Route Strategy' }
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      generateItineraryFromWizard();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (category: CategoryType) => {
    const existing = tripWizard.prioritizedCategories;
    if (existing.includes(category)) {
      if (existing.length > 1) {
        updateTripWizard({ prioritizedCategories: existing.filter(c => c !== category) });
      }
    } else {
      updateTripWizard({ prioritizedCategories: [...existing, category] });
    }
  };

  // Part D.5: Multi-select Indian transport modes
  const toggleIndianTransportMode = (mode: IndianTransportMode) => {
    const existing = tripWizard.allowedTransportModes || ['walk', 'auto_taxi', 'metro'];
    if (existing.includes(mode)) {
      if (existing.length > 1) {
        updateTripWizard({ allowedTransportModes: existing.filter(m => m !== mode) });
      }
    } else {
      updateTripWizard({ allowedTransportModes: [...existing, mode] });
    }
  };

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-6 sm:p-8">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-[#5B7A99] mb-2">
          <span className="font-semibold text-[#111827] uppercase tracking-wider">
            Step {currentStep} of 7: {steps[currentStep - 1].title} ({steps[currentStep - 1].label})
          </span>
          <span>{Math.round((currentStep / 7) * 100)}% Configured</span>
        </div>
        <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B3A6B] transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
        <div className="hidden sm:flex justify-between mt-3 text-[11px] text-[#6B7280]">
          {steps.map(s => (
            <button
              key={s.number}
              onClick={() => setCurrentStep(s.number)}
              className={`hover:text-[#111827] ${
                s.number === currentStep
                  ? 'text-[#1B3A6B] font-semibold'
                  : s.number < currentStep
                  ? 'text-[#111827]'
                  : 'text-[#9CA3AF]'
              }`}
            >
              {s.number}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[280px]">
        {/* Step 1: Where */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                Select Destination City & Departure Hub
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Set your regional hub and hotel anchor across India
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                  Destination Region / City
                </label>
                <select
                  value={tripWizard.cityId || currentCity.id}
                  onChange={e => {
                    const matched = PAN_INDIA_CITIES.find(c => c.id === e.target.value);
                    if (matched) {
                      setCurrentCity(matched);
                      updateTripWizard({
                        cityId: matched.id,
                        destinationArea: `${matched.name} Heritage Quarter`,
                        startCoordinates: { lat: matched.center_lat, lng: matched.center_lng }
                      });
                    }
                  }}
                  className="w-full text-xs px-3 py-2.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
                >
                  {PAN_INDIA_CITIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                  Starting Point / Hotel Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tripWizard.startLocationName}
                    onChange={e => updateTripWizard({ startLocationName: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
                  />
                  <div className="absolute right-3 top-2.5 text-[#5B7A99]">
                    <IconMapPin size={14} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] text-xs text-[#4B5563] flex items-center justify-between">
                <span>Center Coordinates: {tripWizard.startCoordinates.lat}, {tripWizard.startCoordinates.lng}</span>
                <span className="text-[#1B3A6B] font-medium">Mapped Anchor</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: When & How Long */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                When and how long do you have?
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Calculates feasible stops while guaranteeing you are not rushed
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={tripWizard.date}
                  onChange={e => updateTripWizard({ date: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                  Departure Time
                </label>
                <input
                  type="time"
                  value={tripWizard.startTime}
                  onChange={e => updateTripWizard({ startTime: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                  Available Window ({tripWizard.durationHours} Hours)
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={tripWizard.durationHours}
                  onChange={e => updateTripWizard({ durationHours: Number(e.target.value) })}
                  className="w-full accent-[#1B3A6B] mt-2"
                />
                <div className="flex justify-between text-[11px] text-[#5B7A99] mt-1">
                  <span>Half Day (3h)</span>
                  <span>Full Day (10h)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                What is your budget ceiling?
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Calibrated to regional Indian transit and workshop fees
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'budget', label: 'Budget Explorer', desc: 'Focus on public metro, walking, and street food under ₹300 per stop' },
                { id: 'moderate', label: 'Balanced Experience', desc: 'Combines artisan studios, auto-rickshaw transit, and traditional lunch (₹300 - ₹600)' },
                { id: 'premium', label: 'Unconstrained Heritage', desc: 'Private master tastings, hands-on craft sessions, and direct taxis (₹600+)' }
              ].map(tier => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => updateTripWizard({ budgetTier: tier.id as BudgetTier })}
                  className={`p-4 text-left border rounded-[4px] transition-colors ${
                    tripWizard.budgetTier === tier.id
                      ? 'border-[#1B3A6B] bg-[#F7F8FA] ring-1 ring-[#1B3A6B]'
                      : 'border-[#E2E6EC] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="font-semibold text-sm text-[#111827] mb-1">
                    {tier.label}
                  </div>
                  <div className="text-xs text-[#6B7280] leading-relaxed">
                    {tier.desc}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Target Cap per Person: ₹{tripWizard.budgetCapAmount}
              </label>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={tripWizard.budgetCapAmount}
                onChange={e => updateTripWizard({ budgetCapAmount: Number(e.target.value) })}
                className="w-full accent-[#1B3A6B]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Who */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                Who is traveling with you?
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Adjusts seating capacity limits and unlocks essential accessibility pacing
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'solo', label: 'Solo Traveler' },
                { id: 'couple', label: 'Couple' },
                { id: 'family', label: 'Family with Children' },
                { id: 'friends', label: 'Small Group of Friends' },
                { id: 'seniors', label: 'Senior Travelers' },
                { id: 'students', label: 'Student Explorers' }
              ].map(group => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => updateTripWizard({ groupType: group.id as GroupType })}
                  className={`p-3 text-left border rounded-[2px] transition-colors text-xs font-medium ${
                    tripWizard.groupType === group.id
                      ? 'border-[#1B3A6B] bg-[#1B3A6B] text-white'
                      : 'border-[#E2E6EC] bg-white text-[#4B5563] hover:border-[#CBD5E1]'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E6EC]">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-2">
                Accessibility Requirements
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 bg-[#F7F8FA] p-2.5 border border-[#E2E6EC] rounded-[2px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tripWizard.accessibility.step_free}
                    onChange={e =>
                      updateTripWizard({
                        accessibility: { ...tripWizard.accessibility, step_free: e.target.checked }
                      })
                    }
                    className="rounded text-[#1B3A6B]"
                  />
                  <span>Step-Free Access Required</span>
                </label>

                <label className="flex items-center space-x-2 bg-[#F7F8FA] p-2.5 border border-[#E2E6EC] rounded-[2px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tripWizard.accessibility.wheelchair}
                    onChange={e =>
                      updateTripWizard({
                        accessibility: { ...tripWizard.accessibility, wheelchair: e.target.checked }
                      })
                    }
                    className="rounded text-[#1B3A6B]"
                  />
                  <span>Full Wheelchair Compatibility</span>
                </label>

                <label className="flex items-center space-x-2 bg-[#F7F8FA] p-2.5 border border-[#E2E6EC] rounded-[2px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tripWizard.accessibility.senior_paced}
                    onChange={e =>
                      updateTripWizard({
                        accessibility: { ...tripWizard.accessibility, senior_paced: e.target.checked }
                      })
                    }
                    className="rounded text-[#1B3A6B]"
                  />
                  <span>Senior Paced (Add 20-min rest buffers)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Interests */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                What experiences do you want to prioritize?
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Select categories to anchor your tour
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'food' as CategoryType, label: 'Street Food & Dining', desc: 'Historic alleys, paranthe, thalis, local tea roasters' },
                { id: 'workshops' as CategoryType, label: 'Artisan Workshops', desc: 'Block printing, pottery throwing, silk handlooms, azulejos' },
                { id: 'culture' as CategoryType, label: 'Culture & Heritage', desc: 'Classical kathakali, sufi qawwali, art deco, stepwells' },
                { id: 'markets' as CategoryType, label: 'Bazaars & Antiques', desc: 'Flower markets, spice godowns, flea market corridors' },
                { id: 'nature' as CategoryType, label: 'Ghats & Sanctuaries', desc: 'Dawn riverboat rowing, canal promenades, garden walks' }
              ].map(item => {
                const isSelected = tripWizard.prioritizedCategories.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-4 text-left border rounded-[4px] transition-colors ${
                      isSelected
                        ? 'border-[#1B3A6B] bg-[#F7F8FA] ring-1 ring-[#1B3A6B]'
                        : 'border-[#E2E6EC] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[#111827]">
                        {item.label}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-semibold text-[#1B3A6B]">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280]">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Explicit Indian Transport Modes (Part D.5) */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                Allowed Indian Transport Modes (Multi-Select)
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                The constraint engine selects only among your permitted mobility modes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                {
                  id: 'walk' as IndianTransportMode,
                  label: 'Walking',
                  desc: 'Stone alleys & pedestrian lanes for short legs under 1km.',
                  icon: <IconWalk size={16} />
                },
                {
                  id: 'auto_taxi' as IndianTransportMode,
                  label: 'Auto-Rickshaw / Taxi',
                  desc: 'Three-wheelers and direct cabs for flexible medium transit.',
                  icon: <IconAutoRickshaw size={16} />
                },
                {
                  id: 'metro' as IndianTransportMode,
                  label: 'Metro Rail',
                  desc: 'High-speed urban rail with step-free lifts and elevators.',
                  icon: <IconMetro size={16} />
                },
                {
                  id: 'train' as IndianTransportMode,
                  label: 'Suburban Train / Rail',
                  desc: 'Local rail connections for cross-district transit.',
                  icon: <IconTransit size={16} />
                },
                {
                  id: 'bus' as IndianTransportMode,
                  label: 'City Bus',
                  desc: 'Municipal bus routes for low-cost road connections.',
                  icon: <IconTransit size={16} />
                },
                {
                  id: 'other' as IndianTransportMode,
                  label: 'E-Rickshaw / Local Other',
                  desc: 'Battery e-rickshaws, boats, and cycle rickshaws.',
                  icon: <IconAutoRickshaw size={16} />
                }
              ].map(item => {
                const allowed = (tripWizard.allowedTransportModes || ['walk', 'auto_taxi', 'metro']).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleIndianTransportMode(item.id)}
                    className={`p-3.5 text-left border rounded-[4px] transition-colors ${
                      allowed
                        ? 'border-[#1B3A6B] bg-[#F7F8FA] ring-1 ring-[#1B3A6B]'
                        : 'border-[#E2E6EC] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5 text-[#1B3A6B]">
                        {item.icon}
                        <span className="font-semibold text-xs text-[#111827]">
                          {item.label}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${allowed ? 'text-[#1B3A6B]' : 'text-[#9CA3AF]'}`}>
                        {allowed ? 'Allowed' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 7: Sequencing & Open-Now Priority */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111827]">
                Routing & Sequencing Strategy
              </h2>
              <p className="text-xs text-[#5B7A99] mt-0.5">
                Deterministic TSP path optimization with opening-hours awareness
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => updateTripWizard({ sequencingMode: 'shortest_route' })}
                className={`p-5 text-left border rounded-[4px] transition-colors ${
                  tripWizard.sequencingMode === 'shortest_route'
                    ? 'border-[#1B3A6B] bg-[#F7F8FA] ring-1 ring-[#1B3A6B]'
                    : 'border-[#E2E6EC] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="font-serif font-bold text-base text-[#111827] mb-1">
                  Shortest Route (TSP Engine + Hours Aware)
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Solves a Traveling Salesperson graph problem, scheduling later-opening venues after open-now spots so you arrive when doors are open.
                </p>
                <div className="mt-3 text-[11px] text-[#15803D] font-medium">
                  Recommended for efficient, low-friction transit
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateTripWizard({ sequencingMode: 'custom_order' })}
                className={`p-5 text-left border rounded-[4px] transition-colors ${
                  tripWizard.sequencingMode === 'custom_order'
                    ? 'border-[#1B3A6B] bg-[#F7F8FA] ring-1 ring-[#1B3A6B]'
                    : 'border-[#E2E6EC] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="font-serif font-bold text-base text-[#111827] mb-1">
                  Keep My Custom Order
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Preserves the exact chronological sequence in which you add stops. You can manually drag and reorder stops on the timeline anytime.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation Controls */}
      <div className="mt-8 pt-4 border-t border-[#E2E6EC] flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-4 py-2 border rounded-[2px] text-xs font-medium ${
            currentStep === 1
              ? 'border-[#E2E6EC] text-[#9CA3AF] cursor-not-allowed'
              : 'border-[#E2E6EC] text-[#4B5563] hover:bg-[#F7F8FA]'
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1B3A6B] text-white rounded-[2px] text-xs font-semibold hover:bg-[#152e55] transition-colors"
        >
          {currentStep === 7 ? 'Compute Dynamic Itinerary' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
