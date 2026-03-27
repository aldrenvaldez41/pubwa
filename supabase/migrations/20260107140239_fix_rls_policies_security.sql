/*
  # Fix RLS Policy Security Issues

  This migration updates RLS policies to be properly restrictive instead of
  using USING (true) or WITH CHECK (true) which bypass security.

  ## Security Changes
  
  ### Projects Table
  - Replace unrestricted authenticated policies with admin-only policies
  - Admin role is checked via JWT app_metadata
  
  ### Contact Inquiries Table  
  - Keep public insert policy (contact form submission)
  - Restrict updates to admin users only
  
  ### Testimonials Table
  - Replace unrestricted authenticated policies with admin-only policies
  
  ### Facebook Pages Table
  - Replace unrestricted authenticated policies with admin-only policies
  
  ## Admin Setup
  
  To mark a user as admin, update their app_metadata:
  ```sql
  UPDATE auth.users 
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'your-admin@email.com';
  ```
*/

-- ============================================================================
-- PROJECTS TABLE POLICIES
-- ============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

-- Create admin-only policies
CREATE POLICY "Admin users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- CONTACT INQUIRIES TABLE POLICIES
-- ============================================================================

-- Drop existing overly permissive update policy
DROP POLICY IF EXISTS "Authenticated users can update contact inquiries" ON contact_inquiries;

-- Create admin-only update policy
CREATE POLICY "Admin users can update contact inquiries"
  ON contact_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Note: The insert policy "Anyone can submit contact inquiry" remains unchanged
-- as it's intentionally public for the contact form

-- ============================================================================
-- TESTIMONIALS TABLE POLICIES
-- ============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;

-- Create admin-only policies
CREATE POLICY "Admin users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- FACEBOOK PAGES TABLE POLICIES
-- ============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert facebook pages" ON facebook_pages;
DROP POLICY IF EXISTS "Authenticated users can update facebook pages" ON facebook_pages;
DROP POLICY IF EXISTS "Authenticated users can delete facebook pages" ON facebook_pages;

-- Create admin-only policies
CREATE POLICY "Admin users can insert facebook pages"
  ON facebook_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update facebook pages"
  ON facebook_pages
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can delete facebook pages"
  ON facebook_pages
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );