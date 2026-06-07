# Telangana.live 2.0 - UI Wireframes & Design Specs
**Date:** May 20, 2026
**Role:** Agent 3 (Senior Product Designer)

## Design System Overview
- **Aesthetic**: Glassmorphic (Frosted glass background, subtle shadows, vibrant accents).
- **Primary Palette**: Civic Blue (#0056B3), Trust Green (#28A745), Alert Red (#DC3545).
- **Typography**: Inter (Modern, readable, high contrast).
- **Platform**: PWA (Mobile-first, touch-optimized).

---

## 1. Home Dashboard (The Pulse)
A personalized, high-trust overview of what's happening right now.

### ASCII Wireframe
```text
+---------------------------------------+
| [=]  TELANGANA.LIVE 2.0     [👤] [🔔] |
+---------------------------------------+
| [!] EMERGENCY: Heavy rain alert in GHMC |
+---------------------------------------+
| Good Morning, Sridhar!                |
| Your Location: [ Madhapur, Hyd v ]    |
+---------------------------------------+
| LIVE RATES (Glass Card)               |
| Gold: ₹72,400  Petrol: ₹109.66        |
| Veg: Tomato ₹40/kg | Onion ₹30/kg     |
+---------------------------------------+
| YOUR UTILITIES                        |
| [💧 Water: 4 PM]  [⚡ Power: Normal]  |
+---------------------------------------+
| TOP NEWS FOR YOU                      |
| +-----------------------------------+ |
| | [Image] New Flyover in Kondapur   | |
| | [AI Summary] 3 min read           | |
| +-----------------------------------+ |
| | [Image] Telangana IT Exports up   | |
| | [AI Summary] 2 min read           | |
| +-----------------------------------+ |
+---------------------------------------+
| [Home] [My Area] [Services] [News]    |
+---------------------------------------+
```

### Component Hierarchy
- **Main Shell**
  - **Header**: Logo, Sidebar Toggle, Profile, Notifications.
  - **Alert Banner**: Dynamic emergency warnings (e.g., weather, health).
  - **Hero Section**: Personalization, Location Picker.
  - **Rates Ticker**: Real-time prices (horizontal scroll).
  - **Utility Status Grid**: Quick glance cards for Water/Power.
  - **News Feed Snippets**: Cards with AI summarization markers.
  - **Bottom Navigation**: Tab bar for primary app routes.

### Interaction Notes
- **Location Picker**: Opens a bottom sheet with district/ward search.
- **Rates Ticker**: Tap a rate to see historical trend graphs.
- **Utility Cards**: Tap to go to specific schedule/status pages.
- **News Cards**: Tap "AI Summary" to expand a 3-sentence summary without leaving the dashboard.

### Mobile-First Considerations
- Sticky bottom navigation for thumb-reach.
- Rates ticker uses horizontal swipe to save vertical space.
- "Glass" effect helps distinguish cards from the primary background.

---

## 2. My Area (Hyper-Local Hub)
Contextual data and shortcuts for the user's specific ward or mandal.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] MY AREA: MADHAPUR (WARD 107)      |
+---------------------------------------+
| [ Map Snippet: Ward Boundaries ]      |
+---------------------------------------+
| WARD STATS (Glass Card)               |
| Population: 45k | AQI: 85 (Fair)      |
| Public Parks: 4 | Schools: 12         |
+---------------------------------------+
| PINNED SERVICES                       |
| [🚮 Waste] [💡 Street] [🚑 Health]    |
| [📜 Certs] [🏗️ Permits] [📝 Grievance] |
+---------------------------------------+
| YOUR OFFICIALS                        |
| [P] Corporator: V. Jagadeesh          |
| [P] Ward Officer: R. Sudha            |
+---------------------------------------+
| UPCOMING EVENTS                       |
| - Ward Sabha: Sat, 10 AM              |
| - Vaccination Drive: Mon-Wed          |
+---------------------------------------+
```

### Component Hierarchy
- **Header**: Context-aware title with ward number.
- **Geospatial Section**: Mini map showing ward limits and current location.
- **Stats Grid**: Infographic cards with local metrics.
- **Service Shortcuts**: Icon-grid for high-frequency actions.
- **Officials Registry**: Contact cards for local representatives.
- **Local Timeline**: List of neighborhood-specific events.

### Interaction Notes
- **Map Snippet**: Tap to expand into a full interactive ward map.
- **Service Icons**: Long-press to reorder pinned services.
- **Official Cards**: Tap "Message" to open a WhatsApp link to the official's desk.

### Mobile-First Considerations
- Service grid uses 3-column layout for large touch targets.
- AQI/Stats use color-coding (Green/Yellow/Red) for instant visual parsing.

---

## 3. Water Schedule (The Life Line)
A clear, predictable view of water supply timings.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] WATER SUPPLY SCHEDULE       [🔔]  |
+---------------------------------------+
| Status: [ ACTIVE - ON TIME ]          |
+---------------------------------------+
| NEXT SUPPLY IN:                       |
| [ 04:22:15 ]                          |
+---------------------------------------+
| WEEKLY CALENDAR                       |
| [M] [T] [W] [T] [F] [S] [S]           |
|  *   -   *   -   *   -   *            |
+---------------------------------------+
| LOG:                                  |
| - May 20: 4 PM - 6 PM (Scheduled)     |
| - May 18: 4 PM - 5:30 PM (Actual)     |
+---------------------------------------+
| [x] Notify me 15 mins before supply   |
| [ ] Notify me if there's a delay      |
+---------------------------------------+
```

### Component Hierarchy
- **Header**: Navigation and Notification Toggle.
- **Countdown Timer**: Real-time ticker for next supply.
- **Schedule Grid**: Visual week-view with markers.
- **History List**: Log of previous supply timings (Planned vs Actual).
- **Settings Toggle**: Granular notification controls.

### Interaction Notes
- **Notifications**: Toggling "Notify me" triggers a browser notification permission request.
- **Calendar**: Tap a day to see historical reliability stats for that specific day.

### Mobile-First Considerations
- Large digital clock for the countdown.
- Weekly view fits the screen width without horizontal scroll.

---

## 4. Power Outage (Live Status)
Transparency on why the lights are out.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] POWER STATUS: MADHAPUR      [!]   |
+---------------------------------------+
| CURRENT STATUS: [ ⚡ NORMAL ]         |
+---------------------------------------+
| [ LIVE STATUS MAP (Interactive) ]     |
| (Shows green/red zones in real-time)  |
+---------------------------------------+
| SCHEDULED MAINTENANCE                 |
| - May 22 (Fri): 10 AM - 2 PM          |
|   Area: Hitech City, Cyber Hills      |
|   Reason: Transformer Upgrade         |
+---------------------------------------+
| REPORT AN OUTAGE                      |
| [ Button: Quick Report ]              |
+---------------------------------------+
```

### Component Hierarchy
- **Status Indicator**: Global state of the grid.
- **Outage Map**: SVG/Canvas-based map overlay.
- **Maintenance List**: Future downtime cards with area/reason details.
- **Action Button**: Fixed bottom button for emergency reporting.

### Interaction Notes
- **Live Status Map**: Tapping a red zone shows the estimated restoration time (ETR).
- **Quick Report**: Uses geolocation to pre-fill the report form.

### Mobile-First Considerations
- Map is zoomable with pinch-gestures.
- Maintenance cards use vertical stacking with clear Date/Time headers.

---

## 5. Schemes Finder (Opportunity Engine)
Matching citizens to government programs.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] SCHEMES & BENEFITS          [🔍]  |
+---------------------------------------+
| [ FIND MY ELIGIBILITY (Quiz) ]        |
+---------------------------------------+
| FILTERS                               |
| [Farmers] [Students] [Women] [SC/ST]  |
+---------------------------------------+
| SCHEMES LIST                          |
| +-----------------------------------+ |
| | RYTHU BANDHU                      | |
| | [Status: Open] | [Apply Now >]    | |
| +-----------------------------------+ |
| | KALYANA LAKSHMI                   | |
| | [Status: Ongoing] | [Apply Now >] | |
| +-----------------------------------+ |
+---------------------------------------+
```

