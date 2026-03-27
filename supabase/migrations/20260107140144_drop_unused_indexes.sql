/*
  # Drop Unused Indexes

  This migration removes database indexes that are not being used in queries.
  Unused indexes consume storage space and slow down write operations without
  providing any performance benefit.

  ## Indexes Being Removed
  
  1. `idx_projects_industry` - Not used in current queries
  2. `idx_projects_featured` - Not used in current queries  
  3. `idx_contact_status` - Not used in current queries
  4. `idx_testimonials_published` - Not used in current queries
  5. `idx_facebook_pages_niche` - Not used in current queries
  6. `idx_facebook_pages_is_featured` - Not used in current queries
  
  ## Notes
  
  - The `idx_facebook_pages_date_added` index is kept as it's used for ordering
  - If query patterns change in the future, these indexes can be recreated
*/

-- Drop unused indexes on projects table
DROP INDEX IF EXISTS idx_projects_industry;
DROP INDEX IF EXISTS idx_projects_featured;

-- Drop unused indexes on contact_inquiries table
DROP INDEX IF EXISTS idx_contact_status;

-- Drop unused indexes on testimonials table
DROP INDEX IF EXISTS idx_testimonials_published;

-- Drop unused indexes on facebook_pages table
DROP INDEX IF EXISTS idx_facebook_pages_niche;
DROP INDEX IF EXISTS idx_facebook_pages_is_featured;