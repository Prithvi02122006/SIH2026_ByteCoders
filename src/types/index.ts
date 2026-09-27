export type CategoryType = 
  | 'food' 
  | 'culture' 
  | 'workshops' 
  | 'nightlife' 
  | 'hidden-gems' 
  | 'markets' 
  | 'nature';

export type SpecialtyTier = 'hidden-gem' | 'signature' | 'seasonal';

export type TransportMode = 'walking' | 'transit' | 'taxi' | 'auto';

export type IndianTransportMode = 'walk' | 'auto_taxi' | 'metro' | 'train' | 'bus' | 'other';

export type GroupType = 'solo' | 'couple' | 'family' | 'friends' | 'seniors' | 'students';

export type BudgetTier = 'budget' | 'moderate' | 'premium';

export interface City {
  id: string;
  name: string;
  state: string;
  center_lat: number;
  center_lng: number;
}

export interface StructuredHours {
  open: string;       // e.g. "09:30"
  close: string;      // e.g. "21:00"
  days_open: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

export interface AccessibilityProfile {
  wheelchair: boolean;
  step_free: boolean;
  senior_paced: boolean;
  low_sensory: boolean;
}

export interface OfferingItem {
  id: string;
  title: string;
  price: number;
  description: string;
  duration_minutes: number;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
  capacity_remaining: number;
  total_capacity: number;
}

// Strict schema from Section 7 & Part A.2:
export interface ExperienceListing {
  id: string;
  experience_title: string;
  category: CategoryType;
  duration_minutes: number;
  price_per_head: number;
  maximum_capacity: number;
  geolocation: {
    lat: number;
    lng: number;
  };
  city_id?: string;
  neighborhood: string;
  tags: string[];
  specialty_tier: SpecialtyTier;
  
  // Extended realistic storefront metadata
  vendor_id: string;
  vendor_name: string;
  vendor_established: number;
  one_line_teaser: string;
  full_description: string;
  indoor: boolean;
  accessibility: AccessibilityProfile;
  hours: string;
  structured_hours?: StructuredHours;
  open_now: boolean;
  closing_soon?: boolean;
  images: string[];
  offerings: OfferingItem[];
  availability_slots?: AvailabilitySlot[];
  rating_summary: {
    score: number;
    review_count: number;
    editorial_note?: string;
  };
  
  // Data provenance & nearby promotions (Parts C & D)
  data_source?: 'vendor_submitted' | 'osm_llm_estimated' | 'curated_seed';
  attribution?: string;
  eligible_for_nearby_promotions?: boolean;
}

export interface TransitLeg {
  mode: TransportMode;
  indian_mode?: IndianTransportMode;
  duration_minutes: number;
  distance_km: number;
  cost: number;
  summary: string;
}

export interface ItineraryStop {
  id: string;
  experience_id: string;
  title: string;
  category: CategoryType;
  specialty_tier: SpecialtyTier;
  arrival_time: string;
  departure_time: string;
  duration_minutes: number;
  price_per_head: number;
  running_budget_total: number;
  geolocation: {
    lat: number;
    lng: number;
  };
  transit_to_next?: TransitLeg;
  is_indoor: boolean;
  step_free: boolean;
  neighborhood: string;
  image_url: string;
  locked?: boolean;
  completed?: boolean;
  distance_from_start_km?: number;
  structured_hours?: StructuredHours;
}

export interface Itinerary {
  id: string;
  title: string;
  city_id: string;
  start_location: {
    name: string;
    lat: number;
    lng: number;
  };
  date: string;
  start_time: string;
  end_time: string;
  stops: ItineraryStop[];
  total_duration_minutes: number;
  total_cost_per_head: number;
  transport_preference: TransportMode;
  allowed_transport_modes?: IndianTransportMode[];
  sequencing_mode: 'shortest_route' | 'custom_order';
  group_type: GroupType;
  accessibility: AccessibilityProfile;
  completed_stop_ids?: string[];
  active_stop_index?: number;
}

export interface TripWizardState {
  // Step 1: Where
  cityId: string;
  startLocationName: string;
  destinationArea: string;
  startCoordinates: { lat: number; lng: number };
  
  // Step 2: When & How Long
  date: string;
  startTime: string;
  durationHours: number;
  
  // Step 3: Budget
  budgetTier: BudgetTier;
  budgetCapAmount: number;
  
