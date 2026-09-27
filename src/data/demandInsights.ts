import { SearchDemandSignal } from '../types';

export const LOCAL_DEMAND_SIGNALS: SearchDemandSignal[] = [
  {
    id: 'sig-01',
    query_tags: ['wheelchair accessible', 'heritage tea', 'quiet space', 'under $35'],
    category: 'culture',
    searches_count: 84,
    trend_percentage: 28,
    avg_budget_indicated: 32,
    accessibility_demand: 'Step-free access & slow pacing requested in 76% of queries',
    neighborhood_focus: 'Higashiyama South'
  },
  {
    id: 'sig-02',
    query_tags: ['artisan ceramics', 'hands-on workshop', 'couple', 'afternoon slot'],
    category: 'workshops',
    searches_count: 142,
    trend_percentage: 19,
    avg_budget_indicated: 45,
    accessibility_demand: 'Standard seating; high preference for English or tactile instruction',
    neighborhood_focus: 'Gojozaka & Kiyomizu'
  },
  {
    id: 'sig-03',
    query_tags: ['authentic obanzai', 'family with seniors', 'lunch window', 'step-free'],
    category: 'food',
    searches_count: 215,
    trend_percentage: 34,
    avg_budget_indicated: 35,
    accessibility_demand: 'Step-free entry + ground floor seating priority',
    neighborhood_focus: 'Gion Preservation Quarter'
  },
  {
    id: 'sig-04',
    query_tags: ['independent vinyl bar', 'solo traveler', 'evening audio', 'under $25'],
    category: 'nightlife',
    searches_count: 67,
    trend_percentage: 12,
    avg_budget_indicated: 22,
    accessibility_demand: 'Low sensory, calm acoustic preference',
    neighborhood_focus: 'Pontocho & Sanjo'
  },
  {
    id: 'sig-05',
    query_tags: ['woodblock printmaking', 'antique tools', 'rainy day activity'],
    category: 'markets',
    searches_count: 98,
    trend_percentage: 45,
    avg_budget_indicated: 28,
    accessibility_demand: 'Covered indoor venue with table seating',
    neighborhood_focus: 'Teramachi Arcade'
  }
];
