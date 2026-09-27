import { FilterState, ItineraryStop } from '../types';

export interface NaturalSearchResult {
  category?: string;
  budgetTier?: 'budget' | 'moderate' | 'premium';
  stepFree?: boolean;
  wheelchair?: boolean;
  seniorPaced?: boolean;
  lowSensory?: boolean;
  openNowOnly?: boolean;
  keyword?: string;
}

export interface VendorCopyResult {
  one_line_teaser: string;
  full_description: string;
  confidence_score?: number;
}

export interface NarrationResult {
  narration: string;
  confidence_score?: number;
}

export interface LLMProxyResponse<T> {
  result: T;
  confidence_score?: number;
  provider?: string;
}

/**
 * Client helper to call the server-side /api/llm endpoint.
 * Proxies calls to Nugen Intelligence (or configured LLM provider).
 */
async function callLLMProxy<T>(task: string, payload: any, fallback: T): Promise<LLMProxyResponse<T>> {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, payload })
    });

    if (!response.ok) {
      console.warn(`/api/llm returned status ${response.status}, using deterministic fallback.`);
      return { result: fallback };
    }

    const data = await response.json();
    if (data && data.result) {
      return {
        result: data.result as T,
        confidence_score: data.confidence_score,
        provider: data.provider
      };
    }
    return { result: fallback };
  } catch (err) {
    console.warn(`Failed to connect to /api/llm proxy, using fallback:`, err);
    return { result: fallback };
  }
}

/**
 * 1. Natural Language Search -> Filters
 */
export async function parseNaturalLanguageSearch(
  query: string,
  currentFilters: FilterState
): Promise<Partial<FilterState>> {
  const fallback: NaturalSearchResult = {};
  const lower = query.toLowerCase();

  if (lower.includes('cheap') || lower.includes('budget') || lower.includes('under 300') || lower.includes('under 400') || lower.includes('under 500')) {
    fallback.budgetTier = 'budget';
  } else if (lower.includes('luxury') || lower.includes('fine') || lower.includes('premium')) {
    fallback.budgetTier = 'premium';
  }

  if (lower.includes('food') || lower.includes('chaat') || lower.includes('eat') || lower.includes('dinner')) {
    fallback.category = 'food';
  } else if (lower.includes('craft') || lower.includes('pottery') || lower.includes('print') || lower.includes('workshop')) {
    fallback.category = 'workshops';
  } else if (lower.includes('heritage') || lower.includes('temple') || lower.includes('history')) {
    fallback.category = 'culture';
  } else if (lower.includes('market') || lower.includes('bazaar') || lower.includes('shopping')) {
    fallback.category = 'markets';
  }

  if (lower.includes('step free') || lower.includes('step-free') || lower.includes('ramp')) {
    fallback.stepFree = true;
  }
  if (lower.includes('wheelchair')) {
    fallback.wheelchair = true;
  }
  if (lower.includes('senior') || lower.includes('slow')) {
    fallback.seniorPaced = true;
  }
  if (lower.includes('open now') || lower.includes('right now') || lower.includes('tonight')) {
    fallback.openNowOnly = true;
  }

  const { result } = await callLLMProxy<NaturalSearchResult>(
    'natural_search',
    { query, currentFilters },
    fallback
  );

  const toBool = (val: any): boolean | undefined => {
    if (val === true || val === 'true' || val === 'yes') return true;
    if (val === false || val === 'false' || val === 'no') return false;
    return undefined;
  };

  const updates: Partial<FilterState> = {};
  if (result.category) {
    let cat = String(result.category).toLowerCase();
    if (cat === 'workshop') cat = 'workshops';
    if (cat === 'market') cat = 'markets';
    updates.category = cat as any;
  }
  if (result.budgetTier) {
    let b = String(result.budgetTier).toLowerCase();
    if (b === 'low') b = 'budget';
    if (b === 'mid' || b === 'medium') b = 'moderate';
    if (b === 'high') b = 'premium';
    updates.budgetTier = b as any;
  }
  if (result.stepFree !== undefined) updates.stepFree = toBool(result.stepFree);
  if (result.wheelchair !== undefined) updates.wheelchair = toBool(result.wheelchair);
  if (result.seniorPaced !== undefined) updates.seniorPaced = toBool(result.seniorPaced);
  if (result.lowSensory !== undefined) updates.lowSensory = toBool(result.lowSensory);
  if (result.openNowOnly !== undefined) updates.openNowOnly = toBool(result.openNowOnly);
  if (result.keyword) updates.searchQuery = result.keyword;

  return updates;
}

/**
 * 2. Itinerary Narration
 */
