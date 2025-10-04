# Environment Variables Template

Copy this to `.env.local` and fill in your actual values:

```bash
# Supabase Configuration
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (for API routes only - keep secret!)
# Get this from Supabase project settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cron Job Security
# Generate a random string for cron job authentication
# Example: openssl rand -base64 32
CRON_SECRET=your-random-secret-here

# Node Environment
NODE_ENV=development
```

## Setup Instructions

1. Copy the above into a new file named `.env.local` in the project root
2. Fill in your Supabase credentials from your project dashboard
3. Generate a secure random string for `CRON_SECRET`
4. Never commit `.env.local` to version control (already in .gitignore)
