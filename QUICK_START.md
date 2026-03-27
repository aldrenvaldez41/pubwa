# Quick Start Guide - Brevo Email Integration

## 5-Minute Setup

### 1. Create Brevo Account
- Go to [brevo.com](https://www.brevo.com/) and sign up
- Verify your email address

### 2. Get API Key
- Login to [Brevo Dashboard](https://app.brevo.com/)
- Settings > SMTP & API > API Keys
- Generate new API key and copy it

### 3. Verify Sender Email
- Settings > Senders & IP > Add a new sender
- Add your email (hello@buildwithaldren.com)
- Complete verification process

### 4. Add Environment Variables to Supabase
Go to Supabase Dashboard > Your Project > Settings > Edge Functions:

```
BREVO_API_KEY=your_brevo_api_key_here
OWNER_EMAIL=hello@buildwithaldren.com
```

### 5. Test the Form
- Visit your website
- Submit a test form
- Check both your inbox and the test user's inbox

## That's It!

Your contact form now:
- Saves to database
- Emails you with submission details
- Sends acknowledgment to the user

Need help? See BREVO_SETUP.md for detailed instructions.
