import { ExperienceListing } from '../types';

export const INITIAL_EXPERIENCES: ExperienceListing[] = [
  {
    id: 'exp-01',
    experience_title: 'Higashiyama Heritage Tea Tasting & Micro-Roasting',
    category: 'culture',
    duration_minutes: 75,
    price_per_head: 28,
    maximum_capacity: 8,
    geolocation: { lat: 34.9984, lng: 135.7821 },
    tags: ['heritage tea', 'ceremony', 'artisan roasting', 'quiet space', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-01',
    vendor_name: 'Morita Chaho Tea Merchants',
    vendor_established: 1912,
    neighborhood: 'Higashiyama South',
    one_line_teaser: 'A fourth-generation family roaster guiding small-batch sencha and hojicha tastings in a 110-year timber tearoom.',
    full_description: 'Tucked two blocks behind the main stone path of Kiyomizu, Morita Chaho has operated from the same low-eaved wooden townhouse since the late Meiji era. Master blender Kenzo Morita personally roasts hojicha leaves over charcoal embers during the session. Guests learn water temperature modulation across three steepings of unblended single-estate leaves, accompanied by dry sweets made by a neighborhood wagashi maker.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '10:00 - 17:00 (Wed - Sun)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-1', title: 'Single-Estate Flight & Fresh Charcoal Roast', price: 28, description: 'Three steepings of Uji gyokuro and freshly pan-roasted hojicha with paired seasonal confection.', duration_minutes: 75 },
      { id: 'off-2', title: 'Private Reserve Matcha Bowl & Hearth Demonstration', price: 42, description: 'Ceremonial stone-ground matcha prepared in front of the sunken hearth with heritage utensils.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-1', date: '2026-09-27', time: '10:30', capacity_remaining: 3, total_capacity: 8 },
      { id: 's-2', date: '2026-09-27', time: '13:00', capacity_remaining: 6, total_capacity: 8 },
      { id: 's-3', date: '2026-09-27', time: '15:30', capacity_remaining: 2, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.9,
      review_count: 64,
      editorial_note: 'Noted for quiet pacing and authentic lack of tourist theater.'
    }
  },
  {
    id: 'exp-02',
    experience_title: 'Kiyomizu Ceramic Studio Hand-Building Workshop',
    category: 'workshops',
    duration_minutes: 90,
    price_per_head: 45,
    maximum_capacity: 6,
    geolocation: { lat: 34.9961, lng: 135.7794 },
    tags: ['ceramics', 'pottery', 'craftsman studio', 'hands-on', 'independent'],
    specialty_tier: 'signature',
    vendor_id: 'v-02',
    vendor_name: 'Asahi-yaki Kiln & Atelier',
    vendor_established: 1948,
    neighborhood: 'Gojozaka Pottery Quarter',
    one_line_teaser: 'Shape and trim two functional vessels on manual kick-wheels using local iron-rich mountain clay.',
    full_description: 'Gojozaka has been the beating heart of Kyoto ceramics for three centuries. At Asahi-yaki Atelier, resident ceramicist Naomi Sano teaches hand-building techniques, focusing on chawan tea bowls and sake decanters. Tools are tactile wood and bamboo ribs. Finished pieces are glazed with traditional wood-ash finishes and fired in their electric reduction kiln, shipped worldwide within four weeks.',
    indoor: true,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: false
    },
    hours: '09:30 - 18:00 (Tue - Sun)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-3', title: 'Two-Vessel Wheel & Trimming Session', price: 45, description: 'Full guidance on wheel throwing, trimming, and glaze selection for two pieces with international firing.', duration_minutes: 90 },
      { id: 'off-4', title: 'Clay Formulation & Hand-Pinch Tea Cup', price: 35, description: 'Gentle hand-pinch method without wheel, ideal for relaxed rhythm.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-4', date: '2026-09-27', time: '11:00', capacity_remaining: 2, total_capacity: 6 },
      { id: 's-5', date: '2026-09-27', time: '14:30', capacity_remaining: 4, total_capacity: 6 }
    ],
    rating_summary: {
      score: 4.8,
      review_count: 88,
      editorial_note: 'High marks for patient instruction and honest craft atmosphere.'
    }
  },
  {
    id: 'exp-03',
    experience_title: 'Nishiki Back-Alley Dashi & Fermentation Walk',
    category: 'food',
    duration_minutes: 105,
    price_per_head: 38,
    maximum_capacity: 8,
    geolocation: { lat: 35.0049, lng: 135.7648 },
    tags: ['dashi', 'fermentation', 'local market', 'miso', 'kombu', 'guided'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-03',
    vendor_name: 'Kyoto Umami Guild',
    vendor_established: 2014,
    neighborhood: 'Nakagyo / Nishiki Area',
    one_line_teaser: 'Taste through 2-year barrel miso, vintage Rishiri kombu, and warm katsuobushi broth at family wholesalers.',
    full_description: 'While the main aisle of Nishiki Market gets crowded, the real trade happens in the quiet side streets where dry goods merchants supply the city ryokan. Food historian and chef Tatsuya Endo leads small walks through three specialized shops: a kombu cellar aging kelp in cedar drawers, an 80-year pickle tub cooperage, and a dashi bar where participants compare umami depth across harvest years.',
    indoor: false,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '10:00 - 15:30 (Mon - Sat)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-5', title: 'Wholesale Dashi & Pickling Cellar Tour', price: 38, description: 'Guided visits to four heritage dry good stores with six comparative tastings.', duration_minutes: 105 }
    ],
    availability_slots: [
      { id: 's-6', date: '2026-09-27', time: '10:00', capacity_remaining: 3, total_capacity: 8 },
      { id: 's-7', date: '2026-09-27', time: '13:30', capacity_remaining: 5, total_capacity: 8 }
    ],
    rating_summary: {
      score: 4.95,
      review_count: 112,
      editorial_note: 'Deeply knowledgeable culinary focus away from tourist stalls.'
    }
  },
  {
    id: 'exp-04',
    experience_title: 'Kennin-ji Sub-temple Dry Stone Garden Contemplation',
    category: 'nature',
    duration_minutes: 60,
    price_per_head: 12,
    maximum_capacity: 15,
    geolocation: { lat: 35.0006, lng: 135.7735 },
    tags: ['zen garden', 'quiet space', 'architecture', 'moss garden', 'heritage'],
    specialty_tier: 'signature',
    vendor_id: 'v-04',
    vendor_name: 'Ryosoku-in Heritage Trust',
    vendor_established: 1358,
    neighborhood: 'Gion / Kennin-ji Precinct',
    one_line_teaser: 'Sit on the polished cedar verandas of a 14th-century monastery overlooking pond and gravel courtyards.',
    full_description: 'Ryosoku-in is a quiet precinct inside the Kennin-ji compound. Unlike crowded monumental shrines, entry numbers are capped every hour. Visitors remove shoes at the genkan and spend an unhurried hour observing the gravel raking patterns and seasonal water lilies. Printed architectural notebooks detailing the garden geometry are provided at the entrance.',
    indoor: true,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: true
    },
    hours: '09:00 - 16:30 (Daily)',
    open_now: true,
    closing_soon: false,
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-6', title: 'Timed Monastery Grounds & Veranda Admission', price: 12, description: 'Quiet access to the dual gravel courtyards, pond walkway, and historical screens.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-8', date: '2026-09-27', time: '09:30', capacity_remaining: 10, total_capacity: 15 },
      { id: 's-9', date: '2026-09-27', time: '11:00', capacity_remaining: 8, total_capacity: 15 },
      { id: 's-10', date: '2026-09-27', time: '15:00', capacity_remaining: 12, total_capacity: 15 }
    ],
    rating_summary: {
      score: 4.85,
      review_count: 140,
      editorial_note: 'Peaceful sanctuary amidst downtown bustle.'
    }
  },
  {
    id: 'exp-05',
    experience_title: 'Kamogawa Riverside Vinyl Listening Session & Dark Roast',
    category: 'nightlife',
    duration_minutes: 80,
    price_per_head: 18,
    maximum_capacity: 10,
    geolocation: { lat: 35.0062, lng: 135.7712 },
    tags: ['vinyl bar', 'jazz', 'nightlife', 'coffee', 'cocktails', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-05',
    vendor_name: 'Dusk & Needle Audio Bar',
    vendor_established: 1982,
    neighborhood: 'Pontocho North / Sanjo',
    one_line_teaser: 'Analog jazz and folk records played through vintage 1970s tube amplifiers and custom horn speakers.',
    full_description: 'An intimate basement hideaway two minutes from the Sanjo bridge. Founded by former sound engineer Hiroshi Kato, the space features over 4,000 vinyl records spanning Blue Note classics, Japanese 1970s ambient, and European acoustic folk. Orders include either hand-dripネル drip coffee or single-malt highballs with house-made bitter orange peel.',
    indoor: true,
    accessibility: {
      wheelchair: false,
      step_free: false,
      senior_paced: true,
      low_sensory: false
    },
    hours: '17:00 - 23:30 (Daily except Mon)',
    open_now: false,
    closing_soon: false,
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-7', title: 'Listening Seat & Two House Drinks', price: 18, description: 'Reserved audio booth seating, selection of two craft drinks or pour-over coffees with savory snack.', duration_minutes: 80 }
    ],
    availability_slots: [
      { id: 's-11', date: '2026-09-27', time: '17:30', capacity_remaining: 4, total_capacity: 10 },
      { id: 's-12', date: '2026-09-27', time: '19:30', capacity_remaining: 1, total_capacity: 10 },
      { id: 's-13', date: '2026-09-27', time: '21:15', capacity_remaining: 5, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.9,
      review_count: 73,
      editorial_note: 'Unmatched acoustic clarity and contemplative evening mood.'
    }
  },
  {
    id: 'exp-06',
    experience_title: 'Sanjo Antique Market & Woodblock Tool Workshop',
    category: 'markets',
    duration_minutes: 90,
    price_per_head: 22,
    maximum_capacity: 12,
    geolocation: { lat: 35.0089, lng: 135.7681 },
    tags: ['woodblock print', 'antique tools', 'flea market', 'artisan', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-06',
    vendor_name: 'Sanjo Moku Guild',
    vendor_established: 1963,
    neighborhood: 'Teramachi / Sanjo Arcade',
    one_line_teaser: 'Examine vintage cherry-wood printing blocks and practice hand-inking with horsehair brushes.',
    full_description: 'An enduring workshop and collector store preserving traditional ukiyo-e relief printing tools. The master printer guides visitors through identifying paper weights, mixing mineral pigments with animal glue binder, and handling antique carving gouges. Participants pull two commemorative prints to keep.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '11:00 - 18:00 (Thu - Mon)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-8', title: 'Pigment Mixing & Block Printing Session', price: 22, description: 'Hands-on print session on handmade Echizen washi paper with take-home folder.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-14', date: '2026-09-27', time: '11:30', capacity_remaining: 6, total_capacity: 12 },
      { id: 's-15', date: '2026-09-27', time: '14:00', capacity_remaining: 3, total_capacity: 12 }
    ],
    rating_summary: {
      score: 4.75,
      review_count: 51,
      editorial_note: 'Fascinating tactile insight into print history.'
    }
  },
  {
    id: 'exp-07',
    experience_title: 'Kamogawa Canal Botanical Walk & Herbal Infusion',
    category: 'nature',
    duration_minutes: 75,
    price_per_head: 15,
    maximum_capacity: 10,
    geolocation: { lat: 35.0142, lng: 135.7734 },
    tags: ['botanical', 'canal', 'herbal tea', 'flat path', 'outdoor'],
    specialty_tier: 'seasonal',
    vendor_id: 'v-07',
    vendor_name: 'Canal Flora Cooperative',
    vendor_established: 2019,
    neighborhood: 'Okazaki Cultural Zone',
    one_line_teaser: 'A gentle shaded promenade along Lake Biwa canal identifying wild medicinal herbs and native willows.',
    full_description: 'Beginning near the historic red brick aqueduct, local botanist Yumi Tanaka leads an accessible walking study of the riverside flora. The path is completely step-free, paved, and follows gentle grades along running water. Concludes with a warm infusion prepared using seasonal mountain herbs in an open-air pavilion.',
    indoor: false,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '08:30 - 16:30 (Daily)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-9', title: 'Guided Botanical Path & Field Infusion', price: 15, description: 'Step-free guided walk, botanical identification chart, and herbal tasting.', duration_minutes: 75 }
    ],
    availability_slots: [
      { id: 's-16', date: '2026-09-27', time: '09:00', capacity_remaining: 5, total_capacity: 10 },
      { id: 's-17', date: '2026-09-27', time: '14:00', capacity_remaining: 7, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.88,
      review_count: 42,
      editorial_note: 'Exceptionally welcoming for seniors and low-mobility travelers.'
    }
  },
  {
    id: 'exp-08',
    experience_title: 'Gion Obanzai Home-Style Lunch in a Heritage Kyo-Machiya',
    category: 'food',
    duration_minutes: 60,
    price_per_head: 32,
    maximum_capacity: 14,
    geolocation: { lat: 35.0028, lng: 135.7761 },
    tags: ['obanzai', 'home cooking', 'seasonal vegetables', 'machiya', 'dining'],
    specialty_tier: 'signature',
    vendor_id: 'v-08',
    vendor_name: 'Shizuka Obanzai Dining',
    vendor_established: 1974,
    neighborhood: 'South Gion Preservation District',
    one_line_teaser: 'Seven seasonal vegetable side dishes, grilled local fish, and kamado-steamed rice served in heirloom bowls.',
    full_description: 'Obanzai is Kyoto traditional culinary philosophy emphasizing zero food waste, indigenous heirloom vegetables (Kyo-yasai), and seasonal balance. Shizuka has simmered daily stocks since 1974. Dining takes place around an open kitchen counter or low tables overlooking a courtyard pocket garden.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '11:30 - 14:30, 17:30 - 21:00 (Closed Wed)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-10', title: 'Seven-Dish Seasonal Obanzai Set', price: 32, description: 'Rotating market vegetable preparations, soup of the day, grilled fish or tofu, and pickles.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-18', date: '2026-09-27', time: '11:45', capacity_remaining: 3, total_capacity: 14 },
      { id: 's-19', date: '2026-09-27', time: '13:00', capacity_remaining: 4, total_capacity: 14 }
    ],
    rating_summary: {
      score: 4.92,
      review_count: 178,
      editorial_note: 'Celebrated for comforting home-cooked flavors and gentle seasoning.'
    }
  },
  {
    id: 'exp-09',
    experience_title: 'Miyagawacho Geiko Music & Shamisen Demonstration',
    category: 'culture',
    duration_minutes: 60,
    price_per_head: 55,
    maximum_capacity: 12,
    geolocation: { lat: 34.9995, lng: 135.7718 },
    tags: ['shamisen', 'traditional music', 'geiko arts', 'historic hall', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-09',
    vendor_name: 'Miyagawa Traditional Arts Preservation',
    vendor_established: 1952,
    neighborhood: 'Miyagawacho Kabuki District',
    one_line_teaser: 'A rare small-group recital and acoustic breakdown of 3-string shamisen rhythms in an authentic rehearsal hall.',
    full_description: 'Unlike commercial stage shows, this intimate hour is organized directly by retired geiko musicians inside their private rehearsal quarters. Guests hear the distinctive hollow resonance of the cat-skin or synthetic resonator, discover notation scrolls, and try plucking the bachi plectrum with personal coaching.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '14:00 - 18:00 (Thu - Sun)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-11', title: 'Acoustic Shamisen Demonstration & Hands-On Pluck', price: 55, description: 'Solo musical pieces, historical explanation, and guided instrument trial.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-20', date: '2026-09-27', time: '14:30', capacity_remaining: 5, total_capacity: 12 },
      { id: 's-21', date: '2026-09-27', time: '16:00', capacity_remaining: 2, total_capacity: 12 }
    ],
    rating_summary: {
      score: 4.96,
      review_count: 59,
      editorial_note: 'Remarkable access with dignity and cultural integrity.'
    }
  },
  {
    id: 'exp-10',
    experience_title: 'Sanjusangendo Archery Guild Bowyer Studio Visit',
    category: 'workshops',
    duration_minutes: 70,
    price_per_head: 30,
    maximum_capacity: 6,
    geolocation: { lat: 34.9882, lng: 135.7719 },
    tags: ['bamboo bow', 'kyudo', 'artisan woodworking', 'craftsmanship', 'independent'],
    specialty_tier: 'hidden-gem',
    vendor_id: 'v-10',
    vendor_name: 'Shibata Kanjuro Bowyer Lineage',
    vendor_established: 1634,
    neighborhood: 'Shichijo / Sanjusangendo Precinct',
    one_line_teaser: 'Observe the 21st-generation bowyer heating and bending laminated bamboo staves over charcoal flames.',
    full_description: 'Kyoto traditional kyudo bows are prized for their asymmetric curved power and organic bamboo resilience. Master bowyer Shibata demonstrates how wild bamboo is selected, cured for seven years, smoked, and bound with fish glue. Visitors examine historical bows dating to the Edo period archery contests.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '10:00 - 16:30 (Mon, Wed, Fri, Sat)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-12', title: 'Studio Demonstration & Bamboo Curving Lesson', price: 30, description: 'Charcoal heat shaping demonstration, wood selection tour, and keepsake bamboo arrow marker.', duration_minutes: 70 }
    ],
    availability_slots: [
      { id: 's-22', date: '2026-09-27', time: '10:30', capacity_remaining: 2, total_capacity: 6 },
      { id: 's-23', date: '2026-09-27', time: '13:30', capacity_remaining: 4, total_capacity: 6 }
    ],
    rating_summary: {
      score: 4.89,
      review_count: 36,
      editorial_note: 'Living history directly from one of Japan oldest continuous craft guilds.'
    }
  },
  {
    id: 'exp-11',
    experience_title: 'Takase River Night Lantern Stroll & Local Sake Bar',
    category: 'nightlife',
    duration_minutes: 90,
    price_per_head: 26,
    maximum_capacity: 10,
    geolocation: { lat: 35.0035, lng: 135.7702 },
    tags: ['sake tasting', 'night walk', 'canal', 'local guide', 'nightlife'],
    specialty_tier: 'signature',
    vendor_id: 'v-11',
    vendor_name: 'Canal Night Society',
    vendor_established: 2017,
    neighborhood: 'Takasegawa / Kiyamachi',
    one_line_teaser: 'Walk the historic timber canal bank under warm lanterns followed by three artisanal junmai sakes.',
    full_description: 'Built in 1611 to transport grain and timber into Kyoto castle district, the Takase canal is now a gentle stone-paved waterway lined with willow trees. This evening walking tour pauses at historic boat moorings before stopping at a 6-seat standing bar specializing in unpasteurized nama-zake from small regional breweries in Fushimi.',
    indoor: false,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: false
    },
    hours: '18:00 - 22:30 (Tue - Sun)',
    open_now: false,
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-13', title: 'Night Walk & Three Junmai Tastings', price: 26, description: 'Evening canal narrative and comparative flight of 3 seasonal sakes with pickled appetizers.', duration_minutes: 90 }
    ],
    availability_slots: [
      { id: 's-24', date: '2026-09-27', time: '18:30', capacity_remaining: 4, total_capacity: 10 },
      { id: 's-25', date: '2026-09-27', time: '20:15', capacity_remaining: 6, total_capacity: 10 }
    ],
    rating_summary: {
      score: 4.82,
      review_count: 94,
      editorial_note: 'Atmospheric and informative without becoming rowdy.'
    }
  },
  {
    id: 'exp-12',
    experience_title: 'Chion-in Pine Path Morning Bell & Chanting Observation',
    category: 'culture',
    duration_minutes: 60,
    price_per_head: 0,
    maximum_capacity: 25,
    geolocation: { lat: 35.0058, lng: 135.7831 },
    tags: ['morning meditation', 'bell', 'pine groves', 'free admission', 'spiritual'],
    specialty_tier: 'seasonal',
    vendor_id: 'v-12',
    vendor_name: 'Chion-in Community Outreach',
    vendor_established: 1234,
    neighborhood: 'Higashiyama North',
    one_line_teaser: 'Hear the deep resonance of the massive bronze bell and observe morning chanting in the grand wooden hall.',
    full_description: 'Open to respectful public observation at sunrise. Visitors climb the broad stone steps (or take the step-free switchback ramp on the south gate) into the cedar temple complex. The monks chant sacred sutras accompanied by resonant wooden fish drums. Completely free of charge, with donations welcome for temple maintenance.',
    indoor: true,
    accessibility: {
      wheelchair: true,
      step_free: true,
      senior_paced: true,
      low_sensory: true
    },
    hours: '06:00 - 16:00 (Daily)',
    open_now: true,
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80'
    ],
    offerings: [
      { id: 'off-14', title: 'Open Morning Service Observation', price: 0, description: 'Quiet seating in the outer perimeter of the main hall during morning prayer.', duration_minutes: 60 }
    ],
    availability_slots: [
      { id: 's-26', date: '2026-09-27', time: '06:30', capacity_remaining: 15, total_capacity: 25 }
    ],
    rating_summary: {
      score: 4.97,
      review_count: 210,
      editorial_note: 'Profound acoustic serenity in the morning air.'
    }
  }
];
