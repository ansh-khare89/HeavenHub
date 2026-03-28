-- Repair PostgreSQL `properties` so it matches JPA (snake_case) after legacy / partial Hibernate DDL.
-- Runs once per startup after Hibernate (see application.properties).

-- Legacy: JPA camelCase was sometimes stored as a single lowercase token (no underscores).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'properties' AND column_name = 'averagerating'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'properties' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE properties RENAME COLUMN averagerating TO average_rating;
  END IF;
END $$;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS average_rating NUMERIC(19, 2) DEFAULT 4.80;
UPDATE properties SET average_rating = 4.80 WHERE average_rating IS NULL;
ALTER TABLE properties ALTER COLUMN average_rating SET NOT NULL;
ALTER TABLE properties ALTER COLUMN average_rating SET DEFAULT 4.80;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(64) DEFAULT 'Apartment';
UPDATE properties SET property_type = 'Apartment' WHERE property_type IS NULL;
ALTER TABLE properties ALTER COLUMN property_type SET NOT NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1;
UPDATE properties SET bedrooms = 1 WHERE bedrooms IS NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1;
UPDATE properties SET bathrooms = 1 WHERE bathrooms IS NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities TEXT;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS region VARCHAR(32);

ALTER TABLE properties ADD COLUMN IF NOT EXISTS instant_book BOOLEAN DEFAULT FALSE;
UPDATE properties SET instant_book = FALSE WHERE instant_book IS NULL;
ALTER TABLE properties ALTER COLUMN instant_book SET NOT NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE;
UPDATE properties SET pet_friendly = FALSE WHERE pet_friendly IS NULL;
ALTER TABLE properties ALTER COLUMN pet_friendly SET NOT NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS superhost BOOLEAN DEFAULT FALSE;
UPDATE properties SET superhost = FALSE WHERE superhost IS NULL;
ALTER TABLE properties ALTER COLUMN superhost SET NOT NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
UPDATE properties SET review_count = 0 WHERE review_count IS NULL;
ALTER TABLE properties ALTER COLUMN review_count SET NOT NULL;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude NUMERIC(19, 6);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude NUMERIC(19, 6);
