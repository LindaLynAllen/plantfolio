# Planta API Authentication Setup Guide

This guide walks you through the one-time setup process to authenticate with the Planta API and obtain the tokens needed for your Plantfolio app.

## Overview

**Authentication Type:** Custom OTP (One-Time Password) flow

Unlike traditional OAuth 2.0, Planta uses a simplified flow where you:
1. Create an "app" in their portal
2. Receive a one-time code
3. Exchange that code for access + refresh tokens
4. Store tokens in your Supabase database

**No client ID or client secret required!**

---

## Prerequisites

Before starting, ensure you have:

- ✅ Active Planta account with plant data
- ✅ Access to Planta App Portal: `https://getplanta.com/apps`
- ✅ Supabase project set up with `tokens` table created
- ✅ HTTP client ready (curl, Postman, or API documentation page)

---

## Step-by-Step Instructions

### Step 1: Create App in Planta Portal

1. **Navigate to the portal:**
   - Visit `https://getplanta.com/apps`
   - Log in with your Planta credentials

2. **Access the Apps section:**
   - Click "Apps" in the left sidebar
   - You'll see any existing apps you've created

3. **Create new app:**
   - Click the **"+ Create app"** button (green button in top right)
   - A dialog will appear: "Create app"

4. **Enter app description:**
   - In the "App description" field, enter a memorable name
   - Example: `"Plantfolio - Personal plant timeline showcase"`
   - This helps you identify the app later if you create multiple integrations

5. **Generate the app:**
   - Click **"Create app"** button
   - The portal will immediately display your one-time code

---

### Step 2: Copy the OTP Code

**⚠️ CRITICAL: This is your only chance to see this code!**

After creating the app, you'll see a dialog titled **"App created!"** with:

- Your unique OTP code (example: `ABC123`)
- A message: "This code is valid for 15 minutes"
- A warning: "You will not see this code again"
- A copy button (clipboard icon) next to the code

**Action:**
1. **Copy the code immediately** using the clipboard icon
2. **Proceed to Step 3 within 15 minutes**
3. If the code expires, you'll need to create a new app

**Note:** You can create up to **5 apps** per Planta account. If you need to generate a new code, just create another app. You can revoke old apps from the portal.

---

### Step 3: Exchange OTP Code for Tokens

Now you'll exchange the OTP code for your access and refresh tokens using the API documentation page.

