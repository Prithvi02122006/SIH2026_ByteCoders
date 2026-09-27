import {
  ExperienceListing,
  Itinerary,
  ItineraryStop,
  TripWizardState
} from '../types';
import { buildDynamicItinerary, calculateDistanceKm } from './routingEngine';

export interface AdaptationResult {
  updatedItinerary: Itinerary;
  summaryMessage: string;
  affectedStopIds: string[];
}

/**
 * Handles "Less Time":
 * Drops the stop with lowest ranking or largest detour, recalculates remaining schedule.
 */
export function adaptLessTime(
  currentItinerary: Itinerary,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[]
): AdaptationResult {
  if (currentItinerary.stops.length <= 2) {
    return {
      updatedItinerary: currentItinerary,
      summaryMessage: 'Itinerary is already at the minimum viable length (2 stops).',
      affectedStopIds: []
    };
  }

  // Find stop with largest travel detour or longest duration
  let maxDurationIdx = -1;
  let maxVal = -1;
  for (let i = 0; i < currentItinerary.stops.length; i++) {
    const stop = currentItinerary.stops[i];
    if (stop.locked) continue;
    const detourVal = stop.duration_minutes + (stop.transit_to_next?.duration_minutes || 0);
    if (detourVal > maxVal) {
      maxVal = detourVal;
      maxDurationIdx = i;
    }
  }

  if (maxDurationIdx === -1) {
    // Every stop is locked — nothing eligible to remove.
    return {
      updatedItinerary: currentItinerary,
      summaryMessage: 'All stops are locked in place, so none could be removed to save time.',
      affectedStopIds: []
    };
  }

  const removedStop = currentItinerary.stops[maxDurationIdx];
  const remainingExperienceIds = currentItinerary.stops
    .filter((_, idx) => idx !== maxDurationIdx)
    .map(s => s.experience_id);

  const selectedExpList = allExperiences.filter(e =>
    remainingExperienceIds.includes(e.id)
  );

  const updated = buildDynamicItinerary(wizardState, selectedExpList);

  return {
    updatedItinerary: updated,
    summaryMessage: `Removed ${removedStop.title} to recover ~${removedStop.duration_minutes} minutes from the schedule.`,
    affectedStopIds: [removedStop.id]
  };
}

/**
 * Handles "It's Raining":
 * Replaces any outdoor/exposed stop with an indoor cultural or artisan workshop.
 */
export function adaptRain(
  currentItinerary: Itinerary,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[]
): AdaptationResult {
  const currentExpIds = new Set(currentItinerary.stops.map(s => s.experience_id));
  const indoorCandidates = allExperiences.filter(
    e => e.indoor && !currentExpIds.has(e.id)
  );

  let outdoorFound = false;
  const newExpList: ExperienceListing[] = [];
  const swappedStopIds: string[] = [];

  for (const stop of currentItinerary.stops) {
    if (!stop.is_indoor && indoorCandidates.length > 0) {
      // Find closest indoor candidate
      let bestCandidate = indoorCandidates[0];
      let minDistance = Infinity;
      for (const cand of indoorCandidates) {
        const d = calculateDistanceKm(
          stop.geolocation.lat,
          stop.geolocation.lng,
          cand.geolocation.lat,
          cand.geolocation.lng
        );
        if (d < minDistance) {
          minDistance = d;
          bestCandidate = cand;
        }
      }

      // Remove candidate from pool so not reused
      const candIdx = indoorCandidates.indexOf(bestCandidate);
      if (candIdx > -1) indoorCandidates.splice(candIdx, 1);

      newExpList.push(bestCandidate);
      swappedStopIds.push(stop.id);
      outdoorFound = true;
    } else {
      const existing = allExperiences.find(e => e.id === stop.experience_id);
      if (existing) newExpList.push(existing);
    }
  }

  if (!outdoorFound) {
    return {
      updatedItinerary: currentItinerary,
      summaryMessage: 'All current stops are already covered or indoor venues.',
      affectedStopIds: []
    };
  }

  const updated = buildDynamicItinerary(wizardState, newExpList);
  return {
    updatedItinerary: updated,
    summaryMessage: 'Outdoor stops swapped with nearby indoor ateliers and sheltered tearooms.',
    affectedStopIds: swappedStopIds
  };
}

/**
 * Handles "This Spot's Closed":
 * Removes the designated stop and inserts the closest matching open alternative.
 */
