import {
  Itinerary,
  WeatherSimulationParams,
  SimulatedStopImpact,
  DigitalTwinSimulationResult
} from '../types';
import { generateDigitalTwinWeatherInsight } from '../lib/llmClient';

/**
 * Parses "HH:mm" string into total minutes from midnight
 */
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 570; // 09:30 default
  const [h, m] = timeStr.split(':').map(Number);
  return (isNaN(h) ? 9 : h) * 60 + (isNaN(m) ? 30 : m);
}

/**
 * Converts total minutes from midnight back to "HH:mm" string
 */
function minutesToTime(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates transit delay multiplier based on transport mode and weather severity
 */
function calculateTransitMultiplier(
  mode: string | undefined,
  rainfallMm: number,
  waterlogging: 'none' | 'moderate' | 'severe'
): number {
  let waterlogPenalty = 0;
  if (waterlogging === 'moderate') waterlogPenalty = 0.25;
  if (waterlogging === 'severe') waterlogPenalty = 0.65;

  const m = (mode || 'auto').toLowerCase();

  if (m === 'walk' || m === 'walking') {
    // Pedestrian movement is heavily impaired by slippery pavement and deep water
    const rainFactor = Math.min(1.2, (rainfallMm / 30) * 0.7);
    return Math.min(2.4, 1.0 + rainFactor + waterlogPenalty);
  }

  if (m === 'metro' || m === 'train') {
    // Grade-separated rail transit is protected from road surface waterlogging
    const minorConcourseDelay = Math.min(0.12, (rainfallMm / 200));
    return 1.0 + minorConcourseDelay;
  }

  // Road vehicular: auto, auto_taxi, taxi, bus
  const roadTrafficFactor = Math.min(1.4, (rainfallMm / 25) * 0.85);
  return Math.min(2.8, 1.0 + roadTrafficFactor + waterlogPenalty);
}

/**
 * Core Digital Twin Simulation Engine
 * Models stops and transit legs as a graph, calculates per-node impacts,
 * propagates cascade delays, and integrates Nugen Intelligence domain synthesis.
 */
export async function simulateWeatherImpactOnItinerary(
  itinerary: Itinerary,
  params: WeatherSimulationParams
): Promise<DigitalTwinSimulationResult> {
  const intensity = params.rainfall_intensity_mm;
  const isWet = intensity > 5;
  const stops = itinerary.stops || [];

  let cumulativeDelayMinutes = 0;
  const simulatedStops: SimulatedStopImpact[] = [];
  let severelyAffectedCount = 0;
  let totalOutdoorExposure = 0;

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const prevStop = i > 0 ? stops[i - 1] : null;

    // Edge transit analysis
    const transitLeg = prevStop?.transit_to_next;
    const baseTransitDuration = transitLeg?.duration_minutes || (i === 0 ? 0 : 20);
    const transitMode = transitLeg?.indian_mode || transitLeg?.mode || 'auto';

    const multiplier = calculateTransitMultiplier(
      transitMode,
      intensity,
      params.waterlogging_severity
    );

    const legDelayMinutes = i === 0 ? 0 : Math.round(baseTransitDuration * (multiplier - 1));
    cumulativeDelayMinutes += legDelayMinutes;

    // Shift arrival and departure by cumulative cascade
    const origArrivalMins = timeToMinutes(stop.arrival_time);
    const origDepartMins = timeToMinutes(stop.departure_time);

    const simArrivalMins = origArrivalMins + cumulativeDelayMinutes;
    const simDepartMins = origDepartMins + cumulativeDelayMinutes;

    // Exposure risk calculation (0 - 100%)
    let exposureRisk = 5;
    if (!stop.is_indoor) {
      const waterlogBump = params.waterlogging_severity === 'severe' ? 35 : params.waterlogging_severity === 'moderate' ? 20 : 5;
      exposureRisk = Math.min(100, Math.round(intensity * 2.2 + waterlogBump));
    }
    totalOutdoorExposure += exposureRisk;

    // Occupancy & Footfall shift calculation
    let occupancyShift = 0;
    if (stop.is_indoor) {
      // Displaced travelers seek shelter in indoor tearooms, havelis, and ateliers
      occupancyShift = Math.min(65, Math.round(intensity * 1.25 + (isWet ? 15 : 0)));
    } else {
      // Open-air markets, ghats, walking tours experience steep demand drop
      occupancyShift = -Math.min(85, Math.round(intensity * 1.8 + (isWet ? 20 : 0)));
    }

    // Vendor availability risk
    let vendorRisk: 'low' | 'moderate' | 'high' | 'closure_imminent' = 'low';
    if (!stop.is_indoor) {
      if (intensity >= 40 || params.waterlogging_severity === 'severe') {
        vendorRisk = 'closure_imminent';
      } else if (intensity >= 15 || params.waterlogging_severity === 'moderate') {
        vendorRisk = 'high';
      } else if (intensity > 5) {
        vendorRisk = 'moderate';
      }
    } else if (params.waterlogging_severity === 'severe') {
      vendorRisk = 'moderate';
    }

    // Node status determination
    let status: 'normal' | 'delayed' | 'critical' | 'sheltered' = 'normal';
    if (!stop.is_indoor && exposureRisk >= 60) {
      status = 'critical';
      severelyAffectedCount++;
    } else if (cumulativeDelayMinutes >= 25 || legDelayMinutes >= 15) {
      status = 'delayed';
    } else if (stop.is_indoor) {
      status = 'sheltered';
    }

    // Probabilistic confidence band
    const minDelay = Math.max(0, Math.round(cumulativeDelayMinutes * 0.7));
    const maxDelay = Math.round(cumulativeDelayMinutes * 1.45 + (isWet ? 5 : 0));
    const confidenceScore = Math.max(78, Math.min(96, Math.round(94 - (intensity / 10))));

    simulatedStops.push({
      stop_id: stop.id,
      title: stop.title,
      category: stop.category,
      is_indoor: stop.is_indoor,
      neighborhood: stop.neighborhood,
      original_arrival_time: stop.arrival_time,
      simulated_arrival_time: minutesToTime(simArrivalMins),
      original_departure_time: stop.departure_time,
      simulated_departure_time: minutesToTime(simDepartMins),
      transit_delay_minutes: legDelayMinutes,
      cumulative_delay_minutes: cumulativeDelayMinutes,
      exposure_risk_percentage: exposureRisk,
      expected_occupancy_shift_percentage: occupancyShift,
      vendor_availability_risk: vendorRisk,
      status,
      transit_delay_multiplier: Math.round(multiplier * 100) / 100,
      confidence_band: {
        delay_min: minDelay,
        delay_expected: cumulativeDelayMinutes,
        delay_max: maxDelay,
        confidence_score: confidenceScore
      }
    });
  }

  const avgOutdoorExposure = stops.length > 0 ? Math.round(totalOutdoorExposure / stops.length) : 0;

  // Prepare concise payload for Nugen Intelligence domain synthesis
  const stopsSummary = simulatedStops.map(s => ({
    title: s.title,
    is_indoor: s.is_indoor,
    delay_m: s.cumulative_delay_minutes,
    exposure: `${s.exposure_risk_percentage}%`,
    occupancy_shift: `${s.expected_occupancy_shift_percentage}%`
  }));

  const weatherLabel = params.preset_name || (
    intensity >= 30 ? 'Heavy Downpour & Surface Flooding' :
    intensity >= 12 ? 'Steady Monsoon Showers' :
    intensity > 0 ? 'Mild Intermittent Drizzle' : 'Clear & Dry'
  );

  let nugenInsight = '';
  let nugenAction = '';
  let nugenConfidence = 91;

  try {
    const aiRes = await generateDigitalTwinWeatherInsight(
      weatherLabel,
      params.rainfall_intensity_mm,
      params.storm_duration_hours,
      params.temperature_c,
      cumulativeDelayMinutes,
      stopsSummary
    );
    nugenInsight = aiRes.insight;
    nugenAction = aiRes.recommended_action;
    if (aiRes.confidence_score) {
      nugenConfidence = aiRes.confidence_score;
    }
  } catch (err) {
    nugenInsight = `Simulated weather generates a cumulative +${cumulativeDelayMinutes}m schedule lag. Outdoor artisans face reduced traffic while covered venues experience demand surge.`;
    nugenAction = `Consider swapping outdoor street exploration stops for sheltered master-craftsman ateliers.`;
  }

  return {
    params,
    simulated_stops: simulatedStops,
    total_delay_minutes: cumulativeDelayMinutes,
    max_cumulative_delay_minutes: cumulativeDelayMinutes,
    severely_affected_stops_count: severelyAffectedCount,
    outdoor_exposure_index: avgOutdoorExposure,
    nugen_insight: nugenInsight,
    nugen_recommended_action: nugenAction,
    nugen_confidence: nugenConfidence,
    simulated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
