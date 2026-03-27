# Payment System Documentation

## Overview

A comprehensive payment processing system designed for Philippine-based businesses with support for multiple local and international payment methods. The system handles the complete payment flow from service selection to payment confirmation with email receipts.

## Features

### Multi-Page Payment Flow
1. **Service Selection/Cart Page** - Browse services, add to cart, adjust quantities
2. **Payment Method Selection** - Choose from 13+ Philippine payment options
3. **Customer Information** - Collect required customer details with validation
4. **Payment Processing** - Secure backend processing with transaction tracking
5. **Confirmation Page** - Receipt display with download option and email confirmation

### Supported Payment Methods

#### E-Wallets (QR Code Support)
- **GCash** - Most popular e-wallet in Philippines
- **Maya (PayMaya)** - Second largest e-wallet
- **GrabPay** - Ride-hailing payment integration
- **ShopeePay** - E-commerce wallet

#### Online Banking
- **BPI Online** - Bank of the Philippine Islands
- **BDO Online** - Banco de Oro
- **UnionBank Online** - UnionBank of the Philippines
- **Metrobank Online** - Metropolitan Bank

#### Card Payments
- **Credit/Debit Cards** - Visa, Mastercard, JCB

#### Over-the-Counter
- **7-Eleven** - Pay at any 7-Eleven store
- **Cebuana Lhuillier** - Remittance and pawnshop chain
- **M Lhuillier** - Money transfer service

#### International
- **PayPal** - Global payment platform

## Database Schema

### Tables

#### `services`
Stores available services/products for purchase
- `id` (uuid) - Primary key
- `name` (text) - Service name
- `description` (text) - Service description
- `price` (decimal) - Price in PHP
- `category` (text) - Service category
- `is_active` (boolean) - Availability status

#### `orders`
Stores customer orders
- `id` (uuid) - Primary key
- `order_number` (text) - Human-readable order number (ORD-YYYYMMDD-XXXX)
- `customer_name` (text) - Customer full name
- `customer_email` (text) - Email address
- `customer_phone` (text) - Phone number
- `subtotal` (decimal) - Total before tax
- `tax` (decimal) - Tax amount
- `total` (decimal) - Final amount
- `status` (text) - pending, processing, completed, cancelled

#### `order_items`
Individual items in each order
- `id` (uuid) - Primary key
- `order_id` (uuid) - Foreign key to orders
- `service_id` (uuid) - Foreign key to services
- `service_name` (text) - Snapshot of service name
- `service_description` (text) - Snapshot of description
- `quantity` (integer) - Quantity ordered
- `unit_price` (decimal) - Price per unit
- `subtotal` (decimal) - Line item total

#### `transactions`
Payment transaction records
- `id` (uuid) - Primary key
- `order_id` (uuid) - Foreign key to orders
- `transaction_id` (text) - External gateway transaction ID
- `payment_method` (text) - Payment method used
- `payment_gateway` (text) - Gateway used (paymongo, xendit, dragonpay, paypal)
- `amount` (decimal) - Transaction amount
- `currency` (text) - Currency code (PHP)
- `status` (text) - pending, success, failed, refunded
- `gateway_response` (jsonb) - Raw gateway response

## Payment Gateway Integration

### Current Status: DEMO MODE

The system is currently in demo mode and simulates successful payments. To activate live payments, you need to integrate with actual payment gateways.

### Recommended Payment Gateways

#### 1. PayMongo (Primary Gateway)
**Best for**: GCash, Maya, GrabPay, Online Banking, Cards

**Setup Steps**:
1. Create account at https://paymongo.com
2. Get API keys from dashboard
3. Add to environment variables:
   - `PAYMONGO_SECRET_KEY`
   - `PAYMONGO_PUBLIC_KEY`

**Integration Code** (in `process-payment` edge function):
```typescript
// For E-Wallets (GCash, Maya, GrabPay)
const response = await fetch('https://api.paymongo.com/v1/sources', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(Deno.env.get('PAYMONGO_SECRET_KEY') + ':')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      attributes: {
        type: paymentMethod, // 'gcash', 'grab_pay', 'paymaya'
        amount: total * 100, // Amount in centavos
        currency: 'PHP',
        redirect: {
          success: 'https://yourdomain.com/?page=confirmation',
          failed: 'https://yourdomain.com/?page=payment'
        }
      }
    }
  })
});

// For Cards
const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(Deno.env.get('PAYMONGO_SECRET_KEY') + ':')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      attributes: {
        amount: total * 100,
        currency: 'PHP',
        payment_method_allowed: ['card'],
        payment_method_options: {
          card: { request_three_d_secure: 'any' }
        }
      }
    }
  })
});
```

