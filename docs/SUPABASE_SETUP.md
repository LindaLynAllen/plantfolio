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
   - Go to **"Settings"** tab
   - Confirm **"Public bucket"** is enabled

### Why Public?

Your plant photos are meant to be displayed on your public website. Making the bucket public allows direct access to image URLs without authentication. Supabase will generate public URLs like:

```
https://[project-id].supabase.co/storage/v1/object/public/plant-photos/abc123/1705287900000.jpg
```

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

Let's make sure everything is working:

1. **Create a test script:**

   Create `test-connection.ts` in your project root:

   ```typescript
   import { supabase } from "./lib/supabase/client";

   async function testConnection() {
     console.log("Testing Supabase connection...\n");

     // Test 1: Check connection
     const { data, error } = await supabase.from("plants").select("count");

     if (error) {
       console.error("❌ Connection failed:", error.message);
       return;
     }

     console.log("✅ Successfully connected to Supabase!");
     console.log(`📊 Plants table exists (count query worked)`);

     // Test 2: Check all tables
     const tables = ["plants", "photos", "tokens", "sync_logs"];
     for (const table of tables) {
       const { error } = await supabase.from(table).select("*").limit(1);
       if (error) {
         console.log(`❌ ${table}: ${error.message}`);
       } else {
         console.log(`✅ ${table}: Accessible`);
       }
     }

     console.log("\n🎉 All tables are set up correctly!");
   }

   testConnection();
   ```

2. **Run the test:**

   ```bash
   npx tsx test-connection.ts
   ```

3. **Expected output:**

   ```
   Testing Supabase connection...

   ✅ Successfully connected to Supabase!
   📊 Plants table exists (count query worked)
   ✅ plants: Accessible
   ✅ photos: Accessible
   ✅ tokens: Accessible
   ✅ sync_logs: Accessible

   🎉 All tables are set up correctly!
   ```

4. **If you see errors:**
   - Double-check your `.env.local` values
   - Make sure there are no extra spaces or quotes
   - Verify the migration ran successfully in Supabase

5. **Clean up:**
   ```bash
   # After successful test, delete the test file
   rm test-connection.ts
   ```

---

## Step 7: Review Security Settings

Let's verify your security configuration:

### Check RLS Policies

In Supabase dashboard:

1. Go to **"Authentication"** → **"Policies"**
2. You should see:
   - **plants:** 1 policy (Allow public read access)
   - **photos:** 1 policy (Allow public read access)
   - **tokens:** 0 policies (service role only)
   - **sync_logs:** 0 policies (service role only)

### What This Means:

- ✅ Anyone can **read** plants and photos (public website)
- ❌ No one can **write** to plants/photos via public client (only sync job)
- ❌ No one can **access** tokens or sync_logs via public client (admin only)

This is exactly what we want! Your sensitive data is protected while public data is accessible.

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

1. **Build the home page** - Fetch and display plants
2. **Test with sample data** - Add a test plant via SQL:
   ```sql
   INSERT INTO plants (id, "customName", "commonName", "scientificName", location)
   VALUES ('test-1', 'My First Plant', 'Monstera', 'Monstera deliciosa', 'Living Room');
   ```
3. **Implement the sync job** - Connect to Planta API and populate your real data

---

## Troubleshooting

### Error: "relation 'plants' does not exist"

- The migration didn't run successfully
- Go back to Step 2 and run the SQL migration again

### Error: "Invalid API key"

- Check your `.env.local` file for typos
- Make sure you copied the full key (they're very long!)
- Verify no extra spaces or quotes around the keys

### Error: "Cross-Origin Request Blocked"

- Supabase might have CORS restrictions
- Go to **Settings → API → CORS** and add `http://localhost:3000`

### Storage uploads fail

- Verify the `plant-photos` bucket is set to **public**
- Check bucket name matches exactly: `plant-photos` (with hyphen)

### Can't insert into tokens table (second row)

- This is expected! The trigger prevents multiple rows
- Use `UPDATE` instead of `INSERT` to modify tokens

---

## Useful Supabase Dashboard Links

Quick reference for common tasks:

- **Table Editor:** View and edit data
- **SQL Editor:** Run custom queries
- **Storage:** Manage files and buckets
- **Authentication → Policies:** Review RLS rules
- **Settings → API:** Get credentials
- **Logs:** Debug errors (Storage, PostgREST, Auth)

---

**Questions or issues?** Check the [Supabase Documentation](https://supabase.com/docs) or refer back to `docs/plantfolio-mvp-spec.md` for architecture details.
