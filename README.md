# Hoshii - Joyful Actions

A minimal, joyful web app for tracking positive actions and earning points through community engagement, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Business Module (Hoshii for Business)
- **/today** - Today's suggested actions with 1-tap completion
- **/events** - Event list with join and complete functionality
- **/events/new** - Create new events with 5-field form
- **/events/[id]** - Event detail page with join → complete → points flow
- **/redeem** - Points wallet with redemption catalog and exchange flow
- **/me** - User profile with activity history
- **/a/[actionId]** - Action detail page
- **/org/demo** - Organization dashboard
- **/org/demo/overview** - Company-wide analytics with domain heatmap and monthly trends

### Community Module (Hoshii for Community) - Pinterest Style
- **/community/home** - Pinterest-like feed with personal/community tabs
- **/community/discover** - Explore with search and filters (tags/area/type)
- **/community/create** - Creation wizard (Action Card, Package, Event)
- **/community/notifications** - Real-time updates and notifications
- **/community/action/[id]** - Action detail with star functionality
- **/community/board/[id]** - Community board page with pins grid
- **/community/profile/[id]** - User profile with constellation
- **/community/dashboard** - Community organizations dashboard
- **/community/dashboard/create** - Create new community organization
- **/community/org/[orgId]** - Organization management page with places and events
- **/community/org/[orgId]/events/[eventId]** - Event detail with QR code and progress tracking
- **/community/scan/[publicId]** - Public QR scan page for anonymous participation

### Data Models
- **User** - with points tracking
- **Organization** - with product type (business/community)
- **Place** - locations for community events
- **Action** - with domain categories and point values
- **ActionLog** - tracks completed actions and points awarded
- **ActionPackage** - collections of actions for community events
- **Event** - community events with time, place, rewards, and public_id for QR codes
- **EventParticipation** - tracks user event participation
- **RedeemItem** - rewards catalog
- **Redemption** - redemption history
- **Community** - Pinterest-style communities with cover images and tags
- **Star** - user stars on actions (like Pinterest pins)
- **Profile** - user profiles with total stars and constellation data
- **Comment** - optional comments on actions

### Components
- **NavBar** - Bottom navigation with Today/Events/Me/Redeem/Org tabs
- **ActionCard** - Display action with complete button
- **EventCard** - Display event with join/complete actions
- **PointsWallet** - Beautiful gradient card showing user points
- **RedeemCatalog** - Grid of redeemable items
- **DomainHeatmap** - Visual breakdown of activity by domain
- **ThanksModal** - Celebratory modal with templates (society/environment/peer)
- **QRPreview** - QR code display and sharing component
- **ProgressBar** - Progress tracking components (linear, circular, multi-step)
- **MasonryGrid** - Pinterest-style masonry layout for cards
- **CommunityNavbar** - Unified navigation for community module
- **CommunitySidebar** - Desktop sidebar navigation
- **TabSwitcher** - Personal/Community tab switcher
- **CreateActionModal** - Action creation modal with validation

### Features
- ✅ PWA enabled (works offline, installable)
- ✅ localStorage-based data layer (swappable)
- ✅ Points computation and tracking
- ✅ Domain breakdown (health, environment, community, learning, wellbeing)
- ✅ Thanks message templates based on action domain
- ✅ Accessibility with keyboard navigation
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI with shadcn/ui components
- ✅ Community module with organization management
- ✅ QR code generation and scanning for public events
- ✅ Action packages for community events
- ✅ Public scan pages for anonymous participation
- ✅ Progress tracking and constellation visualization

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

## Community Module Quickstart

### Creating a Community Organization

1. Navigate to `/community/dashboard`
2. Click "新しいコミュニティ" to create a new organization
3. Fill in organization details (name, description, theme)
4. Choose organization type (regional, thematic, or group-based)

### Managing Events

1. Go to your organization page (`/community/org/[orgId]`)
2. Click "イベント作成" to create a new event
3. Select an action package from the global catalog
4. Set event details (title, description, time, place, target star count)
5. Generate QR code for public participation

### Public Participation

1. Share the QR code or direct link (`/community/scan/[publicId]`)
2. Participants can scan and select completed actions
3. Stars are automatically awarded and tracked
4. Progress is visible in real-time on the event page

### API Endpoints

- `POST /api/scan` - Record action completions from QR scans
- `GET /api/scan?publicId=[id]` - Get event data for public scanning
- `GET /api/render/constellation?eventId=[id]` - Generate constellation visualization
- `GET /api/community/export/actions?eventId=[id]` - Export actions data as CSV
- `GET /api/community/export/stars?eventId=[id]` - Export stars data as CSV
- `POST /api/community/star` - Star/unstar an action
- `DELETE /api/community/star?actionId=[id]` - Remove star from action
- `GET /api/community/search` - Search actions and communities with filters

### Pinterest-Style Community Quickstart

1. **Home Feed**: Visit `/community/home` to see Pinterest-style masonry feed
2. **Discover**: Use `/community/discover` to search and filter content
3. **Create**: Go to `/community/create` to create action cards, packages, or events
4. **Star Actions**: Click star buttons to save actions to your personal feed
5. **Mobile Navigation**: Use bottom navigation for easy mobile access

### QR Code Testing

1. **Demo QR Code**: Visit `/community/scan/demo` to test the scan experience
2. **Generate QR**: Create an event and generate a QR code from the event detail page
3. **Test Flow**: Scan QR → Select actions → Submit → View success message
4. **Mobile Testing**: Use your phone's camera to scan QR codes and test the mobile experience

## Data Layer

The app uses a swappable data layer architecture (`lib/data.ts`). Currently implemented with localStorage, but can be easily swapped for:
- REST API
- GraphQL
- Firebase
- Supabase
- Any other backend

All data operations go through the `DataLayer` interface, making it easy to change the implementation without touching the UI code.

### Community-Specific Data Operations

The community module includes additional server actions in `lib/community-actions.ts`:
- Organization management (create, get)
- Place management (create, get by organization)
- Event management (create, get, get by public ID)
- Action package management
- Scan recording and progress tracking

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


// Cache cleared - ready for deployment
