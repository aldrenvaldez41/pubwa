/*
  # Fix Security and Performance Issues

  ## Overview
  Addresses RLS policy performance issues and function security vulnerabilities
  identified in the Supabase security audit.

  ## Changes

  1. **RLS Policy Optimization**
     - Update testimonials policy to use subquery `(select auth.uid())` instead of `auth.uid()`
     - This prevents re-evaluation for each row, improving query performance at scale

  2. **Function Security**
     - Fix `update_updated_at_column` function to have immutable search_path
     - Prevents potential security vulnerabilities from search_path manipulation

  ## Security Impact
  - Improves RLS policy performance
  - Hardens function against search_path attacks
  - No breaking changes to existing functionality
*/

-- Drop and recreate the testimonials RLS policy with optimized auth check
DROP POLICY IF EXISTS "Anyone can view published testimonials" ON testimonials;

CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR (select auth.uid()) IS NOT NULL);

-- Recreate the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql'
SET search_path = '';

-- Recreate trigger to use the updated function
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();