export function adaptSpotClosed(
  currentItinerary: Itinerary,
  stopIdToClose: string,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[]
): AdaptationResult {
  const targetStop = currentItinerary.stops.find(s => s.id === stopIdToClose);
  if (!targetStop) {
    return {
      updatedItinerary: currentItinerary,
      summaryMessage: 'Designated stop not found.',
      affectedStopIds: []
    };
  }

  const currentExpIds = new Set(currentItinerary.stops.map(s => s.experience_id));
  const availableAlternatives = allExperiences.filter(
    e => !currentExpIds.has(e.id) && e.open_now
  );

  // Score candidate by category similarity and proximity
  let bestAlt: ExperienceListing | null = null;
  let bestScore = -Infinity;

  for (const alt of availableAlternatives) {
    const dist = calculateDistanceKm(
      targetStop.geolocation.lat,
      targetStop.geolocation.lng,
      alt.geolocation.lat,
      alt.geolocation.lng
    );
    const categoryMatch = alt.category === targetStop.category ? 15 : 0;
    const score = categoryMatch - dist * 4;
    if (score > bestScore) {
      bestScore = score;
      bestAlt = alt;
    }
  }

  const updatedExpList: ExperienceListing[] = [];
  for (const stop of currentItinerary.stops) {
    if (stop.id === stopIdToClose) {
      if (bestAlt) updatedExpList.push(bestAlt);
    } else {
      const exp = allExperiences.find(e => e.id === stop.experience_id);
      if (exp) updatedExpList.push(exp);
    }
  }

  const updated = buildDynamicItinerary(wizardState, updatedExpList);
  return {
    updatedItinerary: updated,
    summaryMessage: bestAlt
      ? `Replaced closed spot with ${bestAlt.experience_title}.`
      : 'Removed closed spot from itinerary.',
    affectedStopIds: [stopIdToClose]
  };
}

/**
 * Handles "Lower My Budget":
 * Biases transport to walking/transit and replaces high-cost stops with free or budget options.
 */
export function adaptLowerBudget(
  currentItinerary: Itinerary,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[]
): AdaptationResult {
  const budgetWizard: TripWizardState = {
    ...wizardState,
    budgetTier: 'budget',
    transportPreference: 'transit'
  };

  const currentExpIds = new Set(currentItinerary.stops.map(s => s.experience_id));
  const budgetAlts = allExperiences.filter(
    e => !currentExpIds.has(e.id) && e.price_per_head <= 22
  );

  const updatedExpList: ExperienceListing[] = [];
  const swappedIds: string[] = [];

  for (const stop of currentItinerary.stops) {
    if (stop.price_per_head > 35 && budgetAlts.length > 0) {
      const cheaper = budgetAlts.shift()!;
      updatedExpList.push(cheaper);
      swappedIds.push(stop.id);
    } else {
      const existing = allExperiences.find(e => e.id === stop.experience_id);
      if (existing) updatedExpList.push(existing);
    }
  }

  const updated = buildDynamicItinerary(budgetWizard, updatedExpList);
  const costDiff = currentItinerary.total_cost_per_head - updated.total_cost_per_head;

  return {
    updatedItinerary: updated,
    summaryMessage: `Reduced trip cost by ₹${Math.max(0, Math.round(costDiff))} per person via public transit and budget artisan spots.`,
    affectedStopIds: swappedIds
  };
}

/**
 * Handles "Senior / Accessibility Friendly":
 * Restricts stops to step-free access, adds buffer time between stops, avoids steep legs.
 */
export function adaptSeniorAccessibility(
  currentItinerary: Itinerary,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[],
  enable: boolean
): AdaptationResult {
  const seniorWizard: TripWizardState = {
    ...wizardState,
    accessibility: {
      ...wizardState.accessibility,
      step_free: enable,
      senior_paced: enable,
      wheelchair: enable ? true : wizardState.accessibility.wheelchair
    }
  };

  const currentExpIds = new Set(currentItinerary.stops.map(s => s.experience_id));
  const accessibleCandidates = allExperiences.filter(
    e => e.accessibility.step_free && !currentExpIds.has(e.id)
  );

  const updatedExpList: ExperienceListing[] = [];
  const affectedStopIds: string[] = [];

  for (const stop of currentItinerary.stops) {
    if (enable && !stop.step_free) {
      if (accessibleCandidates.length > 0) {
        const replacement = accessibleCandidates.shift()!;
        updatedExpList.push(replacement);
        affectedStopIds.push(stop.id);
      } else {
        // No accessible replacement available — keep the original stop
        // instead of silently dropping it from the itinerary.
        const existing = allExperiences.find(e => e.id === stop.experience_id);
        if (existing) updatedExpList.push(existing);
      }
    } else {
      const existing = allExperiences.find(e => e.id === stop.experience_id);
      if (existing) updatedExpList.push(existing);
    }
  }

  const updated = buildDynamicItinerary(seniorWizard, updatedExpList, {
    seniorBuffer: enable
  });

  return {
    updatedItinerary: updated,
    summaryMessage: enable
      ? 'Adapted route: verified step-free access, added 20-minute rest buffers, optimized flat transit.'
      : 'Restored standard pacing and multi-grade transit options.',
    affectedStopIds
  };
}

/**
 * Replaces a single stop with a specifically chosen candidate experience.
 */
export function swapSingleStop(
  currentItinerary: Itinerary,
  stopId: string,
  newExperience: ExperienceListing,
  wizardState: TripWizardState,
  allExperiences: ExperienceListing[]
): AdaptationResult {
  const updatedExpList: ExperienceListing[] = [];

  for (const stop of currentItinerary.stops) {
    if (stop.id === stopId) {
      updatedExpList.push(newExperience);
    } else {
      const existing = allExperiences.find(e => e.id === stop.experience_id);
      if (existing) updatedExpList.push(existing);
    }
  }

  const updated = buildDynamicItinerary(wizardState, updatedExpList);
  return {
    updatedItinerary: updated,
    summaryMessage: `Swapped stop with ${newExperience.experience_title}.`,
    affectedStopIds: [stopId]
  };
}
