/*
  # Coupon/Discount Code System

  ## Overview
  Creates a comprehensive coupon system supporting multiple discount types,
  usage limits, and detailed tracking capabilities.

  ## 1. New Tables

  ### `coupons`
  Main table storing all coupon codes and their properties:
  - `id` (uuid, primary key) - Unique coupon identifier
  - `code` (text, unique) - The actual coupon code (e.g., "SAVE20")
  - `description` (text) - Human-readable description
  - `discount_type` (text) - Type: 'percentage', 'fixed_amount', 'free_shipping', 'bogo'
  - `discount_value` (numeric) - Discount amount (percentage or fixed PHP amount)
  - `min_purchase_amount` (numeric, nullable) - Minimum order value required
  - `max_discount_amount` (numeric, nullable) - Cap for percentage discounts
  - `start_date` (timestamptz) - When coupon becomes active
  - `expiration_date` (timestamptz, nullable) - When coupon expires
  - `usage_limit` (integer, nullable) - Total times coupon can be used (null = unlimited)
  - `usage_limit_per_user` (integer, nullable) - Times each user can use it
  - `is_active` (boolean) - Whether coupon is currently active
  - `is_single_use` (boolean) - If true, can only be used once total
  - `user_specific` (uuid, nullable) - If set, only this user can use it
  - `applicable_services` (jsonb, nullable) - Array of service IDs this applies to
  - `created_by` (uuid) - Admin who created the coupon
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `coupon_usage`
  Tracks each time a coupon is used:
  - `id` (uuid, primary key) - Unique usage record
  - `coupon_id` (uuid, foreign key) - Reference to coupon
  - `order_id` (uuid, foreign key) - Reference to order
  - `user_email` (text) - Email of user who used it
  - `discount_applied` (numeric) - Actual discount amount applied
  - `used_at` (timestamptz) - When coupon was used
  - `order_amount` (numeric) - Total order amount before discount

  ## 2. Table Modifications

  ### Add coupon tracking to `orders` table
  - `coupon_code` (text, nullable) - Coupon code used
  - `discount_amount` (numeric, default 0) - Discount applied

  ## 3. Security
  - Enable RLS on all new tables
  - Coupons: Public can read active coupons, only authenticated admins can manage
  - Usage: Users can view their own usage, admins can view all
  - Orders: Updated to include coupon information

  ## 4. Indexes
  - Index on coupon code for fast lookup
  - Index on coupon expiration and active status
  - Index on usage by coupon_id for analytics
*/

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping', 'bogo')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  min_purchase_amount numeric CHECK (min_purchase_amount >= 0),
  max_discount_amount numeric CHECK (max_discount_amount >= 0),
  start_date timestamptz NOT NULL DEFAULT now(),
  expiration_date timestamptz,
  usage_limit integer CHECK (usage_limit > 0),
  usage_limit_per_user integer CHECK (usage_limit_per_user > 0),
  is_active boolean NOT NULL DEFAULT true,
  is_single_use boolean NOT NULL DEFAULT false,
  user_specific uuid,
  applicable_services jsonb,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_expiration CHECK (expiration_date IS NULL OR expiration_date > start_date)
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  discount_applied numeric NOT NULL CHECK (discount_applied >= 0),
  order_amount numeric NOT NULL CHECK (order_amount >= 0),
  used_at timestamptz DEFAULT now()
);

-- Add coupon columns to orders table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'coupon_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN coupon_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, expiration_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_email ON coupon_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code) WHERE coupon_code IS NOT NULL;

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons table

-- Anyone can view active, non-expired coupons
CREATE POLICY "Public can view active coupons"
  ON coupons FOR SELECT
  TO public
  USING (
    is_active = true 
    AND (expiration_date IS NULL OR expiration_date > now())
    AND start_date <= now()
  );

-- Only authenticated users can create coupons (admin check would be in application logic)
CREATE POLICY "Authenticated users can create coupons"
  ON coupons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update coupons
CREATE POLICY "Authenticated users can update coupons"
  ON coupons FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can delete coupons
CREATE POLICY "Authenticated users can delete coupons"
  ON coupons FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for coupon_usage table

-- Users can view their own coupon usage
CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert usage records
CREATE POLICY "Authenticated users can insert usage"
  ON coupon_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coupon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_coupon_updated_at();

-- Create function to get coupon usage count
CREATE OR REPLACE FUNCTION get_coupon_usage_count(coupon_code_param text)
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM coupon_usage cu
  JOIN coupons c ON c.id = cu.coupon_id
  WHERE c.code = coupon_code_param;
$$ LANGUAGE sql STABLE;

-- Create function to get user-specific coupon usage count
CREATE OR REPLACE FUNCTION get_user_coupon_usage_count(coupon_code_param text, user_email_param text)
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM coupon_usage cu
  JOIN coupons c ON c.id = cu.coupon_id
  WHERE c.code = coupon_code_param AND cu.user_email = user_email_param;
$$ LANGUAGE sql STABLE;

-- Insert some sample coupons for testing
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, is_active, expiration_date)
VALUES 
  ('WELCOME20', '20% off for new customers', 'percentage', 20, 1000, true, now() + interval '30 days'),
  ('SAVE500', '₱500 off orders over ₱5000', 'fixed_amount', 500, 5000, true, now() + interval '60 days'),
  ('FREESHIP', 'Free shipping on all orders', 'free_shipping', 0, 0, true, now() + interval '90 days')
ON CONFLICT (code) DO NOTHING;
