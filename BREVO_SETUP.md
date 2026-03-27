# Brevo Email Integration Setup Guide

Your contact form has been successfully integrated with Brevo email service. This guide will help you complete the setup.

## What's Been Implemented

Your contact form now:
- Saves submissions to your Supabase database
- Sends a notification email to you with all form details
- Sends an automatic acknowledgment email to the user
- Includes proper input validation and sanitization
- Handles errors gracefully with fallback messages

## Step 1: Create Your Brevo Account

1. Visit [Brevo's website](https://www.brevo.com/)
2. Click "Sign up free" to create an account
3. Complete the registration process and verify your email

## Step 2: Get Your Brevo API Key

1. Log in to your [Brevo dashboard](https://app.brevo.com/)
2. Navigate to **Settings** (gear icon in top right)
3. Click on **SMTP & API** in the left sidebar
4. Under the **API Keys** tab, click **Generate a new API key**
5. Give it a name like "Portfolio Contact Form"
6. Copy the API key (you won't be able to see it again)

## Step 3: Verify Your Sender Email

Brevo requires you to verify the email address you'll send from:

1. In your Brevo dashboard, go to **Settings** > **Senders & IP**
2. Click **Add a new sender**
3. Enter your email (hello@buildwithaldren.com or your custom domain)
4. Follow the verification process
5. Wait for approval (usually instant for free domains, may take time for custom domains)

**Important:** If you're using a custom domain, you'll need to:
- Add SPF and DKIM records to your DNS settings
- Brevo will provide these records during the verification process

## Step 4: Configure Environment Variables

You need to add two environment variables to your Supabase project:

### Option A: Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Settings** > **Edge Functions**
4. Scroll to **Environment Variables**
5. Add these variables:
   - `BREVO_API_KEY`: Your Brevo API key from Step 2
   - `OWNER_EMAIL`: Your email address (e.g., hello@buildwithaldren.com)

### Option B: Using Supabase CLI (if available)

```bash
supabase secrets set BREVO_API_KEY=your_api_key_here
supabase secrets set OWNER_EMAIL=hello@buildwithaldren.com
```

## Step 5: Update Email Templates (Optional)

The Edge Function includes professional email templates. If you want to customize them:

1. Open `supabase/functions/send-contact-email/index.ts`
2. Find the `notificationEmail` and `acknowledgmentEmail` objects
3. Modify the HTML content as needed
4. Redeploy the function (this happens automatically)

## Email Template Details

### Notification Email (sent to you)
<!-- - **From:** noreply@buildwithaldren.com -->
- **From:** hello@buildwithaldren.com
- **Subject:** "New Contact Form Submission from [Name]"
- **Contains:**
  - Sender's name
  - Sender's email
  - Company (if provided)
  - Full message text
  - Formatted in a clean, readable layout

### Acknowledgment Email (sent to user)
- **From:** Your configured owner email
- **Subject:** "Thank you for reaching out!"
- **Contains:**
  - Personalized greeting
  - Confirmation of message receipt
  - Expected response time (24 hours)
  - Copy of their submitted message
  - Your contact information
  - Professional branding

## Testing Your Integration

### Test 1: Submit the Form

1. Visit your website
2. Fill out the contact form with test data
3. Use a real email address you can check
4. Submit the form

### Test 2: Verify Database Storage

1. Log in to your Supabase dashboard
2. Go to **Table Editor** > **contact_inquiries**
3. Verify your test submission appears

### Test 3: Check Email Delivery

1. **Check your inbox** (owner email) for the notification
2. **Check the test user's inbox** for the acknowledgment email
3. If emails don't arrive within 2 minutes, check:
   - Spam/Junk folders
   - Brevo dashboard for delivery status
   - Supabase Edge Function logs for errors

### Test 4: Check Edge Function Logs

1. In Supabase Dashboard, go to **Edge Functions**
2. Click on **send-contact-email**
3. View the **Logs** tab for any errors
4. Common issues:
   - Invalid API key
   - Unverified sender email
   - Rate limits (free tier: 300 emails/day)

## Troubleshooting

### Emails Not Sending

1. **Verify API key is correct:**
   - Check the environment variable in Supabase
   - Ensure there are no extra spaces or characters

2. **Check sender email verification:**
   - Go to Brevo dashboard > Senders & IP
   - Ensure your email is verified and active

3. **Review Edge Function logs:**
   - Look for specific error messages
   - Common errors include "Invalid sender" or "Unauthorized"

4. **Check Brevo account limits:**
   - Free tier: 300 emails/day
   - Verify you haven't hit the limit in Brevo dashboard

### Form Submits But No Emails

If the form shows success but no emails arrive:

1. Check browser console for errors
2. Verify the Edge Function URL is correct
3. Check that CORS headers are properly configured
4. Review Supabase Edge Function logs

### User Not Receiving Acknowledgment

1. Check if the email address is valid
2. Ask user to check spam/junk folder
3. Verify the acknowledgment email template sender is verified in Brevo
4. Check Brevo's email logs for delivery status

## Email Deliverability Best Practices

To ensure your emails don't end up in spam:

1. **Use a custom domain** instead of free email providers
2. **Set up SPF and DKIM records** in your DNS
3. **Verify your domain** in Brevo
4. **Keep a good sender reputation:**
   - Don't send spam
   - Monitor bounce rates
   - Respond to complaints promptly

## Rate Limits

**Brevo Free Tier:**
- 300 emails per day
- No credit card required
- All features included

**If you need more:**
- Upgrade to Lite plan: 10,000 emails/month starting at $25/month
- Enterprise plans available for higher volumes

## Security Features Implemented

Your integration includes:
- Input validation (required fields, email format)
- HTML sanitization to prevent XSS attacks
- CORS headers properly configured
- API key stored securely in environment variables
- Public function (no authentication required for contact form)
- Error handling with user-friendly messages

## Form Fields

The contact form collects:
- **Name** (required)
- **Email** (required, validated)
- **Company** (optional)
- **Message** (required)

## File Structure

```
project/
├── src/
│   └── components/
│       └── Contact.tsx              # Updated form component
└── supabase/
    └── functions/
        └── send-contact-email/
            └── index.ts              # Edge Function for email sending
```

## Customization Options

### Change Owner Email Display Name

Edit the Edge Function and modify:
```typescript
sender: { email: ownerEmail, name: "Your Name Here" }
```

### Add CC or BCC Recipients

In the Edge Function, modify the email objects:
```typescript
to: [{ email: ownerEmail, name: "Aldren" }],
cc: [{ email: "team@company.com", name: "Team" }],
bcc: [{ email: "archive@company.com" }]
```

### Customize Email Styling

Both emails use inline CSS for maximum compatibility. Modify the `htmlContent` strings in the Edge Function to change:
- Colors
- Fonts
- Layout
- Branding

## Support Resources

- [Brevo Documentation](https://developers.brevo.com/)
- [Brevo API Reference](https://developers.brevo.com/reference)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Your Brevo Dashboard](https://app.brevo.com/)

## Next Steps

1. Complete Steps 1-4 above to activate the integration
2. Test the form with real email addresses
3. Monitor the first few submissions to ensure everything works
4. Customize email templates if desired
5. Consider upgrading Brevo plan if you expect high volume

## Questions?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase Edge Function logs
3. Check Brevo dashboard for email delivery status
4. Verify all environment variables are set correctly
