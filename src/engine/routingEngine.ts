import {
  ExperienceListing,
  IndianTransportMode,
  Itinerary,
  ItineraryStop,
  TransitLeg,
  TransportMode,
  TripWizardState
} from '../types';

/**
 * Calculates Haversine distance in kilometers between two geographic coordinates.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Determines transit leg properties based on distance, preference, allowed Indian modes, and budget.
 * Math remains strictly deterministic per requirements.
 */
export function determineTransitLeg(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  preference: TransportMode,
  budgetTier: 'budget' | 'moderate' | 'premium',
  seniorFriendly: boolean = false,
  allowedModes?: IndianTransportMode[]
): TransitLeg {
  const dist = calculateDistanceKm(fromLat, fromLng, toLat, toLng);
  
  // Default allowed modes if none specified
  const permitted = (allowedModes && allowedModes.length > 0)
    ? allowedModes
    : ['walk', 'auto_taxi', 'metro'] as IndianTransportMode[];

  let chosenIndianMode: IndianTransportMode = 'walk';

  // Rule-based mode selection constrained strictly by traveler allowed modes
  if (dist <= 0.8 && permitted.includes('walk') && !seniorFriendly) {
    chosenIndianMode = 'walk';
  } else if (dist <= 1.2 && permitted.includes('walk') && budgetTier === 'budget') {
    chosenIndianMode = 'walk';
  } else if (dist > 3.0 && permitted.includes('metro')) {
    chosenIndianMode = 'metro';
  } else if (permitted.includes('auto_taxi')) {
    chosenIndianMode = 'auto_taxi';
  } else if (permitted.includes('metro')) {
    chosenIndianMode = 'metro';
  } else if (permitted.includes('bus')) {
    chosenIndianMode = 'bus';
  } else if (permitted.includes('train')) {
    chosenIndianMode = 'train';
  } else {
    chosenIndianMode = permitted[0] || 'walk';
  }

  let durationMins = 10;
  let cost = 0;
  let summary = '';
  let mappedMode: TransportMode = 'walking';

  switch (chosenIndianMode) {
    case 'walk': {
      const walkRate = seniorFriendly ? 18 : 13;
      durationMins = Math.max(8, Math.round(dist * walkRate));
      cost = 0;
      summary = `Walk ${dist} km via pedestrian lanes`;
      mappedMode = 'walking';
      break;
    }
    case 'auto_taxi': {
      durationMins = Math.max(7, Math.round(dist * 2.4 + 4));
      // Indian auto-rickshaw/cab pricing: base Rs 40 + Rs 16/km
      cost = Math.round(40 + dist * 16);
      summary = `Auto-rickshaw / Cab (${dist} km)`;
      mappedMode = 'taxi';
      break;
    }
    case 'metro': {
      durationMins = Math.max(12, Math.round(dist * 3.2 + 8));
      cost = Math.round(Math.min(60, 20 + dist * 4));
      summary = `Metro Rail Transit (${dist} km)`;
      mappedMode = 'transit';
      break;
    }
    case 'train': {
      durationMins = Math.max(15, Math.round(dist * 2.8 + 10));
      cost = 15;
      summary = `Suburban Local Rail (${dist} km)`;
      mappedMode = 'transit';
      break;
    }
    case 'bus': {
      durationMins = Math.max(14, Math.round(dist * 4.0 + 8));
      cost = 20;
      summary = `City Bus Connection (${dist} km)`;
      mappedMode = 'transit';
      break;
    }
    default: {
      durationMins = Math.max(8, Math.round(dist * 14));
      cost = 30;
      summary = `E-Rickshaw / Local Transit (${dist} km)`;
      mappedMode = 'transit';
    }
  }

  return {
    mode: mappedMode,
    indian_mode: chosenIndianMode,
    duration_minutes: durationMins,
    distance_km: dist,
    cost,
    summary
  };
}

/**
 * Solves Traveling Salesperson Problem (TSP) using Nearest Neighbor + 2-opt heuristic.
 * Keeps math intact.
 */
