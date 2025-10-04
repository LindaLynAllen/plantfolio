## App Specification: Personal House Plant Collection Showcase

### Purpose

A public website that showcases the user's collection of 50+ house plants. It serves two main goals:

1. **Personal Display**: Share the plant collection with friends, family, and potential employers.
2. **Portfolio Project**: Demonstrate front-end development skills using Next.js and AI-assisted workflows. The project will be hosted on GitHub with detailed documentation.

### User Types

- **Public Viewers**: Anyone visiting the site to browse the collection.
- **Owner (Developer)**: The app creator, managing content and development (not through the site, but via code or database).

### Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS, optional use of shadcn/ui component library
- **Hosting**: Vercel
- **Data Sources**:
  - **Planta API**: Source of truth for plant metadata (names, species, locations, etc.)
  - **Supabase**: Stores all plant photos and metadata; used to generate cover images and timelines
- **Image Lightbox**: `yet-another-react-lightbox` for photo viewing
- **AI Tools**: Used for coding assistance and documented in the README
- **Version Control**: GitHub with README including development process details
- **Quality Assurance**:
  - ESLint for linting
  - Prettier for formatting
  - Type checking via `tsc`
  - Manual testing for MVP (automated tests deferred to v2)
- **Sync Infrastructure**: Vercel Cron job calling Next.js API route

### Features and UI Screens

#### 🌿 Home Page

- **Navbar**: Logo and site title "Plantfolio"
- **Header**: Title and subtitle introducing the collection
- **Plant Gallery**:
  - Grid display of all plants (at least 5 across on desktop)
  - Each plant shows a thumbnail and name displayed underneath (use `customName` with fallback: `commonName` → `scientificName`)
  - Clicking a plant opens its detail page
  - Loading: Show simple "Loading plants..." message (or nothing) while data fetches
- **Footer**: "© Linda 2025" with icon links to email (`mailto:`) and GitHub repo

#### 🌿 Plant Detail Page

- **Navbar**: Logo and site title "Plantfolio"
- **Back Link**: "← Back to Collection"
- **Header**:
  - Display `customName` as main title (with fallback: `commonName` → `scientificName` if empty)
  - Display `scientificName` as subtitle (plain text, not italicized)
  - Display `location` below species (e.g., "📍 Living Room Shelf")
- **Main Photo**: Newest photo displayed larger (or "No timeline yet" placeholder if no photos exist)
- **Photo Gallery**:
  - Grid of all photos with newest first
  - Display date underneath each photo in format "Jan 15, 2025" (using native `Intl.DateTimeFormat`)
  - Clicking a photo opens it in a lightbox view using `yet-another-react-lightbox` with arrow navigation
  - If no photos exist: display a placeholder message, e.g. "No timeline yet"
- **Footer**: "© Linda 2025" with icon links to email (`mailto:`) and GitHub repo

### Data Model

#### Plant (synced from Planta API, stored in Supabase)

- `id` (string): Planta's unique plant ID (primary key)
- `customName` (string): User-defined name (from API: `names.custom`)
- `commonName` (string): Common plant name (from API: `names.localizedName`)
- `scientificName` (string): Scientific name (from API: `names.scientific`)
- `location` (string): Where the plant is located (from API: `site.name`)
- `planta_image_updated_at` (timestamp): When Planta last updated the photo (from API: `image.lastUpdated`)
- `last_synced_at` (timestamp): When this plant was last checked during sync

_Note: For MVP, display name priority is `customName` → `commonName` → `scientificName` (first non-empty value). Location is shown only on detail page._

#### Photo (stored in Supabase)

