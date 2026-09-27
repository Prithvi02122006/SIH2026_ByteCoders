import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryType } from '../../types';
import { SummaryCard } from './SummaryCard';
import { CardSkeleton } from '../common/SkeletonLoaders';
import { CitySelector } from './CitySelector';
import { NaturalSearchInput } from './NaturalSearchInput';
import { calculateDistanceKm } from '../../engine/routingEngine';
import {
  IconFilter,
  IconMapPin,
  IconClock
} from '../common/Icons';

export const ExploreFeed: React.FC = () => {
  const {
    experiences,
    openStorefront,
    navigateTo,
    filters,
    setFilters,
    currentCity,
    userLocation,
    isLoadingExperiences
  } = useApp();

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const categories: Array<{ id: CategoryType | 'all'; label: string }> = [
    { id: 'all', label: 'All Experiences' },
    { id: 'hidden-gems', label: 'Independent Gems' },
    { id: 'food', label: 'Street Food & Dining' },
    { id: 'workshops', label: 'Artisan Workshops' },
    { id: 'culture', label: 'Heritage & Classical Arts' },
    { id: 'markets', label: 'Bazaars & Antiques' },
    { id: 'nature', label: 'Ghats & Sanctuaries' }
  ];

  const handleCategorySelect = (cat: CategoryType | 'all') => {
    setFilters(prev => ({
      ...prev,
      category: cat,
      hiddenGemsOnly: cat === 'hidden-gems'
    }));
  };

  const handleFilterChange = (updates: any) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      // Category filter
      if (filters.category === 'hidden-gems') {
        if (exp.specialty_tier !== 'hidden-gem') return false;
      } else if (filters.category !== 'all' && exp.category !== filters.category) {
        return false;
      }

      // Independent gems toggle
      if (filters.hiddenGemsOnly && exp.specialty_tier !== 'hidden-gem') {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = exp.experience_title.toLowerCase().includes(query);
        const matchesDesc = exp.full_description.toLowerCase().includes(query);
        const matchesNeighborhood = exp.neighborhood.toLowerCase().includes(query);
        const matchesTags = exp.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesNeighborhood && !matchesTags) {
          return false;
        }
      }

      // Budget tier (calibrated to INR)
      if (filters.budgetTier === 'budget' && exp.price_per_head > 300) return false;
      if (filters.budgetTier === 'moderate' && (exp.price_per_head < 250 || exp.price_per_head > 600)) return false;
      if (filters.budgetTier === 'premium' && exp.price_per_head < 600) return false;

      // Accessibility requirements
      if (filters.wheelchair && !exp.accessibility.wheelchair) return false;
      if (filters.stepFree && !exp.accessibility.step_free) return false;
      if (filters.seniorPaced && !exp.accessibility.senior_paced) return false;
      if (filters.lowSensory && !exp.accessibility.low_sensory) return false;

      // Part D.8: Open now filter
      if (filters.openNowOnly && !exp.open_now) return false;

      // Search radius: measure from the user's live location only when
      // that reading is actually plausible for the selected city (GPS can
      // be denied, inaccurate, or simply outside India in a test/dev
      // environment) — otherwise fall back to the city's own center so a
      // stray location reading doesn't zero out every listing in a city.
      let originLat = currentCity.center_lat;
      let originLng = currentCity.center_lng;
      if (userLocation) {
        const distFromCityCenter = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          currentCity.center_lat,
          currentCity.center_lng
        );
        if (distFromCityCenter <= 100) {
          originLat = userLocation.lat;
          originLng = userLocation.lng;
        }
      }
      const distanceKm = calculateDistanceKm(
        originLat,
        originLng,
        exp.geolocation.lat,
        exp.geolocation.lng
      );
      if (distanceKm > filters.maxDistanceKm) return false;

      // Group style: only 'seniors' and 'family' have real backing data
      // today (senior_paced accessibility flag and capacity respectively).
      // 'solo' / 'couple' / 'friends' have no distinguishing field on
      // ExperienceListing yet, so they intentionally pass through
      // unfiltered rather than faking a match.
      if (filters.groupType === 'seniors' && !exp.accessibility.senior_paced) return false;
      if (filters.groupType === 'family' && exp.maximum_capacity < 4) return false;

      return true;
    });
  }, [experiences, filters, currentCity, userLocation]);

  return (
    <div className="space-y-6">
      {/* Editorial Hero Header with City Selector */}
      <div className="bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E6EC] pb-4 mb-4">
          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[11px] font-semibold tracking-wider uppercase rounded-[2px]">
              Pan-India Experience Network
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111827]">
              {currentCity.name} Local Discoveries & Guilds
            </h1>
          </div>
          <CitySelector />
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed max-w-2xl mb-4">
          Direct discovery of authentic neighborhood eateries, family weaving pit-looms, stone stepwells, and artisan ateliers across {currentCity.name} ({currentCity.state}).
        </p>

        {/* Natural Language Filter Assistant */}
        <div className="max-w-xl">
          <NaturalSearchInput onFiltersApplied={() => {}} />
        </div>
      </div>

      {/* Category Filter Pills & Open Now Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E6EC] pb-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-[2px] whitespace-nowrap transition-colors border ${
                filters.category === cat.id
                  ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                  : 'bg-white text-[#4B5563] border-[#E2E6EC] hover:border-[#CBD5E1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Part D.8: Prioritize Open Right Now */}
          <button
            onClick={() => handleFilterChange({ openNowOnly: !filters.openNowOnly })}
            className={`px-3 py-1.5 text-xs font-medium rounded-[2px] border transition-colors flex items-center space-x-1.5 ${
              filters.openNowOnly
                ? 'bg-[#15803D] text-white border-[#15803D]'
                : 'bg-white text-[#4B5563] border-[#E2E6EC] hover:bg-[#F7F8FA]'
            }`}
          >
            <IconClock size={12} />
            <span>Open Right Now</span>
          </button>

          {/* Collapsible Filters Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-[2px] border transition-colors ${
              filtersOpen
                ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                : 'bg-white text-[#111827] border-[#E2E6EC] hover:bg-[#F7F8FA]'
            }`}
          >
            <IconFilter size={13} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Collapsible Advanced Filters */}
      {filtersOpen && (
        <div className="card-surface p-5 bg-white border border-[#E2E6EC] rounded-[4px] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Keyword / Neighborhood
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={e => handleFilterChange({ searchQuery: e.target.value })}
                placeholder="Search market, ghat, thali..."
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Budget Tier (INR)
              </label>
              <select
                value={filters.budgetTier}
                onChange={e => handleFilterChange({ budgetTier: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget (Under ₹300)</option>
                <option value="moderate">Moderate (₹250 - ₹600)</option>
                <option value="premium">Premium (₹600+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Group Style
              </label>
              <select
                value={filters.groupType}
                onChange={e => handleFilterChange({ groupType: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                <option value="all">All Group Types</option>
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple</option>
                <option value="family">Family with Children</option>
                <option value="seniors">Senior Paced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Search Radius ({filters.maxDistanceKm} km)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={filters.maxDistanceKm}
                onChange={e => handleFilterChange({ maxDistanceKm: Number(e.target.value) })}
                className="w-full accent-[#1B3A6B] mt-2"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E6EC] flex flex-wrap gap-4 text-xs">
            <label className="flex items-center space-x-2 text-[#4B5563] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stepFree}
                onChange={e => handleFilterChange({ stepFree: e.target.checked })}
                className="rounded text-[#1B3A6B]"
              />
              <span>Step-Free Access Only</span>
            </label>

            <label className="flex items-center space-x-2 text-[#4B5563] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.wheelchair}
                onChange={e => handleFilterChange({ wheelchair: e.target.checked })}
                className="rounded text-[#1B3A6B]"
              />
              <span>Wheelchair Accessible</span>
            </label>

            <label className="flex items-center space-x-2 text-[#4B5563] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.seniorPaced}
                onChange={e => handleFilterChange({ seniorPaced: e.target.checked })}
                className="rounded text-[#1B3A6B]"
              />
              <span>Senior Paced</span>
            </label>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#5B7A99]">
        <div>
          Showing {filteredExperiences.length} of {experiences.length} verified listings in {currentCity.name}
        </div>
        <div className="text-[11px] text-[#9CA3AF]">
          Attribution: Wikimedia Commons (CC BY-SA 4.0) & OpenStreetMap
        </div>
      </div>

      {/* Listings Grid with Real Skeletons */}
      {isLoadingExperiences ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="card-surface p-12 text-center bg-white border border-[#E2E6EC] rounded-[4px] space-y-2">
          <h3 className="font-serif font-bold text-lg text-[#111827]">
            No matching experiences found in {currentCity.name}
          </h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            Try resetting filters or exploring another of our 10 regional Indian hubs.
          </p>
          <button
            onClick={() => handleCategorySelect('all')}
            className="mt-3 px-4 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map(exp => (
            <SummaryCard
              key={exp.id}
              experience={exp}
              onOpenStorefront={openStorefront}
            />
          ))}
        </div>
      )}
    </div>
  );
};
