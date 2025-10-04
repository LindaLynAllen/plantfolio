# Supabase Setup Guide

This guide walks you through setting up Supabase for your Plantfolio application, from creating a project to configuring your local environment.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- The Plantfolio project cloned and dependencies installed

---

## Step 1: Create Supabase Project

1. **Go to [app.supabase.com](https://app.supabase.com)**

2. **Click "New Project"**

3. **Fill in project details:**
   - **Name:** `plantfolio` (or your preferred name)
   - **Database Password:** Generate a strong password and **save it securely**
   - **Region:** Choose closest to your location for best performance
   - **Pricing Plan:** Free tier is perfect for this project

4. **Click "Create new project"**
   - Wait 2-3 minutes for provisioning

---

## Step 2: Run Database Migration

Once your project is ready:

1. **Open the SQL Editor:**
   - In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Copy the migration file:**
   - Open `supabase/migrations/001_initial_schema.sql` from your project
   - Copy the **entire contents**

3. **Paste and run:**
   - Paste into the SQL Editor
   - Click **"Run"** (or press `Cmd/Ctrl + Enter`)
   - You should see: **"Success. No rows returned"**

4. **Verify tables were created:**
   - Click **"Table Editor"** in the left sidebar
   - You should see 4 tables: `plants`, `photos`, `tokens`, `sync_logs`

### What This Migration Does:

✅ Creates all database tables with proper types and constraints  
✅ Sets up indexes for query performance  
✅ Configures Row Level Security (RLS) policies  
✅ Adds a placeholder token row (you'll update this later)  
✅ Enforces single-row constraint on tokens table

---

## Step 3: Create Storage Bucket

Your plant photos need a home in Supabase Storage:

1. **Open Storage:**
   - Click **"Storage"** in the left sidebar
   - Click **"Create a new bucket"**

2. **Configure bucket:**
   - **Name:** `plant-photos`
   - **Public bucket:** ✅ **Yes** (checked)
   - Click **"Create bucket"**

3. **Verify bucket is public:**
   - Click on the `plant-photos` bucket
   - Confirm **"Public bucket"** label is visible at the top

### Why Public?

Your plant photos are meant to be displayed on your public website. Making the bucket public allows direct access to image URLs without authentication.

---

## Step 4: Get Your API Credentials

Now let's grab the credentials you'll need for your `.env.local` file:

1. **Open Project Settings:**
   - Click **"Settings"** (gear icon) in the left sidebar
   - Click **"API"**

2. **Copy your Project URL:**
   - Find **"Project URL"** section
   - Copy the URL (looks like `https://xxxxx.supabase.co`)
   - **Save this** - you'll need it for `NEXT_PUBLIC_SUPABASE_URL`

3. **Copy your anon (public) key:**
   - Scroll to **"Project API keys"** section
   - Find the **"anon public"** key
   - Click **"Copy"**
   - **Save this** - you'll need it for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Copy your service_role key:**
   - In the same **"Project API keys"** section
   - Find the **"service_role"** key
   - Click **"Reveal"**, then **"Copy"**
   - **⚠️ IMPORTANT:** This key has admin privileges - keep it secret!
   - **Save this** - you'll need it for `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 5: Configure Local Environment

Now let's set up your environment variables:

1. **Create `.env.local` file:**

   ```bash
   # In your project root
   touch .env.local
   ```

2. **Add your Supabase credentials:**

   Open `.env.local` and paste:

   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   # Cron Job Security
   CRON_SECRET=your-random-secret-here

   # Node Environment
   NODE_ENV=development
   ```

3. **Replace the placeholders:**
   - Replace `https://xxxxx.supabase.co` with your **Project URL**
   - Replace `your-anon-key-here` with your **anon public key**
   - Replace `your-service-role-key-here` with your **service_role key**

4. **Generate CRON_SECRET:**

   ```bash
   # Run this in your terminal to generate a secure random string:
   openssl rand -base64 32
   ```

   Copy the output and use it for `CRON_SECRET`

5. **Save the file** and verify it's in `.gitignore`:
   ```bash
   cat .gitignore | grep ".env"
   # Should show: .env*
   ```

---

## Step 6: Verify Connection

Let's test that everything is working:

1. **Run the connection test:**

   ```bash
   npm run test:connection
   ```

2. **Expected output:**

   ```
   🔍 Testing Supabase connection...

   Test 1: Connection & Credentials
   ✅ Connected to Supabase successfully!

   Test 2: Database Tables
   ✅ plants      : Exists
   ✅ photos      : Exists
   ✅ tokens      : Exists
   ✅ sync_logs   : Exists

   Test 3: Public Data Access
   ✅ Plants: Public read access working (empty table)
   ✅ Photos: Public read access working (empty table)

   🎉 Supabase connection test passed!
   ✅ Your database is ready for development!
   ```

3. **If you see errors:**
   - Double-check your `.env.local` values
   - Make sure there are no extra spaces or quotes around the keys
   - Verify the migration ran successfully in Supabase
   - Check that variable names match exactly (including `NEXT_PUBLIC_` prefix)

---

## Step 7: Verify Security (Optional)

Want to double-check your security configuration? Here's what to look for:

### RLS (Row Level Security) Status

In Supabase dashboard:

1. Go to **Table Editor**
2. Click on each table
3. Look for the **"RLS enabled"** indicator

**Expected configuration:**

- **plants:** RLS enabled, 1 policy (public read)
- **photos:** RLS enabled, 1 policy (public read)
- **tokens:** RLS enabled, 0 policies (no public access)
- **sync_logs:** RLS enabled, 0 policies (no public access)

### What This Means:

✅ Public visitors can view plants and photos (your website)  
✅ Only your API routes can access tokens and sync logs (secure)  
✅ No one can write to the database via public client (protected)

---

## 🎉 You're All Set!

Your Supabase backend is now fully configured:

- ✅ Database tables created with proper schema
- ✅ Row Level Security policies configured
- ✅ Storage bucket ready for photos
- ✅ Environment variables configured locally
- ✅ Connection verified and working

---

## Next Steps

Now that your database is ready, you can:

1. **Add test data** (optional) - See `supabase/README.md` for SQL examples
2. **Start building the home page** - Display your plant gallery
3. **Run the dev server** - `npm run dev`

---

## Troubleshooting

### Connection test fails with "Missing environment variables"

- Verify `.env.local` exists in project root (not in a subdirectory)
- Check that variable names are spelled correctly
- Make sure there are no quotes around the values
- Restart your terminal/editor after creating `.env.local`

### "Table does not exist" errors

- The migration didn't run successfully
- Go back to Step 2 and run the SQL migration again
- Check for any error messages in the SQL Editor

### "Cannot read plants/photos" errors

- RLS policies might not be set up correctly
- Re-run the migration (it's safe to run multiple times)
- Check the **Authentication → Policies** section in Supabase dashboard

### Storage bucket not found

- Verify bucket name is exactly `plant-photos` (with hyphen)
- Check that it's set to **Public** in the Storage section
- You may need to create it manually via the dashboard

---

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

**Questions or issues?** Check `supabase/README.md` for SQL query examples, or refer back to `docs/plantfolio-mvp-spec.md` for architecture details.
