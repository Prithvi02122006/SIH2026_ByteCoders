import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { City, ExperienceListing, SearchDemandSignal } from '../types';
import { PAN_INDIA_CITIES } from '../data/panIndiaCities';
import { PAN_INDIA_EXPERIENCES } from '../data/panIndiaExperiences';
import { PAN_INDIA_DEMAND_SIGNALS } from '../data/panIndiaDemand';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistent store fallback
const LOCAL_STORAGE_EXP_KEY = 'passage_pan_india_experiences_v1';

function getLocalStoredExperiences(): ExperienceListing[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EXP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read from local storage:', e);
  }
  return PAN_INDIA_EXPERIENCES;
}

function saveLocalStoredExperiences(list: ExperienceListing[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_EXP_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not write to local storage:', e);
  }
}

/**
 * High-level repository functions for seamless online/offline operation
 */
export async function getCities(): Promise<City[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data && data.length > 0) {
        return data as City[];
      }
    } catch (err) {
      console.warn('Supabase getCities error, falling back to local dataset:', err);
    }
  }
  return PAN_INDIA_CITIES;
}

export async function getExperiencesByCity(cityId: string): Promise<ExperienceListing[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*, vendors(business_name, established_year), offerings(*), availability_slots(*)')
        .eq('city_id', cityId);

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          experience_title: row.experience_title,
          category: row.category,
          duration_minutes: row.duration_minutes,
          price_per_head: Number(row.price_per_head),
          maximum_capacity: row.maximum_capacity,
          geolocation: { lat: row.lat, lng: row.lng },
          city_id: row.city_id,
          neighborhood: row.neighborhood,
          tags: row.tags || [],
          specialty_tier: row.specialty_tier,
          vendor_id: row.vendor_id || 'v-supabase',
          // vendor_name/vendor_established live on the joined `vendors` row,
          // not on `experiences` directly — read them from there.
          vendor_name: row.vendors?.business_name || 'Verified Indian Merchant',
          vendor_established: row.vendors?.established_year || 1980,
          one_line_teaser: row.one_line_teaser || '',
          full_description: row.full_description || '',
          indoor: Boolean(row.indoor),
          accessibility: {
            wheelchair: Boolean(row.wheelchair),
            step_free: Boolean(row.step_free),
            senior_paced: Boolean(row.senior_paced),
            low_sensory: Boolean(row.low_sensory)
          },
          hours: row.hours || '09:00 - 18:00',
          structured_hours: row.structured_hours,
          open_now: Boolean(row.open_now),
          images: row.images || [],
          offerings: row.offerings || [],
          availability_slots: row.availability_slots || [],
          rating_summary: {
            score: row.rating_score || 4.9,
            review_count: row.rating_review_count || 10,
            editorial_note: row.editorial_note || 'Verified merchant listing.'
          },
          data_source: row.data_source || 'vendor_submitted',
          attribution: row.attribution,
          eligible_for_nearby_promotions: row.eligible_for_nearby_promotions ?? true
        })) as ExperienceListing[];
      }
    } catch (err) {
      console.warn('Supabase getExperiencesByCity error, falling back to local dataset:', err);
    }
  }

  // Fallback to local Pan-India store
  const all = getLocalStoredExperiences();
  const cityFiltered = all.filter(e => e.city_id === cityId);
  return cityFiltered.length > 0 ? cityFiltered : all.filter(e => e.city_id === 'delhi');
}

export async function insertExperience(exp: ExperienceListing): Promise<boolean> {
  // Update local memory & storage
  const current = getLocalStoredExperiences();
  const updated = [exp, ...current];
  saveLocalStoredExperiences(updated);

  if (supabase) {
    try {
      const row = {
        id: exp.id,
        experience_title: exp.experience_title,
        category: exp.category,
        duration_minutes: exp.duration_minutes,
        price_per_head: exp.price_per_head,
        maximum_capacity: exp.maximum_capacity,
        lat: exp.geolocation.lat,
        lng: exp.geolocation.lng,
        city_id: exp.city_id,
        neighborhood: exp.neighborhood,
        tags: exp.tags,
        specialty_tier: exp.specialty_tier,
        // Only pass a vendor_id through if it's a real Supabase vendor row
        // (a uuid). The app doesn't yet authenticate vendors via Supabase
        // Auth, so locally-generated ids (e.g. "v-<timestamp>") aren't real
        // vendors.id values — sending one of those would violate the
        // experiences.vendor_id foreign key. Until real vendor auth exists,
        // those listings still insert, just ownerless (vendor_id null).
        vendor_id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(exp.vendor_id)
          ? exp.vendor_id
          : null,
        one_line_teaser: exp.one_line_teaser,
        full_description: exp.full_description,
        indoor: exp.indoor,
        wheelchair: exp.accessibility.wheelchair,
        step_free: exp.accessibility.step_free,
        senior_paced: exp.accessibility.senior_paced,
        low_sensory: exp.accessibility.low_sensory,
        hours: exp.hours,
        structured_hours: exp.structured_hours,
        open_now: exp.open_now,
        images: exp.images,
        rating_score: exp.rating_summary.score,
        rating_review_count: exp.rating_summary.review_count,
        editorial_note: exp.rating_summary.editorial_note,
        data_source: 'vendor_submitted',
        eligible_for_nearby_promotions: exp.eligible_for_nearby_promotions ?? true
      };

      const { error } = await supabase.from('experiences').insert(row);
      if (error) {
        console.error('Supabase insertExperience error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase insert failed, stored in local cache:', err);
    }
  }
  return true;
}

export async function getDemandSignals(cityId: string): Promise<SearchDemandSignal[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('search_demand_signals')
        .select('*')
        .eq('city_id', cityId);
      if (!error && data && data.length > 0) return data as SearchDemandSignal[];
    } catch (err) {
      console.warn('Supabase getDemandSignals error:', err);
    }
  }
  return PAN_INDIA_DEMAND_SIGNALS.filter(s => s.city_id === cityId);
}
