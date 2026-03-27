/*
  # Optimize RLS Policy Performance

  This migration optimizes Row Level Security policies by wrapping auth function
  calls in SELECT statements. This ensures the auth functions are evaluated once
  per query instead of once per row, significantly improving performance at scale.

  ## Changes Made
  
  ### Projects Table
  - Optimize admin insert, update, and delete policies
  
  ### Contact Inquiries Table
  - Optimize admin update policy
  
  ### Testimonials Table
  - Optimize admin insert, update, and delete policies
  
  ### Facebook Pages Table
  - Optimize admin insert, update, and delete policies
  
  ## Performance Impact
  
  Before: `auth.jwt()` called once per row (N times for N rows)
  After: `(select auth.jwt())` called once per query (1 time for N rows)
  
  This change is especially important for batch operations and large result sets.

  ## Note on Contact Form Policy
  
  The "Anyone can submit contact inquiry" INSERT policy intentionally allows
  unrestricted access (true) as it's a public contact form. This is by design
  and not a security issue.
*/

-- ============================================================================
-- PROJECTS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert projects" ON projects;
DROP POLICY IF EXISTS "Admin users can update projects" ON projects;
DROP POLICY IF EXISTS "Admin users can delete projects" ON projects;

CREATE POLICY "Admin users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- CONTACT INQUIRIES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can update contact inquiries" ON contact_inquiries;

CREATE POLICY "Admin users can update contact inquiries"
  ON contact_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- TESTIMONIALS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can delete testimonials" ON testimonials;

CREATE POLICY "Admin users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- FACEBOOK PAGES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin users can insert facebook pages" ON facebook_pages;
DROP POLICY IF EXISTS "Admin users can update facebook pages" ON facebook_pages;
DROP POLICY IF EXISTS "Admin users can delete facebook pages" ON facebook_pages;

CREATE POLICY "Admin users can insert facebook pages"
  ON facebook_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update facebook pages"
  ON facebook_pages
  FOR UPDATE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete facebook pages"
  ON facebook_pages
  FOR DELETE
  TO authenticated
  USING (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );