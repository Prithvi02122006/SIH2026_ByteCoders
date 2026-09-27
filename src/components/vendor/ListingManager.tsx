import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryType, ExperienceListing, SpecialtyTier, StructuredHours } from '../../types';
import { assistVendorListingCopy } from '../../lib/llmClient';
import { DynamicMapView } from '../trip-builder/DynamicMapView';
import { IconMapPin, IconClock, IconStepFree, IconSpark } from '../common/Icons';

export const ListingManager: React.FC = () => {
  const { experiences, addNewVendorListing, currentCity } = useApp();
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [copyNotes, setCopyNotes] = useState<string>('');
  const [copyConfidence, setCopyConfidence] = useState<number | null>(null);
  const [isDraftingCopy, setIsDraftingCopy] = useState<boolean>(false);

  // Form fields strictly mapping to platform schema
  const [formData, setFormData] = useState<{
    experience_title: string;
    category: CategoryType;
    duration_minutes: number;
    price_per_head: number;
    maximum_capacity: number;
    geolocation: { lat: number; lng: number };
    tags: string;
    specialty_tier: SpecialtyTier;
    neighborhood: string;
    one_line_teaser: string;
    full_description: string;
    step_free: boolean;
    wheelchair: boolean;
    indoor: boolean;
    open_time: string;
    close_time: string;
    days_open: string[];
    eligible_for_nearby_promotions: boolean;
  }>({
    experience_title: '',
    category: 'workshops',
    duration_minutes: 90,
    price_per_head: 850,
    maximum_capacity: 10,
    geolocation: { lat: currentCity.center_lat, lng: currentCity.center_lng },
    tags: 'artisan, handcraft, regional-craft, heritage',
    specialty_tier: 'hidden-gem',
    neighborhood: `${currentCity.name} Cultural Quarter`,
    one_line_teaser: 'Hands-on artisanal workshop guided by master craftspeople.',
    full_description: 'Discover traditional techniques, heritage materials, and authentic regional craftsmanship in an intimate workshop session.',
    step_free: true,
    wheelchair: true,
    indoor: true,
    open_time: '10:00',
    close_time: '18:30',
    days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    eligible_for_nearby_promotions: true
  });

  const handleAIDraftCopy = async () => {
    if (!copyNotes.trim()) return;
    setIsDraftingCopy(true);
    try {
      const res = await assistVendorListingCopy(copyNotes, formData.category, formData.neighborhood);
      if (res) {
        if (res.confidence_score !== undefined) {
          setCopyConfidence(res.confidence_score);
        }
        setFormData(prev => ({
          ...prev,
          one_line_teaser: res.one_line_teaser || prev.one_line_teaser,
          full_description: res.full_description || prev.full_description
        }));
      }
    } catch (err) {
      console.warn('AI Copy generation error:', err);
    } finally {
      setIsDraftingCopy(false);
    }
  };

  const handleToggleDay = (day: string) => {
    setFormData(prev => {
      const exists = prev.days_open.includes(day);
      const days = exists ? prev.days_open.filter(d => d !== day) : [...prev.days_open, day];
      return { ...prev, days_open: days };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.experience_title.trim()) return;

    const structured_hours: StructuredHours = {
      open: formData.open_time,
      close: formData.close_time,
      days_open: formData.days_open
    };

    const newListing: ExperienceListing = {
      id: `exp-vendor-${Date.now()}`,
      experience_title: formData.experience_title,
      category: formData.category,
      duration_minutes: Number(formData.duration_minutes),
      price_per_head: Number(formData.price_per_head),
      maximum_capacity: Number(formData.maximum_capacity),
      geolocation: {
        lat: Number(formData.geolocation.lat),
        lng: Number(formData.geolocation.lng)
      },
      city_id: currentCity.id,
      neighborhood: formData.neighborhood,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      specialty_tier: formData.specialty_tier,
      vendor_id: `v-${Date.now().toString(36)}`,
      vendor_name: `${currentCity.name} Artisan Collective`,
      vendor_established: 2024,
      one_line_teaser: formData.one_line_teaser,
      full_description: formData.full_description,
      indoor: formData.indoor,
      accessibility: {
        step_free: formData.step_free,
        wheelchair: formData.wheelchair,
        senior_paced: true,
        low_sensory: true
      },
      hours: `${formData.open_time} - ${formData.close_time} (${formData.days_open.join(', ')})`,
      structured_hours,
      open_now: true,
      eligible_for_nearby_promotions: formData.eligible_for_nearby_promotions,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80'
      ],
      offerings: [
        {
          id: `off-${Date.now()}`,
          title: 'Full Atelier Workshop Session',
          price: Number(formData.price_per_head),
          description: formData.one_line_teaser,
          duration_minutes: Number(formData.duration_minutes)
        }
      ],
      rating_summary: {
        score: 5.0,
        review_count: 1,
        editorial_note: 'Verified independent local vendor listing.'
      },
      data_source: 'vendor_submitted'
    };

    addNewVendorListing(newListing);
    setShowCreateForm(false);
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Management Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#E2E6EC] rounded-[4px]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif font-bold text-lg text-[#111827]">
              Active Offerings & Experiences
            </h3>
            <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
              {currentCity.name}
            </span>
          </div>
          <p className="text-xs text-[#5B7A99] mt-0.5">
            Manage experiences published directly to the dynamic Pan-India traveler itinerary engine
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors self-start sm:self-auto"
        >
          {showCreateForm ? 'Cancel Creation' : 'Create New Offering'}
        </button>
      </div>

      {/* Schema-Compliant Creation Form */}
      {showCreateForm && (
        <form
          onSubmit={handleSubmit}
          className="card-surface bg-white border border-[#1B3A6B] rounded-[4px] p-6 space-y-6"
        >
          <div className="border-b border-[#E2E6EC] pb-3">
            <h4 className="font-serif font-bold text-base text-[#111827]">
              New Experience Offering Schema (Pan-India & Section 7 Compliant)
            </h4>
            <p className="text-xs text-[#6B7280]">
              Fields strictly adhere to the unified platform listing contract with structured hours and geolocation
            </p>
          </div>

          {/* AI Copy Assistant Section */}
          <div className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#1B3A6B]">
                <IconSpark size={13} className="text-[#1B3A6B]" />
                <span>AI Copy Assistant (Draft from Rough Notes)</span>
                {copyConfidence !== null && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-[#EBF5FF] text-[#1B3A6B] rounded border border-[#BFDBFE]">
                    Nugen Confidence: {copyConfidence}%
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAIDraftCopy}
                disabled={isDraftingCopy || !copyNotes.trim()}
                className="px-3 py-1 bg-[#1B3A6B] text-white text-[11px] font-medium rounded-[2px] hover:bg-[#152e55] disabled:opacity-50 transition-colors"
              >
                {isDraftingCopy ? 'Drafting Copy...' : 'Generate Teaser & Description'}
              </button>
            </div>
            <textarea
              rows={2}
              value={copyNotes}
              onChange={e => setCopyNotes(e.target.value)}
              placeholder="Paste rough notes (e.g. family brassware workshop running for 40 years, includes tea, teaches metal engraving, step-free access)..."
              className="w-full text-xs p-2.5 bg-white border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* experience_title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Experience Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Traditional Hand-Engraved Brassware Atelier"
                value={formData.experience_title}
                onChange={e => setFormData({ ...formData, experience_title: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* category */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                <option value="workshops">Workshops</option>
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="markets">Markets</option>
                <option value="nightlife">Nightlife</option>
                <option value="nature">Nature</option>
                <option value="hidden-gems">Hidden Gems</option>
              </select>
            </div>

            {/* specialty_tier */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Specialty Tier
              </label>
              <select
                value={formData.specialty_tier}
                onChange={e => setFormData({ ...formData, specialty_tier: e.target.value as SpecialtyTier })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              >
                <option value="hidden-gem">hidden-gem (Independent artisan focus)</option>
                <option value="signature">signature (Neighborhood landmark)</option>
                <option value="seasonal">seasonal (Limited time availability)</option>
              </select>
            </div>

            {/* duration_minutes */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="360"
                step="5"
                value={formData.duration_minutes}
                onChange={e => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* price_per_head in INR */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Price Per Head (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                max="25000"
                step="50"
                value={formData.price_per_head}
                onChange={e => setFormData({ ...formData, price_per_head: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* maximum_capacity */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Maximum Capacity (Guests)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.maximum_capacity}
                onChange={e => setFormData({ ...formData, maximum_capacity: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* neighborhood */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Neighborhood / Precinct
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* Structured Hours Entry */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Daily Opening Time
              </label>
              <input
                type="time"
                value={formData.open_time}
                onChange={e => setFormData({ ...formData, open_time: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Daily Closing Time
              </label>
              <input
                type="time"
                value={formData.close_time}
                onChange={e => setFormData({ ...formData, close_time: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* Operating Days */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Operating Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1 text-xs rounded-[2px] border transition-colors ${
                      formData.days_open.includes(day)
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                        : 'bg-[#F7F8FA] border-[#E2E6EC] text-[#4B5563]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Map Pin Picker */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider">
                  Pin Exact Location on Map
                </label>
                <span className="text-[11px] text-[#5B7A99]">
                  Lat: {formData.geolocation.lat.toFixed(4)}, Lng: {formData.geolocation.lng.toFixed(4)}
                </span>
              </div>
              <div className="border border-[#E2E6EC] rounded-[4px] overflow-hidden">
                <DynamicMapView
                  itinerary={null}
                  isLoading={false}
                  isPickerMode={true}
                  pickedCoordinates={formData.geolocation}
                  onPickCoordinates={coords => setFormData(prev => ({ ...prev, geolocation: coords }))}
                />
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Click anywhere on the map to pin your workshop or atelier coordinates.
              </p>
            </div>

            {/* tags */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* one_line_teaser */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                One-Line Summary Teaser (Feed Headline)
              </label>
              <input
                type="text"
                required
                value={formData.one_line_teaser}
                onChange={e => setFormData({ ...formData, one_line_teaser: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* full_description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Full Editorial Description
              </label>
              <textarea
                rows={3}
                value={formData.full_description}
                onChange={e => setFormData({ ...formData, full_description: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
              />
            </div>

            {/* Accessibility and Promotion Checkboxes */}
            <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-[#E2E6EC]">
              <label className="flex items-center space-x-2 text-xs text-[#111827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.step_free}
                  onChange={e => setFormData({ ...formData, step_free: e.target.checked })}
                  className="rounded text-[#1B3A6B]"
                />
                <span>Step-Free Access Available</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-[#111827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wheelchair}
                  onChange={e => setFormData({ ...formData, wheelchair: e.target.checked })}
                  className="rounded text-[#1B3A6B]"
                />
                <span>Wheelchair Restroom / Wide Corridor</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-[#111827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.indoor}
                  onChange={e => setFormData({ ...formData, indoor: e.target.checked })}
                  className="rounded text-[#1B3A6B]"
                />
                <span>Indoor / Sheltered from Rain</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-[#15803D] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.eligible_for_nearby_promotions}
                  onChange={e => setFormData({ ...formData, eligible_for_nearby_promotions: e.target.checked })}
                  className="rounded text-[#15803D]"
                />
                <span>Eligible for nearby recommendation popups (within 1km)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E6EC] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-[#E2E6EC] text-xs font-medium text-[#4B5563] hover:bg-[#F7F8FA] rounded-[2px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors"
            >
              Publish to Pan-India Traveler Network
            </button>
          </div>
        </form>
      )}

      {/* Existing Listings Table */}
      <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] overflow-hidden">
        <div className="p-4 bg-[#F7F8FA] border-b border-[#E2E6EC] text-xs font-semibold text-[#111827] uppercase tracking-wider flex items-center justify-between">
          <span>Currently Published Experiences in {currentCity.name} ({experiences.length})</span>
          <span className="text-[10px] text-[#5B7A99] font-normal">Persisted to Data Layer</span>
        </div>

        <div className="divide-y divide-[#E2E6EC]">
          {experiences.map(exp => (
            <div key={exp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
                    {exp.category}
                  </span>
                  <span className="card-tag px-2 py-0.5 bg-[#111827] text-white text-[10px]">
                    {exp.specialty_tier}
                  </span>
                  {exp.accessibility.step_free && (
                    <span className="text-[10px] text-[#15803D] font-medium">
                      Step-Free
                    </span>
                  )}
                  {exp.eligible_for_nearby_promotions && (
                    <span className="text-[10px] text-[#1B3A6B] bg-[#EBF5FF] px-1.5 py-0.5 rounded-[2px]">
                      Nearby Promo Active
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-base text-[#111827]">
                  {exp.experience_title}
                </h4>
                <div className="text-xs text-[#5B7A99] flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span>{exp.neighborhood}</span>
                  <span>{exp.duration_minutes} min</span>
                  <span>Max {exp.maximum_capacity} guests</span>
                  <span>Hours: {exp.hours}</span>
                </div>
              </div>

              <div className="text-right sm:flex-shrink-0">
                <div className="text-sm font-semibold text-[#111827]">
                  {exp.price_per_head === 0 ? 'Free' : `₹${exp.price_per_head} / head`}
                </div>
                <div className="text-[11px] text-[#15803D] mt-0.5 font-medium">
                  Active in Live Engine
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
