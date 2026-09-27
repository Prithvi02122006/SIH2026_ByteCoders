import { City } from '../types';

export const PAN_INDIA_CITIES: City[] = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    center_lat: 28.6506,
    center_lng: 77.2303 // Centered near Chandni Chowk / Old Delhi heritage core
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center_lat: 18.9322,
    center_lng: 72.8335 // Centered near Fort & Kala Ghoda Arts Precinct
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    center_lat: 26.9239,
    center_lng: 75.8267 // Centered in Old Pink City
  },
  {
    id: 'kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    center_lat: 9.9658,
    center_lng: 76.2421 // Centered in Fort Kochi & Mattancherry
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    center_lat: 22.5726,
    center_lng: 88.3639 // Centered near College Street & BBD Bagh
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Benares)',
    state: 'Uttar Pradesh',
    center_lat: 25.3076,
    center_lng: 83.0107 // Centered along Dashashwamedh Ghat & ancient alleys
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center_lat: 12.9716,
    center_lng: 77.5946 // Centered in Central Bengaluru & Malleswaram
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    center_lat: 13.0336,
    center_lng: 80.2699 // Centered in Mylapore heritage temple quarter
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    center_lat: 17.3616,
    center_lng: 78.4747 // Centered at Charminar & Old City
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    center_lat: 15.4989,
    center_lng: 73.8278 // Centered in Fontainhas Latin Quarter, Panaji
  }
];

export const DEFAULT_CITY = PAN_INDIA_CITIES[0]; // Delhi as default
