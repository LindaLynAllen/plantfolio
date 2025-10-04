# 🌿 Plantfolio

A modern web application to showcase my personal collection of 50+ house plants with photo timelines and rich metadata. Built with Next.js 15, TypeScript, and Supabase.

## 📋 Project Overview

Plantfolio is both a personal plant collection showcase and a portfolio project demonstrating modern full-stack development practices. The app automatically syncs plant data and photos from the Planta API nightly, building a historical timeline of each plant's growth over time.

### Key Features

- **Plant Gallery**: Grid display of all plants with thumbnails and names
- **Plant Details**: Individual pages with full photo timelines and metadata
- **Automatic Sync**: Nightly sync job pulls new photos from Planta API
- **Photo Timelines**: Track plant growth over time with dated photos
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Lightbox Viewer**: Full-screen photo viewing with arrow navigation

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Storage)
- **Hosting**: [Vercel](https://vercel.com/)
- **Data Source**: Planta API
- **Photo Viewer**: [yet-another-react-lightbox](https://www.npmjs.com/package/yet-another-react-lightbox)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account and project
- Planta API access (via Planta app)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd plantfolio
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the project root (see `ENV_TEMPLATE.md` for details):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CRON_SECRET=your-random-secret
   ```

4. **Set up Supabase database**:

   Run the SQL migrations in `docs/` to create tables and configure RLS policies
   (Instructions coming soon)

5. **Run the development server**:

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation on:

- Directory organization and rationale
- Architectural decisions
- Data flow patterns
- Security configurations
- Component organization

Quick overview:

```
plantfolio/
├── app/              # Next.js App Router (pages and API routes)
├── components/       # Reusable React components
├── lib/              # Utilities and Supabase clients
├── types/            # TypeScript type definitions
├── docs/             # Project documentation
└── public/           # Static assets
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run type-check   # Check TypeScript types
```

### Code Quality

The project uses:

- **ESLint**: Code quality and best practices
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and better DX

Run all checks before committing:

```bash
npm run type-check && npm run lint && npm run format:check
```

## 🗄️ Database Schema

The app uses Supabase with the following tables:

- **plants**: Plant metadata (names, location, sync timestamps)
- **photos**: Photo records with URLs and dates
- **tokens**: Planta API authentication tokens
- **sync_logs**: Sync job execution logs

See `types/database.ts` for TypeScript type definitions.

## 🔐 Security

- **Environment Variables**: Secrets stored securely, never committed
- **RLS Policies**: Database-level security with Supabase Row Level Security
- **API Authentication**: Cron jobs protected with `CRON_SECRET`
- **Token Management**: Automatic refresh with secure server-side storage

## 📖 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture and organization
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Environment variable setup
- [docs/plantfolio-mvp-spec.md](./docs/plantfolio-mvp-spec.md) - Complete MVP specification

## 🚧 Development Status

**Current Phase**: Initial setup and infrastructure ✅

**Next Steps**:

1. [ ] Implement home page plant gallery
2. [ ] Create plant detail page with photo timeline
3. [ ] Build sync job with Planta API integration
4. [ ] Add photo lightbox component
5. [ ] Deploy to Vercel

See `docs/plantfolio-mvp-spec.md` for full feature roadmap.

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Feel free to open an issue if you spot bugs or have ideas for improvements.

## 📄 License

Private project - All rights reserved.

## 🙏 Acknowledgments

- Built with guidance from Claude (Anthropic)
- Plant data powered by [Planta](https://getplanta.com/)
- Inspired by the joy of houseplants 🌱

---

**Made with ❤️ by Linda**