- `id` (uuid): Unique identifier (primary key)
- `plantId` (string): Foreign key linking to the Planta plant ID
- `url` (string): Image file URL (Supabase Storage URL, stored at `{plantId}/{currentTimestamp}.jpg` where timestamp is save time)
- `date` (timestamp): Date the photo was taken/updated (from Planta's `image.lastUpdated` or manual entry for backfilled photos)
- `source` (enum): 'planta' | 'manual_upload' - Where this photo came from
- `created_at` (timestamp): When this record was created in Supabase

#### Tokens (stored in Supabase)

- `id` (uuid): Primary key
- `access_token` (text): Current Planta API access token (consider encryption)
- `refresh_token` (text): Current Planta API refresh token (consider encryption)
- `expires_at` (timestamp): When the access token expires
- `updated_at` (timestamp): Last time tokens were refreshed

_Note: This table should have only one row. Protected by RLS with no public access._

#### Sync Logs (stored in Supabase)

- `id` (uuid): Primary key
- `synced_at` (timestamp): When the sync job ran
- `status` (enum): 'success' | 'partial' | 'failed'
- `plants_checked` (integer): Number of plants processed
- `photos_added` (integer): Number of new photos added
- `errors` (jsonb): Array of error messages and details
- `duration_ms` (integer): How long the sync took

_Note: Used for monitoring sync job health and debugging issues._

### Data Flow & Sync Logic

- **Planta API** is used to fetch plant metadata (names, species, location, etc.)
- **Supabase** is the exclusive source for all plant photos (past and present)
- The most recent photo from Supabase is used as the "cover image" for gallery thumbnails and detail views

#### Syncing Strategy

- **Why this is necessary**: The Planta API only returns the **current** plant photo — it does **not provide historical image data**. To build a timeline and preserve visual history, photos must be independently stored and versioned in Supabase.

- **Nightly sync**: Compare the current Planta `image.lastUpdated` timestamp to the stored `planta_image_updated_at` value in the plant record. If different, download the image and append it as a new timeline entry with the photo's date (`image.lastUpdated`), retaining all prior photos. If unchanged, do nothing.

- **Photo change detection**: Use **timestamp comparison** (not URL comparison). The Planta API provides `image.lastUpdated` which is an explicit signal that the photo has changed. This is more reliable than URL comparison because:
  - URLs might change even if the image content hasn't
  - Timestamps are Planta's explicit indicator of photo updates
  - More robust to API infrastructure changes

- **Sync logic flow**:
  1. Fetch plant from Planta API (get `image.url` and `image.lastUpdated`)
  2. Query plant record from Supabase (check `planta_image_updated_at`)
  3. If timestamps differ OR plant has no photos yet:
     - Download image from `image.url`
     - Upload to Supabase Storage at path `{plantId}/{currentTimestamp}.jpg` (use current time for unique filename)
     - Insert new photo record with `source: 'planta'` and `date: image.lastUpdated` (actual photo date)
     - Update plant record with new `planta_image_updated_at`
  4. Otherwise: skip, no change detected

- **Backfill past**: User can manually upload older photos to Supabase with `source: 'manual_upload'` to start timeline before today

- **Capture forward**: A scheduled sync process uses a Planta **refresh token** to pull new photo data and append new rows to Supabase (not overwrite)

- **Current = most recent**: The latest Supabase photo becomes the plant's cover; detail views show newest first

### Token Management & Security

#### Storage Strategy

**Use Supabase for runtime token storage** because tokens need to be programmatically refreshed and updated by the sync job. Environment variables cannot be updated at runtime.

- Create a `tokens` table in Supabase with a single row:
  ```sql
  - id (uuid, primary key)
  - access_token (text, encrypted)
  - refresh_token (text, encrypted)
  - expires_at (timestamp)
  - updated_at (timestamp)
  ```
- Enable Row Level Security (RLS) with policies that only allow server-side access
- Store initial tokens manually via Supabase dashboard or SQL query
- Optional: Keep backup tokens in Vercel environment variables as fallback

#### Token Refresh Flow

The sync job must check and refresh tokens before making API calls:

1. **Before each sync**: Query the `tokens` table from Supabase
2. **Check expiration**: If `expires_at` is within 5 minutes, refresh proactively
3. **Refresh tokens**:
   - Call Planta API refresh endpoint: `POST /v1/auth/refreshToken` with current refresh token
   - Planta returns new `{ accessToken, refreshToken, expiresAt }`
   - Update `tokens` table with new values and `expires_at`
4. **Handle refresh failure**:
   - If refresh token is expired/invalid, log critical error to `sync_logs`
   - Sync job should exit gracefully with status 'failed'
   - Check logs manually and re-authenticate via OAuth flow if needed
5. **Use access token**: Make Planta API calls with current valid access token

#### Initial Token Setup

**Authentication Type:** Custom OTP (One-Time Password) flow - no client ID/secret required

**High-Level Process:**

1. Create app in Planta App Portal (`https://getplanta.com/apps`)
2. Copy OTP code (valid 15 minutes, shown once)
3. Exchange code for tokens via `POST /v1/auth/authorize`
4. Store access token, refresh token, and expiry in Supabase `tokens` table

**Important Notes:**

- OTP codes expire after 15 minutes and are shown only once
- Up to 5 apps per Planta account
- Apps can be revoked from portal at any time
- Access tokens last ~1 hour; refresh tokens are long-lived

**📖 Detailed Setup Instructions:** See `docs/authentication-setup.md` for complete step-by-step guide with curl commands, SQL examples, and troubleshooting

#### Security Requirements

- Tokens are **never exposed to the client** (only accessed in API routes)
- Tokens table is protected by Supabase RLS (no anonymous access)
- Consider encrypting tokens at rest using Supabase Vault or pgcrypto
- API route authenticates cron requests using `CRON_SECRET` environment variable
- Base URL: `https://public.planta-api.com`
- Authentication: `Bearer <access_token>` in Authorization header

### Planta API Endpoints

- **Base URL**: `https://public.planta-api.com`
- **Authentication**: Bearer token in Authorization header
- **Available Endpoints**:
  - `POST /v1/auth/authorize` - Exchange OTP code for initial tokens
  - `POST /v1/auth/refreshToken` - Refresh expired access tokens
  - `GET /v1/addedPlants` - List all plants (pagination via cursor, returns 50 plants at a time)
  - `GET /v1/addedPlants/{id}` - Get plant details including current photo

#### API Response Field Mapping

The Planta API returns data in a nested structure. Map fields as follows:

**From API Response → To Supabase Plant Table:**

- `data.id` → `id`
- `data.names.custom` → `customName`
- `data.names.localizedName` → `commonName`
- `data.names.scientific` → `scientificName`
- `data.site.name` → `location`
- `data.image.lastUpdated` → `planta_image_updated_at`

_Note: `data.names.variety` available in API but deferred to v2_

**From API Response → To Supabase Photo Table:**

- `data.image.url` → download and upload to Supabase Storage (path: `{plantId}/{currentTimestamp}.jpg` where timestamp = now), store resulting URL in `url`
- `data.image.lastUpdated` → `date` (actual photo date)
- `'planta'` → `source`

_Note: See `docs/planta-app-api-schemas.md` for complete API response structure with all available fields_

### Sync Infrastructure & Implementation

- **Sync Job Location**: Next.js API route at `/app/api/sync-plants/route.ts`
- **Scheduling**: Vercel Cron job configured in `vercel.json` to run nightly at 2 AM UTC
- **Security**: API route verifies `CRON_SECRET` environment variable to prevent unauthorized calls
- **Process**:
  1. **Authenticate**: Fetch tokens from Supabase `tokens` table, refresh if needed (see Token Refresh Flow above)
  2. **Fetch plants**: Get all plants from Planta API (handling cursor-based pagination until `pagination.nextPage` is null)
  3. **For each plant**:
     - Upsert plant metadata (customName, commonName, scientificName, location) in Supabase (creates new record if plant doesn't exist, updates if it does)
     - Get `image.url` and `image.lastUpdated` from Planta API response
     - Query plant record from Supabase to check `planta_image_updated_at`
     - Compare timestamps: if `image.lastUpdated` differs from `planta_image_updated_at` OR plant has no photos (first sync):
       - Download image from `image.url`
       - Upload to Supabase Storage at path `{plantId}/{currentTimestamp}.jpg` (use current sync time for unique filename)
       - Insert new photo record with `source: 'planta'` and `date: image.lastUpdated` (actual photo date)
       - Update plant's `planta_image_updated_at` to match `image.lastUpdated`
     - Update `last_synced_at` timestamp on plant record
  4. **Log results**: Write sync summary to `sync_logs` table (plants checked, photos added, errors)
- **Manual Trigger**: Support optional `?manual=true` query parameter for testing during development
- **Error Handling**:
  - If token refresh fails: exit gracefully, log to `sync_logs` with status 'failed'
  - If individual plant fails: wrap in try-catch, log error, continue to next plant
  - Log all errors to `sync_logs.errors` (jsonb) for manual review

### Frontend Data Fetching

The Next.js app reads data directly from Supabase using Server Components (no API routes needed).

#### Data Access Pattern

- **Authentication**: Use Supabase anon key (public read access)
- **Security**: Row Level Security (RLS) policies control what data is accessible
- **Method**: Direct Supabase queries from Server Components

#### Key Queries

**Home Page** - Get all plants with their most recent photo:

```typescript
const { data: plants } = await supabase
  .from("plants")
  .select(
    `
    *,
    photos(url, date)
  `
  )
  .order("commonName", { ascending: true });

// Then in your component:
// - Get most recent photo for each plant: photos.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
// - Display name using: customName || commonName || scientificName
```

**Plant Detail Page** - Get single plant with all photos:

```typescript
const { data: plant } = await supabase
  .from("plants")
  .select(
    `
    *,
    photos(*)
  `
  )
  .eq("id", plantId)
  .single();

// Sort photos newest first in the component
```

#### Why This Approach

- **Simple**: No extra API routes, direct database access
- **Modern**: Recommended pattern for Next.js App Router + Supabase
- **Performant**: Server-side rendering with direct queries
- **Portfolio-worthy**: Shows understanding of modern Next.js patterns

_Note: With only ~55 plants, loading all at once is more performant than pagination._

### Error Handling

#### UI Error States

- **Missing plant or photos**: Show a friendly message like "Plant not found" or "No photos yet"
- **API fetch fails**: Show fallback UI like "Error loading collection. Please try again later."
- **Broken image URLs**: Use a default placeholder image
- **Lightbox fails to load**: Prevent crashes; disable or hide if unsupported
- **Missing timeline data**: If a plant has no photos, show placeholder message like "No timeline yet"

#### Sync Job Error Scenarios

For MVP, keep error handling simple. Log everything to `sync_logs` table and fix issues manually.

- **Token refresh fails**:
  - Log critical error to `sync_logs` with status 'failed' and clear error message
  - Include recovery instructions in error log: "Refresh token expired - re-authenticate at https://getplanta.com/apps"
  - Exit sync gracefully
  - Check `sync_logs` table regularly for failures (recommended: weekly or after noticing missing photos)
- **Individual plant fails** (API error, photo download fails, etc.): Log the error, skip that plant, continue with others
- **Image processing errors**:
  - Wrap image download/upload in try-catch
  - On failure: log error to `sync_logs.errors` with plant ID and error message
  - Continue to next plant (don't crash entire sync)
- **Entire sync fails**: Status logged as 'failed' with error details in `errors` field
- **Partial success**: Status logged as 'partial' if some plants succeeded but others failed

**MVP Philosophy**: If something breaks, you'll see it in `sync_logs` table and fix it manually. With 50 plants syncing once daily, this is sufficient.

### Accessibility, Performance & Responsiveness

- **Accessibility**:
  - Use semantic HTML (e.g. `header`, `nav`, `main`, `section`)
  - Ensure all images have meaningful `alt` text:
    - Gallery thumbnails: `"{plantName}"`
    - Detail page main photo: `"{plantName} - current photo"`
    - Timeline photos: `"{plantName} - photo from {date}"`
  - Provide focus states and keyboard navigation
  - Meet WCAG AA color contrast standards

- **Performance**:
  - Use Next.js `<Image>` component for all plant photos with `fill` prop for responsive sizing (handles lazy loading, optimization, and responsive srcSet automatically)
  - Compress assets and optimize static delivery
  - Use aspect-ratio containers with `position: relative` for Image fill to prevent layout shifts
  - Target Core Web Vitals thresholds

- **Responsiveness**:
  - Web app must render cleanly and remain fully functional on desktop, tablet, and mobile devices
  - Use mobile-first layout strategies and responsive Tailwind utilities

### Initial Setup & Bootstrap Process

This section documents the one-time setup required before the app can run:

1. **Supabase Setup**:
   - Create new Supabase project
   - Create tables: `plants`, `photos`, `tokens`, `sync_logs`
   - Configure Row Level Security (RLS) policies:
     - `plants`: Allow SELECT for anon (public read)
     - `photos`: Allow SELECT for anon (public read)
     - `tokens`: No anon access (server-only via service role key)
     - `sync_logs`: No anon access (server-only)
   - Create storage bucket for plant photos:
     - Bucket name: `plant-photos`
     - Bucket type: Public
     - Path structure: `{plantId}/{currentTimestamp}.jpg` where timestamp is when photo is saved (e.g., `abc123/1705287900000.jpg`)
   - Set up Supabase environment variables in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for frontend queries)
     - `SUPABASE_SERVICE_ROLE_KEY` (for sync job only)

2. **Planta API Authentication**:
   - Create an app in Planta App Portal (`https://getplanta.com/apps`)
   - Generate OTP code (valid for 15 minutes)
   - Exchange OTP for access + refresh tokens via `/v1/auth/authorize` endpoint
   - Insert tokens into Supabase `tokens` table via SQL or dashboard
   - **See `docs/authentication-setup.md` for complete step-by-step guide**

3. **Vercel Configuration**:
   - Set environment variable `CRON_SECRET` (random secure string)
   - Add `vercel.json` with cron configuration:
     ```json
     {
       "crons": [
         {
           "path": "/api/sync-plants",
           "schedule": "0 2 * * *"
         }
       ]
     }
     ```
   - Deploy app to Vercel

4. **Initial Data Sync**:
   - Manually trigger sync job: `https://your-app.vercel.app/api/sync-plants?manual=true`
   - This will populate all plants and their current photos from Planta API
   - For each plant, `last_synced_at` is set to current timestamp
   - For each photo:
     - Uploaded to storage at `{plantId}/{currentTimestamp}.jpg` (filename uses current save time)
     - `source` is set to 'planta'
     - `date` is set to `image.lastUpdated` from Planta (actual photo date shown to users)
   - Verify plants and photos are populated in Supabase
   - Check `sync_logs` table for success status

5. **Optional: Historical Photo Backfill**:
   - Manually upload older photos to Supabase storage
   - Insert corresponding rows in `photos` table with:
     - Accurate historical dates in `date` field
     - `source: 'manual_upload'`
   - Link photos to correct `plantId`

### Acceptance Criteria (User + System)

- **Gallery**: Display all plants at once; grid loads efficiently with Next.js Image optimization
- **Detail**: When a new photo is added, it appears at the top of the timeline; older photos remain visible
- **Sync**: Nightly job checks each plant; if `image.lastUpdated` timestamp has changed, download and append a new Supabase entry with proper `source` tracking; otherwise, skip update
- **Lightbox**: Photo lightbox opens smoothly with arrow navigation between images
- **Photo Source Tracking**: Photos synced from Planta marked with `source: 'planta'`; manually uploaded photos marked with `source: 'manual_upload'`

### Future Enhancements (MVP → v2)

- **Photo Query Optimization**: Optimize thumbnail fetch with Supabase query ordering instead of client-side sort (e.g., `photos!inner(...).order(date.desc()).limit(1)`)
- **Plant Variety Field**: Add `variety` field to data model for more detailed plant information and filtering/sorting
- **Runtime Validation**: Add Zod for API response and data validation
- **Automated Testing**: Add Playwright tests for critical user flows
- **Light/Dark Mode Toggle**: Allow users to switch between light and dark themes
- **Scroll-to-Top Button**: Floating button visible on scroll, especially on mobile
- **Search Functionality**: Allow users to search plants by name on the homepage
- **Sort & Filter Options**:
  - Sort by custom name, species, or location
  - Filter by room/location, species, variety, or date added
