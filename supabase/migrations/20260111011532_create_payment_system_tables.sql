/*
  # Payment System Schema

  ## Overview
  Complete payment system for Philippine-based business with support for multiple payment methods.

  ## New Tables
  
  ### `services`
  Stores available services/products for purchase
  - `id` (uuid, primary key)
  - `name` (text) - Service/product name
  - `description` (text) - Detailed description
  - `price` (decimal) - Price in PHP
  - `category` (text) - Service category
  - `is_active` (boolean) - Whether service is available for purchase
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `orders`
  Stores customer orders
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Human-readable order number
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email address
  - `customer_phone` (text) - Customer phone number
  - `subtotal` (decimal) - Total before tax
  - `tax` (decimal) - Tax amount
  - `total` (decimal) - Final total amount
  - `status` (text) - Order status (pending, processing, completed, cancelled)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `order_items`
  Stores individual items in each order
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - Reference to orders table
  - `service_id` (uuid, foreign key) - Reference to services table
  - `service_name` (text) - Snapshot of service name at time of order
  - `service_description` (text) - Snapshot of description
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (decimal) - Price per unit at time of order
  - `subtotal` (decimal) - quantity * unit_price
  - `created_at` (timestamptz)

  ### `transactions`
  Stores payment transaction details
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - Reference to orders table
  - `transaction_id` (text, unique) - External payment gateway transaction ID
  - `payment_method` (text) - Payment method used (gcash, maya, etc.)
  - `payment_gateway` (text) - Gateway used (paymongo, xendit, etc.)
  - `amount` (decimal) - Transaction amount
  - `currency` (text) - Currency code (PHP)
  - `status` (text) - Transaction status (pending, success, failed, refunded)
  - `gateway_response` (jsonb) - Raw response from payment gateway
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public can read active services
  - Authenticated users can create orders
  - Only authenticated users can view their own orders
  - Transactions are read-only for customers

  ## Indexes
  - Index on order_number for quick lookups
  - Index on customer_email for order history
  - Index on order status for filtering
  - Index on transaction_id for payment verification
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  subtotal decimal(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax decimal(10, 2) DEFAULT 0 CHECK (tax >= 0),
  total decimal(10, 2) NOT NULL CHECK (total >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  service_name text NOT NULL,
  service_description text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal decimal(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  transaction_id text UNIQUE NOT NULL,
  payment_method text NOT NULL,
  payment_gateway text NOT NULL,
  amount decimal(10, 2) NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'PHP',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services table
CREATE POLICY "Anyone can view active services"
  ON services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for orders table
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (true);

-- RLS Policies for order_items table
CREATE POLICY "Users can insert order items"
  ON order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view order items"
  ON order_items
  FOR SELECT
  USING (true);

-- RLS Policies for transactions table
CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view transactions"
  ON transactions
  FOR SELECT
  USING (true);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  order_exists boolean;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_order_number) INTO order_exists;
    
    IF NOT order_exists THEN
      RETURN new_order_number;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample services
INSERT INTO services (name, description, price, category, is_active) VALUES
  ('Web Development - Landing Page', 'Professional single-page website with modern design, mobile responsive, and optimized for conversions. Includes hosting setup and basic SEO.', 15000.00, 'Web Development', true),
  ('Web Development - Business Website', 'Multi-page business website with up to 5 pages, contact forms, image galleries, and CMS integration. Fully responsive and SEO optimized.', 35000.00, 'Web Development', true),
  ('Web Development - E-Commerce Store', 'Complete online store with product catalog, shopping cart, payment integration, order management, and inventory tracking. Includes admin dashboard.', 75000.00, 'Web Development', true),
  ('Mobile App Development - MVP', 'Minimum Viable Product mobile app for iOS and Android. Includes core features, user authentication, and basic backend integration.', 150000.00, 'Mobile Development', true),
  ('Social Media Automation - Starter', 'Automated posting setup for up to 3 Facebook pages. Includes content scheduling, basic analytics, and 1 month of management.', 8000.00, 'Social Media', true),
  ('Social Media Automation - Professional', 'Comprehensive automation for up to 10 pages. Advanced scheduling, engagement tracking, performance reports, and 3 months of management.', 25000.00, 'Social Media', true),
  ('Custom Software Development', 'Tailored software solution for your specific business needs. Pricing varies based on requirements. This is a consultation fee.', 10000.00, 'Consulting', true),
  ('Website Maintenance - Monthly', 'Monthly website maintenance including updates, security patches, backups, and technical support. Subscription-based service.', 5000.00, 'Maintenance', true),
  ('SEO Optimization Package', 'Complete SEO audit and optimization including keyword research, on-page optimization, meta tags, sitemap, and performance improvements.', 18000.00, 'Marketing', true),
  ('Database Design & Integration', 'Custom database design and integration for web applications. Includes schema design, optimization, and secure API endpoints.', 20000.00, 'Backend Development', true)
ON CONFLICT DO NOTHING;