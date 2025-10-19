# Hoshii - Quick Start Guide

## 🚀 Getting Started

The app is now running at **http://localhost:3000**

## 📱 Navigation

Use the bottom navigation bar to explore:

### 🏠 Today
- View 3 personalized suggested actions
- Tap "Complete Action" to earn points
- Receive thank you messages from society, environment, or peers
- Points automatically added to your wallet

### 📅 Events
- Browse upcoming community events
- Tap "Details" to view full event information
- Join events you're interested in
- Complete events after attending to earn points
- Create new events with the "+" button

### 👤 Me
- View your profile and total points
- See your activity statistics
- Review recent completed actions and events
- Track your redemption history

### 🎁 Redeem
- View your points wallet
- Browse the rewards catalog
- Redeem points for:
  - Coffee vouchers
  - Tree planting donations
  - Yoga class passes
  - Book vouchers
  - Charity donations

### 🏢 Org
- View organization dashboard
- Access company-wide analytics at "Overview"
- See domain heatmap (health, environment, community, learning, wellbeing)
- Track monthly point trends
- Create organizational events

## ✨ Key Features

### Points System
- Complete actions: earn 5-20 points
- Join events: earn 30-50 points
- Points are tracked in real-time
- Spend points on rewards

### Domain Categories
All activities are categorized into 5 domains:
- 🏃 **Health** - Physical wellness
- 🌍 **Environment** - Eco-friendly actions
- 👥 **Community** - Social engagement
- 📚 **Learning** - Educational activities
- 🧘 **Wellbeing** - Mental health & mindfulness

### Thank You Messages
After completing activities, you receive personalized thanks from:
- **Society** - For community contributions
- **Environment** - For eco-friendly actions
- **Peers** - For general positive actions

### PWA Features
- Install the app on your device
- Works offline (after first visit)
- App-like experience on mobile
- Add to home screen

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Sample Data

The app comes pre-loaded with:
- 5 sample actions across all domains
- 2 upcoming events
- 5 redeemable items
- 1 demo user (Alex Chen) with 150 points

All data is stored in localStorage and persists between sessions.

## 🎨 Customization

### Adding New Actions
1. Edit `lib/data.ts`
2. Add to the `actions` array in `getDefaultData()`
3. Include: title, description, domain, pointsValue

### Adding New Events
- Use the Events page → "+" button
- Or add directly in `lib/data.ts`

### Adding New Rewards
1. Edit `lib/data.ts`
2. Add to the `redeemItems` array
3. Set pointsCost and category

### Swapping Data Layer
The data layer is abstracted through the `DataLayer` interface.
To use a different backend:
1. Create a new class implementing `DataLayer`
2. Replace the export in `lib/data.ts`
3. No changes needed in UI components!

## 🎯 Next Steps

1. **Try completing an action** on the Today page
2. **Create a new event** and join it
3. **Redeem your points** for a reward
4. **Check the Org overview** to see analytics
5. **Install as PWA** (on mobile: "Add to Home Screen")

## 🌟 Tips

- Actions suggest daily activities for quick engagement
- Events are perfect for team building
- The domain heatmap shows which areas need more focus
- Use keyboard navigation (Tab, Enter, Escape) for accessibility
- Points balance updates in real-time across all pages

Enjoy making a positive impact with Hoshii! 🎉


