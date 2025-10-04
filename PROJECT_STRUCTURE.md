# Plantfolio Project Structure Guide

This document explains the file structure and architectural decisions for the Plantfolio application.

## 📁 Directory Structure Overview

```
plantfolio/
├── app/                      # Next.js App Router (pages and API routes)
│   ├── api/                  # API route handlers
│   │   └── sync-plants/      # Cron job endpoint for syncing Planta data
│   │       └── route.ts
│   ├── plants/               # Plant detail pages
│   │   └── [id]/             # Dynamic route for individual plants
│   │       └── page.tsx
│   ├── layout.tsx            # Root layout (wraps all pages)
│   ├── page.tsx              # Home page (plant gallery)
│   ├── globals.css           # Global styles and Tailwind imports
│   └── favicon.ico
│
├── components/               # Reusable React components
│   └── .gitkeep              # Placeholder (components added as needed)
│
├── lib/                      # Utility functions and configurations
│   └── supabase/             # Supabase client configurations
│       ├── client.ts         # Public client (anon key)
│       └── server.ts         # Admin client (service role key)
│
├── types/                    # TypeScript type definitions
│   ├── database.ts           # Database schema types
│   └── index.ts              # Re-exports and utility functions
│
├── docs/                     # Project documentation
│   └── plantfolio-mvp-spec.md
│
├── public/                   # Static assets (served from root)
│   └── *.svg                 # Next.js default icons
│
├── .prettierrc               # Prettier configuration
├── .prettierignore           # Files to ignore in formatting
├── ENV_TEMPLATE.md           # Environment variables template
├── vercel.json               # Vercel deployment config (cron jobs)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration
└── package.json              # Dependencies and scripts
```

## 🎯 Key Architectural Decisions

### 1. App Router (`app/` directory)

**Why:** Next.js 15 uses the App Router as the modern, recommended approach. Benefits include:

- **Server Components by default**: Better performance, smaller bundle size
- **Colocation**: Routes, layouts, and loading states live together
- **Streaming & Suspense**: Built-in support for progressive loading
- **Nested layouts**: Share UI across route segments

**Structure:**

- `app/page.tsx` → Home page at `/`
- `app/plants/[id]/page.tsx` → Dynamic plant detail at `/plants/:id`
- `app/api/sync-plants/route.ts` → API endpoint at `/api/sync-plants`
- `app/layout.tsx` → Root layout wrapping all pages

### 2. Supabase Client Configuration (`lib/supabase/`)

**Why two separate clients?**

#### `lib/supabase/client.ts` (Public Client)

- **Purpose**: Frontend data access for public read operations
- **Uses**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (exposed to browser)
- **Security**: Row Level Security (RLS) enforces what data is accessible
- **Used in**:
  - Server Components (Home page, Plant detail page)
  - Client Components (if needed for public data)

#### `lib/supabase/server.ts` (Admin Client)

- **Purpose**: Server-side operations requiring elevated privileges
- **Uses**: `SUPABASE_SERVICE_ROLE_KEY` (never exposed to browser)
- **Security**: Bypasses RLS, has full database access
- **Used in**:
  - API routes (`/api/sync-plants`)
  - Operations on protected tables (`tokens`, `sync_logs`)
  - Write operations during sync

**Key Principle**: Never import `server.ts` in client-side code. Only use in API routes and server actions.

### 3. Type Definitions (`types/`)

**Why separate type files?**

- **Type Safety**: Compile-time checks prevent runtime errors
- **Documentation**: Types serve as inline documentation
- **DRY Principle**: Single source of truth for data structures
- **IDE Support**: Better autocomplete and IntelliSense

**Structure:**

- `database.ts`: Core database schema types matching Supabase tables
- `index.ts`: Helper functions and re-exports for convenient imports

**Usage:**

```typescript
import { Plant, PlantWithPhotos, getPlantDisplayName } from "@/types";
```

### 4. Components Organization (`components/`)

**Why at root level?**

- **Reusability**: Components used across multiple routes
- **Clear separation**: UI components separate from route logic
- **Path aliases**: Import as `@/components/ComponentName`

**Future structure (to be added as needed):**