export function optimizeShortestRoute(
  startLat: number,
  startLng: number,
  experiences: ExperienceListing[]
): ExperienceListing[] {
  if (experiences.length <= 1) return [...experiences];

  const unvisited = [...experiences];
  const ordered: ExperienceListing[] = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = calculateDistanceKm(
        currentLat,
        currentLng,
        unvisited[i].geolocation.lat,
        unvisited[i].geolocation.lng
      );
      if (d < minDistance) {
        minDistance = d;
        nearestIndex = i;
      }
    }

    const nextStop = unvisited.splice(nearestIndex, 1)[0];
    ordered.push(nextStop);
    currentLat = nextStop.geolocation.lat;
    currentLng = nextStop.geolocation.lng;
  }

  // 2-opt refinement
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < ordered.length - 1; i++) {
      for (let k = i + 1; k < ordered.length; k++) {
        const d1 = calculateDistanceKm(
          i === 0 ? startLat : ordered[i - 1].geolocation.lat,
          i === 0 ? startLng : ordered[i - 1].geolocation.lng,
          ordered[i].geolocation.lat,
          ordered[i].geolocation.lng
        );
        const d2 = calculateDistanceKm(
          ordered[k].geolocation.lat,
          ordered[k].geolocation.lng,
          k === ordered.length - 1 ? ordered[k].geolocation.lat : ordered[k + 1].geolocation.lat,
          k === ordered.length - 1 ? ordered[k].geolocation.lng : ordered[k + 1].geolocation.lng
        );

        const newD1 = calculateDistanceKm(
          i === 0 ? startLat : ordered[i - 1].geolocation.lat,
          i === 0 ? startLng : ordered[i - 1].geolocation.lng,
          ordered[k].geolocation.lat,
          ordered[k].geolocation.lng
        );
        const newD2 = calculateDistanceKm(
          ordered[i].geolocation.lat,
          ordered[i].geolocation.lng,
          k === ordered.length - 1 ? ordered[k].geolocation.lat : ordered[k + 1].geolocation.lat,
          k === ordered.length - 1 ? ordered[k].geolocation.lng : ordered[k + 1].geolocation.lng
        );

        if (newD1 + newD2 < d1 + d2 - 0.2) {
          const reversed = ordered.slice(i, k + 1).reverse();
          ordered.splice(i, k - i + 1, ...reversed);
          improved = true;
        }
      }
    }
  }

  return ordered;
}

/**
 * Formats minutes into 24-hour time string HH:MM.
 */
function minutesToTimeStr(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Parses HH:MM string to total minutes from midnight.
 */
function timeStrToMinutes(timeStr: string): number {
  const [h, m] = (timeStr || '09:30').split(':').map(Number);
  return (h || 9) * 60 + (m || 0);
}

/**
 * Re-orders stops taking into account structured opening/closing hours.
 * If a venue is currently closed at the arrival minute but opens later,
 * it schedules currently-open venues first so traveler arrives when it is open.
 */
function scheduleOpeningHoursAware(
  ordered: ExperienceListing[],
  startMinutes: number,
  startLat: number,
  startLng: number,
  transportPreference: TransportMode,
  budgetTier: 'budget' | 'moderate' | 'premium',
  seniorFriendly: boolean,
  allowedModes?: IndianTransportMode[]
): ExperienceListing[] {
  if (ordered.length <= 1) return ordered;

  const result: ExperienceListing[] = [];
  const remaining = [...ordered];
  let curMins = startMinutes;
  let curLat = startLat;
  let curLng = startLng;

  while (remaining.length > 0) {
    let chosenIdx = 0;
    let foundOpen = false;

    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      const transit = determineTransitLeg(
        curLat,
        curLng,
        cand.geolocation.lat,
        cand.geolocation.lng,
        transportPreference,
        budgetTier,
        seniorFriendly,
        allowedModes
      );
      const estArrival = curMins + transit.duration_minutes;

      // Check structured hours if defined
      if (cand.structured_hours) {
        const openMins = timeStrToMinutes(cand.structured_hours.open);
        const closeMins = timeStrToMinutes(cand.structured_hours.close);
        // Handle venues open past midnight (e.g. nightlife: open 20:00, close 02:00)
        const isOpenAtArrival = closeMins < openMins
          ? (estArrival >= openMins || estArrival <= closeMins)
          : (estArrival >= openMins && estArrival <= closeMins);

        if (isOpenAtArrival) {
          chosenIdx = i;
          foundOpen = true;
          break; // Stop is open right when traveler arrives
        }
      } else {
        chosenIdx = i;
        foundOpen = true;
        break;
      }
    }

    // If no candidate is open at this minute, pick the one that opens earliest
    if (!foundOpen) {
      let earliestOpenMins = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const cand = remaining[i];
        const openMins = cand.structured_hours ? timeStrToMinutes(cand.structured_hours.open) : 0;
        if (openMins < earliestOpenMins) {
          earliestOpenMins = openMins;
          chosenIdx = i;
        }
      }
    }

    const picked = remaining.splice(chosenIdx, 1)[0];
    result.push(picked);

    const transit = determineTransitLeg(
      curLat,
      curLng,
      picked.geolocation.lat,
      picked.geolocation.lng,
      transportPreference,
      budgetTier,
      seniorFriendly,
      allowedModes
    );
    curMins += transit.duration_minutes + picked.duration_minutes + (seniorFriendly ? 20 : 10);
    curLat = picked.geolocation.lat;
    curLng = picked.geolocation.lng;
  }

  return result;
}

