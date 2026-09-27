/**
 * scripts/seed-pan-india.ts
 * 
 * Idempotent script to seed Supabase database with Pan-India cities,
 * experiences, offerings, availability slots, and demand signals.
 * 
 * Usage:
 *   npx tsx scripts/seed-pan-india.ts
 */

import { createClient } from '@supabase/supabase-js';
import { PAN_INDIA_CITIES } from '../src/data/panIndiaCities';
import { PAN_INDIA_EXPERIENCES } from '../src/data/panIndiaExperiences';
import { PAN_INDIA_DEMAND_SIGNALS } from '../src/data/panIndiaDemand';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('No SUPABASE_URL or SUPABASE_KEY provided. Skipping remote database seed.');
  console.log('The application will use the comprehensive in-memory Pan-India dataset offline.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log('Starting Pan-India Supabase Seeding...');

  // 1. Seed Cities
  console.log(`Upserting ${PAN_INDIA_CITIES.length} cities...`);
  const { error: cityError } = await supabase.from('cities').upsert(PAN_INDIA_CITIES, {
    onConflict: 'id'
  });
  if (cityError) console.error('Error seeding cities:', cityError);
  else console.log('Cities seeded successfully.');

  // 2. Seed Experiences
  console.log(`Upserting ${PAN_INDIA_EXPERIENCES.length} experiences...`);
  for (const exp of PAN_INDIA_EXPERIENCES) {
    const { offerings, availability_slots, ...expRow } = exp;

    const rowToInsert = {
      id: expRow.id,
      experience_title: expRow.experience_title,
      category: expRow.category,
      duration_minutes: expRow.duration_minutes,
      price_per_head: expRow.price_per_head,
      maximum_capacity: expRow.maximum_capacity,
      lat: expRow.geolocation.lat,
      lng: expRow.geolocation.lng,
      city_id: expRow.city_id,
      neighborhood: expRow.neighborhood,
      tags: expRow.tags,
      specialty_tier: expRow.specialty_tier,
      one_line_teaser: expRow.one_line_teaser,
      full_description: expRow.full_description,
      indoor: expRow.indoor,
      wheelchair: expRow.accessibility.wheelchair,
      step_free: expRow.accessibility.step_free,
      senior_paced: expRow.accessibility.senior_paced,
      low_sensory: expRow.accessibility.low_sensory,
      hours: expRow.hours,
      structured_hours: expRow.structured_hours,
      open_now: expRow.open_now,
      images: expRow.images,
      rating_score: expRow.rating_summary?.score,
      rating_review_count: expRow.rating_summary?.review_count,
      editorial_note: expRow.rating_summary?.editorial_note,
      data_source: expRow.data_source || 'curated_seed',
      attribution: expRow.attribution || 'Wikimedia Commons (CC BY-SA 4.0)',
      eligible_for_nearby_promotions: expRow.eligible_for_nearby_promotions ?? true
    };

    const { error: expError } = await supabase.from('experiences').upsert(rowToInsert, {
      onConflict: 'id'
    });
    if (expError) console.error(`Error seeding experience ${exp.id}:`, expError);

    // Seed offerings
    if (offerings && offerings.length > 0) {
      const offeringRows = offerings.map(o => ({
        experience_id: exp.id,
        title: o.title,
        price: o.price,
        description: o.description,
        duration_minutes: o.duration_minutes
      }));
      await supabase.from('offerings').upsert(offeringRows);
    }
  }

  // 3. Seed Demand Signals
  console.log(`Upserting demand signals...`);
  await supabase.from('search_demand_signals').upsert(PAN_INDIA_DEMAND_SIGNALS);

  console.log('Pan-India Seeding Complete!');
}

runSeed().catch(console.error);