  // Step 4: Who
  groupType: GroupType;
  groupSize: number;
  accessibility: AccessibilityProfile;
  
  // Step 5: Interests
  prioritizedCategories: CategoryType[];
  
  // Step 6: Transport (Extended for Indian Transport Modes)
  transportPreference: TransportMode;
  allowedTransportModes: IndianTransportMode[];
  
  // Step 7: Sequencing & Open Now Priority
  sequencingMode: 'shortest_route' | 'custom_order';
  prioritizeOpenNow: boolean;
}

export interface FilterState {
  cityId: string;
  category: CategoryType | 'all';
  searchQuery: string;
  budgetTier: BudgetTier | 'all';
  groupType: GroupType | 'all';
  maxDistanceKm: number;
  timeWindowHours: number;
  accessibilityOnly: boolean;
  wheelchair: boolean;
  stepFree: boolean;
  seniorPaced: boolean;
  lowSensory: boolean;
  hiddenGemsOnly: boolean;
  openNowOnly: boolean;
}

export interface SearchDemandSignal {
  id: string;
  vendor_id?: string;
  city_id?: string;
  query_tags: string[];
  category: CategoryType;
  searches_count: number;
  trend_percentage: number;
  avg_budget_indicated: number;
  accessibility_demand: string;
  neighborhood_focus: string;
}

export interface UserRoleSession {
  role: 'traveler' | 'vendor';
  userName: string;
  businessName?: string;
  vendorId?: string;
  email?: string;
  userId?: string;
}

// ==========================================
// Weather-Driven Digital Twin Types
// ==========================================

export interface WeatherCurrent {
  temperature_c: number;
  apparent_temperature_c: number;
  relative_humidity: number;
  precipitation_mm: number;
  rain_mm: number;
  weather_code: number;
  weather_description: string;
  wind_speed_kmh: number;
  is_day: boolean;
  is_raining: boolean;
  is_storm: boolean;
  condition_category: 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm' | 'fog';
}

export interface WeatherHourlyItem {
  time: string;
  temperature_c: number;
  precipitation_probability: number;
  precipitation_mm: number;
  weather_code: number;
  weather_description: string;
  wind_speed_kmh: number;
}

export interface WeatherData {
  city_name: string;
  lat: number;
  lng: number;
  current: WeatherCurrent;
  hourly: WeatherHourlyItem[];
  precipitation_sum_24h: number;
  max_rain_probability_24h: number;
  fetched_at: string;
}

export interface WeatherSimulationParams {
  rainfall_intensity_mm: number;   // 0 - 80 mm/h
  storm_duration_hours: number;    // 0.5 - 6 h
  temperature_c: number;           // 10 - 45 °C
  wind_speed_kmh: number;          // 0 - 80 km/h
  waterlogging_severity: 'none' | 'moderate' | 'severe';
  preset_name?: string;
}

export interface SimulatedStopImpact {
  stop_id: string;
  title: string;
  category: CategoryType;
  is_indoor: boolean;
  neighborhood: string;
  original_arrival_time: string;
  simulated_arrival_time: string;
  original_departure_time: string;
  simulated_departure_time: string;
  transit_delay_minutes: number;
  cumulative_delay_minutes: number;
  exposure_risk_percentage: number;      // 0 - 100%
  expected_occupancy_shift_percentage: number; // e.g. -60% or +40%
  vendor_availability_risk: 'low' | 'moderate' | 'high' | 'closure_imminent';
  status: 'normal' | 'delayed' | 'critical' | 'sheltered';
  transit_delay_multiplier: number;
  confidence_band: {
    delay_min: number;
    delay_expected: number;
    delay_max: number;
    confidence_score: number;
  };
}

export interface DigitalTwinSimulationResult {
  params: WeatherSimulationParams;
  simulated_stops: SimulatedStopImpact[];
  total_delay_minutes: number;
  max_cumulative_delay_minutes: number;
  severely_affected_stops_count: number;
  outdoor_exposure_index: number; // 0 - 100
  nugen_insight: string;
  nugen_recommended_action: string;
  nugen_confidence: number;
  simulated_at: string;
}

export interface SocialWeatherSignal {
  id: string;
  source: string;
  timestamp: string;
  headline: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  neighborhood: string;
  verified: boolean;
  traveler_impact: string;
}

