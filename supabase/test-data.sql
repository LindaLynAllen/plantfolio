-- =============================================
-- Test Data for Plantfolio
-- =============================================
-- Run this in Supabase SQL Editor to add sample plants for testing
-- This helps you see how the gallery looks before running the sync job

-- Add a test plant (Monstera)
INSERT INTO plants (
  id,
  "customName",
  "commonName",
  "scientificName",
  location,
  last_synced_at
) VALUES (
  'test-monstera-001',
  'My Big Monstera',
  'Monstera',
  'Monstera deliciosa',
  'Living Room',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Add another test plant (Pothos)
INSERT INTO plants (
  id,
  "customName",
  "commonName",
  "scientificName",
  location,
  last_synced_at
) VALUES (
  'test-pothos-001',
  NULL, -- No custom name, will fall back to common name
  'Golden Pothos',
  'Epipremnum aureum',
  'Office',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Add a third test plant (Snake Plant)
INSERT INTO plants (
  id,
  "customName",
  "commonName",
  "scientificName",
  location,
  last_synced_at
) VALUES (
  'test-snake-plant-001',
  'Sansevieria Sam',
  'Snake Plant',
  'Dracaena trifasciata',
  'Bedroom',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Note: These plants have no photos yet, so they'll show the "No photo yet" placeholder
-- This demonstrates both the populated and empty photo states

-- To verify the plants were added:
SELECT id, "customName", "commonName", "scientificName", location FROM plants;

