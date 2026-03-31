# Spore — Web Prototype

The web companion and interactive prototype for **Spore**, a privacy-first support network for small, trusted circles. This React app demonstrates the full user experience — from the marketing landing page through the dashboard, check-ins, support prompts, and group management.

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 18 |
| Bundler | Vite 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3 + custom CSS design system |
| State | React Context (client-only, mock data) |
| Extras | pptxgenjs (pitch deck generator) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Route definitions
│   ├── styles.css                # App-wide styles + design system
│   ├── landing.css               # Landing page styles
│   ├── components/
│   │   ├── AppShell.jsx          # Authenticated layout shell
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   ├── SporeCard.jsx         # Spore group card
│   │   ├── ConfirmModal.jsx      # Confirmation dialog
│   │   ├── AppreciationModal.jsx # Appreciation prompt modal
│   │   ├── Toast.jsx             # Toast notifications
│   │   ├── PageSkeleton.jsx      # Loading skeleton
│   │   ├── PageHeader.jsx        # Reusable page header
│   │   └── SettingToggle.jsx     # Toggle switch for settings
│   ├── pages/
│   │   ├── HomePage.jsx          # Public landing page
│   │   ├── AppHomePage.jsx       # Dashboard with check-ins, insights, support feed
│   │   ├── SporesPage.jsx        # All spore groups
│   │   ├── SporeDetailPage.jsx   # Individual spore view
│   │   ├── MemberDetailPage.jsx  # Member profile and activity
│   │   ├── CheckInsPage.jsx      # Check-in history
│   │   ├── SupportPromptsPage.jsx# AI-generated support suggestions
│   │   ├── AppreciationPage.jsx  # Gratitude and appreciation prompts
│   │   ├── CreateSporePage.jsx   # New spore creation flow
│   │   └── SettingsPage.jsx      # App preferences and data controls
│   ├── context/
│   │   └── AppStateContext.jsx   # Global state provider
│   ├── hooks/
│   │   ├── useFakeLoading.js     # Simulated loading states
│   │   └── useSupportPrompts.js  # Support prompt logic
│   ├── utils/
│   │   ├── logic.js              # Health scoring, activity analysis, prompt generation
│   │   ├── sporeDisplay.js       # Display helpers (icons, labels, initials)
│   │   ├── supportFeedDisplay.js # Support feed formatting
│   │   └── displayLabels.js      # Human-readable label mappings
│   ├── data/
│   │   └── appMockData.js        # Seed data for the prototype
│   └── constants/
│       └── moodCheckIn.js        # Mood check-in options
├── generate-pptx.mjs            # Hackathon pitch deck generator
├── presentation.html            # Pitch deck (HTML version)
├── index.html                   # Vite entry HTML
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Features

- **Landing page** — Marketing site with feature overview and CTA
- **Dashboard** — At-a-glance metrics, mood check-in, activity and workload insights, support feed
- **Spore groups** — Create, browse, and manage small trusted circles
- **Support prompts** — Context-aware suggestions to reach out (based on a 5-factor health score)
- **Check-ins** — Soft mood signals (Good / Okay / Not great / Missing) with optional notes
- **Appreciation** — Gratitude prompts to strengthen group bonds
- **Member profiles** — Activity patterns, work balance, and interaction history
- **Settings** — Toggle activity tracking, manage active spores, data controls

## Notes

- This is a **client-only prototype** — all data lives in React Context with mock seed data and resets on refresh.
- No backend, authentication, or persistent storage. Designed for demonstrating the UX and interaction model.
- The pitch deck can be regenerated with `node generate-pptx.mjs`.
