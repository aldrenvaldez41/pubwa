# Coupon/Discount Code System

## Overview

A comprehensive coupon management system has been successfully implemented with full support for multiple discount types, usage limits, analytics, and seamless integration with the checkout process.

## Features

### Supported Coupon Types

1. **Percentage Discounts** - e.g., 20% off
2. **Fixed Amount Discounts** - e.g., ₱500 off
3. **Free Shipping** - Waive shipping fees
4. **Buy One Get One (BOGO)** - 50% off total order

### Advanced Capabilities

- **Minimum Purchase Requirements** - Set minimum order amounts
- **Maximum Discount Caps** - Limit percentage discounts (e.g., max ₱1000 off)
- **Usage Limits** - Total uses and per-user limits
- **Date-based Validity** - Start and expiration dates
- **Single-use Coupons** - One-time only codes
- **User-specific Coupons** - Restrict to specific users
- **Service-specific Discounts** - Apply to selected services only
- **Real-time Validation** - Instant coupon verification
- **Usage Analytics** - Track performance metrics

## Database Schema

### Tables Created

#### `coupons` Table
Stores all coupon codes and their configurations:
- Unique coupon codes (case-insensitive)
- Discount type and value
- Validity periods
- Usage constraints
- Active/inactive status

#### `coupon_usage` Table
Tracks every coupon redemption:
- Links to orders
- User email tracking
- Discount amount applied
- Usage timestamps

#### `orders` Table Updates
Added fields:
- `coupon_code` - Applied coupon code
- `discount_amount` - Discount value

## Backend API

### Edge Functions Deployed

#### 1. `validate-coupon`
**Endpoint:** `POST /functions/v1/validate-coupon`

Validates coupon codes and calculates discounts in real-time.

