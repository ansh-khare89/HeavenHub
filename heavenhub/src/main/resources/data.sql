-- Sample Indian property listings (10 rows).
-- Matches JPA Property entity → PostgreSQL snake_case columns.
-- host_id references the first HOST user (same convention as DatabaseSeeder: alice@heavenhub.com).
-- Idempotent: each INSERT runs only if that title is not already present.

-- 1 · Mumbai
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Harbour light loft · Mumbai',
  'Sea breeze, fast Wi‑Fi, and Bandra sunsets — a compact loft for two.',
  '42 Ring Road, Bandra West', 'Mumbai', 'Maharashtra', '400050',
  9200.00, 1200.00, 4.62, 12.00,
  'Check-in after 2 PM · Wi‑Fi on the fridge magnet · Metro 8 min walk.', 4,
  'City loft', 2, 2,
  'WiFi, AC, Kitchen, Washing machine, Power backup', 'West',
  true, false, true, 128,
  19.0596, 72.8295,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Harbour light loft · Mumbai');

-- 2 · Delhi
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Lutyens garden studio · Delhi',
  'Quiet studio near greens — work desk, kitchenette, winter sunshine.',
  '18 Safdarjung Enclave', 'Delhi', 'Delhi', '110029',
  6800.00, 950.00, 4.48, 11.00,
  'OTP lock · Housekeeping on request · Metro 10 min.', 3,
  'Studio loft', 1, 1,
  'WiFi, AC, Kitchenette, Inverter, Workspace', 'North',
  true, true, false, 86,
  28.5677, 77.1880,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Lutyens garden studio · Delhi');

-- 3 · Jaipur
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Pink sandstone haveli · Jaipur',
  'Heritage courtyard, jharokha views, and filter coffee on the terrace.',
  '9 Johari Bazaar Lane', 'Jaipur', 'Rajasthan', '302001',
  7400.00, 1100.00, 4.71, 10.00,
  'Respect quiet hours after 10 PM · Local guide cards in lobby.', 4,
  'Heritage haveli', 3, 2,
  'WiFi, AC, Courtyard, Traditional sit-out, Airport pickup opt', 'North',
  false, false, true, 203,
  26.9124, 75.7873,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Pink sandstone haveli · Jaipur');

-- 4 · Goa (Panaji)
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Candolim coconut villa · Panaji',
  'Short walk to the waves — pool, outdoor shower, and susegad on tap.',
  '3 Beach Road, Candolim', 'Panaji', 'Goa', '403515',
  14200.00, 2000.00, 4.88, 12.00,
  'Beach towels in the bench · Bikes in the shed.', 5,
  'Beach house', 3, 3,
  'WiFi, AC, Pool, Beach access path, Outdoor shower', 'Islands',
  true, true, true, 312,
  15.4989, 73.8278,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Candolim coconut villa · Panaji');

-- 5 · Shimla
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Ridge pine cabin · Shimla',
  'Wood stove, mountain air, and Mall Road ten minutes down the hill.',
  '22 Lakkar Bazaar', 'Shimla', 'Himachal Pradesh', '171001',
  3200.00, 500.00, 4.35, 10.00,
  'Heating on · Extra blankets in chest · No smoking indoors.', 4,
  'Mountain cabin', 2, 1,
  'WiFi, Heating, Wood stove, Trek maps, Hot chai', 'North',
  false, true, false, 54,
  31.1048, 77.1734,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Ridge pine cabin · Shimla');

-- 6 · Bengaluru
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Koramangala workation flat · Bengaluru',
  'WFH desk, 300 Mbps, and filter coffee — startup city, slow evenings.',
  '88 4th Block Koramangala', 'Bengaluru', 'Karnataka', '560034',
  5600.00, 900.00, 4.69, 12.00,
  'Building access card in the bowl · Parking slot B7.', 4,
  'Garden villa', 2, 2,
  'WiFi, AC, Parking, WFH desk, Power backup', 'South',
  true, false, true, 241,
  12.9352, 77.6245,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Koramangala workation flat · Bengaluru');

-- 7 · Chennai
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Marina breeze apartment · Chennai',
  'Sea-facing balcony, AC, and idli spots pinned on the welcome card.',
  '15 Kamarajar Salai', 'Chennai', 'Tamil Nadu', '600004',
  7100.00, 1300.00, 4.74, 13.00,
  'Lift to 6th floor · Shoes off indoors.', 6,
  'Sea-view apartment', 3, 2,
  'WiFi, AC, Sea view, Kitchen, Washing machine', 'South',
  true, false, true, 177,
  13.0478, 80.2801,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Marina breeze apartment · Chennai');

-- 8 · Kochi
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Backwater deck house · Kochi',
  'Kayak tie-up, coconut palms, and a chef on call for appam nights.',
  '7 Fort Kochi Waterfront', 'Kochi', 'Kerala', '682001',
  11800.00, 1900.00, 4.91, 13.00,
  'Life jackets under the stairs · Ferry timings on the fridge.', 4,
  'Waterfront villa', 3, 3,
  'WiFi, AC, Kayak dock, Ayurveda spa room, Chef on call', 'South',
  true, false, true, 289,
  9.9312, 76.2673,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Backwater deck house · Kochi');

-- 9 · Udaipur
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Lake Pichola terrace suite · Udaipur',
  'Sunrise over the water — marble floors, rooftop chai, and boat pickup.',
  '4 Chandpole Marg', 'Udaipur', 'Rajasthan', '313001',
  8900.00, 1200.00, 4.67, 10.00,
  'Respect heritage tiles · No shoes on marble.', 3,
  'Palace-view suite', 2, 2,
  'WiFi, AC, Lake-facing terrace, Boat pickup opt', 'North',
  true, false, true, 156,
  24.5854, 73.7125,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Lake Pichola terrace suite · Udaipur');

-- 10 · Kolkata
INSERT INTO properties (
  title, description, address, city, state, zip_code,
  price_per_night, cleaning_fee, average_rating, platform_fee_percent,
  house_manual, max_guests,
  property_type, bedrooms, bathrooms, amenities, region,
  instant_book, pet_friendly, superhost, review_count,
  latitude, longitude,
  host_id, created_at, updated_at
)
SELECT
  'Colonial courtyard home · Kolkata',
  'High ceilings, terrazzo tiles, and adda on the balcony after tram rides.',
  '21 Park Street', 'Kolkata', 'West Bengal', '700016',
  5200.00, 900.00, 4.58, 12.00,
  'Gate code on SMS · Maid service on request.', 5,
  'Heritage haveli', 4, 3,
  'WiFi, AC, Courtyard, Bengali breakfast opt-in, Car parking', 'East',
  false, false, false, 98,
  22.5726, 88.3639,
  (SELECT id FROM users WHERE role = 'HOST' ORDER BY id LIMIT 1),
  NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'HOST')
  AND NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Colonial courtyard home · Kolkata');