**Documentation**: https://developers.paymongo.com/

#### 2. Xendit (Secondary Gateway)
**Best for**: ShopeePay, Alternative E-Wallets

**Setup Steps**:
1. Create account at https://xendit.co
2. Get API key from dashboard
3. Add to environment: `XENDIT_SECRET_KEY`

**Integration Code**:
```typescript
const response = await fetch('https://api.xendit.co/ewallets/charges', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(Deno.env.get('XENDIT_SECRET_KEY') + ':')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference_id: transactionId,
    currency: 'PHP',
    amount: total,
    checkout_method: 'ONE_TIME_PAYMENT',
    channel_code: paymentMethod.toUpperCase(),
    channel_properties: {
      success_redirect_url: 'https://yourdomain.com/?page=confirmation',
      failure_redirect_url: 'https://yourdomain.com/?page=payment'
    }
  })
});
```

**Documentation**: https://developers.xendit.co/

#### 3. DragonPay (Over-the-Counter)
**Best for**: 7-Eleven, Cebuana, M Lhuillier, BDO, Metrobank

**Setup Steps**:
1. Apply for merchant account at https://www.dragonpay.ph/
2. Get merchant ID and password
3. Add to environment:
   - `DRAGONPAY_MERCHANT_ID`
   - `DRAGONPAY_PASSWORD`

**Integration Code**:
```typescript
// Generate payment URL
const params = new URLSearchParams({
  merchantid: Deno.env.get('DRAGONPAY_MERCHANT_ID')!,
  txnid: transactionId,
  amount: total.toString(),
  ccy: 'PHP',
  description: `Order ${orderNumber}`,
  email: customerInfo.email,
  procid: paymentMethod.toUpperCase() // Payment processor code
});

// Redirect user to DragonPay
const dragonpayUrl = `https://gw.dragonpay.ph/Pay.aspx?${params.toString()}`;
```

**Documentation**: https://www.dragonpay.ph/

#### 4. PayPal (International)
**Best for**: International customers, USD payments

**Setup Steps**:
1. Create business account at https://paypal.com
2. Get API credentials from developer dashboard
3. Add to environment:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_SECRET`

**Integration Code**:
```typescript
// Get access token
const authResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(Deno.env.get('PAYPAL_CLIENT_ID') + ':' + Deno.env.get('PAYPAL_SECRET'))}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
});
const { access_token } = await authResponse.json();

// Create order
const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'PHP',
        value: total.toFixed(2)
      }
    }]
  })
});
```

**Documentation**: https://developer.paypal.com/

## Edge Functions

### 1. `process-payment`
**Path**: `/functions/v1/process-payment`

**Purpose**: Creates order and transaction records, processes payment

**Request Body**:
```json
{
  "cart": [
    {
      "id": "uuid",
      "name": "Service Name",
      "description": "Service Description",
      "price": 15000,
      "quantity": 1
    }
  ],
  "total": 15000,
  "paymentMethod": "gcash",
  "paymentGateway": "paymongo",
  "customerInfo": {
    "name": "Juan Dela Cruz",
    "email": "juan@example.com",
    "phone": "09171234567"
  }
}
```

**Response**:
```json
{
  "success": true,
  "orderNumber": "ORD-20260111-1234",
  "transactionId": "TXN-1736585...",
  "paymentUrl": "https://gateway.com/pay/...",
  "message": "Order created successfully"
}
```

### 2. `send-payment-receipt`
**Path**: `/functions/v1/send-payment-receipt`

**Purpose**: Sends email receipt to customer and notification to owner

**Request Body**:
```json
{
  "orderNumber": "ORD-20260111-1234",
  "transactionId": "TXN-1736585...",
  "customerName": "Juan Dela Cruz",
  "customerEmail": "juan@example.com",
  "paymentMethod": "gcash",
  "cart": [...],
  "subtotal": 15000,
  "tax": 0,
  "total": 15000
}
```