/**
 * Builds a dynamic sequenced Itinerary complete with timeline timestamps,
 * transit legs, opening-hours awareness, and distance annotations.
 */
export function buildDynamicItinerary(
  wizard: TripWizardState,
  selectedExperiences: ExperienceListing[],
  options?: { seniorBuffer?: boolean }
): Itinerary {
  let orderedList = [...selectedExperiences];

  if (wizard.sequencingMode === 'shortest_route') {
    orderedList = optimizeShortestRoute(
      wizard.startCoordinates.lat,
      wizard.startCoordinates.lng,
      selectedExperiences
    );
  }

  const startMins = timeStrToMinutes(wizard.startTime || '09:30');

  // Apply Opening-Hours-Aware Scheduling (Part D.8)
  orderedList = scheduleOpeningHoursAware(
    orderedList,
    startMins,
    wizard.startCoordinates.lat,
    wizard.startCoordinates.lng,
    wizard.transportPreference,
    wizard.budgetTier,
    options?.seniorBuffer || wizard.accessibility.senior_paced,
    wizard.allowedTransportModes
  );

  let currentMinutes = startMins;
  let runningBudget = 0;
  const stops: ItineraryStop[] = [];
  const bufferMinutes = (options?.seniorBuffer || wizard.accessibility.senior_paced) ? 20 : 10;

  for (let i = 0; i < orderedList.length; i++) {
    const exp = orderedList[i];
    const prevCoord =
      i === 0
        ? wizard.startCoordinates
        : orderedList[i - 1].geolocation;

    // Transit leg to reach this stop
    const transit = determineTransitLeg(
      prevCoord.lat,
      prevCoord.lng,
      exp.geolocation.lat,
      exp.geolocation.lng,
      wizard.transportPreference,
      wizard.budgetTier,
      options?.seniorBuffer || wizard.accessibility.senior_paced,
      wizard.allowedTransportModes
    );

    currentMinutes += transit.duration_minutes;
    const arrivalTime = minutesToTimeStr(currentMinutes);

    currentMinutes += exp.duration_minutes + bufferMinutes;
    const departureTime = minutesToTimeStr(currentMinutes);

    runningBudget += exp.price_per_head + transit.cost;

    // Straight line distance from start hub for D.7 nearest-to-farthest indicator
    const distFromStart = calculateDistanceKm(
      wizard.startCoordinates.lat,
      wizard.startCoordinates.lng,
      exp.geolocation.lat,
      exp.geolocation.lng
    );

    let nextTransit: TransitLeg | undefined;
    if (i < orderedList.length - 1) {
      const nextExp = orderedList[i + 1];
      nextTransit = determineTransitLeg(
        exp.geolocation.lat,
        exp.geolocation.lng,
        nextExp.geolocation.lat,
        nextExp.geolocation.lng,
        wizard.transportPreference,
        wizard.budgetTier,
        options?.seniorBuffer || wizard.accessibility.senior_paced,
        wizard.allowedTransportModes
      );
    }

    stops.push({
      id: `stop-${i + 1}-${exp.id}`,
      experience_id: exp.id,
      title: exp.experience_title,
      category: exp.category,
      specialty_tier: exp.specialty_tier,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      duration_minutes: exp.duration_minutes,
      price_per_head: exp.price_per_head,
      running_budget_total: Math.round(runningBudget * 10) / 10,
      geolocation: exp.geolocation,
      transit_to_next: nextTransit,
      is_indoor: exp.indoor,
      step_free: exp.accessibility.step_free,
      neighborhood: exp.neighborhood,
      image_url: exp.images[0],
      completed: false,
      distance_from_start_km: distFromStart,
      structured_hours: exp.structured_hours
    });
  }

  const totalDuration = currentMinutes - startMins;

  return {
    id: `itin-${Date.now()}`,
    title: `${wizard.destinationArea || 'Regional'} Cultural Tour`,
    city_id: wizard.cityId || 'delhi',
    start_location: {
      name: wizard.startLocationName || 'Starting Hub',
      lat: wizard.startCoordinates.lat,
      lng: wizard.startCoordinates.lng
    },
    date: wizard.date || new Date().toISOString().slice(0, 10),
    start_time: wizard.startTime || '09:30',
    end_time: minutesToTimeStr(currentMinutes),
    stops,
    total_duration_minutes: totalDuration,
    total_cost_per_head: Math.round(runningBudget * 10) / 10,
    transport_preference: wizard.transportPreference,
    allowed_transport_modes: wizard.allowedTransportModes,
    sequencing_mode: wizard.sequencingMode,
    group_type: wizard.groupType,
    accessibility: wizard.accessibility,
    completed_stop_ids: [],
    active_stop_index: 0
  };
}
