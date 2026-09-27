import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  City,
  ExperienceListing,
  FilterState,
  Itinerary,
  ItineraryStop,
  TripWizardState,
  UserRoleSession,
  WeatherData,
  WeatherSimulationParams,
  DigitalTwinSimulationResult,
  SocialWeatherSignal
} from '../types';
import { PAN_INDIA_CITIES } from '../data/panIndiaCities';
import { PAN_INDIA_EXPERIENCES } from '../data/panIndiaExperiences';
import { getExperiencesByCity, insertExperience } from '../lib/supabase';
import { generateAdaptationExplanation } from '../lib/llmClient';
import { buildDynamicItinerary } from '../engine/routingEngine';
import { fetchLiveWeather } from '../lib/weatherClient';
import { fetchSocialWeatherSignals } from '../lib/socialSignalClient';
import { simulateWeatherImpactOnItinerary } from '../engine/digitalTwinEngine';
import {
  adaptLessTime,
  adaptRain,
  adaptSpotClosed,
  adaptLowerBudget,
  adaptSeniorAccessibility,
  swapSingleStop
} from '../engine/adaptationEngine';

export type AppView = 'explore' | 'trip-builder' | 'vendor-portal' | 'terms' | 'privacy';

interface AppContextType {
  currentView: AppView;
  previousView: AppView;
  slideDirection: 'right' | 'left';
  activeRole: 'traveler' | 'vendor';
  showRoleModal: boolean;
  currentCity: City;
  userLocation: { lat: number; lng: number } | null;
  allowNearbyAds: boolean;
  experiences: ExperienceListing[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isLoadingExperiences: boolean;
  activeStorefront: ExperienceListing | null;
  activeItinerary: Itinerary | null;
  isComputingItinerary: boolean;
  adaptationNotice: string | null;
  tripWizard: TripWizardState;
  activeStopToSwap: ItineraryStop | null;
  
  // Weather-Driven Digital Twin State
  weatherData: WeatherData | null;
  isLoadingWeather: boolean;
  simulatedTwin: DigitalTwinSimulationResult | null;
  isSimulatingTwin: boolean;
  socialSignals: SocialWeatherSignal[];
  isLoadingSocialSignals: boolean;
  weatherSimulationParams: WeatherSimulationParams;
  setWeatherSimulationParams: React.Dispatch<React.SetStateAction<WeatherSimulationParams>>;
  tripBuilderTab: 'timeline' | 'digital-twin';
  setTripBuilderTab: (tab: 'timeline' | 'digital-twin') => void;
  fetchCityWeather: (city?: City) => Promise<WeatherData | null>;
  runDigitalTwinSimulation: (customParams?: Partial<WeatherSimulationParams>) => Promise<DigitalTwinSimulationResult | null>;
  applySimulationToActual: () => void;
  clearSimulation: () => void;

  // Actions
  navigateTo: (view: AppView) => void;
  setActiveRole: (role: 'traveler' | 'vendor') => void;
  setShowRoleModal: (show: boolean) => void;
  setCurrentCity: (city: City) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setAllowNearbyAds: (allow: boolean) => void;
  markStopComplete: (stopId: string) => void;
  openStorefront: (exp: ExperienceListing) => void;
  closeStorefront: () => void;
  updateTripWizard: (updates: Partial<TripWizardState>) => void;
  generateItineraryFromWizard: (state?: TripWizardState) => void;
  triggerAdaptation: (
    type: 'less_time' | 'rain' | 'closed' | 'lower_budget' | 'senior_toggle',
    param?: { stopId?: string; enableSenior?: boolean }
  ) => void;
  executeStopSwap: (stopId: string, candidate: ExperienceListing) => void;
  addExperienceToTrip: (exp: ExperienceListing) => void;
  addNewVendorListing: (listing: ExperienceListing) => void;
  setActiveStopToSwap: (stop: ItineraryStop | null) => void;
  dismissNotice: () => void;
}

const getDefaultTripDate = (): string => new Date().toISOString().slice(0, 10);

const DEFAULT_WIZARD: TripWizardState = {
  cityId: 'delhi',
  startLocationName: 'Connaught Place, Central Delhi',
  destinationArea: 'Old Delhi & Central Cultural Corridor',
  startCoordinates: { lat: 28.6315, lng: 77.2167 },
  date: getDefaultTripDate(),
  startTime: '09:30',
  durationHours: 6,
  budgetTier: 'moderate',
  budgetCapAmount: 1500,
  groupType: 'couple',
  groupSize: 2,
  accessibility: {
    wheelchair: false,
    step_free: false,
    senior_paced: false,
    low_sensory: false
  },
  prioritizedCategories: ['culture', 'workshops', 'food'],
  transportPreference: 'auto',
  allowedTransportModes: ['walk', 'auto_taxi', 'metro'],
  sequencingMode: 'shortest_route',
  prioritizeOpenNow: false
};

const DEFAULT_FILTERS: FilterState = {
  cityId: 'delhi',
  category: 'all',
  searchQuery: '',
  budgetTier: 'all',
  groupType: 'all',
  maxDistanceKm: 40,
  timeWindowHours: 8,
  accessibilityOnly: false,
  wheelchair: false,
  stepFree: false,
  seniorPaced: false,
  lowSensory: false,
  hiddenGemsOnly: false,
  openNowOnly: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('explore');
  const [previousView, setPreviousView] = useState<AppView>('explore');
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [activeRole, setActiveRoleState] = useState<'traveler' | 'vendor'>('traveler');
  // Show the role-select modal at the start of every visit (not just the
  // first one) so travelers/vendors always get an explicit choice — it no
  // longer remembers "already onboarded" across refreshes.
  const [showRoleModal, setShowRoleModal] = useState<boolean>(true);
  const [currentCity, setCurrentCityState] = useState<City>(PAN_INDIA_CITIES[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [allowNearbyAds, setAllowNearbyAds] = useState<boolean>(false);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Pan-India experiences initialized for Delhi
  const [experiences, setExperiences] = useState<ExperienceListing[]>(() => {
    return PAN_INDIA_EXPERIENCES.filter(e => e.city_id === 'delhi');
  });

  const [activeStorefront, setActiveStorefront] = useState<ExperienceListing | null>(null);
  const [tripWizard, setTripWizard] = useState<TripWizardState>(DEFAULT_WIZARD);
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(() => {
    const delhiExps = PAN_INDIA_EXPERIENCES.filter(e => e.city_id === 'delhi');
    return buildDynamicItinerary(DEFAULT_WIZARD, delhiExps.slice(0, 4));
  });
  const [isComputingItinerary, setIsComputingItinerary] = useState<boolean>(false);
  const [adaptationNotice, setAdaptationNotice] = useState<string | null>(null);
  const [activeStopToSwap, setActiveStopToSwap] = useState<ItineraryStop | null>(null);

  // Weather-Driven Digital Twin State
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [simulatedTwin, setSimulatedTwin] = useState<DigitalTwinSimulationResult | null>(null);
  const [isSimulatingTwin, setIsSimulatingTwin] = useState<boolean>(false);
  const [socialSignals, setSocialSignals] = useState<SocialWeatherSignal[]>([]);
  const [isLoadingSocialSignals, setIsLoadingSocialSignals] = useState<boolean>(false);
  const [weatherSimulationParams, setWeatherSimulationParams] = useState<WeatherSimulationParams>({
    rainfall_intensity_mm: 22,
    storm_duration_hours: 2,
    temperature_c: 27,
    wind_speed_kmh: 24,
    waterlogging_severity: 'moderate',
    preset_name: 'Sudden Monsoon Shower'
  });
  const [tripBuilderTab, setTripBuilderTab] = useState<'timeline' | 'digital-twin'>('timeline');

  const fetchCityWeather = async (cityToFetch?: City) => {
    const target = cityToFetch || currentCity;
    setIsLoadingWeather(true);
    try {
      const data = await fetchLiveWeather(target.name, target.center_lat, target.center_lng);
      setWeatherData(data);
      return data;
    } catch (err) {
      console.warn('Failed to load weather:', err);
      return null;
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Initial load and on city change
  useEffect(() => {
    fetchCityWeather(currentCity);
  }, [currentCity.id]);

  const runDigitalTwinSimulation = async (customParams?: Partial<WeatherSimulationParams>) => {
    if (!activeItinerary || activeItinerary.stops.length === 0) {
      setAdaptationNotice('Please schedule an itinerary before executing the digital twin simulation.');
      return null;
    }

    const params: WeatherSimulationParams = {
      ...weatherSimulationParams,
      ...(customParams || {})
    };
    setWeatherSimulationParams(params);
    setIsSimulatingTwin(true);
    setIsLoadingSocialSignals(true);

    try {
      const simResult = await simulateWeatherImpactOnItinerary(activeItinerary, params);
      setSimulatedTwin(simResult);

      const signals = await fetchSocialWeatherSignals(currentCity.id, currentCity.name, params);
      setSocialSignals(signals);

      return simResult;
    } catch (err) {
      console.warn('Digital twin simulation error:', err);
      return null;
    } finally {
      setIsSimulatingTwin(false);
      setIsLoadingSocialSignals(false);
    }
  };

  const applySimulationToActual = () => {
    if (!simulatedTwin || !activeItinerary) return;

    const updatedStops = activeItinerary.stops.map(stop => {
      const sim = simulatedTwin.simulated_stops.find(s => s.stop_id === stop.id);
      if (!sim) return stop;
      return {
        ...stop,
        arrival_time: sim.simulated_arrival_time,
        departure_time: sim.simulated_departure_time
      };
    });

    const updatedItinerary: Itinerary = {
      ...activeItinerary,
      stops: updatedStops,
      total_duration_minutes: activeItinerary.total_duration_minutes + simulatedTwin.total_delay_minutes
    };

    setActiveItinerary(updatedItinerary);
    setAdaptationNotice(
      `Applied Digital Twin weather simulation: ${simulatedTwin.total_delay_minutes}m buffer added across schedule.`
    );
  };

  const clearSimulation = () => {
    setSimulatedTwin(null);
  };

  // When currentCity changes, load experiences from Supabase / local cache
  const setCurrentCity = async (city: City) => {
    setCurrentCityState(city);
    setIsLoadingExperiences(true);
    try {
      const cityExps = await getExperiencesByCity(city.id);
      setExperiences(cityExps);
      setFilters(prev => ({ ...prev, cityId: city.id }));

      const updatedWizard: TripWizardState = {
        ...tripWizard,
        cityId: city.id,
        startLocationName: `${city.name} Central Hub`,
        destinationArea: `${city.name} Cultural Core`,
        startCoordinates: { lat: city.center_lat, lng: city.center_lng }
      };
      setTripWizard(updatedWizard);

      // Re-generate default itinerary for the new city
      if (cityExps.length > 0) {
        const newItin = buildDynamicItinerary(updatedWizard, cityExps.slice(0, 4));
        setActiveItinerary(newItin);
      }
    } catch (err) {
      console.warn('Error loading experiences for city:', city.name, err);
    } finally {
      setIsLoadingExperiences(false);
    }
  };

  const viewOrder: Record<AppView, number> = {
    'explore': 1,
    'trip-builder': 2,
    'vendor-portal': 3,
    'terms': 4,
    'privacy': 5
  };

  const navigateTo = (newView: AppView) => {
    if (newView === currentView) return;
    const direction = viewOrder[newView] >= viewOrder[currentView] ? 'right' : 'left';
    setSlideDirection(direction);
    setPreviousView(currentView);
    setCurrentView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveRole = (role: 'traveler' | 'vendor') => {
    setActiveRoleState(role);
    setShowRoleModal(false);
    if (role === 'vendor' && currentView !== 'vendor-portal') {
      navigateTo('vendor-portal');
    } else if (role === 'traveler' && currentView === 'vendor-portal') {
      navigateTo('explore');
    }
  };

  const openStorefront = (exp: ExperienceListing) => {
    setActiveStorefront(exp);
  };

  const closeStorefront = () => {
    setActiveStorefront(null);
  };

  const updateTripWizard = (updates: Partial<TripWizardState>) => {
    setTripWizard(prev => ({ ...prev, ...updates }));
  };

  const generateItineraryFromWizard = (customState?: TripWizardState) => {
    const state = customState || tripWizard;
    setIsComputingItinerary(true);

    setTimeout(() => {
      // Filter candidates based on categories and accessibility
      let candidates = experiences.filter(exp => {
        if (state.accessibility.step_free && !exp.accessibility.step_free) return false;
        if (state.accessibility.wheelchair && !exp.accessibility.wheelchair) return false;
        return true;
      });

      // Filter by interests if selected
      if (state.prioritizedCategories.length > 0) {
        const matching = candidates.filter(c => state.prioritizedCategories.includes(c.category));
        if (matching.length >= 3) {
          candidates = matching;
        }
      }

      // Pick top 4-5 balanced experiences, greedily respecting the
      // per-person budget cap set on the wizard.
      const picked: typeof candidates = [];
      let runningTotal = 0;
      for (const candidate of candidates) {
        if (picked.length >= 4) break;
        const nextTotal = runningTotal + candidate.price_per_head;
        if (picked.length > 0 && nextTotal > state.budgetCapAmount) continue;
        picked.push(candidate);
        runningTotal = nextTotal;
      }
      // Guarantee at least one stop even if it alone exceeds the cap,
      // so a very low cap doesn't produce an empty itinerary.
      if (picked.length === 0 && candidates.length > 0) {
        picked.push(candidates[0]);
      }
      const computed = buildDynamicItinerary(state, picked, {
        seniorBuffer: state.accessibility.senior_paced
      });

      setActiveItinerary(computed);
      setIsComputingItinerary(false);
      setAdaptationNotice('Dynamic schedule generated with live route legs and running budget.');
    }, 450);
  };

  const triggerAdaptation = (
    type: 'less_time' | 'rain' | 'closed' | 'lower_budget' | 'senior_toggle',
    param?: { stopId?: string; enableSenior?: boolean }
  ) => {
    if (!activeItinerary) return;
    setIsComputingItinerary(true);

    setTimeout(() => {
      let result;
      switch (type) {
        case 'less_time':
          result = adaptLessTime(activeItinerary, tripWizard, experiences);
          break;
        case 'rain':
          result = adaptRain(activeItinerary, tripWizard, experiences);
          break;
        case 'closed':
          result = adaptSpotClosed(
            activeItinerary,
            param?.stopId || activeItinerary.stops[0]?.id,
            tripWizard,
            experiences
          );
          break;
        case 'lower_budget':
          result = adaptLowerBudget(activeItinerary, tripWizard, experiences);
          break;
        case 'senior_toggle':
          result = adaptSeniorAccessibility(
            activeItinerary,
            tripWizard,
            experiences,
            param?.enableSenior ?? true
          );
          break;
      }

      if (result) {
        setActiveItinerary(result.updatedItinerary);
        setAdaptationNotice(result.summaryMessage);

        // Async LLM explanation enhancement (falls back silently if offline/no key)
        const stopNames = result.updatedItinerary.stops.map(s => s.title);
        generateAdaptationExplanation(type, stopNames, result.summaryMessage)
          .then(richExplanation => {
            if (richExplanation && richExplanation !== result.summaryMessage) {
              setAdaptationNotice(richExplanation);
            }
          })
          .catch(() => {});
      }
      setIsComputingItinerary(false);
    }, 350);
  };

  const markStopComplete = (stopId: string) => {
    if (!activeItinerary) return;
    const updatedStops = activeItinerary.stops.map(s => {
      if (s.id === stopId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const completedIds = updatedStops.filter(s => s.completed).map(s => s.id);
    setActiveItinerary({
      ...activeItinerary,
      stops: updatedStops,
      completed_stop_ids: completedIds
    });
  };

  const executeStopSwap = (stopId: string, candidate: ExperienceListing) => {
    if (!activeItinerary) return;
    setIsComputingItinerary(true);

    setTimeout(() => {
      const result = swapSingleStop(activeItinerary, stopId, candidate, tripWizard, experiences);
      setActiveItinerary(result.updatedItinerary);
      setAdaptationNotice(result.summaryMessage);
      setActiveStopToSwap(null);
      setIsComputingItinerary(false);
    }, 300);
  };

  const addExperienceToTrip = (exp: ExperienceListing) => {
    if (!activeItinerary) {
      generateItineraryFromWizard({
        ...tripWizard,
        prioritizedCategories: [exp.category]
      });
      navigateTo('trip-builder');
      closeStorefront();
      return;
    }

    const currentExpIds = activeItinerary.stops.map(s => s.experience_id);
    if (currentExpIds.includes(exp.id)) {
      setAdaptationNotice(`${exp.experience_title} is already part of your itinerary.`);
      closeStorefront();
      return;
    }

    const currentExpList = experiences.filter(e => currentExpIds.includes(e.id));
    currentExpList.push(exp);

    const updated = buildDynamicItinerary(tripWizard, currentExpList);
    setActiveItinerary(updated);
    setAdaptationNotice(`Added ${exp.experience_title} to your dynamic itinerary.`);
    closeStorefront();
    navigateTo('trip-builder');
  };

  const addNewVendorListing = async (newListing: ExperienceListing) => {
    // Persist to Supabase or local persistent store
    await insertExperience(newListing);
    setExperiences(prev => [newListing, ...prev]);
    setAdaptationNotice(`Published "${newListing.experience_title}" to the live traveler network.`);
  };

  const dismissNotice = () => {
    setAdaptationNotice(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        previousView,
        slideDirection,
        activeRole,
        showRoleModal,
        currentCity,
        userLocation,
        allowNearbyAds,
        experiences,
        filters,
        setFilters,
        isLoadingExperiences,
        activeStorefront,
        activeItinerary,
        isComputingItinerary,
        adaptationNotice,
        tripWizard,
        activeStopToSwap,
        navigateTo,
        setActiveRole,
        setShowRoleModal,
        setCurrentCity,
        setUserLocation,
        setAllowNearbyAds,
        markStopComplete,
        openStorefront,
        closeStorefront,
        updateTripWizard,
        generateItineraryFromWizard,
        triggerAdaptation,
        executeStopSwap,
        addExperienceToTrip,
        addNewVendorListing,
        setActiveStopToSwap,
        dismissNotice,
        weatherData,
        isLoadingWeather,
        simulatedTwin,
        isSimulatingTwin,
        socialSignals,
        isLoadingSocialSignals,
        weatherSimulationParams,
        setWeatherSimulationParams,
        tripBuilderTab,
        setTripBuilderTab,
        fetchCityWeather,
        runDigitalTwinSimulation,
        applySimulationToActual,
        clearSimulation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
