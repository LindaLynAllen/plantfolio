# Supabase Database Files

This directory contains database migrations and utilities for the Plantfolio Supabase backend.

## 📁 Directory Structure

```
supabase/
├── migrations/
│   └── 001_initial_schema.sql    # Creates all tables, indexes, and RLS policies
└── README.md                      # This file
```

## 🚀 Quick Start

### Initial Setup

1. **Create Supabase project** at [app.supabase.com](https://app.supabase.com)

2. **Run the migration:**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `migrations/001_initial_schema.sql`
   - Paste and run

3. **Create storage bucket:**
   - Name: `plant-photos`
   - Type: Public

4. **Configure environment variables:**
   - Copy credentials from Supabase Settings → API
   - Add to `.env.local` (see `ENV_TEMPLATE.md`)

5. **Test connection:**
   ```bash
   npm run test:connection
   ```

📖 **For detailed instructions, see:** [`docs/SUPABASE_SETUP.md`](../docs/SUPABASE_SETUP.md)

---

## 📊 Database Schema

### Tables

| Table       | Purpose                        | Public Access        |
| ----------- | ------------------------------ | -------------------- |
| `plants`    | Plant metadata from Planta API | ✅ Read only         |
| `photos`    | Plant photo timeline           | ✅ Read only         |
| `tokens`    | Planta API auth tokens         | ❌ Service role only |
| `sync_logs` | Sync job execution logs        | ❌ Service role only |

### Storage

| Bucket         | Type   | Path Structure              |
| -------------- | ------ | --------------------------- |
| `plant-photos` | Public | `{plantId}/{timestamp}.jpg` |

---

## 🛠️ Useful SQL Queries

### View All Plants

```sql
SELECT id, "customName", "commonName", "scientificName", location
FROM plants
ORDER BY "commonName";
```

### View Photos for a Plant

```sql
SELECT url, date, source, created_at
FROM photos
WHERE "plantId" = 'your-plant-id'
ORDER BY date DESC;
```

### Check Recent Syncs

```sql
SELECT synced_at, status, plants_checked, photos_added, duration_ms
FROM sync_logs
ORDER BY synced_at DESC
LIMIT 10;
```

### Add Test Plant

```sql
INSERT INTO plants (id, "customName", "commonName", "scientificName", location)
VALUES (
  'test-1',
  'My Test Plant',
  'Monstera',
  'Monstera deliciosa',
  'Living Room'
);
```

### Update Planta API Tokens

```sql
UPDATE tokens
SET
  access_token = 'your-new-access-token',
  refresh_token = 'your-new-refresh-token',
  expires_at = NOW() + INTERVAL '1 hour',
  updated_at = NOW();
```

### View Storage Usage

```sql
-- Run in Supabase SQL Editor
SELECT
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint / 1024 / 1024 as total_mb
FROM storage.objects
GROUP BY bucket_id;
```

---

## 🔒 Security Notes

### Row Level Security (RLS)

All tables have RLS enabled. Policies:

- **plants & photos:** Public read access (for website visitors)
- **tokens & sync_logs:** No public access (admin/API only)

### Service Role Key

The service role key bypasses RLS and should ONLY be used:

- ✅ In API routes (`/api/sync-plants`)
- ✅ In server-side operations
- ❌ NEVER in client-side code
- ❌ NEVER committed to git

---

## 🔄 Future Migrations

When you need to modify the schema:

1. **Create new migration file:**

   ```
   supabase/migrations/002_description.sql
   ```

2. **Name format:** `[number]_[description].sql`
   - Use sequential numbers
   - Use descriptive names

3. **Best practices:**
   - Always use `IF NOT EXISTS` for safety
   - Include rollback instructions in comments
   - Test on a separate Supabase project first

---

## 🐛 Troubleshooting

### Migration fails with "already exists" error

- Tables may already exist from previous run
- Safe to ignore if schema matches
- Use `DROP TABLE IF EXISTS` for clean slate (⚠️ deletes data!)

### RLS blocking queries

- Use service role key for admin operations
- Check policies in Supabase dashboard: Authentication → Policies

### Storage bucket not found

- Verify bucket name: `plant-photos` (with hyphen)
- Check bucket is set to public
- May need to manually create via dashboard

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

**Questions?** See the main project docs in [`docs/`](../docs/) directory.
