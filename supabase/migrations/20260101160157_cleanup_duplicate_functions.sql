/*
  # Clean Up Duplicate Functions

  ## Overview
  Removes any duplicate trigger functions and ensures only the secure version exists.

  ## Changes
  1. Drop all existing versions of update_updated_at_column function
  2. Create single secure version with proper search_path
  3. Recreate trigger

  ## Notes
  This ensures only one secure version of the function exists in the database.
*/

-- Drop all versions of the function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate the function with secure search_path
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql'
SECURITY DEFINER
SET search_path = '';

-- Recreate trigger for projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();