### Component Hierarchy
- **Search/Filter Bar**: Text search + Category chips.
- **Quiz Banner**: Call-to-action for eligibility checker.
- **Scheme Cards**: Title, target group, status, and external link.
- **Eligibility Quiz**: Modal-based multi-step form.

### Interaction Notes
- **Eligibility Quiz**: Asks for age, income, and profession; filters the list in real-time.
- **Apply Now**: Directs to the official government portal with a "Telangana.live guide" overlay.

### Mobile-First Considerations
- Category filters are horizontally scrollable chips.
- "Apply Now" buttons are full-width within cards for easy tapping.

---

## 6. News Feed (Hyper-Local Daily)
AI-sorted news that actually matters.

### ASCII Wireframe
```text
+---------------------------------------+
| [=] LOCAL NEWS FEED             [⚖️] |
+---------------------------------------+
| DISTRICT: [ Hyderabad v ]             |
| CATEGORY: [ All Categories v ]        |
+---------------------------------------+
| [ AI: Trending in Madhapur ]          |
+---------------------------------------+
| +-----------------------------------+ |
| | [Image] Metro Phase 2 Update      | |
| | [Politics] [Summary: 20s read]    | |
| +-----------------------------------+ |
| +-----------------------------------+ |
| | [Image] Local Food Festival       | |
| | [Life] [Summary: 15s read]        | |
| +-----------------------------------+ |
+---------------------------------------+
```

