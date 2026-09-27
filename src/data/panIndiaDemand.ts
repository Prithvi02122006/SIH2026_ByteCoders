import { SearchDemandSignal } from '../types';

export const PAN_INDIA_DEMAND_SIGNALS: SearchDemandSignal[] = [
  {
    id: 'sig-delhi-01',
    city_id: 'delhi',
    query_tags: ['wheelchair accessible', 'old delhi street food', 'evening', 'under Rs 500'],
    category: 'food',
    searches_count: 248,
    trend_percentage: 34,
    avg_budget_indicated: 400,
    accessibility_demand: 'Step-free access & slow pacing requested in 72% of queries',
    neighborhood_focus: 'Chandni Chowk & Daryaganj'
  },
  {
    id: 'sig-mum-01',
    city_id: 'mumbai',
    query_tags: ['art deco walking tour', 'heritage bakery', 'morning slot', 'step-free'],
    category: 'culture',
    searches_count: 312,
    trend_percentage: 26,
    avg_budget_indicated: 350,
    accessibility_demand: 'Paved flat sidewalks & shade stops preferred',
    neighborhood_focus: 'Fort & Kala Ghoda'
  },
  {
    id: 'sig-jai-01',
    city_id: 'jaipur',
    query_tags: ['dabu block printing workshop', 'hands-on craft', 'village atelier', 'couple'],
    category: 'workshops',
    searches_count: 420,
    trend_percentage: 42,
    avg_budget_indicated: 600,
    accessibility_demand: 'Wheelchair ramp and ground-floor washrooms prioritized',
    neighborhood_focus: 'Bagru & Sanganer Clusters'
  },
  {
    id: 'sig-koc-01',
    city_id: 'kochi',
    query_tags: ['kathakali makeup observation', 'classical arts', 'evening', 'family'],
    category: 'culture',
    searches_count: 185,
    trend_percentage: 19,
    avg_budget_indicated: 300,
    accessibility_demand: 'Chair seating with back support requested for seniors',
    neighborhood_focus: 'Fort Kochi'
  },
  {
    id: 'sig-var-01',
    city_id: 'varanasi',
    query_tags: ['dawn hand-rowed boat', 'classical sitar', 'spiritual', 'silent'],
    category: 'nature',
    searches_count: 530,
    trend_percentage: 51,
    avg_budget_indicated: 250,
    accessibility_demand: 'Gentle step boarding assistance and quiet acoustics',
    neighborhood_focus: 'Assi to Dashashwamedh'
  }
];
