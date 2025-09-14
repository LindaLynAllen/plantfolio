# Plantfolio 🌱

A minimalist portfolio site for plant photography built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with clean, modern typography
- **Plant Gallery**: Grid layout showcasing plant thumbnails
- **Plant Details**: Individual pages with comprehensive plant information
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **App Router**: Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── plant/[id]/        # Dynamic plant detail pages
│   ├── layout.tsx         # Root layout with navbar
│   └── page.tsx           # Home page with plant grid
├── components/
│   ├── layout/            # Layout components
│   │   └── navbar.tsx     # Navigation bar
│   ├── plant/             # Plant-specific components
│   │   └── plant-card.tsx # Plant card for grid display
│   └── ui/                # shadcn/ui components
├── data/
│   └── plants.ts          # Sample plant data
├── types/
│   └── plant.ts           # TypeScript type definitions
└── lib/
    └── utils.ts           # Utility functions
```

## Pages

- **Home (`/`)**: Displays a responsive grid of plant thumbnails
- **Plant Detail (`/plant/[id]`)**: Dynamic route for individual plant information

## Customization

### Adding New Plants

1. Update the `Plant` interface in `src/types/plant.ts` if needed
2. Add new plant data to `src/data/plants.ts`
3. The grid and detail pages will automatically include the new plants

### Styling

- Global styles are in `src/app/globals.css`
- Component-specific styles use Tailwind CSS classes
- shadcn/ui theme can be customized in `components.json`

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

The app is fully static and will work perfectly on Vercel's edge network.

## Development

- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Start**: `npm start`

## License

MIT License - feel free to use this project as a starting point for your own portfolio!
