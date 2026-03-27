# Payment Gateway Setup Guide

Your payment system is now integrated with **PayMongo**, **Xendit**, and **PayPal**. To activate live payments, you need to add your API keys to Supabase.

## Required API Keys

You mentioned you have:
- ✅ PayMongo secret key (sandbox)
- ✅ Xendit test key
- ✅ PayPal sandbox credentials

## How to Add API Keys to Supabase

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Edge Functions** → **Secrets**

### Step 2: Add Environment Variables

Add the following secrets (click "Add new secret" for each):

#### For PayMongo (E-Wallets, Online Banking, Cards)
```
Name: PAYMONGO_SECRET_KEY
Value: [Your PayMongo Secret Key - starts with sk_test_...]
```

#### For Xendit (ShopeePay)
```
Name: XENDIT_SECRET_KEY
Value: [Your Xendit Secret Key]
```

#### For PayPal (International Payments)
```
Name: PAYPAL_CLIENT_ID
Value: [Your PayPal Client ID]

Name: PAYPAL_SECRET
Value: [Your PayPal Secret]
```

### Step 3: Verify Setup

Once you've added all the secrets:
1. The edge functions will automatically use them (no restart needed)
2. Test each payment method with a small transaction
3. Check that redirects work properly

## Payment Flow

### How It Works Now:

1. **User selects payment method** → Frontend validates customer info
2. **Payment request sent** → Backend creates order in database
3. **Gateway integration** → Redirects to payment gateway (GCash, PayPal, etc.)
4. **User completes payment** → Gateway processes payment
5. **Return to site** → User redirected back to confirmation page
6. **Email receipt sent** → Customer receives receipt via email

## Supported Payment Methods

### PayMongo Gateway
- **GCash** - QR code payment via PayMongo
- **Maya (PayMaya)** - QR code payment via PayMongo
- **GrabPay** - Wallet payment via PayMongo
- **BillEase** - Buy now, pay later via PayMongo
- **BPI Online** - Bank transfer via PayMongo
- **UnionBank Online** - Bank transfer via PayMongo
- **Credit/Debit Cards** - Visa, Mastercard, JCB via PayMongo

### Xendit Gateway
- **ShopeePay** - E-wallet payment via Xendit

### PayPal Gateway
- **PayPal** - International payments via PayPal

## Testing Payments

### PayMongo Test Mode
- Use test card: `4343434343434345`
- Any future expiry date
- Any 3-digit CVV
- For e-wallets: You'll see a test payment page

Documentation: https://developers.paymongo.com/docs/testing

### Xendit Test Mode
- Test payments will show a simulation page
- No real money is charged

Documentation: https://developers.xendit.co/api-reference/#test-scenarios

### PayPal Sandbox
- Use PayPal sandbox account credentials
- Test payments in sandbox environment
- No real money is charged

Documentation: https://developer.paypal.com/tools/sandbox/

## Going Live

### When You're Ready for Production:

#### 1. Switch to Production Keys

**PayMongo:**
- Go to PayMongo dashboard
- Get your **live** secret key (starts with `sk_live_...`)
- Replace `PAYMONGO_SECRET_KEY` in Supabase

**Xendit:**
- Get production API key from Xendit dashboard
- Replace `XENDIT_SECRET_KEY` in Supabase

**PayPal:**
- Update the edge function to use production endpoint
- Change `https://api-m.sandbox.paypal.com` to `https://api-m.paypal.com`
- Get live PayPal credentials
- Replace `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET`

#### 2. Update Edge Function for PayPal Production

In `supabase/functions/process-payment/index.ts`, find line 225 and change:
```typescript
// From:
const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {

// To:
const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
```

And line 240:
```typescript
// From:
const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {

// To:
const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
```

Then redeploy the edge function.

#### 3. Test with Small Real Transactions
- Make small test purchases (₱10-50)
- Verify all payment methods work
- Check email receipts arrive correctly
- Confirm database records are created

#### 4. Monitor Transactions
- Check Supabase dashboard for orders
- Monitor PayMongo/Xendit/PayPal dashboards
- Watch for any failed payments

## Troubleshooting

### Payment Fails with "API key not configured"
- Check that you've added the secret in Supabase
- Verify the secret name matches exactly (case-sensitive)
- Wait 1-2 minutes after adding secrets

### Redirect Not Working
- Verify your site URL is correct
- Check browser console for errors
- Ensure cookies/localStorage are enabled

### Email Not Sending
- Brevo API key should already be configured
- Check Brevo dashboard for sent emails
- Verify customer email is valid

### Gateway Returns Error
- Check the error message in browser console
- Verify API keys are correct
- Ensure you're using test mode for testing
- Check gateway dashboard for transaction status

## Payment Gateway Fees

### PayMongo
- **E-Wallets (GCash, Maya, GrabPay):** 2.5% per transaction
- **Cards:** 3.5% per transaction
- **Online Banking:** ₱15 per transaction

### Xendit
- **ShopeePay:** 2% + ₱2 per transaction

### PayPal
- **International:** 4.4% + ₱15 per transaction
- **Local:** 3.9% + ₱15 per transaction

*Fees are approximate. Check each gateway's pricing for exact rates.*

## Security Notes

- ✅ All API keys are stored securely in Supabase
- ✅ Keys are never exposed to the frontend
- ✅ All payment data is encrypted in transit
- ✅ No sensitive payment info is stored in your database
- ✅ PCI DSS compliant (gateways handle card data)

## Support

### Payment Gateway Support:
- **PayMongo:** support@paymongo.com | https://paymongo.help
- **Xendit:** support@xendit.co | https://help.xendit.co
- **PayPal:** https://paypal.com/support

### Technical Support:
- Email: support@buildwithaldren.com
- Phone: 09161171825

## Quick Start Checklist

- [ ] Add `PAYMONGO_SECRET_KEY` to Supabase
- [ ] Add `XENDIT_SECRET_KEY` to Supabase
- [ ] Add `PAYPAL_CLIENT_ID` to Supabase
- [ ] Add `PAYPAL_SECRET` to Supabase
- [ ] Test GCash payment (sandbox)
- [ ] Test PayPal payment (sandbox)
- [ ] Test ShopeePay payment (sandbox)
- [ ] Verify email receipts are sent
- [ ] Check orders appear in database
- [ ] Ready for production!

---

**You're all set!** Once you add your API keys to Supabase, the payment system will be fully operational.
