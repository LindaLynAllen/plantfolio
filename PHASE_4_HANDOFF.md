# 🌿 Plantfolio - Phase 4 Handoff Document

**Status:** End of Phase 3 (Frontend Complete) → Starting Phase 4 (Sync Job)  
**Date:** October 4, 2025  
**Context Usage:** 68% - Fresh session needed  
**Next Milestone:** Planta API integration and automatic photo sync

---

## 🎯 Quick Status Summary

### ✅ What's Complete (Phases 1-3)

- **Phase 1:** Supabase setup with all tables, RLS policies, and storage bucket
- **Phase 2:** Home page with responsive plant gallery (2→5+ columns)
- **Phase 3:** Plant detail page with photo timeline and lightbox

### 🚧 What's Next (Phase 4)

- **Phase 4:** Sync job to import plants and photos from Planta API
- **Phase 5:** Polish, deploy to Vercel, set up cron job

---

## 📊 Project Architecture Overview

### Tech Stack

```
Frontend:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Server Components (default)
- Client Components (where needed)

Backend:
- Supabase (PostgreSQL + Storage)
- Planta API (external data source)
- Vercel Cron (scheduled sync)

Libraries:
- yet-another-react-lightbox (photo viewer)
- @supabase/supabase-js (database client)
```

### File Structure

```
app/
├── layout.tsx              # Root layout (Navbar + Footer)
├── page.tsx                # Home page (Server Component)
└── plants/[id]/
    ├── page.tsx            # Detail page (Server Component)
    └── not-found.tsx       # Custom 404

components/
├── Navbar.tsx              # Site header
├── Footer.tsx              # Site footer
├── PlantCard.tsx           # Gallery thumbnail
├── PlantGallery.tsx        # Grid layout
├── PlantHeader.tsx         # Detail page header
├── PlantMainPhoto.tsx      # Featured photo
├── PhotoTimeline.tsx       # Photo grid
└── PlantDetail.tsx         # CLIENT COMPONENT (lightbox state)

lib/
└── supabase/
    ├── client.ts           # Public client (anon key)
    └── server.ts           # Admin client (service role)

types/
├── database.ts             # Database schema types
└── index.ts                # Helper functions + exports

supabase/
├── migrations/
│   └── 001_initial_schema.sql
├── test-data.sql           # Development test data
└── README.md               # SQL reference

app/api/
└── sync-plants/
    └── route.ts            # PLACEHOLDER - needs implementation
```

---

## 🏗️ Key Architectural Decisions

### 1. Server vs Client Components Pattern

**Decision:** Use Server Components by default, Client Components only when needed

```typescript
// SERVER COMPONENT (default) - for data fetching
// app/page.tsx, app/plants/[id]/page.tsx
export default async function Page() {
  const data = await supabase.from('plants').select('*');
  return <Component data={data} />;
}

// CLIENT COMPONENT - only for interactivity
// components/PlantDetail.tsx (manages lightbox state)
"use client";
export function PlantDetail() {
  const [open, setOpen] = useState(false);
  // ...
}
```

**Why:** SEO, performance, less JS to browser, modern Next.js best practice

### 2. Direct Supabase Queries (No API Routes for Reads)

**Decision:** Server Components query Supabase directly

```typescript
// In Server Component
const { data } = await supabase.from("plants").select("*");
```

**Why:** Simpler, faster, fewer files, recommended pattern for Next.js 15

### 3. Two Supabase Clients

**File:** `lib/supabase/client.ts` (anon key)
- Used in: Server Components, Client Components
- Access: Public read-only (RLS enforced)

**File:** `lib/supabase/server.ts` (service role)
- Used in: API routes, sync job
- Access: Full admin (bypasses RLS)

**Why:** Security separation - never expose service role to client

### 4. Name Fallback Logic

**Pattern established:**
```typescript
customName || commonName || scientificName || "Unknown Plant"
```

**Helper:** `getPlantDisplayName()` in `types/index.ts`

**Used in:** All components displaying plant names

### 5. Photo Sorting

**Always sort newest first:**
```typescript
photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
```

**Helper:** `getMostRecentPhoto()` in `types/index.ts`

---

## 🗄️ Database Schema

### Tables