### Component Hierarchy
- **Feed Controls**: Multi-select filters for District/Category.
- **Trending Banner**: AI-highlighted hot topics.
- **News List**: Infinite-scroll feed of cards.
- **AI Summary Overlay**: Modal/Bottom-sheet for quick consumption.

### Interaction Notes
- **Summary**: Clicking the "Summary" tag opens a bulleted list of key facts from the article.
- **Translate**: Toggle icon to switch between Telugu and English.

### Mobile-First Considerations
- Infinite scroll reduces interaction overhead.
- High-quality image thumbnails help users scan quickly.

---

## 7. Jobs Board (Livelihood Hub)
Bridging the gap between skills and opportunities.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] JOBS & OPPORTUNITIES              |
+---------------------------------------+
| [ Search Jobs...            ] [Filter]|
+---------------------------------------+
| CATEGORIES                            |
| [🛠️ Skill] [💻 IT] [🏫 Teaching]      |
| [🚛 Delivery] [🏥 Healthcare]         |
+---------------------------------------+
| FEATURED JOBS                         |
| +-----------------------------------+ |
| | Delivery Partner - Swiggy         | |
| | [Madhapur] [₹20k-30k] [Apply >]   | |
| +-----------------------------------+ |
| | Nurse - Apollo Hospitals          | |
| | [Jubilee Hills] [Full-time] [Apply]| |
| +-----------------------------------+ |
+---------------------------------------+
```

### Component Hierarchy
- **Search Bar**: Keyword and location search.
- **Category Chips**: High-level job classification.
- **Job Cards**: Company logo, position, location, salary, and call-to-action.
- **Easy Apply Flow**: Native app-based application (where integrated).

### Interaction Notes
- **Filter**: Opens a slide-out menu for salary range, job type, and education level.
- **Apply**: One-tap application if the user's profile is complete.

### Mobile-First Considerations
- Salary and location are clearly highlighted in the card view.
- Category icons make the interface accessible to all literacy levels.

---

## 8. Emergency Directory (One-Tap Help)
Critical contacts when every second counts.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] EMERGENCY DIRECTORY               |
+---------------------------------------+
| [🆘 SOS: CALL EMERGENCY SERVICES ]    |
+---------------------------------------+
| CATEGORIES:                           |
| [👮 Police] [🚒 Fire] [🚑 Ambulance]  |
| [🏥 Hospitals] [🏢 Utilities]         |
+---------------------------------------+
| QUICK DIAL                            |
| - Dial 100: Main Control Room    [📞] |
| - Dial 108: Medical Emergency    [📞] |
| - Dial 101: Fire Services        [📞] |
+---------------------------------------+
| NEAREST POLICE STATION:               |
| Madhapur PS (0.8km away)         [📍] |
+---------------------------------------+
```

