import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PAN_INDIA_CITIES } from '../../data/panIndiaCities';
import { calculateDistanceKm } from '../../engine/routingEngine';
import { IconClose, IconMapPin, IconShield } from './Icons';

export const RoleSelectModal: React.FC = () => {
  const {
    showRoleModal,
    setShowRoleModal,
    setActiveRole,
    navigateTo,
    setCurrentCity,
    setUserLocation,
    setAllowNearbyAds,
    allowNearbyAds
  } = useApp();

  const [step, setStep] = useState<'role_choice' | 'traveler_onboarding' | 'vendor_onboarding'>('role_choice');
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'vendor'>('traveler');
  const [locatingStatus, setLocatingStatus] = useState<string | null>(null);

  // Vendor fields
  const [businessName, setBusinessName] = useState('Chandni Chowk Artisan Guild');
  const [vendorCityId, setVendorCityId] = useState('delhi');
  const [vendorCategory, setVendorCategory] = useState('workshops');

  if (!showRoleModal) return null;

  const handleSelectRole = (role: 'traveler' | 'vendor') => {
    setSelectedRole(role);
    if (role === 'traveler') {
      setStep('traveler_onboarding');
      // Request browser location permission immediately
      requestBrowserLocation();
    } else {
      setStep('vendor_onboarding');
    }
  };

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocatingStatus('Geolocation not supported by your browser. Using city default.');
      return;
    }

    setLocatingStatus('Requesting GPS location to match nearest regional hub...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        // Match closest Indian city
        let closestCity = PAN_INDIA_CITIES[0];
        let minDist = Infinity;
        for (const city of PAN_INDIA_CITIES) {
          const d = calculateDistanceKm(userLat, userLng, city.center_lat, city.center_lng);
          if (d < minDist) {
            minDist = d;
            closestCity = city;
          }
        }

        setCurrentCity(closestCity);
        setLocatingStatus(`Position locked: Matched to ${closestCity.name} (${Math.round(minDist)} km)`);
      },
      err => {
        console.warn('Geolocation denied or unavailable:', err);
        setLocatingStatus('Location permission not granted. You can select your city manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleFinishTraveler = () => {
    setActiveRole('traveler');
    setShowRoleModal(false);
    navigateTo('explore');
  };

  const handleFinishVendor = () => {
    const matched = PAN_INDIA_CITIES.find(c => c.id === vendorCityId);
    if (matched) setCurrentCity(matched);
    setActiveRole('vendor');
    setShowRoleModal(false);
    navigateTo('vendor-portal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/50 backdrop-blur-[2px]">
      <div className="bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] max-w-xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E6EC]">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#111827]">
              What brings you to Passage today?
            </h2>
            <p className="text-xs text-[#5B7A99] mt-0.5">
              Select your primary intent to enter the appropriate domain
            </p>
          </div>
          <button
            onClick={() => setShowRoleModal(false)}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded-[2px]"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Step 1: Role Choice (Mandatory First Screen) */}
        {step === 'role_choice' && (
          <div className="py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectRole('traveler')}
                className="p-5 text-left border border-[#E2E6EC] hover:border-[#1B3A6B] bg-[#F7F8FA] rounded-[4px] transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1B3A6B]">
                    Traveler Domain
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B3A6B]" />
                </div>
                <div className="font-serif font-bold text-lg text-[#111827] group-hover:text-[#1B3A6B]">
                  I am Traveling
                </div>
                <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                  Discover authentic street food, artisan guilds, and build adaptive Pan-India custom itineraries.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('vendor')}
                className="p-5 text-left border border-[#E2E6EC] hover:border-[#15803D] bg-[#F7F8FA] rounded-[4px] transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D]">
                    Merchant Domain
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                </div>
                <div className="font-serif font-bold text-lg text-[#111827] group-hover:text-[#15803D]">
                  I am a Local Vendor
                </div>
                <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
                  Publish workshops or tours, manage availability slots, and inspect regional traveler search trends.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Traveler Onboarding (GPS Location & Nearby Ad Opt-in) */}
        {step === 'traveler_onboarding' && (
          <div className="py-4 space-y-5">
            <div className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#111827]">
                <IconMapPin size={14} className="text-[#1B3A6B]" />
                <span>Geographic Location Matching</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                {locatingStatus || 'Detecting nearest regional hub for accurate distance calculations...'}
              </p>
            </div>

            {/* Part D.4: Explicit Nearby Vendor Ad Opt-in */}
            <div className="p-4 bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] space-y-2">
              <div className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
                Nearby Merchant Recommendations
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Show me nearby independent shop and workshop recommendations while I explore?
              </p>
              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="nearbyAds"
                    checked={allowNearbyAds}
                    onChange={() => setAllowNearbyAds(true)}
                    className="text-[#1B3A6B]"
                  />
                  <span>Yes, notify me of nearby independent gems</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="nearbyAds"
                    checked={!allowNearbyAds}
                    onChange={() => setAllowNearbyAds(false)}
                    className="text-[#1B3A6B]"
                  />
                  <span>No, show only my search results</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('role_choice')}
                className="text-xs text-[#5B7A99] hover:underline"
              >
                Change Role
              </button>

              <button
                type="button"
                onClick={handleFinishTraveler}
                className="px-6 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors"
              >
                Enter Traveler Discovery Feed
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vendor Onboarding */}
        {step === 'vendor_onboarding' && (
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Business or Guild Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Operating City
              </label>
              <select
                value={vendorCityId}
                onChange={e => setVendorCityId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                {PAN_INDIA_CITIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Primary Category
              </label>
              <select
                value={vendorCategory}
                onChange={e => setVendorCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                <option value="workshops">Artisan Crafts & Workshops</option>
                <option value="food">Heritage Food & Culinary Tours</option>
                <option value="culture">Historical & Performing Arts</option>
                <option value="markets">Bazaar & Antiques</option>
                <option value="nature">Sanctuaries & Waterways</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E6EC]">
              <button
                type="button"
                onClick={() => setStep('role_choice')}
                className="text-xs text-[#5B7A99] hover:underline"
              >
                Change Role
              </button>

              <button
                type="button"
                onClick={handleFinishVendor}
                className="px-6 py-2 bg-[#15803D] text-white text-xs font-semibold rounded-[2px] hover:bg-[#166534] transition-colors"
              >
                Enter Vendor Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
