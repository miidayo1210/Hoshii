# Hoshii - Joyful Actions

A minimal, joyful web app for tracking positive actions and earning points through community engagement, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Pages
- **/today** - Today's suggested actions with 1-tap completion
- **/events** - Event list with join and complete functionality
- **/events/new** - Create new events with 5-field form
- **/events/[id]** - Event detail page with join → complete → points flow
- **/redeem** - Points wallet with redemption catalog and exchange flow
- **/me** - User profile with activity history
- **/a/[actionId]** - Action detail page
- **/org/demo** - Organization dashboard
- **/org/demo/overview** - Company-wide analytics with domain heatmap and monthly trends

### Data Models
- **User** - with points tracking
- **Action** - with domain categories and point values
- **ActionLog** - tracks completed actions and points awarded
- **Event** - community events with time, place, and rewards
- **EventParticipation** - tracks user event participation
- **RedeemItem** - rewards catalog
- **Redemption** - redemption history

### Components
- **NavBar** - Bottom navigation with Today/Events/Me/Redeem/Org tabs
- **ActionCard** - Display action with complete button
- **EventCard** - Display event with join/complete actions
- **PointsWallet** - Beautiful gradient card showing user points
- **RedeemCatalog** - Grid of redeemable items
- **DomainHeatmap** - Visual breakdown of activity by domain
- **ThanksModal** - Celebratory modal with templates (society/environment/peer)

### Features
- ✅ PWA enabled (works offline, installable)
- ✅ localStorage-based data layer (swappable)
- ✅ Points computation and tracking
- ✅ Domain breakdown (health, environment, community, learning, wellbeing)
- ✅ Thanks message templates based on action domain
- ✅ Accessibility with keyboard navigation
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI with shadcn/ui components

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **lucide-react** - Icons
- **next-pwa** - PWA support

## Data Layer

The app uses a swappable data layer architecture (`lib/data.ts`). Currently implemented with localStorage, but can be easily swapped for:
- REST API
- GraphQL
- Firebase
- Supabase
- Any other backend

All data operations go through the `DataLayer` interface, making it easy to change the implementation without touching the UI code.

## Domains

Actions and events are categorized into 5 domains:
- 🏃 **Health** - Physical wellness activities
- 🌍 **Environment** - Eco-friendly actions
- 👥 **Community** - Social engagement
- 📚 **Learning** - Educational activities
- 🧘 **Wellbeing** - Mental health and mindfulness

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- Semantic HTML

## License

MIT