1. Navigate to the Planta API docs: `https://getplanta.com/apps/api`
2. Click the **"Authorize"** button (top right, green button with lock icon)
3. Leave the authorization dialog (you don't need to authorize yet)
4. Expand the **Auth** section
5. Click on `POST /v1/auth/authorize`
6. Click **"Try it out"**
7. In the request body, replace `"string"` with your OTP code:
   ```json
   {
     "code": "ABC123"
   }
   ```
8. Click **"Execute"**

**Alternative:** You can also use curl or Postman if you prefer:
```bash
curl -X POST https://public.planta-api.com/v1/auth/authorize \
  -H "Content-Type: application/json" \
  -d '{"code": "YOUR_OTP_CODE_HERE"}'
```

---

### Step 4: Save the Response

If successful, you'll receive a **200 OK** response with this structure:

```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresAt": "2025-01-16T03:00:00.000Z"
  }
}
```

**Save all four values** - you'll need them in the next step.

---

### Step 5: Store Tokens in Supabase

Now store these tokens in your Supabase `tokens` table.

#### Option A: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query with:

```sql
INSERT INTO tokens (id, access_token, refresh_token, expires_at, updated_at)
VALUES (
  gen_random_uuid(),
  'PASTE_ACCESS_TOKEN_HERE',
  'PASTE_REFRESH_TOKEN_HERE',
  'PASTE_EXPIRES_AT_HERE',
  NOW()
);
```

4. Replace the placeholder values with your actual tokens
5. Run the query

#### Option B: Using Supabase Table Editor

1. Go to **Table Editor** → `tokens` table
2. Click **"Insert row"**
3. Fill in the fields:
   - `id`: Leave empty (auto-generated)
   - `access_token`: Paste the accessToken value
   - `refresh_token`: Paste the refreshToken value
   - `expires_at`: Paste the expiresAt timestamp
   - `updated_at`: Leave empty or set to current time
4. Click **"Save"**

---

## Verification

### Test Your Access Token

Verify your setup by making a test API call:

```bash
curl -X GET https://public.planta-api.com/v1/addedPlants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected result:** JSON response with your plants data (status 200)

If you get a **401 Unauthorized** error, your token may have expired or is invalid. Generate a new OTP code and repeat the process.

---

## Token Management

### Access Token
- **Lifetime:** Approximately 1 hour (check `expiresAt` field)
- **Usage:** Include in `Authorization: Bearer {token}` header for all API calls
- **Refresh:** Automatically refreshed by your sync job when needed

### Refresh Token
- **Lifetime:** Long-lived (weeks/months - Planta doesn't specify exact duration)
- **Usage:** Exchange for new access token when current one expires
- **Endpoint:** `POST /v1/auth/refreshToken`
- **Body:** `{"refreshToken": "your_refresh_token"}`

### Token Refresh Flow

Your sync job will handle token refresh automatically. Before each sync run, it will:

1. Check if the access token expires within the next 5 minutes
2. If expiring soon, call `POST /v1/auth/refreshToken` with the current refresh token
3. Receive new access token + refresh token + expiry time
4. Update the `tokens` table in Supabase with the new values
5. Continue with sync using the fresh access token

This means you don't need to manually refresh tokens - the sync job handles it for you.

---

## Troubleshooting & FAQ

### "Code is invalid or expired"

**Problem:** You waited more than 15 minutes to exchange the code.

**Solution:** Create a new app in the portal and get a fresh code. You can have up to 5 active apps per Planta account.

---

### "Unauthorized" error when testing

**Problem:** Token is invalid or expired.

**Solution:** 
1. Check that you copied the full token (they're quite long!)
2. Verify the token is in your database correctly
3. Try refreshing the token using the refresh endpoint
4. If nothing works, generate a new OTP code and repeat setup

---

### Refresh token stops working

**Problem:** Refresh token has expired or been revoked.

**Solution:**
1. Check the Planta App Portal - your app might have been revoked
2. Create a new app and repeat the authentication flow
3. Consider keeping a backup refresh token in Vercel environment variables

---

### Can I see my OTP code again after creating an app?

**No** - it's only shown once. If you lose it before exchanging for tokens, create a new app (you can have up to 5 apps).

---

### How long do tokens last?

- **Access tokens:** ~1 hour (check `expiresAt` field in response)
- **Refresh tokens:** Long-lived (weeks/months - Planta doesn't specify exact duration)

Your sync job automatically refreshes access tokens before they expire.

---

### Do I need to re-authenticate for local development?

**No** - use the same tokens from Supabase for local development. Just connect your local environment to the same Supabase project.

---

### Can I revoke access to my app?

**Yes** - go to the Planta App Portal (`https://getplanta.com/apps`), navigate to the Apps section, and click "Revoke" next to your app.

---

## Security Best Practices

1. **Never commit tokens to git**
   - Tokens should only exist in Supabase (protected by RLS)
   - Optional: Keep backup in Vercel environment variables

2. **Protect the tokens table**
   - Enable Row Level Security (RLS)
   - Only allow access via service role key (server-side only)
   - Never expose tokens to the frontend

3. **Monitor token health**
   - Check `sync_logs` table regularly for auth failures
   - Set up alerts for failed sync jobs (future enhancement)

4. **Revoke unused apps**
   - If you created test apps, revoke them from the portal
   - Keep only the production app active

---

## Next Steps

Once you've completed this setup:

1. ✅ Tokens are stored in Supabase
2. ✅ Run your first manual sync: `https://your-app.vercel.app/api/sync-plants?manual=true`
3. ✅ Check `sync_logs` table to verify success
4. ✅ Verify plants and photos are populated in your database

If you encounter any issues, check the `sync_logs` table for error details.

---

## Reference Links

- **Planta App Portal:** https://getplanta.com/apps
- **API Documentation:** https://getplanta.com/apps/api
- **API Base URL:** https://public.planta-api.com
- **Your Spec:** See `Plantfolio-MVP-Spec.md` for architecture details

