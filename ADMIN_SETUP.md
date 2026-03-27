# Admin User Setup Guide

This portfolio application uses role-based access control (RBAC) to restrict write operations to admin users only. After the security updates, only users with the `admin` role can create, update, or delete content.

## Setting Up Your First Admin User

After creating your account through the application, you need to grant yourself admin privileges. Follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** > **Users**
4. Find your user account in the list
5. Click on your user to open the details
6. Scroll to **User Metadata** section
7. Click **Edit** next to "Raw App Meta Data"
8. Add the admin role:
   ```json
   {
     "role": "admin"
   }
   ```
9. Click **Save**

### Option 2: Using SQL Query

You can also run this SQL query in the **SQL Editor** section of your Supabase Dashboard:

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin@email.com';
```

Replace `your-admin@email.com` with your actual email address.

## Verifying Admin Access

After setting up the admin role:

1. Log out and log back in to your application
2. Try accessing the admin panel at `/admin`
3. You should now be able to create, edit, and delete:
   - Projects
   - Testimonials
   - Facebook Pages
   - Contact inquiry statuses

## Security Notes

- Public users can still view all content (projects, testimonials, Facebook pages)
- Public users can submit contact form inquiries
- Only admin users can modify content
- The admin role is stored in the JWT token's `app_metadata` which cannot be modified by users
- You can create multiple admin users by repeating the setup process for additional accounts

## Troubleshooting

**Problem**: I set up admin but still can't edit content

**Solution**:
- Make sure you logged out and back in after setting the admin role
- Verify the role was set correctly by checking the user's metadata in the Supabase dashboard
- Check your browser console for any authentication errors

**Problem**: SQL query doesn't update the user

**Solution**:
- Double-check the email address is correct
- Make sure you're running the query in the correct project
- Try using the Dashboard UI method instead