```sql
plants (
  id TEXT PRIMARY KEY,                -- Planta ID
  customName TEXT,
  commonName TEXT,
  scientificName TEXT,
  location TEXT,
  planta_image_updated_at TIMESTAMPTZ, -- For change detection
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

photos (
  id UUID PRIMARY KEY,
  plantId TEXT → plants(id),
  url TEXT,                           -- Supabase Storage URL
  date TIMESTAMPTZ,                   -- Photo date (from Planta)
  source TEXT,                        -- 'planta' | 'manual_upload'
  created_at TIMESTAMPTZ
)

tokens (
  id UUID PRIMARY KEY,
  access_token TEXT,                  -- Planta API token
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
-- CONSTRAINT: Only 1 row allowed (enforced by trigger)

sync_logs (
  id UUID PRIMARY KEY,
  synced_at TIMESTAMPTZ,
  status TEXT,                        -- 'success' | 'partial' | 'failed'
  plants_checked INTEGER,
  photos_added INTEGER,
  errors JSONB,                       -- Array of error objects
  duration_ms INTEGER
)
```

### RLS Policies

- **plants:** Public SELECT only
- **photos:** Public SELECT only  
- **tokens:** No public access (service role only)
- **sync_logs:** No public access (service role only)

### Storage Bucket

- **Name:** `plant-photos`
- **Type:** Public
- **Path pattern:** `{plantId}/{timestamp}.jpg`

---

## 🎨 UI/UX Patterns Established

### Responsive Grid Pattern

```typescript
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
```

Used in: `PlantGallery`, `PhotoTimeline`

### Color Scheme

- Primary: `green-700` (brand color)
- Hover: `green-600`, `green-800`
- Text: `gray-900` (headings), `gray-600` (body)
- Borders: `gray-200`

### Image Optimization

```typescript
<Image
  src={url}
  alt={descriptive}
  fill                    // Responsive sizing
  sizes="(max-width: 768px) 50vw, 25vw"
  className="object-cover"
  priority={isMainImage}  // Only for hero images
/>
```

### Empty States

Always provide helpful placeholders:
```typescript
<div className="text-center py-12">
  <div className="text-6xl mb-4">🌱</div>
  <p className="text-gray-600">No plants yet</p>
  <p className="text-sm text-gray-500 mt-2">Helpful context here</p>
</div>
```

---

## 🔐 Security Model

### Environment Variables

```bash
# Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Server-only (never exposed)
SUPABASE_SERVICE_ROLE_KEY=...
CRON_SECRET=...
```

### API Route Protection

