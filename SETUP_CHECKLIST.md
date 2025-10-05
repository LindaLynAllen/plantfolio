# 🚀 Plantfolio Setup Checklist

Use this checklist to track your progress setting up the Plantfolio application.

## Phase 1: Supabase Setup

### ☐ Create Supabase Project

- [x] Go to [app.supabase.com](https://app.supabase.com)
- [x] Create new project named "plantfolio"
- [x] Save database password securely
- [x] Wait for project to finish provisioning

### ☐ Run Database Migration

- [x] Open SQL Editor in Supabase dashboard
- [x] Copy contents of `supabase/migrations/001_initial_schema.sql`
- [x] Paste and run in SQL Editor
- [x] Verify 4 tables created: `plants`, `photos`, `tokens`, `sync_logs`

**📖 Detailed guide:** [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

### ☐ Create Storage Bucket

- [x] Go to Storage section in Supabase
- [x] Create bucket named `plant-photos`
- [x] Set to **Public**
- [x] Verify bucket appears in list

### ☐ Get API Credentials

- [x] Go to Settings → API in Supabase
- [x] Copy Project URL
- [x] Copy anon public key
- [x] Copy service_role key (keep secret!)

### ☐ Configure Environment Variables

- [x] Create `.env.local` file in project root
- [x] Add `NEXT_PUBLIC_SUPABASE_URL` (your Project URL)
- [x] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your anon key)
- [x] Add `SUPABASE_SERVICE_ROLE_KEY` (your service role key)
- [x] Generate and add `CRON_SECRET` (run: `openssl rand -base64 32`)
- [x] Verify `.env.local` is in `.gitignore`

### ☐ Test Connection

- [x] Run: `npm run test:connection`
- [x] Verify all tests pass ✅
- [x] All 4 tables should exist
- [x] Public data access working

**✨ If all tests pass, you're ready for Phase 2!**

---

## Phase 2: Build Home Page (Next Steps)

### ☐ Create Plant Card Component

- [x] Design thumbnail display
- [x] Show plant name with fallback logic
- [x] Add hover states

### ☐ Build Plant Gallery

- [x] Create grid layout (5+ columns on desktop)
- [x] Fetch plants from Supabase
- [x] Display loading state
- [x] Handle empty state

### ☐ Add Navigation

- [x] Create navbar with logo and title
- [x] Add footer with contact links
- [x] Make responsive

---

## Phase 3: Build Plant Detail Page

### ☐ Dynamic Route Setup

- [x] Fetch single plant by ID
- [x] Handle 404 for missing plants
- [x] Display plant metadata

### ☐ Photo Timeline

- [x] Display all photos newest first
- [x] Format dates properly
- [x] Handle "no photos" state

### ☐ Lightbox Integration

- [x] Set up yet-another-react-lightbox
- [x] Add click handlers
- [x] Enable arrow navigation

---

## Phase 4: Sync Job Implementation

### ☐ Planta API Authentication

- [x] Create app in Planta portal
- [x] Get OTP code
- [x] Exchange for tokens
- [x] Store in Supabase tokens table

**📖 Detailed guide:** [`docs/authentication-setup.md`](docs/authentication-setup.md)

### ☐ Build Sync Logic

- [ ] Implement token refresh
- [ ] Fetch plants from Planta API
- [ ] Handle pagination
- [ ] Compare timestamps

### ☐ Photo Sync

- [ ] Download images from Planta
- [ ] Upload to Supabase Storage
- [ ] Create photo records
- [ ] Update plant metadata

### ☐ Error Handling

- [ ] Log errors to sync_logs
- [ ] Handle individual plant failures
- [ ] Graceful exit on token failure

---

## Phase 5: Polish & Deploy

### ☐ Styling & UX

- [ ] Responsive on mobile/tablet/desktop
= [ ] Revisit and finetune the styling
- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Accessibility audit (WCAG AA)

### ☐ Performance

- [ ] Optimize images with Next.js Image
- [ ] Check Core Web Vitals
- [ ] Add meta tags for SEO

### ☐ Deploy to Vercel

- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Test cron job
- [ ] Verify production deployment

---

## 🎯 Current Status

**✅ Completed:**

- Project initialized with Next.js 15, TypeScript, Tailwind
- File structure and architecture set up
- Type definitions created
- Supabase migration scripts ready
- Test utilities created
- Committed to GitHub
- **Supabase fully configured and tested**

**➡️ You are here:** Ready to build the home page!

**🔜 Next:** Create plant gallery and display components

---

## 📚 Quick Reference

| Document                                                       | Purpose                        |
| -------------------------------------------------------------- | ------------------------------ |
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)             | Step-by-step Supabase setup    |
| [`docs/plantfolio-mvp-spec.md`](docs/plantfolio-mvp-spec.md)   | Complete feature specification |
| [`docs/authentication-setup.md`](docs/authentication-setup.md) | Planta API authentication      |
| [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)                 | Architecture decisions         |
| [`supabase/README.md`](supabase/README.md)                     | Database reference             |

## 🆘 Getting Help

- **Connection issues?** Run `npm run test:connection` for diagnostics
- **SQL errors?** Check `supabase/README.md` for common queries
- **Architecture questions?** See `PROJECT_STRUCTURE.md`
- **Feature requirements?** Reference `docs/plantfolio-mvp-spec.md`

---

**Ready to build?** You've got a solid foundation - let's create the home page! 🚀
