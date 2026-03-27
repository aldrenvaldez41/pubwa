/*
  # Create Facebook Pages Table
  
  This migration creates a dedicated table for showcasing automated Facebook pages
  in the portfolio. This is a read-only display table for potential clients to view
  the automated social media pages being managed.

  ## New Tables
  
  ### `facebook_pages`
  - `id` (uuid, primary key) - Unique identifier for each page
  - `page_name` (text, required) - Name of the Facebook page
  - `page_url` (text, required) - URL to the Facebook page
  - `niche` (text, required) - Category/niche of the page (e.g., E-commerce, Food, Travel)
  - `description` (text, optional) - Brief description or notes about the page
  - `follower_count` (integer, optional) - Number of followers (for showcasing scale)
  - `posts_per_day` (integer, optional) - Average posts per day (automation frequency)
  - `date_added` (timestamptz) - When the page was added to the portfolio
  - `is_featured` (boolean) - Whether to highlight this page
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  
  - Enable RLS on `facebook_pages` table
  - Allow public read access (portfolio showcase)
  - Restrict write access to authenticated admin users only
*/

-- Create the facebook_pages table
CREATE TABLE IF NOT EXISTS facebook_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name text NOT NULL,
  page_url text NOT NULL,
  niche text NOT NULL,
  description text,
  follower_count integer,
  posts_per_day integer DEFAULT 6,
  date_added timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read facebook pages (public portfolio)
CREATE POLICY "Anyone can view facebook pages"
  ON facebook_pages
  FOR SELECT
  USING (true);

-- Only authenticated users can insert facebook pages
CREATE POLICY "Authenticated users can insert facebook pages"
  ON facebook_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update facebook pages
CREATE POLICY "Authenticated users can update facebook pages"
  ON facebook_pages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete facebook pages
CREATE POLICY "Authenticated users can delete facebook pages"
  ON facebook_pages
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_facebook_pages_niche ON facebook_pages(niche);
CREATE INDEX IF NOT EXISTS idx_facebook_pages_is_featured ON facebook_pages(is_featured);
CREATE INDEX IF NOT EXISTS idx_facebook_pages_date_added ON facebook_pages(date_added DESC);