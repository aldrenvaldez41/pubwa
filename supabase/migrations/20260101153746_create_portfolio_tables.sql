/*
  # Portfolio Website Database Schema

  ## Overview
  Creates the complete database structure for a professional portfolio website
  with project showcase, contact management, and testimonials functionality.

  ## New Tables

  ### 1. projects
  Stores portfolio project information with full details for showcase
  - `id` (uuid, primary key) - Unique project identifier
  - `title` (text) - Project name
  - `description` (text) - Detailed project description
  - `short_description` (text) - Brief summary for card displays
  - `industry` (text) - Industry category (real estate, healthcare, e-commerce, etc.)
  - `technologies` (text[]) - Array of technologies used
  - `image_url` (text) - Primary project screenshot URL
  - `demo_url` (text) - Live demo link
  - `completion_date` (date) - Project completion date
  - `is_featured` (boolean) - Whether to highlight on homepage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. contact_inquiries
  Stores contact form submissions from potential clients
  - `id` (uuid, primary key) - Unique inquiry identifier
  - `name` (text) - Client name
  - `email` (text) - Client email address
  - `company` (text, optional) - Client company name
  - `message` (text) - Inquiry message
  - `status` (text) - Inquiry status (new, contacted, completed)
  - `created_at` (timestamptz) - Submission timestamp

  ### 3. testimonials
  Stores client testimonials and reviews
  - `id` (uuid, primary key) - Unique testimonial identifier
  - `client_name` (text) - Client name
  - `company` (text, optional) - Client company
  - `position` (text, optional) - Client position/title
  - `testimonial` (text) - Testimonial content
  - `rating` (integer) - Rating out of 5
  - `is_published` (boolean) - Whether to display publicly
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Projects: Public read access, admin-only write access
  - Contact inquiries: Public insert only, admin read access
  - Testimonials: Public read for published only, admin full access

  ## Notes
  1. All tables use UUID primary keys for security
  2. Timestamps use timestamptz for timezone awareness
  3. Default values ensure data integrity
  4. Indexes on frequently queried columns for performance
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  industry text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL,
  demo_url text,
  completion_date date DEFAULT CURRENT_DATE,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text,
  position text,
  testimonial text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_industry ON projects(industry);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Projects policies: Public can read all projects
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Contact inquiries policies: Anyone can submit, only authenticated can read
CREATE POLICY "Anyone can submit contact inquiry"
  ON contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact inquiries"
  ON contact_inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact inquiries"
  ON contact_inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials policies: Public can read published, authenticated can manage all
CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();