```typescript
// app/api/sync-plants/route.ts
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Why:** Prevent unauthorized sync job triggers

---

## 🚀 Development Workflow

### Commands

```bash
npm run dev            # Start dev server (Turbopack)
npm run build          # Production build
npm run type-check     # TypeScript validation
npm run lint           # ESLint
npm run format         # Prettier auto-fix
npm run test:connection # Test Supabase connection
```

### Testing with Test Data

**Current test plants:**
- `test-monstera-001`
- `test-pothos-001`
- `test-snake-plant-001`

**Test photos added via SQL:**
- Uses Unsplash URLs for visual testing
- 3 photos on Monstera (Jan, Dec, Oct 2024/2025)

**To add more test data:**
```bash
# Run SQL from supabase/test-data.sql in Supabase dashboard
```

### Image Configuration

**Allowed domains in `next.config.ts`:**
- `images.unsplash.com` (test photos)
- `*.supabase.co/storage/v1/object/public/**` (real photos)

**Important:** Restart dev server after config changes!

---

## 🎯 Phase 4: Sync Job Implementation

### Overview

Build the sync job that:
1. Fetches plants from Planta API
2. Downloads photos from Planta
3. Uploads to Supabase Storage
4. Updates database
5. Logs results

### What Needs to Be Built

#### 1. Token Management (`lib/planta/tokens.ts`)

```typescript
- getTokens(): Get from Supabase
- needsRefresh(expiresAt): Check if expires within 5 min
- refreshTokens(refreshToken): Call Planta API
- getValidAccessToken(): Main function (auto-refreshes)
```

#### 2. Planta API Client (`lib/planta/client.ts`)

```typescript
- fetchAllPlants(): Get all plants (handles pagination)
- fetchPlant(id): Get single plant details
```

**Key:** Handle cursor-based pagination (50 plants per page)

#### 3. Image Transfer (`lib/planta/images.ts`)

```typescript
- downloadImage(url): Fetch from Planta
- uploadToStorage(plantId, buffer): Upload to Supabase
- transferImage(plantId, url): Download → Upload
```

**Path pattern:** `{plantId}/{Date.now()}.jpg`

#### 4. Sync Logic (`lib/planta/sync.ts`)

```typescript
- syncPlants(): Main sync function
- syncSinglePlant(): Process one plant
- logSyncResult(): Write to sync_logs
```

**Logic:**
```
For each plant:
  1. Upsert plant metadata (always)
  2. Check if photo changed (timestamp comparison)
  3. If changed: transfer photo, insert photo record
  4. Update last_synced_at
```

#### 5. API Route (`app/api/sync-plants/route.ts`)

Update the placeholder to:
```typescript
- Verify CRON_SECRET
- Call syncPlants()
- Return result JSON
- Handle errors gracefully
```

### Authentication Setup (One-Time Manual)

**Before coding, need to:**
1. Go to https://getplanta.com/apps
2. Create new app
3. Get OTP code (valid 15 min!)
4. Exchange for tokens via POST /v1/auth/authorize
5. Store in Supabase tokens table

**Reference:** `docs/authentication-setup.md` (already in project)

### Planta API Reference

**Base URL:** `https://public.planta-api.com`

**Endpoints:**
- `POST /v1/auth/authorize` - Exchange OTP
- `POST /v1/auth/refreshToken` - Refresh tokens
- `GET /v1/addedPlants` - List plants (paginated)
- `GET /v1/addedPlants/{id}` - Plant details

**Auth:** `Authorization: Bearer {access_token}`

**Response structure:** See `docs/planta-app-api-schemas.md`

### Field Mapping

```typescript
Planta API → Supabase
─────────────────────
data.id → id
data.names.custom → customName
data.names.localizedName → commonName
data.names.scientific → scientificName
data.site.name → location
data.image.url → [download, upload, get public URL]
data.image.lastUpdated → planta_image_updated_at (for change detection)
data.image.lastUpdated → date (in photos table)
```

---

## ⚠️ Important Gotchas & Notes

### 1. Token Row ID

The `tokens` table should have exactly **one row**. You'll need its UUID for updates.

**Get it:**
```sql
SELECT id FROM tokens;
```

**Use it:**
```typescript
.eq("id", "uuid-from-above")
```

### 2. Image Domain Configuration

**Must restart dev server** after adding new image domains to `next.config.ts`

### 3. Timestamp Comparison

**Compare as strings OR convert to timestamps:**
```typescript
// Safe comparison
existingTimestamp !== plantaTimestamp

// Or
new Date(existing).getTime() !== new Date(planta).getTime()
```

### 4. Photo Change Detection

**Only sync photo if:**
- Plant has no photos yet (first sync) OR
- `planta_image_updated_at` differs from `image.lastUpdated`

**Don't compare URLs** - they might change even if photo hasn't

### 5. Error Handling Philosophy

**Individual plant failures should NOT stop sync:**
```typescript
for (const plant of plants) {
  try {
    await syncPlant(plant);
  } catch (error) {
    errors.push({ plantId: plant.id, error });
    // Continue to next plant!
  }
}
```

### 6. Date Formatting

**Spec requires:** "Jan 15, 2025"

**Implementation:**
```typescript
new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(date)
```

Already implemented in `PhotoTimeline.tsx`

---

## 🧪 Testing Strategy for Phase 4

### Incremental Testing Approach

```
1. Test token management
   - Get tokens from DB
   - Check expiration logic
   - Test refresh (might need to wait for expiry)

2. Test API client
   - Fetch plants, log count
   - Check pagination (if > 50 plants)

3. Test image transfer
   - Download ONE image
   - Upload to Storage
   - Verify public URL works

4. Test single plant sync
   - Sync just one plant
   - Check DB for upsert
   - Verify photo inserted if changed

5. Test full sync
   - Run complete sync
   - Check sync_logs table
   - Verify all plants updated

6. Test error scenarios
   - Invalid auth (should reject)
   - Network failures (should log, continue)
   - Partial failures (should mark 'partial')
```

### Manual Testing

**Trigger sync:**
```bash
# In browser or curl
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/sync-plants
```

**Check results:**
```sql
-- See latest sync
SELECT * FROM sync_logs ORDER BY synced_at DESC LIMIT 1;

-- Count plants
SELECT COUNT(*) FROM plants;

-- Count photos
SELECT COUNT(*) FROM photos;

-- Check errors
SELECT errors FROM sync_logs WHERE errors IS NOT NULL;
```

---

## 📚 Key Reference Documents

### In This Project

- `docs/plantfolio-mvp-spec.md` - Complete feature spec
- `docs/authentication-setup.md` - Planta auth guide (with curl examples)
- `docs/planta-app-api-schemas.md` - API response structures
- `docs/SUPABASE_SETUP.md` - Database setup guide
- `PROJECT_STRUCTURE.md` - Architecture decisions
- `supabase/README.md` - SQL query examples
- `SETUP_CHECKLIST.md` - Progress tracker

### External

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Planta API Portal](https://getplanta.com/apps)

---

## 🎨 Code Style & Patterns

### TypeScript

- Strict mode enabled
- Explicit types on function parameters
- Props types defined as separate `type` (not inline)
- Use `import type` for type-only imports

### Component Structure

```typescript
import statements
↓
Type definitions
↓
JSDoc comment
↓
Component function
↓
Early returns (errors, empty states)
↓
Main return (happy path)
```

### Naming Conventions

- **Components:** PascalCase (PlantCard.tsx)
- **Files:** PascalCase for components, lowercase for utils
- **Functions:** camelCase
- **Types:** PascalCase
- **Database fields:** camelCase (but with quotes in SQL)

### Error Messages

Always be helpful:
```typescript
// ❌ Bad
error: "Failed"

// ✅ Good
error: "Failed to sync plant abc123: Network timeout. Will retry on next sync."
```

---

## 🚦 Definition of Done for Phase 4

Phase 4 is complete when:

- [ ] Can authenticate with Planta API
- [ ] Tokens auto-refresh before expiry
- [ ] Sync job fetches all plants
- [ ] Photos download and upload to Storage
- [ ] Database updates correctly
- [ ] Sync logs track results
- [ ] Individual failures don't crash sync
- [ ] Can trigger manually via API route
- [ ] Test plants removed, real plants visible
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code committed and pushed

---

## 💡 Implementation Tips

### Start Small, Build Up

```
1. Token management (no API calls yet)
   Test: Can get tokens, check expiration

2. API client (just fetch, don't process)
   Test: Can list plants, see data structure

3. Single plant sync (one plant only)
   Test: Can sync one plant end-to-end

4. Full sync (all plants)
   Test: Can sync entire collection

5. Error handling (make it robust)
   Test: Still works when things fail
```

### Debugging Helpers

```typescript
// Add throughout sync logic
console.log(`📥 Fetched ${plants.length} plants`);
console.log(`✅ Synced plant ${plantId}`);
console.log(`📸 Downloaded photo for ${plantId}`);
console.log(`⏭️  Skipped ${plantId} (no changes)`);
console.error(`❌ Failed ${plantId}:`, error);
```

### Time Estimates

- Token management: ~30 min
- API client: ~45 min  
- Image transfer: ~60 min
- Sync logic: ~90 min
- Testing & debugging: ~60 min
- **Total: 4-5 hours**

Can be done in one session or split across multiple days.

---

## 🎯 Success Metrics

After Phase 4, you should be able to:

1. Visit app → see YOUR real plants
2. Click plant → see YOUR real photos
3. Check sync_logs → see successful sync records
4. Wait a day → new photos appear automatically (after Vercel deploy)

---

## 🤝 Handoff Checklist

Before continuing:

- [ ] Review this entire document
- [ ] Check `docs/plantfolio-mvp-spec.md` section on Sync (lines 236-259)
- [ ] Read `docs/authentication-setup.md` for Planta auth steps
- [ ] Confirm you have Planta app subscription (needed for API access)
- [ ] Verify dev server is running (`npm run dev`)
- [ ] Confirm test data is working (can see plants with photos)
- [ ] Review the sync job breakdown in chat history

---

## 💬 Context for New Chat

**Where we are:**
- Frontend is 100% complete and working beautifully
- Database is set up and tested
- Test data shows the UI works perfectly
- Ready to build the backend sync job

**What we're building next:**
- Token management for Planta API
- API client to fetch plants
- Image download/upload pipeline
- Complete sync logic with error handling
- Testing and deployment prep

**Approach established:**
- Build incrementally (test each piece)
- Commit frequently (after each working feature)
- Ask questions if unclear (don't assume)
- Follow patterns already established in codebase

**User preferences:**
- Wants detailed explanations of "why"
- Appreciates step-by-step breakdowns before implementation
- Values best practices and learning
- Comfortable with technical complexity
- Wants to understand architectural decisions

---

## 🚀 Next Steps (Immediate Actions)

1. **Review this handoff document thoroughly**
2. **Read sync job requirements** in spec (lines 236-259)
3. **Read Planta auth guide** (`docs/authentication-setup.md`)
4. **Prepare to authenticate** with Planta (one-time setup)
5. **Start coding** token management utilities

---

## 📞 Questions to Ask When Resuming

If picking up this project in a new chat:

1. "Have you completed the Planta API authentication setup yet?"
2. "Do you have your OTP code ready, or do we need to get one?"
3. "Should we start with token management or would you like to review the architecture first?"
4. "Are there any questions about the handoff document or the approach?"

---

**Document Version:** 1.0  
**Last Updated:** October 4, 2025  
**Created By:** AI Assistant (Claude)  
**For:** Linda Allen  
**Project:** Plantfolio MVP

---

Good luck with Phase 4! The foundation is solid, the pattern is clear, and the sync job will bring it all together. You've got this! 🌱✨