**Response**:
```json
{
  "success": true,
  "message": "Receipt sent successfully"
}
```

## Security Features

### PCI DSS Compliance
- No card data stored on servers
- All payment data handled by PCI-compliant gateways
- Secure HTTPS connections enforced
- Tokenization for sensitive data

### Row Level Security (RLS)
All database tables have RLS enabled with appropriate policies:
- Public can view active services
- Users can create orders
- Users can view their own orders
- Transactions are read-only after creation

### Input Validation
- Email format validation
- Philippine phone number format validation
- SQL injection prevention
- XSS protection through sanitization

## Testing

### Demo Mode
The system currently runs in demo mode where:
1. All payments are automatically approved
2. No actual money is transferred
3. Email receipts are still sent
4. All database records are created

### Test Flow
1. Visit homepage
2. Click "View All Services & Pricing"
3. Add services to cart
4. Click "Proceed to Payment"
5. Fill in customer information:
   - Name: Test User
   - Email: test@example.com
   - Phone: 09171234567
6. Select any payment method
7. Click "Proceed to Payment"
8. View confirmation page

### Testing Payment Gateways
Each gateway provides test/sandbox credentials:
- **PayMongo**: https://developers.paymongo.com/docs/testing
- **Xendit**: https://developers.xendit.co/api-reference/#test-scenarios
- **DragonPay**: Contact support for test merchant account
- **PayPal**: https://developer.paypal.com/tools/sandbox/

## Email Integration

Uses Brevo (formerly Sendinblue) for transactional emails.

### Email Types
1. **Customer Receipt** - Detailed order information and receipt
2. **Owner Notification** - New order alert with customer details

### Configuration
Already configured with existing Brevo API key from contact form.

Environment variables:
- `BREVO_API_KEY` - API key for Brevo
- `OWNER_EMAIL` - Recipient for notifications

## Going Live

### Pre-Launch Checklist

#### 1. Payment Gateway Setup
- [ ] Create production accounts with chosen gateways
- [ ] Obtain production API keys
- [ ] Configure environment variables in Supabase
- [ ] Test with small real transactions

#### 2. Security Verification
- [ ] Enable HTTPS for entire site
- [ ] Review all RLS policies
- [ ] Test authentication flows
- [ ] Verify email validation

#### 3. Legal Requirements
- [ ] Add Terms of Service
- [ ] Add Privacy Policy
- [ ] Add Refund Policy
- [ ] Display business registration details
- [ ] Show DTI/SEC registration

#### 4. Testing
- [ ] Test all payment methods
- [ ] Verify email delivery
- [ ] Test error scenarios
- [ ] Check mobile responsiveness
- [ ] Verify receipt downloads

#### 5. Monitoring
- [ ] Set up error tracking
- [ ] Configure transaction alerts
- [ ] Monitor failed payments
- [ ] Track conversion rates

## Customization

### Adding New Services
Add services directly in the database:
```sql
INSERT INTO services (name, description, price, category, is_active)
VALUES (
  'New Service',
  'Service description',
  25000.00,
  'Category Name',
  true
);
```

### Modifying Payment Methods
Edit `PaymentMethodSelection.tsx` to add/remove payment methods from the `paymentMethods` array.

### Customizing Emails
Edit the email templates in `send-payment-receipt` edge function to match your branding.

### Adding Tax Calculation
Update the `calculateTax()` functions in:
- `ServiceSelection.tsx`
- `PaymentMethodSelection.tsx`
- `process-payment` edge function

## Support

For technical support with the payment system:
- Email: support@buildwithaldren.com
- Phone: 09161171825

For payment gateway issues:
- PayMongo: support@paymongo.com
- Xendit: support@xendit.co
- DragonPay: support@dragonpay.ph
- PayPal: https://paypal.com/support

## Additional Resources

- [PayMongo API Documentation](https://developers.paymongo.com/)
- [Xendit API Documentation](https://developers.xendit.co/)
- [DragonPay Integration Guide](https://www.dragonpay.ph/wp-content/uploads/2014/05/DragonPay-PS-API-V3.pdf)
- [PayPal Developer Documentation](https://developer.paypal.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Brevo Email API](https://developers.brevo.com/)

## License

This payment system is part of the Build with Aldren portfolio website. All rights reserved.