```
components/
├── ui/              # Base UI components (buttons, cards, etc.)
├── PlantCard.tsx    # Gallery thumbnail card
├── PlantGallery.tsx # Grid layout container
├── PhotoLightbox.tsx # Lightbox wrapper component
└── Footer.tsx       # Shared footer component
```

### 5. API Routes (`app/api/`)

**Why in `app/api/`?**

- **Serverless functions**: Each route is a separate serverless function
- **Backend operations**: Server-side logic not exposed to client
- **Cron jobs**: Vercel can call these endpoints on schedule

**Current routes:**

- `sync-plants/route.ts`: Nightly sync job (called by Vercel Cron)

**Security pattern:**

```typescript
// Verify requests come from Vercel Cron
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### 6. Configuration Files

#### `vercel.json`

- **Purpose**: Configure Vercel-specific features
- **Current use**: Schedule cron job to run sync at 2 AM UTC daily
- **Format**: `"0 2 * * *"` (standard cron expression)

#### `tsconfig.json`

- **Path aliases**: `@/*` maps to project root for clean imports
- **Example**: `import { supabase } from "@/lib/supabase/client"`

#### `.prettierrc`

- **Consistency**: Automatic code formatting
- **Tailwind plugin**: Sorts Tailwind classes in recommended order
- **Team benefit**: Prevents style debates, ensures uniformity

## 🔄 Data Flow Architecture

### Frontend (Read Operations)

```
Server Component → supabase (public client) → Supabase Database
                   ↓
                Render with data
```

### Backend (Sync Operations)

```
Vercel Cron → /api/sync-plants → supabaseAdmin (service role)
                                    ↓
                                 Supabase Database
                                    ↓
                                 Planta API
```

## 📦 Dependencies Explained

### Production Dependencies

- **`next`**: Framework (v15+)
- **`react` & `react-dom`**: UI library
- **`@supabase/supabase-js`**: Database and storage client
- **`yet-another-react-lightbox`**: Photo viewer with navigation
- **`tailwindcss`**: Utility-first CSS framework

### Dev Dependencies

- **`typescript`**: Type safety and better DX
- **`@types/*`**: Type definitions for JavaScript libraries
- **`eslint` & `eslint-config-next`**: Code quality and consistency
- **`prettier` & `prettier-plugin-tailwindcss`**: Code formatting

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `ENV_TEMPLATE.md` instructions to create `.env.local`
   - Fill in Supabase credentials and `CRON_SECRET`

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Type checking**:

   ```bash
   npm run type-check
   ```

5. **Format code**:
   ```bash
   npm run format
   ```

## 🎨 Styling Approach

**Tailwind CSS + Utility-First**

- **Why**: Rapid development, consistent design system, small bundle size
- **Pattern**: Compose styles with utility classes directly in JSX
- **Responsive**: Mobile-first breakpoints (`sm:`, `md:`, `lg:`, etc.)
- **Example**:
  ```tsx
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
    {/* Plant cards */}
  </div>
  ```

## 🔒 Security Patterns

### Environment Variables

- **`NEXT_PUBLIC_*`**: Exposed to browser (safe for public data)
- **No prefix**: Server-only (never sent to browser)
- **Never commit**: `.env.local` is in `.gitignore`

### RLS (Row Level Security)

- **Public tables**: `plants`, `photos` (read-only for anon users)
- **Private tables**: `tokens`, `sync_logs` (no anon access)
- **Pattern**: Security enforced at database level, not application level

### API Route Authentication

- **Cron jobs**: Verify `CRON_SECRET` in authorization header
- **Future auth**: Can add user authentication with Supabase Auth if needed

## 📝 Next Steps

With this foundation in place, you're ready to implement features:

1. **Home page**: Plant gallery with thumbnails
2. **Plant detail page**: Full photo timeline
3. **Sync job**: Planta API integration
4. **Components**: Reusable UI components
5. **Error handling**: Graceful fallbacks and loading states

Each feature can be built incrementally, with types and structure already defined.

---

**Questions or unclear patterns?** Refer back to `docs/plantfolio-mvp-spec.md` for feature requirements and business logic.
