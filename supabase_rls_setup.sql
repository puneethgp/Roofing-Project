-- =============================================
-- IRFAAZ ROOFING - Supabase RLS Security Setup
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_history ENABLE ROW LEVEL SECURITY;

-- 2. PROJECTS TABLE
--    Public can READ projects (portfolio display)
--    Nobody can write without being authenticated
CREATE POLICY "Public read projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Authenticated write projects"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

-- 3. GLOBAL_SETTINGS TABLE
--    Public can READ settings (pricing, materials, business info)
--    Only authenticated can write
CREATE POLICY "Public read settings"
  ON global_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated write settings"
  ON global_settings FOR ALL USING (auth.role() = 'authenticated');

-- 4. PRICING_HISTORY TABLE
--    Public can read the latest price (for estimator)
--    Only authenticated can insert new prices
CREATE POLICY "Public read pricing"
  ON pricing_history FOR SELECT USING (true);

CREATE POLICY "Authenticated write pricing"
  ON pricing_history FOR INSERT USING (auth.role() = 'authenticated');

-- 5. LEADS TABLE
--    Anyone can INSERT a lead (contact form submissions)
--    Only authenticated users can READ/UPDATE leads (admin CRM)
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated read leads"
  ON leads FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update leads"
  ON leads FOR UPDATE USING (auth.role() = 'authenticated');

-- =============================================
-- DONE! Your database is now protected.
-- Next: Set up Supabase Auth for admin login
-- Docs: https://supabase.com/docs/guides/auth
-- =============================================