### Component Hierarchy
- **Global SOS Button**: Prominent red button for universal emergency services.
- **Category Grid**: Toggles for specific emergency types.
- **Dial List**: Name, number, and large dial icon.
- **Proximity Feature**: Shows nearest physical stations based on GPS.

### Interaction Notes
- **SOS Button**: Triggers a countdown (3, 2, 1) before auto-dialing 112 to prevent accidental taps.
- **Dial Icon**: Opens the system phone app with the number pre-filled.

### Mobile-First Considerations
- Dial buttons are large and easy to tap under stress.
- No typing required; all interactions are tap-based.

---

## 9. Ward/Mandal Dashboard (Governance)
Tracking the pulse of local governance.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] WARD 107 DASHBOARD                |
+---------------------------------------+
| GOVERNANCE SCORE: [ 8.5/10 ]          |
+---------------------------------------+
| INFRASTRUCTURE STATUS                 |
| - Street Lights: 98% Functional       |
| - Road Quality: Good (Resurfaced Mar) |
| - Waste Collection: On Track (9 AM)   |
+---------------------------------------+
| OFFICIAL CONTACTS                     |
| - Assistant Engineer (AE): [📞] [💬] |
| - Sanitary Inspector:     [📞] [💬] |
+---------------------------------------+
| [ Submit Feedback for Ward ]          |
+---------------------------------------+
```

### Component Hierarchy
- **Governance Score**: Aggregated rating based on service delivery data.
- **Infra Status List**: Checklist of local maintenance metrics.
- **Officials Directory**: Specific ground-level officers for the ward.
- **Feedback Loop**: Button to report issues or give ratings.

### Interaction Notes
- **Infrastructure Status**: Tap a metric (e.g., Road Quality) to see the history of works completed.
- **Governance Score**: Tap to see how the score is calculated (Transparency).

### Mobile-First Considerations
- Progress bars for "Functional" metrics provide quick visual feedback.
- Contact actions (Call/Chat) are side-by-side for choice.

---

## 10. Public Works Tracker (Transparency)
Follow the money and the progress.

### ASCII Wireframe
```text
+---------------------------------------+
| [<] PUBLIC WORKS TRACKER              |
+---------------------------------------+
| ACTIVE PROJECTS: [ 12 ]               |
+---------------------------------------+
| +-----------------------------------+ |
| | Storm Water Drain - Phase 1       | |
| | [PROGRESS: 75%] [Budget: ₹2.5Cr]  | |
| | Deadline: Aug 2026                | |
| +-----------------------------------+ |
| +-----------------------------------+ |
| | Park Beautification               | |
| | [PROGRESS: 10%] [Budget: ₹45L]    | |
| | Deadline: Dec 2026                | |
| +-----------------------------------+ |
+---------------------------------------+
| [ View Expenditure Report ]           |
+---------------------------------------+
```

### Component Hierarchy
- **Global Summary**: Total active projects and total budget spent in the area.
- **Project Cards**: Title, progress bar, budget, and estimated completion date.
- **Transparency Portal**: Link to detailed budget documents and contractor info.

### Interaction Notes
- **Progress Bar**: Tap to see a photo gallery of "Before vs Current" project status.
- **Budget**: Tap to see a breakdown of funds allocated vs disbursed.

### Mobile-First Considerations
- Progress bars are high-contrast for visibility.
- Card-based layout makes it easy to compare multiple projects.