**Request:**
```json
{
  "couponCode": "SAVE20",
  "userEmail": "customer@example.com",
  "orderAmount": 5000,
  "serviceIds": ["service-id-1"]
}
```

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "id": "uuid",
    "code": "SAVE20",
    "description": "20% off for new customers",
    "discount_type": "percentage"
  },
  "discountAmount": 1000,
  "finalAmount": 4000,
  "message": "Coupon applied successfully"
}
```

**Validation Checks:**
- Coupon exists and is active
- Within validity period
- Meets minimum purchase amount
- Has not exceeded usage limits
- User has not exceeded per-user limit
- Applicable to selected services

#### 2. `manage-coupons`
**Endpoint:** `POST /functions/v1/manage-coupons?action={action}`

Comprehensive coupon management API.

**Actions:**

- `create` - Create new coupons
- `update` - Update existing coupons
- `delete` - Delete coupons
- `list` - Retrieve all coupons
- `record-usage` - Log coupon usage
- `analytics` - Get usage statistics

**Create Example:**
```json
{
  "code": "WELCOME20",
  "description": "20% off for new customers",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_purchase_amount": 1000,
  "expiration_date": "2026-12-31",
  "usage_limit": 100,
  "usage_limit_per_user": 1,
  "is_active": true
}
```

**Analytics Response:**
```json
{
  "success": true,
  "analytics": [
    {
      "code": "SAVE20",
      "description": "20% discount",
      "usage_count": 45,
      "total_discount": 22500,
      "is_active": true
    }
  ]
}
```

## Frontend Components

### 1. Admin Interface (`CouponManager.tsx`)

Access via: Admin Dashboard > Coupons Tab

**Features:**
- Create and edit coupons with intuitive form
- Visual coupon cards showing key details
- Quick enable/disable toggles
- Delete confirmation dialogs
- Analytics dashboard
- Filter by status

**Form Fields:**
- Coupon Code (auto-uppercase)
- Description
- Discount Type dropdown
- Discount Value
- Minimum Purchase Amount
- Maximum Discount Cap (for percentages)
- Start and Expiration Dates
- Usage Limits (total and per-user)
- Active/Inactive toggle
- Single-use checkbox

### 2. Coupon Input (`CouponInput.tsx`)

Integrated into the shopping cart sidebar.

**Features:**
- Real-time validation on apply
- Visual success/error feedback
- Applied coupon display with remove option
- Shows discount amount and new total
- Keyboard support (Enter to apply)

**States:**
- Empty state with input field
- Loading state during validation
- Error state with clear messaging
- Applied state with green confirmation

### 3. Checkout Integration

Coupons are seamlessly integrated throughout the checkout flow:

1. **Service Selection Page**
   - Apply coupons in cart sidebar
   - See real-time price updates
   - Discount reflected in total

2. **Payment Page**
   - Applied coupon info displayed
   - Discount preserved in order summary
   - Passes to payment processing

3. **Order Creation**
   - Coupon code saved to order
   - Usage recorded in database
   - Analytics updated automatically

## Usage Flow

### For Administrators

1. **Access Admin Panel**
   - Navigate to `?admin=true`
   - Login with credentials
   - Click "Coupons" tab

2. **Create Coupon**
   - Click "Add Coupon" button
   - Fill in coupon details
   - Set restrictions as needed
   - Save coupon

3. **Manage Coupons**
   - View all coupons in grid
   - Edit existing coupons
   - Toggle active status
   - Delete unused coupons

4. **View Analytics**
   - Click "View Analytics"
   - See usage statistics
   - Track discount totals
   - Monitor performance

### For Customers

1. **Add Services to Cart**
   - Browse and select services
   - Items appear in cart sidebar

2. **Apply Coupon**
   - Enter coupon code in field
   - Click "Apply" or press Enter
   - See instant validation

3. **Proceed to Checkout**
   - Discount applied to total
   - Continue to payment
   - Complete purchase

## Sample Coupons

Three sample coupons are pre-loaded:

1. **WELCOME20**
   - 20% off for new customers
   - Min purchase: ₱1,000
   - Valid for 30 days

2. **SAVE500**
   - ₱500 off orders over ₱5,000
   - Valid for 60 days

3. **FREESHIP**
   - Free shipping on all orders
   - Valid for 90 days

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled:

- **Public Access:** View active, non-expired coupons
- **Authenticated Users:** Full CRUD operations
- **Usage Tracking:** Secure coupon redemption logging

### Validation Security

- Server-side validation prevents tampering
- Usage limits enforced at database level
- Concurrent usage protection
- Expiration checks on every validation

## Error Handling

Comprehensive error messages guide users:

- "Invalid coupon code" - Code not found
- "This coupon has expired" - Past expiration date
- "Minimum purchase amount of ₱X required" - Order too small
- "This coupon has reached its usage limit" - No uses remaining
- "You have already used this coupon" - Per-user limit reached

## Analytics & Reporting

Track coupon performance:

- Total usage count
- Total discount amount
- Revenue generated
- Average order value
- Active vs inactive status
- Per-coupon detailed metrics

## Technical Architecture

### Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** PostgreSQL with RLS
- **API:** RESTful endpoints
- **Authentication:** Supabase Auth

### Data Flow

1. User enters coupon code
2. Frontend calls `validate-coupon` API
3. Backend validates against database
4. Response with discount calculation
5. Frontend updates UI and state
6. On checkout, coupon included in order
7. Usage recorded in database
8. Analytics updated automatically

### Performance Optimizations

- Database indexes on frequently queried fields
- Efficient RLS policies
- Client-side state management
- Real-time validation feedback
- Optimistic UI updates

## Future Enhancements

Potential additions:

1. **Automatic Coupons** - Apply best coupon automatically
2. **Coupon Stacking** - Combine multiple coupons
3. **Tiered Discounts** - Progressive savings
4. **Referral Codes** - Customer acquisition
5. **Time-based Promotions** - Flash sales
6. **Geolocation Targeting** - Regional offers
7. **Email Integration** - Automated coupon delivery
8. **A/B Testing** - Optimize conversions

## Troubleshooting

### Common Issues

**Coupon not applying:**
- Check if coupon is active
- Verify expiration date
- Confirm minimum purchase met
- Ensure usage limit not reached

**Validation failing:**
- Check API configuration
- Verify database connection
- Review console for errors
- Test with sample coupons

**Analytics not updating:**
- Confirm edge function deployed
- Check database permissions
- Verify RLS policies

## Support

For technical assistance:
- Review edge function logs in Supabase
- Check browser console for errors
- Verify environment variables
- Test with sample data first

## Conclusion

The coupon system is production-ready with enterprise-level features including comprehensive validation, analytics, and security. All components are fully integrated and tested.
