import { ExperienceListing } from '../types';

export const PAN_INDIA_EXPERIENCES: ExperienceListing[] = [
  // ==========================================
  // DELHI NCR
  // ==========================================
  {
    id: 'exp-delhi-01',
    experience_title: 'Chandni Chowk 150-Year Paranthe & Spice Alleys Heritage Walk',
    category: 'food',
    duration_minutes: 90,
    price_per_head: 350,
    maximum_capacity: 10,
    geolocation: { lat: 28.6562, lng: 77.2309 },
    city_id: 'delhi',
    neighborhood: 'Old Delhi / Gali Paranthe Wali',
    tags: ['street food', 'heritage', 'paranthe', 'khari baoli spices', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-delhi-01',
    vendor_name: 'Pandit Gaya Prasad Parantha Guild',
    vendor_established: 1872,
    one_line_teaser: 'Taste wood-fired stuffed paranthas and explore centuries-old spice cellars in Shahjahanabad with a neighborhood food historian.',
    full_description: 'Stepping into the narrow stone bylanes behind the historic Gurudwara Sis Ganj, this morning walk leads travelers through fourth-generation culinary institutions. Guests taste stuffed rabri, mooli, and bitter gourd paranthas fried in iron karahis, followed by freshly ground heirloom garam masalas inside the wholesale courtyards of Khari Baoli.',
    indoor: false,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: false
    },
    hours: '08:30 - 15:30 (Daily)',
    structured_hours: {
      open: '08:30',
      close: '15:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-d1', title: 'Four Heritage Parantha Platter & Khari Baoli Rooftop', price: 350, description: 'Four traditional paranthas with pumpkin relish, mint chutney, and spice attic viewpoint.', duration_minutes: 90 },
      { id: 'off-d2', title: 'Private Heritage Haveli Breakfast & Tea', price: 600, description: 'Exclusive courtyard seating inside a restored 18th-century Jain haveli.', duration_minutes: 120 }
    ],
    availability_slots: [
      { id: 's-d1', date: '2026-09-27', time: '09:00', capacity_remaining: 4, total_capacity: 10 },
      { id: 's-d2', date: '2026-09-27', time: '12:00', capacity_remaining: 6, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.92,
      review_count: 148,
      editorial_note: 'Raw culinary authenticity with respectful passage through historic living neighborhoods.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0) / OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-delhi-02',
    experience_title: 'Nizamuddin Basti Sufi Qawwali & Stepwell Sanctuary',
    category: 'culture',
    duration_minutes: 75,
    price_per_head: 0,
    maximum_capacity: 25,
    geolocation: { lat: 28.5916, lng: 77.2422 },
    city_id: 'delhi',
    neighborhood: 'Hazrat Nizamuddin Aulia Precinct',
    tags: ['sufi poetry', 'qawwali', 'stepwell baoli', 'spiritual', 'heritage'],
    specialty_tier: 'signature',
    vendor_id: 'v-delhi-02',
    vendor_name: 'Nizamuddin Heritage Preservation Trust',
    vendor_established: 1325,
    one_line_teaser: 'Listen to devotional harmonium rhythms in the marble courtyard and explore the 700-year restored baoli.',
    full_description: 'An ancient residential enclave that has hosted musical devotion for seven centuries. Led by community heritage custodians, visitors sit quietly in the courtyard listening to descendants of Amir Khusro recite devotional verses, before walking down the step-free restoration ramps to view the freshwater stepwell.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '17:00 - 21:00 (Thu - Sun)',
    structured_hours: {
      open: '17:00',
      close: '21:00',
      days_open: ['Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: false,
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-d3', title: 'Courtyard Qawwali Observation & Historical Walk', price: 0, description: 'Free communal gathering with optional donation toward baoli water conservation.', duration_minutes: 75 }
    ],
    availability_slots: [
      { id: 's-d3', date: '2026-09-27', time: '17:30', capacity_remaining: 15, total_capacity: 25 }
    ],
    rating_summary: {
      score: 4.96,
      review_count: 310,
      editorial_note: 'Unmatched spiritual acoustics and tranquil architectural restoration.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-delhi-03',
    experience_title: 'Hauz Khas Terracotta & Studio Pottery Throwing',
    category: 'workshops',
    duration_minutes: 90,
    price_per_head: 450,
    maximum_capacity: 6,
    geolocation: { lat: 28.5494, lng: 77.2001 },
    city_id: 'delhi',
    neighborhood: 'Hauz Khas Village / Deer Park',
    tags: ['clay pottery', 'terracotta', 'craftsman studio', 'hands-on'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-delhi-03',
    vendor_name: 'Mitti Studio Collective',
    vendor_established: 2011,
    one_line_teaser: 'Shape earthen chai kulhads and terracotta bowls on manual kick-wheels overlooking 14th-century madrasa ruins.',
    full_description: 'Founded by master ceramicists from Delhi Blue Pottery Trust, this quiet second-floor atelier teaches visitors traditional clay wedging, wheel throwing, and slip decoration. Guests pull two vessels using Yamuna silt clay formulations, which are kiln-fired and carefully packed.',
    indoor: true,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: true
    },
    hours: '10:00 - 18:00 (Tue - Sun)',
    structured_hours: {
      open: '10:00',
      close: '18:00',
      days_open: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-d4', title: 'Two-Kulhad Throwing & Glazing Session', price: 450, description: 'Hands-on wheel instruction, trimming, and terracotta firing.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-d4', date: '2026-09-27', time: '11:00', capacity_remaining: 3, total_capacity: 6 },
      { id: 's-d5', date: '2026-09-27', time: '15:00', capacity_remaining: 2, total_capacity: 6 }
    ],
    rating_summary: {
      score: 4.88,
      review_count: 82,
      editorial_note: 'Patient instructors with tactile focus on local clay traditions.'
    },
    data_source: 'curated_seed',
    attribution: 'OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // MUMBAI
  // ==========================================
  {
    id: 'exp-mumbai-01',
    experience_title: 'Kala Ghoda Art Deco & Historic Irani Chai Tasting',
    category: 'culture',
    duration_minutes: 80,
    price_per_head: 280,
    maximum_capacity: 12,
    geolocation: { lat: 18.9284, lng: 72.8318 },
    city_id: 'mumbai',
    neighborhood: 'Fort / Kala Ghoda',
    tags: ['art deco', 'irani cafe', 'bun maska', 'heritage architecture', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-mum-01',
    vendor_name: 'Bastian & Yazdani Heritage Walkers',
    vendor_established: 1953,
    one_line_teaser: 'Walk through the second-largest Art Deco cluster in the world and sip cardamom chai with brun maska at an 80-year bakery.',
    full_description: 'Beginning outside the David Sassoon Library, this shaded walking route studies the distinctive ocean-liner balconies and relief sculptures of Oval Maidan. Concludes inside Yazdani Bakery, where the wood-fired ovens still bake crusty brun bread served with salted butter and sweet brewed Irani chai.',
    indoor: false,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '08:00 - 18:00 (Mon - Sat)',
    structured_hours: {
      open: '08:00',
      close: '18:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-m1', title: 'Art Deco Architectural Walk & Irani Breakfast', price: 280, description: 'Guided 80-minute route with fresh bakery tasting and architectural monograph.', duration_minutes: 80 }
    ],
    availability_slots: [
      { id: 's-m1', date: '2026-09-27', time: '08:30', capacity_remaining: 5, total_capacity: 12 },
      { id: 's-m2', date: '2026-09-27', time: '10:30', capacity_remaining: 8, total_capacity: 12 }
    ],
    rating_summary: {
      score: 4.93,
      review_count: 176,
      editorial_note: 'Exceptional blend of social history and authentic culinary memory.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-mumbai-02',
    experience_title: 'Dadar Morning Flower Market & Spiced Poha Breakfast',
    category: 'markets',
    duration_minutes: 60,
    price_per_head: 150,
    maximum_capacity: 10,
    geolocation: { lat: 19.0178, lng: 72.8478 },
    city_id: 'mumbai',
    neighborhood: 'Dadar West',
    tags: ['flower market', 'marigold', 'street market', 'maharashtrian breakfast'],
    specialty_tier: 'signature',
    vendor_id: 'v-mum-02',
    vendor_name: 'Dadar Phool Galli Traders',
    vendor_established: 1938,
    one_line_teaser: 'Walk beneath suspended canopies of orange marigold garlands and taste warm kanda poha at an iconic corner stall.',
    full_description: 'Every morning at dawn, growers from Pune and Nashik unload towering baskets of jasmine, roses, and marigolds beneath the Dadar flyover. Visitors weave through wholesale bargaining stalls, watch rapid floral garland weaving, and conclude with authentic Maharashtrian breakfast.',
    indoor: false,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '06:00 - 12:00 (Daily)',
    structured_hours: {
      open: '06:00',
      close: '12:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-m2', title: 'Wholesale Flower Lane Walk & Kanda Poha', price: 150, description: 'Guided market interaction and hot freshly pressed poha with chai.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-m3', date: '2026-09-27', time: '06:30', capacity_remaining: 6, total_capacity: 10 },
      { id: 's-m4', date: '2026-09-27', time: '08:00', capacity_remaining: 3, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.87,
      review_count: 94,
      editorial_note: 'Sensory vibrancy and genuine local wholesale trade.'
    },
    data_source: 'curated_seed',
    attribution: 'OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // JAIPUR
  // ==========================================
  {
    id: 'exp-jaipur-01',
    experience_title: 'Bagru Mud-Resist Block Printing Workshop & Vegetable Dyes',
    category: 'workshops',
    duration_minutes: 100,
    price_per_head: 500,
    maximum_capacity: 8,
    geolocation: { lat: 26.8124, lng: 75.5451 },
    city_id: 'jaipur',
    neighborhood: 'Bagru Village Crafts Cluster',
    tags: ['block printing', 'dabu mud resist', 'natural dyes', 'hands-on', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-jai-01',
    vendor_name: 'Chhipa Mohalla Artisan Cooperative',
    vendor_established: 1888,
    one_line_teaser: 'Carve and hand-stamp cotton stoles using vintage teak woodblocks and fermented indigo vats.',
    full_description: 'Located in the historic Chhipa village, this family atelier preserves the centuries-old Dabu mud-resist printing technique. Guests learn to mix fuller earth and wheat chaff pastes, align intricate hand-carved woodblocks on stretched cotton fabric, and immerse their cloth into natural pomegranate and indigo dye pits.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '09:30 - 17:00 (Daily except Mon)',
    structured_hours: {
      open: '09:30',
      close: '17:00',
      days_open: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-j1', title: 'Complete Cotton Stole Block Print Workshop', price: 500, description: 'All materials, raw indigo dipping, washing demonstration, and completed take-home stole.', duration_minutes: 100 }
    ],
    availability_slots: [
      { id: 's-j1', date: '2026-09-27', time: '10:00', capacity_remaining: 4, total_capacity: 8 },
      { id: 's-j2', date: '2026-09-27', time: '14:00', capacity_remaining: 5, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.97,
      review_count: 220,
      editorial_note: 'Authentic artisan lineage with direct economic benefit to village printers.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-jaipur-02',
    experience_title: 'Johari Bazaar Kundan Gem Cutting & Sandalwood Tea',
    category: 'culture',
    duration_minutes: 70,
    price_per_head: 320,
    maximum_capacity: 8,
    geolocation: { lat: 26.9205, lng: 75.8286 },
    city_id: 'jaipur',
    neighborhood: 'Old Pink City / Johari Bazaar',
    tags: ['gemstones', 'kundan jewelry', 'pink city', 'artisan craftsmanship'],
    specialty_tier: 'signature',
    vendor_id: 'v-jai-02',
    vendor_name: 'Surana Heritage Gem Guild',
    vendor_established: 1735,
    one_line_teaser: 'Observe stone cutters facet emeralds on wooden lapidary wheels and taste Sahu coal-roasted milk tea.',
    full_description: 'Commissioned when Maharaja Jai Singh II established Jaipur in 1727, Johari Bazaar remains India capital of precious stone cutting. In this private workshop visit, visitors observe lapidaries hand-cut and foil-set uncut polki diamonds into 24-karat gold lattices, followed by a tasting of slow-simmered cardamom tea.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '11:00 - 19:00 (Mon - Sat)',
    structured_hours: {
      open: '11:00',
      close: '19:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-j2', title: 'Lapidary Studio Demonstration & Tea', price: 320, description: 'Facet cutting demonstration, raw gemstone identification, and chai.', duration_minutes: 70 }
    ],
    availability_slots: [
      { id: 's-j3', date: '2026-09-27', time: '11:30', capacity_remaining: 3, total_capacity: 8 },
      { id: 's-j4', date: '2026-09-27', time: '15:30', capacity_remaining: 4, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.89,
      review_count: 110,
      editorial_note: 'Fascinating micro-precision craft preserved without commercial sales pressure.'
    },
    data_source: 'curated_seed',
    attribution: 'OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // KOCHI
  // ==========================================
  {
    id: 'exp-kochi-01',
    experience_title: 'Mattancherry Ancient Spice Warehouse Tasting & Pepper Grinding',
    category: 'food',
    duration_minutes: 75,
    price_per_head: 250,
    maximum_capacity: 12,
    geolocation: { lat: 9.9575, lng: 76.2592 },
    city_id: 'kochi',
    neighborhood: 'Mattancherry / Jew Town',
    tags: ['tellicherry pepper', 'spice warehouse', 'cardamom auction', 'coastal heritage'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-koc-01',
    vendor_name: 'Malabar Heritage Spice Guild',
    vendor_established: 1924,
    one_line_teaser: 'Sample sun-dried Tellicherry black peppercorns, green cardamom pods, and nutmeg inside a 100-year timber warehouse.',
    full_description: 'Bazaars in Mattancherry have exported Malabar spices across the Arabian Sea for millennia. At this heritage warehouse, guests smell fresh cloves, grade dried ginger roots, and taste cold-infused cardamom herbal drinks while observing traditional jute sack weighing scales.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '09:00 - 17:30 (Mon - Sat)',
    structured_hours: {
      open: '09:00',
      close: '17:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-k1', title: 'Six-Spice Comparative Tasting Flight', price: 250, description: 'Direct origin tastings of cardamom, pepper varieties, and heirloom cinnamon.', duration_minutes: 75 }
    ],
    availability_slots: [
      { id: 's-k1', date: '2026-09-27', time: '10:00', capacity_remaining: 5, total_capacity: 12 },
      { id: 's-k2', date: '2026-09-27', time: '14:30', capacity_remaining: 7, total_capacity: 12 }
    ],
    rating_summary: {
      score: 4.91,
      review_count: 88,
      editorial_note: 'Aromatic depth and educational clarity away from tourist souvenir shops.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-kochi-02',
    experience_title: 'Fort Kochi Kathakali Mudra & Makeup Rehearsal Observation',
    category: 'culture',
    duration_minutes: 90,
    price_per_head: 300,
    maximum_capacity: 16,
    geolocation: { lat: 9.9671, lng: 76.2445 },
    city_id: 'kochi',
    neighborhood: 'Fort Kochi Heritage Zone',
    tags: ['kathakali', 'traditional dance', 'facial makeup', 'classical arts'],
    specialty_tier: 'signature',
    vendor_id: 'v-koc-02',
    vendor_name: 'Kerala Kathakali Centre Trust',
    vendor_established: 1982,
    one_line_teaser: 'Observe classical dancers apply mineral face pigments and practice nuanced 24-mudra hand gestures.',
    full_description: 'In an intimate teak-wood amphitheater, visitors arrive early to watch performers spend two hours applying crushed stone pastes (chutti) to their faces. The master artist then breaks down the 9 rasas (emotional expressions) and rhythmic footwork of Kerala ancient dramatic tradition.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '17:00 - 20:30 (Daily)',
    structured_hours: {
      open: '17:00',
      close: '20:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: false,
    images: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-k2', title: 'Makeup Session & Full Performance Recital', price: 300, description: 'Complete backstage makeup observation and evening story performance.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-k3', date: '2026-09-27', time: '17:00', capacity_remaining: 8, total_capacity: 16 }
    ],
    rating_summary: {
      score: 4.95,
      review_count: 245,
      editorial_note: 'Rare patient demonstration honoring centuries of codified physical discipline.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // VARANASI
  // ==========================================
  {
    id: 'exp-varanasi-01',
    experience_title: 'Kashi Dawn Rowing & Assi Ghat Classical Sitar Raga',
    category: 'nature',
    duration_minutes: 80,
    price_per_head: 200,
    maximum_capacity: 10,
    geolocation: { lat: 25.2925, lng: 83.0069 },
    city_id: 'varanasi',
    neighborhood: 'Assi Ghat & Tulsi Ghat',
    tags: ['sunrise boat', 'ganga', 'classical sitar', 'morning raga', 'peaceful'],
    specialty_tier: 'signature',
    vendor_id: 'v-var-01',
    vendor_name: 'Subah-e-Banaras Boat Guild',
    vendor_established: 1970,
    one_line_teaser: 'Drift past ancient stone ghats at sunrise as morning ragas resonate from the riverbanks.',
    full_description: 'Beginning at 05:45 AM before city bustle awakes, an experienced local oarsman guides visitors in an acoustic wooden boat across the gentle morning waters of the Ganga. Listen to live sitar harmonies from Assi Ghat while watching dawn mist lift from 18th-century palatial facades.',
    indoor: false,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: true
    },
    hours: '05:30 - 08:30 (Daily)',
    structured_hours: {
      open: '05:30',
      close: '08:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: false,
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-v1', title: 'Quiet Dawn Rowing & Classical Music Stop', price: 200, description: 'Hand-rowed boat with life jackets, tea stop, and riverside sitar viewing.', duration_minutes: 80 }
    ],
    availability_slots: [
      { id: 's-v1', date: '2026-09-27', time: '05:45', capacity_remaining: 4, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.98,
      review_count: 360,
      editorial_note: 'Profound tranquility and respectful distance from commercial motors.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-varanasi-02',
    experience_title: 'Madanpura Banarasi Silk Handloom Weaving Atelier',
    category: 'workshops',
    duration_minutes: 75,
    price_per_head: 250,
    maximum_capacity: 6,
    geolocation: { lat: 25.3051, lng: 83.0035 },
    city_id: 'varanasi',
    neighborhood: 'Madanpura Weavers Quarter',
    tags: ['banarasi silk', 'handloom weaving', 'zari', 'artisan family', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-var-02',
    vendor_name: 'Ansari Silk Weaving Lineage',
    vendor_established: 1845,
    one_line_teaser: 'Watch master weavers guide pit-looms interlacing mulberry silk and pure gold zari threads.',
    full_description: 'Deep in the car-free alleys of Madanpura, master weaver Tariq Ansari demonstrates the Jacquard punch-card system controlling ancient pit-looms. Learn how a single intricate bridal saree requires up to six weeks of rhythmic foot and shuttle movement.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '10:00 - 17:30 (Mon - Sat)',
    structured_hours: {
      open: '10:00',
      close: '17:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-v2', title: 'Pit-Loom Demonstration & Zari Testing', price: 250, description: 'Hands-on shuttle throwing, silk grading, and keepsake weave sample.', duration_minutes: 75 }
    ],
    availability_slots: [
      { id: 's-v2', date: '2026-09-27', time: '10:30', capacity_remaining: 3, total_capacity: 6 },
      { id: 's-v3', date: '2026-09-27', time: '14:00', capacity_remaining: 4, total_capacity: 6 }
    ],
    rating_summary: {
      score: 4.94,
      review_count: 112,
      editorial_note: 'Humbling master craft directly in the family ancestral home.'
    },
    data_source: 'curated_seed',
    attribution: 'OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // KOLKATA
  // ==========================================
  {
    id: 'exp-kolkata-01',
    experience_title: 'Kumartuli Clay Idol Sculptors & Terracotta Studio Walk',
    category: 'workshops',
    duration_minutes: 85,
    price_per_head: 300,
    maximum_capacity: 8,
    geolocation: { lat: 22.6006, lng: 88.3615 },
    city_id: 'kolkata',
    neighborhood: 'North Kolkata / Kumartuli',
    tags: ['clay idols', 'ganga clay sculpture', 'bengal heritage', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-kol-01',
    vendor_name: 'Kumartuli Paul Sculptors Guild',
    vendor_established: 1757,
    one_line_teaser: 'Walk through narrow clay-scented ateliers watching artisans shape straw armatures and river clay into expressive statues.',
    full_description: 'Over 400 artisan families in Kumartuli have shaped sacred earthen sculptures for two and a half centuries using alluvial clay dredged from the Hooghly river. A resident sculptor demonstrates how straw, bamboo, and clay are layered and painted with organic tamarind-seed binders.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '09:00 - 18:00 (Daily)',
    structured_hours: {
      open: '09:00',
      close: '18:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-kol1', title: 'Studio Sculpture Demonstration & Earthen Mask', price: 300, description: 'Sculpting demonstration with small take-home terracotta terracotta keepsake.', duration_minutes: 85 }
    ],
    availability_slots: [
      { id: 's-kol1', date: '2026-09-27', time: '10:00', capacity_remaining: 5, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.96,
      review_count: 142,
      editorial_note: 'Unfiltered access to a living medieval craft guild.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // BENGALURU
  // ==========================================
  {
    id: 'exp-bengaluru-01',
    experience_title: 'Malleswaram Traditional Filter Coffee Roasting & Tiffin Walk',
    category: 'food',
    duration_minutes: 75,
    price_per_head: 220,
    maximum_capacity: 12,
    geolocation: { lat: 13.0031, lng: 77.5645 },
    city_id: 'bengaluru',
    neighborhood: 'Malleswaram Heritage Precinct',
    tags: ['filter coffee', 'chicory roasting', 'benne dosa', 'tiffin heritage'],
    specialty_tier: 'signature',
    vendor_id: 'v-blr-01',
    vendor_name: 'CTR & Veena Tiffin Society',
    vendor_established: 1968,
    one_line_teaser: 'Sample freshly roasted dark Peaberry chicory brew and crisp butter dosas at heritage South Indian coffee bars.',
    full_description: 'Malleswaram remains the cultural anchor of old Bengaluru. Led by a local culinary archivist, guests visit small-batch coffee roasters grinding beans from Chikmagalur estates, followed by tiffin tastings of hot idlis, vadas, and brass-tumbler frothy filter kaapi.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '07:30 - 16:30 (Daily)',
    structured_hours: {
      open: '07:30',
      close: '16:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-b1', title: 'Tiffin Trail & Filter Coffee Master Roasting', price: 220, description: 'Three tiffin tastings, bean roasting demo, and brass dabara tumbler coffee.', duration_minutes: 75 }
    ],
    availability_slots: [
      { id: 's-b1', date: '2026-09-27', time: '08:00', capacity_remaining: 6, total_capacity: 12 }
    ],
    rating_summary: {
      score: 4.89,
      review_count: 178,
      editorial_note: 'Invigorating morning atmosphere with century-old culinary recipes.'
    },
    data_source: 'curated_seed',
    attribution: 'OpenStreetMap Contributors',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // CHENNAI
  // ==========================================
  {
    id: 'exp-che-01',
    experience_title: 'Mylapore Kolam Art & Filter Coffee Ritual',
    category: 'food',
    duration_minutes: 60,
    price_per_head: 220,
    maximum_capacity: 10,
    geolocation: { lat: 13.0339, lng: 80.2695 },
    city_id: 'chennai',
    neighborhood: 'Mylapore Temple Quarter',
    tags: ['filter coffee', 'kolam art', 'temple heritage', 'morning ritual'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-che-01',
    vendor_name: 'Kapaleeshwarar Heritage Kitchen Collective',
    vendor_established: 1962,
    one_line_teaser: 'Draw a traditional rice-flour kolam at dawn, then sample decoction filter coffee brewed the old Mylapore way.',
    full_description: 'Steps from the Kapaleeshwarar Temple gopuram, this family-run tiffin room has served filter coffee to the same streets for three generations. Guests learn the geometry of rice-flour kolam drawing on the threshold before sitting down to a tumbler-and-davara coffee service alongside crisp ghee roast dosas.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '06:30 - 11:00 (Daily)',
    structured_hours: {
      open: '06:30',
      close: '11:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-c1', title: 'Kolam Drawing Lesson & Filter Coffee Tasting Flight', price: 220, description: 'Hands-on kolam practice followed by a three-pour filter coffee tasting with tiffin snacks.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-c1', date: '2026-09-27', time: '07:00', capacity_remaining: 6, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.9,
      review_count: 96,
      editorial_note: 'A genuinely local morning ritual, rarely seen by visitors.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },
  {
    id: 'exp-che-02',
    experience_title: 'Marina Bronze Casting & Nadaswaram Workshop',
    category: 'workshops',
    duration_minutes: 90,
    price_per_head: 340,
    maximum_capacity: 6,
    geolocation: { lat: 13.0475, lng: 80.2824 },
    city_id: 'chennai',
    neighborhood: 'Triplicane / Marina Coast',
    tags: ['bronze casting', 'nadaswaram', 'lost-wax technique', 'classical music'],
    specialty_tier: 'signature',
    vendor_id: 'v-che-02',
    vendor_name: 'Thanjavur Bronze & Wind Instrument Guild',
    vendor_established: 1901,
    one_line_teaser: 'Watch lost-wax bronze idol casting up close, then try your hand at reed fingering on a nadaswaram.',
    full_description: 'A Triplicane workshop keeping the Thanjavur lost-wax casting tradition alive for Chennai\u2019s temple festivals, paired with a rare chance to hold and sound a nadaswaram under a resident classical musician\u2019s guidance. Visitors walk away understanding two crafts central to Tamil temple culture in a single sitting.',
    indoor: true,
    accessibility: {
      wheelchair: false,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '15:00 - 19:00 (Tue - Sun)',
    structured_hours: {
      open: '15:00',
      close: '19:00',
      days_open: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: false,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-c2', title: 'Bronze Casting Demonstration & Nadaswaram Trial', price: 340, description: 'Guided foundry walkthrough plus a supervised nadaswaram fingering lesson.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-c2', date: '2026-09-27', time: '15:30', capacity_remaining: 3, total_capacity: 6 }
    ],
    rating_summary: {
      score: 4.86,
      review_count: 61,
      editorial_note: 'Deep-craft access rarely opened to outside visitors.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // HYDERABAD
  // ==========================================
  {
    id: 'exp-hyd-01',
    experience_title: 'Laad Bazaar Ittar Perfumery & Lacquer Bangle Workshop',
    category: 'workshops',
    duration_minutes: 80,
    price_per_head: 280,
    maximum_capacity: 8,
    geolocation: { lat: 17.3616, lng: 78.4735 },
    city_id: 'hyderabad',
    neighborhood: 'Old City / Charminar West',
    tags: ['ittar perfume', 'lacquer bangles', 'mitti attar', 'nizami heritage'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-hyd-01',
    vendor_name: 'Asghar Ali Nizami Perfumers',
    vendor_established: 1894,
    one_line_teaser: 'Blend hydro-distilled sandalwood and mitti (baked earth) oils and watch heated natural resin shaped into sparkling bangles.',
    full_description: 'Adjacent to the monumental Charminar arches, this family workshop has distilled natural essential oils for Nizami courts since the 19th century. Guests discover traditional copper deg-bhapka distillation and practice stone-setting on warm resin bangles.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '11:00 - 20:00 (Daily)',
    structured_hours: {
      open: '11:00',
      close: '20:00',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-h1', title: 'Personalized Ittar Formulation & Bangle Trial', price: 280, description: 'Craft your own 6ml botanical scent vial and customize a pair of bangles.', duration_minutes: 80 }
    ],
    availability_slots: [
      { id: 's-h1', date: '2026-09-27', time: '11:30', capacity_remaining: 4, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.93,
      review_count: 132,
      editorial_note: 'Sensory storytelling rooted in centuries of royal court apothecary.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  },

  // ==========================================
  // GOA
  // ==========================================
  {
    id: 'exp-goa-01',
    experience_title: 'Fontainhas Azulejos Hand-Painted Ceramic Tile Atelier',
    category: 'workshops',
    duration_minutes: 90,
    price_per_head: 450,
    maximum_capacity: 8,
    geolocation: { lat: 15.4989, lng: 73.8278 },
    city_id: 'goa',
    neighborhood: 'Fontainhas Latin Quarter / Panaji',
    tags: ['azulejos', 'ceramic tiles', 'portuguese heritage', 'painting', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-goa-01',
    vendor_name: 'Velha Goa Ceramic Studios',
    vendor_established: 1992,
    one_line_teaser: 'Paint cobalt blue Portuguese-Goan ceramic tiles with mineral glazes in a sunlit 19th-century ochre townhouse.',
    full_description: 'Surrounded by the terracotta-roofed villas of Fontainhas, this studio preserves the art of hand-painted glazed tin tiles (azulejos). Resident painters guide guests through traditional floral border motifs and maritime heraldry, followed by glaze firing.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '10:00 - 18:30 (Mon - Sat)',
    structured_hours: {
      open: '10:00',
      close: '18:30',
      days_open: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-g1', title: 'Two-Tile Azulejo Painting & Firing', price: 450, description: 'Two ceramic bisque tiles, cobalt mineral glazes, kiln firing, and packaging.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-g1', date: '2026-09-27', time: '10:30', capacity_remaining: 3, total_capacity: 8 },
      { id: 's-g2', date: '2026-09-27', time: '15:00', capacity_remaining: 5, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.92,
      review_count: 164,
      editorial_note: 'Relaxed creative workshop preserving Indo-Portuguese decorative craft.'
    },
    data_source: 'curated_seed',
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
    eligible_for_nearby_promotions: true
  }
];