export async function generateItineraryNarration(stops: ItineraryStop[]): Promise<NarrationResult> {
  const fallback = `Your journey features ${stops.length} curated stops starting at ${stops[0]?.arrival_time || 'morning'} in ${stops[0]?.neighborhood || 'the historic district'}, taking you through local artisans and heritage sites with smooth transit legs.`;

  const simplifiedStops = stops.map(s => ({
    title: s.title,
    category: s.category,
    arrival_time: s.arrival_time,
    neighborhood: s.neighborhood
  }));

  const res = await callLLMProxy<{ narration: string }>(
    'itinerary_narration',
    { stops: simplifiedStops },
    { narration: fallback }
  );

  return {
    narration: res.result.narration || fallback,
    confidence_score: res.confidence_score
  };
}

/**
 * 3. Adaptation Explanations
 */
export async function generateAdaptationExplanation(
  adaptationType: string,
  affectedStops: string[],
  defaultMessage: string
): Promise<string> {
  const res = await callLLMProxy<{ explanation: string }>(
    'adaptation_explanation',
    { adaptationType, affectedStops, defaultMessage },
    { explanation: defaultMessage }
  );

  return res.result.explanation;
}

/**
 * 4. Stop-Swap Reasoning
 */
export async function generateStopSwapReasoning(
  currentTitle: string,
  candidateTitle: string,
  candidateCategory: string,
  candidateNeighborhood: string
): Promise<string> {
  const fallback = `A seamless ${candidateCategory} alternative located in nearby ${candidateNeighborhood}, offering authentic regional craft within your allocated window.`;

  const res = await callLLMProxy<{ reasoning: string }>(
    'swap_reasoning',
    { currentTitle, candidateTitle, candidateCategory, candidateNeighborhood },
    { reasoning: fallback }
  );

  return res.result.reasoning;
}

/**
 * 5. Vendor Listing Copy Assistant
 */
export async function assistVendorListingCopy(
  roughNotes: string,
  category: string,
  neighborhood: string
): Promise<VendorCopyResult> {
  const fallback: VendorCopyResult = {
    one_line_teaser: `Authentic ${category} experience guided by master artisans in ${neighborhood}.`,
    full_description: `Rooted in regional heritage, this ${category} offering welcomes travelers to discover traditional techniques, historic tools, and small-batch craftsmanship in the heart of ${neighborhood}.`
  };

  const res = await callLLMProxy<VendorCopyResult>(
    'vendor_copy_assistant',
    { roughNotes, category, neighborhood },
    fallback
  );

  return {
    ...res.result,
    confidence_score: res.confidence_score
  };
}

/**
 * 6. Demand Insight Synthesis
 */
export async function synthesizeDemandInsights(signals: any[]): Promise<string[]> {
  const fallback = [
    'Strong weekend demand for step-free artisan craft experiences in central cultural hubs.',
    'Travelers indicate high preference for morning sessions between 09:30 and 11:30.',
    'Growing interest in unhurried, multi-generational family and senior-paced bookings.'
  ];

  const res = await callLLMProxy<{ takeaways: string[] }>(
    'demand_insight_synthesis',
    { signals },
    { takeaways: fallback }
  );

  return res.result.takeaways || fallback;
}

export interface DigitalTwinInsightResult {
  insight: string;
  recommended_action: string;
  confidence_score?: number;
}

/**
 * 7. Digital Twin Weather Impact Synthesis (Nugen Intelligence)
 */
export async function generateDigitalTwinWeatherInsight(
  weatherCondition: string,
  rainfallIntensity: number,
  stormDuration: number,
  temperature: number,
  totalDelayMinutes: number,
  stopsSummary: any[]
): Promise<DigitalTwinInsightResult> {
  const isWet = rainfallIntensity > 10;
  const fallback: DigitalTwinInsightResult = {
    insight: isWet
      ? `Heavy precipitation creates a cumulative +${totalDelayMinutes}m transit penalty across surface lanes. Open-air heritage courtyards face reduced footfall while covered tea-rooms and pottery ateliers absorb displaced travelers.`
      : `Stable atmospheric conditions maintain planned arrival intervals across all heritage stops with minimal transit friction.`,
    recommended_action: isWet
      ? `Switch road auto-rickshaw segments to elevated/metro corridors and prioritize indoor artisan workshops.`
      : `Proceed along primary timeline; outdoor stops are fully accessible.`
  };

  const res = await callLLMProxy<{ insight: string; recommended_action: string }>(
    'digital_twin_weather_insight',
    {
      weatherCondition,
      rainfallIntensity,
      stormDuration,
      temperature,
      totalDelayMinutes,
      stopsSummary
    },
    fallback
  );

  return {
    insight: res.result.insight || fallback.insight,
    recommended_action: res.result.recommended_action || fallback.recommended_action,
    confidence_score: res.confidence_score
  };
}

